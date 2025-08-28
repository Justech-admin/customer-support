// api/admin/maintenance-summary.js
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import authOptions from "../auth/[...nextauth]";
import { executeQuery } from "@/lib/db";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const token = await getToken({ req });

  if (!session || !token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userid = token?.id;
  const role = token?.role;

  if (!userid || role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  if (req.method === "GET") {
    try {
      // Using exactly your query without changes
      const query = `
        SELECT 
          rj.serial_number,
          MAX(CASE 
            WHEN bm.maintenance_date >= DATE_FORMAT(NOW(), '%Y-%m-01') 
            THEN bm.maintenance_date 
            ELSE NULL 
          END) as battery_maintenance_date,
          MAX(CASE 
            WHEN pi.inspection_date >= DATE_FORMAT(NOW(), '%Y-%m-01') 
            THEN pi.inspection_date 
            ELSE NULL 
          END) as physical_inspection_date,
          MAX(CASE 
            WHEN ft.maintenance_date >= DATE_FORMAT(NOW(), '%Y-%m-01') 
            THEN ft.maintenance_date 
            ELSE NULL 
          END) as functional_test_date
        FROM 
          rifle_jammer rj
        LEFT JOIN BatteryMaintenance bm ON rj.serial_number = bm.serial_number
        LEFT JOIN PhysicalInspection pi ON rj.serial_number = pi.serial_number
        LEFT JOIN FunctionalTest ft ON rj.serial_number = ft.serial_number
        GROUP BY rj.serial_number
        ORDER BY rj.serial_number;
      `;

      const results = await executeQuery({ query, values: [] });

      // Formatting the results exactly as in your example
      const formattedResults = results.map(row => ({
        serial_number: row.serial_number,
        battery_maintenance_date: row.battery_maintenance_date || 'NULL',
        physical_inspection_date: row.physical_inspection_date || 'NULL',
        functional_test_date: row.functional_test_date || 'NULL'
      }));

      return res.status(200).json(formattedResults);
    } catch (error) {
      console.error("Maintenance Summary Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
