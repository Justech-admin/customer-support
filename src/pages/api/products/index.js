import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import authOptions from "@/pages/api/auth/[...nextauth]";
import { executeQuery } from "@/lib/db";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const token = await getToken({ req });

  if (!session || !token?.id || !token?.role) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { role } = token;
  if (role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Only admin can access this data" });
  }

  try {
    switch (req.method) {
      case "GET": {
        const results = await executeQuery({ query: `SELECT id, name FROM products` });
        return res.status(200).json(results);
      }

      case "POST": {
        const { tableName, serial_number, location_id, user_id, type, manufacturing_date, delivery_date, status } = req.body;

        if (!tableName || !serial_number || !location_id || !type) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
          return res.status(400).json({ error: "Invalid table name" });
        }

        await executeQuery({
          query: `
            INSERT INTO \`${tableName}\` 
            (serial_number, location_id, user_id, type, manufacturing_date, delivery_date, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          values: [
            serial_number,
            location_id,
            user_id || null,
            type,
            manufacturing_date || null,
            delivery_date || null,
            status ?? 0
          ],
        });

        return res.status(201).json({ message: "Unit added successfully" });
      }

      case "PUT": {
        const { tableName, id, location_id, user_id, status } = req.body;

        if (!tableName || !id || !location_id || !user_id) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
          return res.status(400).json({ error: "Invalid table name" });
        }

        await executeQuery({
          query: `
            UPDATE \`${tableName}\`
            SET location_id = ?, user_id = ?, status = ?
            WHERE id = ?
          `,
          values: [location_id, user_id, status ?? 0, id],
        });

        return res.status(200).json({ message: "Unit updated successfully" });
      }

      case "DELETE": {
        const { serial_number, table } = req.query;

        if (!serial_number || !table) {
          return res.status(400).json({ error: "serial_number and table are required for deletion" });
        }

        if (!/^[a-zA-Z0-9_]+$/.test(table)) {
          return res.status(400).json({ error: "Unsafe table name" });
        }

        await executeQuery({
          query: `DELETE FROM \`${table}\` WHERE serial_number = ?`,
          values: [serial_number],
        });

        return res.status(200).json({ message: "Product deleted successfully" });
      }

      default:
        return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Products API Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
