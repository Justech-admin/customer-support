// pages/api/engineers.js
import { executeQuery } from "@/lib/db";

export default async function handler(req, res) {
  try {
    const engineers = await executeQuery({
      query: "SELECT engineer_id, name, email_id FROM engineers",
    });
    res.status(200).json(engineers);
  } catch (error) {
    console.error("Error fetching engineers:", error);
    res.status(500).json({ error: "Failed to fetch engineers" });
  }
}
