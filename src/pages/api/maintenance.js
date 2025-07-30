import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import authOptions from "./auth/[...nextauth]";
import { executeQuery } from "@/lib/db";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const token = await getToken({ req });

  if (!session || !token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userid = token?.id;
  const role = token?.role;

  if (!userid || !role) {
    return res.status(401).json({ error: "Unauthorized: Missing credentials" });
  }

  // 🔹 Handle GET: Fetch jammer & maintenance info
  if (req.method === "GET") {
    try {
      let { serial_number } = req.query;
      if (serial_number) {
        serial_number = decodeURIComponent(serial_number);
      }

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
        // Admin can see all
      } else if (role === "user") {
        query += " WHERE rj.user_id = ?";
        queryValues.push(userid);
      } else {
        return res.status(403).json({ error: "Forbidden: Invalid Role" });
      }

      if (serial_number) {
        query += role === "admin" ? " WHERE" : " AND";
        query += " rj.serial_number = ?";
        queryValues.push(serial_number);
      }

      const results = await executeQuery({ query, values: queryValues });
      return res.status(200).json(results);
    } catch (error) {
      console.error("Database GET Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // 🔹 Handle POST: Insert maintenance record
  else if (req.method === "POST") {
    try {
      const {
        type,
        maintenanceDate,
        inspectionDate,
        serialNumber,
        checklistItems,
        comments,
        name,
        designation
      } = req.body;

      if (type === "battery") {
        const {
          "1a": battery_condition,
          "1b": no_leakage,
          "1c": easily_seated,
          "2a": adequate_level,
          "2b": secure_connections,
          "2c": charger_functions,
          "2d": display_functions,
          "2e": accurate_indicators,
          "2f": no_flickering
        } = checklistItems || {};

        const insertQuery = `
          INSERT INTO BatteryMaintenance (
            serial_number, maintenance_date,
            battery_condition, no_leakage, easily_seated,
            adequate_level, secure_connections, charger_functions,
            display_functions, accurate_indicators, no_flickering,
            comments, name, designation
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
          serialNumber,
          maintenanceDate,
          battery_condition ? 1 : 0,
          no_leakage ? 1 : 0,
          easily_seated ? 1 : 0,
          adequate_level ? 1 : 0,
          secure_connections ? 1 : 0,
          charger_functions ? 1 : 0,
          display_functions ? 1 : 0,
          accurate_indicators ? 1 : 0,
          no_flickering ? 1 : 0,
          comments,
          name,
          designation
        ];

        await executeQuery({ query: insertQuery, values });
        return res.status(200).json({ message: "Battery maintenance record submitted successfully" });
      }

      if (type === "functional") {
        const {
          "1a": powers_correctly,
          "1b": trigger_functions,
          "2a": jamming_activates,
          "2b": jamming_range
        } = checklistItems || {};

        const insertQuery = `
          INSERT INTO FunctionalTest (
            maintenance_date, serial_number,
            powers_correctly, trigger_functions,
            jamming_activates, jamming_range,
            comments, name, designation
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
          maintenanceDate,
          serialNumber,
          powers_correctly ? 1 : 0,
          trigger_functions ? 1 : 0,
          jamming_activates ? 1 : 0,
          jamming_range ? 1 : 0,
          comments,
          name,
          designation
        ];

        await executeQuery({ query: insertQuery, values });
        return res.status(200).json({ message: "Functional test record submitted successfully" });
      }

      if (type === "physical") {
        const {
          "1a": cracks,
          "1b": surface_clean,
          "1c": corrosion,
          "1d": buttons_intact,
          "2a": strap_intact,
          "2b": no_fraying,
          "2c": attachment_secure,
          "3a": bag_damage,
          "3b": zippers_ok,
          "3c": interior_clean,
          "3d": compartments_ok
        } = checklistItems || {};

        const insertQuery = `
          INSERT INTO PhysicalInspection (
  serial_number, inspection_date,
  no_visible_cracks, clean_surface, no_corrosion, buttons_intact,
  strap_intact, no_fraying, secure_attachment,
  bag_no_damage, zippers_function, clean_interior, compartments_intact,
  comments, name, designation
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
          serialNumber,
          inspectionDate,
          cracks ? 1 : 0,
          surface_clean ? 1 : 0,
          corrosion ? 1 : 0,
          buttons_intact ? 1 : 0,
          strap_intact ? 1 : 0,
          no_fraying ? 1 : 0,
          attachment_secure ? 1 : 0,
          bag_damage ? 1 : 0,
          zippers_ok ? 1 : 0,
          interior_clean ? 1 : 0,
          compartments_ok ? 1 : 0,
          comments,
          name,
          designation
        ];

        await executeQuery({ query: insertQuery, values });
        return res.status(200).json({ message: "Physical inspection record submitted successfully" });
      }

      return res.status(400).json({ error: "Invalid maintenance type" });
    } catch (error) {
      console.error("❌ Maintenance Submission Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // 🔹 Method Not Allowed
  else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
