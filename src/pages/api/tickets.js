import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import authOptions from "./auth/[...nextauth]";
import { executeQuery } from "@/lib/db";
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Verify authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = await getToken({ req });
    const userId = token?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: No User ID" });
    }

    // Configure file upload
    const uploadDir = path.join(process.cwd(), 'public/img/tickets');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      multiples: true,
      filename: (name, ext, part) => `ticket_${Date.now()}_${part.originalFilename}`,
    });

    // Parse form data and files
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Validate required fields
    if (!fields.ticketNumber || !fields.serialNumber || !fields.contactNumber || !fields.incidentDate || !fields.incidentDetails) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Process attachments
    let attachments = [];
    if (files.attachments) {
      const fileArray = Array.isArray(files.attachments) ? files.attachments : [files.attachments];

      attachments = fileArray.map(file => `img/tickets/${file.newFilename}`);
    }

    // Insert ticket into database
    const query = `
      INSERT INTO service_tickets (
        ticket_number,
        user_id,
        serial_number,
        contact_number,
        incident_date,
        incident_details,
        status,
        attachments,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const values = [
      fields.ticketNumber,
      userId,
      fields.serialNumber,
      fields.contactNumber,
      fields.incidentDate,
      fields.incidentDetails,
      1, // Changed status from 'NEW' to 1
      JSON.stringify(attachments)
    ];

    const result = await executeQuery({
      query,
      values,
    });

    res.status(200).json({ 
      message: 'Ticket created successfully',
      ticketId: result.insertId,
      attachments
    });

  } catch (error) {
    console.error("Error processing ticket:", error);

    // Clean up any uploaded files if there's an error
    if (error.uploadedFiles) {
      error.uploadedFiles.forEach(file => {
        try {
          fs.unlinkSync(file.filepath);
        } catch (unlinkError) {
          console.error("Error removing file:", unlinkError);
        }
      });
    }

    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
