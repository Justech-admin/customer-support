
import { executeQuery } from "@/lib/db";

export default async function handler(req, res) {
  const { name } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Validate
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Missing or invalid product name" });
    }

    // Check if product name exists in products table
    const result = await executeQuery({
      query: `SELECT name FROM products WHERE name = ?`,
      values: [name],
    });

    if (result.length === 0) {
      return res.status(404).json({ error: "Product name not found in products table" });
    }

    const tableName = result[0].name;

    // Prevent SQL injection
    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
      return res.status(400).json({ error: "Unsafe table name" });
    }

    // Query the actual table
    const data = await executeQuery({
  query: `
    SELECT t.*, l.name AS location_name
    FROM \`${tableName}\` t
    LEFT JOIN locations l ON t.location_id = l.id
  `,
});


    res.status(200).json(data);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch product data", details: err.message });
  }
}
