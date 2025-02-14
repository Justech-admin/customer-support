import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { executeQuery } from "@/lib/db";

export default async function handler(req, res) {
  console.log("API Route Hit");

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

    // Extract username
    const username = session.user.name;
    console.log("Username from session:", username);

    // Extract serial number from query (if provided)
    let { serial_number } = req.query;

    // Decode URL parameter to handle special characters
    if (serial_number) {
      serial_number = decodeURIComponent(serial_number);
    }

    console.log("Serial Number:", serial_number);

    // Base SQL Query
    let query = `
      SELECT 
        rj.serial_number, 
        rj.status, 
        rj.type, 
        rj.manufacturing_date,
        rj.delivery_date,
        l.name AS location_name,
        jd.frequencies, 
        jd.gloves, 
        jd.strap, 
        jd.manual, 
        jd.battery, 
        jd.charger,
        jd.jacket,
        jd.bag
      FROM rifle_jammer rj
      JOIN locations l ON rj.location_id = l.id
      JOIN users u ON rj.user_id = u.id
      LEFT JOIN jammer_details jd ON rj.jammer_details_id = jd.id
      WHERE u.username = ?
    `;

    const queryValues = [username];

    // If serial_number is provided, filter by it
    if (serial_number) {
      query += " AND rj.serial_number = ?";
      queryValues.push(serial_number);
    }

    console.log("Executing Query:", query);
    console.log("Query Values:", queryValues);

    const results = await executeQuery({
      query,
      values: queryValues,
    });

    console.log("Query Results:", results);

    return res.status(200).json(results);
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
