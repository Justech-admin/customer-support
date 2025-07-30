// pages/api/users/[id].js
import { executeQuery } from "@/lib/db";
import bcrypt from "bcryptjs";


export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  if (method === "PUT") {
    try {
      const { newPassword } = req.body;

      if (!newPassword) {
        return res.status(400).json({ error: "Password is required" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await executeQuery({
        query: "UPDATE users SET password = ? WHERE id = ?",
        values: [hashedPassword, id],
      });

      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Password update error:", error);
      return res.status(500).json({ error: "Failed to update password" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
