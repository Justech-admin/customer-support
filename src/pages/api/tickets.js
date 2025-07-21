// pages/api/tickets.js
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import authOptions from "./auth/[...nextauth]";
import { executeQuery } from "@/lib/db";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";


export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    console.log("Session in API:", session);

    if (!session) {
      console.log("No session found");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = await getToken({ req });
    console.log("Session Token:", token);

    // Extract user ID from the token
    const userId = token?.id; // Extract id from token
    const userRole = token?.role; // Extract id from token
    const username = token?.name; // Extract id from token

    console.log("Extracted User ID:", userId);
    console.log("Extracted User role:", userRole);
    console.log("Extracted User name:", username);

    // Verify URL username matches authenticated user (unless admin)
    const urlUsername = req.query.user;
    if (urlUsername && userRole !== "admin" && urlUsername !== username) {
      return res
        .status(403)
        .json({ error: "Forbidden: You can only access your own data" });
    }

    switch (req.method) {
      case "GET":
        return await handleGetRequest(req, res, userId, userRole,username);
      case "POST":
        return await handlePostRequest(req, res, userId, userRole,username);
      case "PUT":
        return await handlePutRequest(req, res, userId, userRole, username);

      default:
        return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
}

async function handleGetRequest(req, res, userId, userRole, username) {
  const { ticketId, status } = req.query;

  let query = `
    SELECT 
    st.id, 
    st.ticket_number, 
    st.user_id, 
    st.serial_number, 
    st.contact_number, 
    st.incident_date, 
    st.incident_details, 
    st.status, 
    st.attachments, 
    st.name AS reporter, 
    st.created_at, 
    st.designation, 
    st.updates, 
    l.name AS location, 
    rj.delivery_date, 
    jd.frequencies ,
    e.name AS engineer_name,       
    e.email_id AS engineer_email 
FROM 
    service_tickets st 
LEFT JOIN 
    rifle_jammer rj ON st.serial_number = rj.serial_number 
LEFT JOIN 
    locations l ON rj.location_id = l.id 
LEFT JOIN 
    jammer_details jd ON rj.jammer_details_id = jd.id 
 LEFT JOIN 
    engineers e ON st.assigned_engineer_id = e.engineer_id
WHERE 
    1=1
  `;

  const values = [];

  // Add user filtering unless admin
  if (userRole !== "admin") {
    query += " AND st.user_id = ?";
    values.push(userId);
  }

  if (ticketId) {
    query += " AND st.id = ?";
    values.push(ticketId);
  }

  if (status) {
    query += " AND st.status = ?";
    values.push(status);
  }

  query += " ORDER BY st.created_at DESC";

  const tickets = await executeQuery({
    query,
    values,
  });

  return res.status(200).json(tickets);
}

async function handlePostRequest(req, res, userId) {
  // Configure file upload
  const uploadDir = path.join(process.cwd(), "public/img/tickets");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    multiples: true,
    filename: (name, ext, part) =>
      `ticket_${Date.now()}_${part.originalFilename}`,
  });

  // Parse form data and files
  const [fields, files] = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve([fields, files]);
    });
  });

  // Validate required fields
  if (
    !fields.ticketNumber ||
    !fields.serialNumber ||
    !fields.contactNumber ||
    !fields.incidentDate ||
    !fields.incidentDetails
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Process attachments
  let attachments = [];
  if (files.attachments) {
    const fileArray = Array.isArray(files.attachments)
      ? files.attachments
      : [files.attachments];

    attachments = fileArray.map((file) => `img/tickets/${file.newFilename}`);
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
      created_at,
      name,
      designation
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(),?,?)
  `;

  const values = [
    fields.ticketNumber,
    userId,
    fields.serialNumber,
    fields.contactNumber,
    fields.incidentDate,
    fields.incidentDetails,
    1, // Initial status: New
    JSON.stringify(attachments),
    fields.name,
    fields.designation
  ];

  try {
    const result = await executeQuery({
      query,
      values,
    });

    return res.status(200).json({
      message: "Ticket created successfully",
      ticketId: result.insertId,
      attachments,
    });
  } catch (error) {
    // Clean up any uploaded files if there's an error
    if (files.attachments) {
      const fileArray = Array.isArray(files.attachments)
        ? files.attachments
        : [files.attachments];

      fileArray.forEach((file) => {
        try {
          fs.unlinkSync(file.filepath);
        } catch (unlinkError) {
          console.error("Error removing file:", unlinkError);
        }
      });
    }
    throw error;
  }
}

async function handlePutRequest(req, res, userId, userRole, username) {
  if (userRole !== "admin") {
    return res.status(403).json({ error: "Only admin can assign engineers" });
  }

  const { ticketId } = req.query;
  const { engineerId } = req.body; // ✅ FIX: now defined

  if (!ticketId || !engineerId) {
    return res.status(400).json({ error: "Missing ticketId or engineerId" });
  }

  try {
    // Update ticket with engineer
    await executeQuery({
      query: `UPDATE service_tickets SET assigned_engineer_id = ? WHERE id = ?`,
      values: [engineerId, ticketId],
    });

    // Fetch engineer email
    const engineer = await executeQuery({
      query: `SELECT name, email_id FROM engineers WHERE engineer_id = ?`,
      values: [engineerId],
    });

    if (engineer.length === 0) {
      return res.status(404).json({ error: "Engineer not found" });
    }

    const { name, email_id } = engineer[0];

    // Send email notification
    await sendAssignmentEmail(email_id, name, ticketId);

    return res.status(200).json({ message: "Engineer assigned and notified" });
  } catch (error) {
    console.error("Error in engineer assignment:", error);
    return res.status(500).json({ error: "Failed to assign engineer" });
  }
}



async function sendAssignmentEmail(toEmail, engineerName, ticketId) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Ticketing System" <${process.env.SMTP_EMAIL}>`,
    to: toEmail,
    subject: `Ticket #${ticketId} Assigned to You`,
    html: `
      <p>Dear ${engineerName},</p>
      <p>You have been assigned to Ticket <strong>#${ticketId}</strong>.</p>
      <p>Please log in to the portal to view and resolve it.</p>
      <p>Regards,<br/>Support Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
}
