// pages/api/users/index.js
import { executeQuery } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const users = await executeQuery({
      query: "SELECT * FROM users",
      values: [],
    });

    res.status(200).json({ users });
  } catch (error) {
    console.error("🔥 DB Error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}
