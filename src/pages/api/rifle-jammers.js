import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import authOptions from "./auth/[...nextauth]";
import { executeQuery } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Authenticate user session
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get token
    const token = await getToken({ req });
    if (!token || !token.id || !token.role) {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }

    const { id: userid, role } = token; // Extract User ID and Role
    console.log(`User ID: ${userid}, Role: ${role}`);

    // Extract optional serial number from query
    let { serial_number } = req.query;
    if (serial_number) {
      serial_number = decodeURIComponent(serial_number);
    }

    // Base SQL Query
    let query = `
      SELECT 
        rj.serial_number, 
        rj.client_status, 
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
    `;

    const queryValues = [];

    if (role === "admin") {
      // Admin can view all users' data
      query += ""; // No extra condition needed
    } else if (role === "user") {
      // Regular user can only view their own data
      query += " WHERE u.id = ?";
      queryValues.push(userid);
    } else {
      return res.status(403).json({ error: "Forbidden: Invalid Role" });
    }

    // Filter by serial_number if provided
    if (serial_number) {
      query += role === "admin" ? " WHERE" : " AND";
      query += " rj.serial_number = ?";
      queryValues.push(serial_number);
    }

    const results = await executeQuery({ query, values: queryValues });

    return res.status(200).json(results);
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
