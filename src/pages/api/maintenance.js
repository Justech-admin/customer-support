import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import authOptions from "./auth/[...nextauth]";
import { executeQuery } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    console.log("Session in API:", session);

    if (!session) {
      console.log("No session found");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = await getToken({ req });
    console.log("Session Token:", token);

    const userid = token?.id;
    const role = token?.role; // Extract role from token
    console.log(`Extracted User ID: ${userid}, Role: ${role}`);

    if (!userid || !role) {
      console.log("❌ User ID or Role missing in token");
      return res.status(401).json({ error: "Unauthorized: Missing credentials" });
    }

    let { serial_number } = req.query;
    if (serial_number) {
      serial_number = decodeURIComponent(serial_number);
    }

    // Updated Base Query to include type
    let query = `
      SELECT
        rj.serial_number AS serialNumber,
        rj.type AS jammerType,
        l.name AS locationName,
        bm.maintenance_date AS batteryMaintenanceDate,
        pi.inspection_date AS physicalMaintenanceDate,
        ft.maintenance_date AS functionalMaintenanceDate
      FROM rifle_jammer rj
      LEFT JOIN locations l ON rj.location_id = l.id
      LEFT JOIN BatteryMaintenance bm ON rj.serial_number = bm.serial_number
      LEFT JOIN PhysicalInspection pi ON rj.serial_number = pi.serial_number
      LEFT JOIN FunctionalTest ft ON rj.serial_number = ft.serial_number
    `;

    const queryValues = [];

    if (role === "admin") {
      // Admin can view all users' data
      query += ""; // No extra condition
    } else if (role === "user") {
      // Users can only view their own records
      query += " WHERE rj.user_id = ?";
      queryValues.push(userid);
    } else {
      return res.status(403).json({ error: "Forbidden: Invalid Role" });
    }

    // Apply Serial Number Filter (if provided)
    if (serial_number) {
      query += role === "admin" ? " WHERE" : " AND";
      query += " rj.serial_number = ?";
      queryValues.push(serial_number);
    }

    // Execute Query
    const results = await executeQuery({
      query,
      values: queryValues,
    });

    return res.status(200).json(results);
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
