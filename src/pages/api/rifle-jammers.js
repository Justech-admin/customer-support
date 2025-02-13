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

    // Extract username since we're using it in the database
    const username = session.user.name;
    console.log("Username from session:", username);

    let query;
    let queryValues;

    if (session.user.role === "instructor") {
      query = `
        SELECT rj.serial_number, rj.status, rj.type, l.name AS location_name
        FROM rifle_jammer rj
        JOIN locations l ON rj.location_id = l.id
        JOIN users u ON rj.user_id = u.id
      `;
      queryValues = [];
    } else {
      query = `
        SELECT rj.serial_number, rj.status, rj.type, l.name AS location_name
        FROM rifle_jammer rj
        JOIN locations l ON rj.location_id = l.id
        JOIN users u ON rj.user_id = u.id
        WHERE u.username = ?
      `;
      queryValues = [username];
    }

    // console.log("Executing Query:", query);
    // console.log("Query Values:", queryValues);

    const results = await executeQuery({
      query,
      values: queryValues,
    });

    // console.log("Query Results:", results);

    return res.status(200).json(results);
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
