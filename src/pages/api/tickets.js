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
    bodyParser: false,
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
        return await handlePostRequest(req, res, userId, userRole,username,session);
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
      st.quotation_inspection_at,
      st.service_under_progress_at,
      st.service_completed_at,
      st.pending_at,
      st.resolved_at,
      st.designation, 
      st.updates, 
      st.email,
      st.assigned_engineer_id,
      l.name AS location, 
      rj.delivery_date, 
      jd.frequencies,
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
    WHERE 1=1
  `;

  const values = [];

  // Restrict to user's own tickets if not admin
  if (userRole !== "admin") {
    query += " AND st.user_id = ?";
    values.push(userId);
  }

  // Allow lookup by ticket ID or ticket number
  if (ticketId) {
    const isNumericId = /^\d+$/.test(ticketId); // True if ticketId is all digits
    if (isNumericId) {
      query += " AND st.id = ?";
    } else {
      query += " AND st.ticket_number = ?";
    }
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

  const engineers = await executeQuery({
    query: `SELECT engineer_id, name, email_id FROM engineers`,
  });

  return res.status(200).json({
    tickets,
    engineers,
  });
}


async function handlePostRequest(req, res, userId, userRole, username, session) {
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

    // ✅ If admin is sending an update + email
  if (fields.action === 'updateStatusAndNotify') {
    const { ticketId, status, emailBody } = fields;

    if (!ticketId || !status || !emailBody) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Update status in DB
      const now = new Date();
      const formattedLocal = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

 

      const statusToTimestampField = {
        "2": "service_under_progress_at",
        "3": "service_completed_at",
        "4": "pending_at",
        "5": "resolved_at",
      };

      const timestampField = statusToTimestampField[status];


      let updateQuery = `UPDATE service_tickets SET status = ?, updates = CONCAT(IFNULL(updates, ''), ?)`;
      const queryParams = [parseInt(status), `\n[Admin ${username}] ${emailBody}`];

      if (timestampField) {
        updateQuery += `, ${timestampField} = ?`;
        queryParams.push(now);
      }

      updateQuery += ` WHERE ticket_number = ?`;
      queryParams.push(ticketId);

      // Execute the update
      await executeQuery({
        query: updateQuery,
        values: queryParams,
      });


      // Get user email for this ticket
      const [ticket] = await executeQuery({
        query: `SELECT email, name FROM service_tickets WHERE ticket_number = ?`,
        values: [ticketId],
      });

      if (!ticket?.email) {
        return res.status(404).json({ error: "Ticket or email not found" });
      }

      // Send mail
      await sendStatusUpdateEmail(ticket.email, ticket.name, ticketId, emailBody);

      const [updatedTicket] = await executeQuery({
      query: `
        SELECT 
          st.*, 
          e.name AS assigned_engineer_name, 
          e.email_id AS assigned_engineer_email
        FROM service_tickets st
        LEFT JOIN engineers e ON st.assigned_engineer_id = e.engineer_id
        WHERE st.ticket_number = ?
      `,
      values: [ticketId],
    });

    return res.status(200).json({
      message: "Status updated and email sent",
      ticket: updatedTicket,
    });

    } catch (err) {
      console.error("Error updating status and sending mail:", err);
      return res.status(500).json({ error: "Failed to update ticket and send email" });
    }
  }


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
      designation,
      email
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(),?,?,?)
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
    fields.designation,
    fields.email
  ];

  try {
  const result = await executeQuery({
    query,
    values,
  });

  // Send acknowledgment email
  try {
    const userEmail = session?.user?.email || fields.email; // fallback to form field
    if (userEmail) {
      await sendTicketAcknowledgmentEmail(
        userEmail,
        fields.ticketNumber ,
        fields.incidentDetails
      );
    } else {
      console.warn("User email not available for acknowledgment email.");
    }
  } catch (mailErr) {
    console.error("Failed to send acknowledgment email:", mailErr);
    }

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

  // Parse JSON manually
  const body = await new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        const parsed = JSON.parse(data);
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    });
  });

  const { engineerId } = body;

  if (!ticketId || !engineerId) {
    return res.status(400).json({ error: "Missing ticketId or engineerId" });
  }


  try {
    // Update ticket with engineer
    await executeQuery({
      query: `UPDATE service_tickets SET assigned_engineer_id = ? WHERE ticket_number = ?`,
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

    const [updatedTicket] = await executeQuery({
      query: `
        SELECT 
          st.*, 
          e.name AS assigned_engineer_name, 
          e.email_id AS assigned_engineer_email
        FROM service_tickets st
        LEFT JOIN engineers e ON st.assigned_engineer_id = e.engineer_id
        WHERE st.ticket_number = ?
      `,
      values: [ticketId],
    });

return res.status(200).json({
  message: "Engineer assigned and notified",
  ticket: updatedTicket,
});

  } catch (error) {
    console.error("Error in engineer assignment:", error);
    return res.status(500).json({ error: "Failed to assign engineer" });
  }
}

// Updated function to create Zoho email transporter
// Updated function to create Zoho email transporter
function createZohoTransporter() {
  return nodemailer.createTransport({
    host: 'smtppro.zoho.in', // Zoho SMTP server for paid accounts
    port: 587,               // Use 465 for SSL or 587 for TLS
    secure: false,           // true for port 465, false for 587
    auth: {
      user: process.env.ZOHO_EMAIL,        // e.g. customer_support@jus-tech.in
      pass: process.env.ZOHO_APP_PASSWORD, // your Zoho app password
    },
    tls: {
      rejectUnauthorized: false, // avoids self-signed cert errors
    },
  });
}


async function sendAssignmentEmail(toEmail, engineerName, ticketId) {
  const transporter = createZohoTransporter();

  const mailOptions = {
    from: `"JUS-TECH Support" <${process.env.ZOHO_EMAIL}>`, // Updated sender name
    to: toEmail,
    subject: `Ticket #${ticketId} Assigned to You`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
          <h2 style="color: #333; margin-bottom: 20px;">Ticket Assignment Notification</h2>
          <p>Dear ${engineerName},</p>
          <p>You have been assigned to Ticket <strong>#${ticketId}</strong>.</p>
          <p>Please log in to the portal to view the ticket details and begin resolution.</p>
          <div style="margin: 20px 0; padding: 15px; background-color: #e3f2fd; border-left: 4px solid #2196f3;">
            <strong>Next Steps:</strong>
            <ul style="margin: 10px 0;">
              <li>Access the support portal</li>
              <li>Review ticket details and attachments</li>
              <li>Update ticket status as you progress</li>
              <li>Communicate with the customer as needed</li>
            </ul>
          </div>
          <p>Best regards,<br/>
          <strong>JUS-TECH Support Team</strong><br/>
          customer_support@jus-tech.in</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}


async function sendTicketAcknowledgmentEmail(toEmail, ticketNumber, incidentDetails) {
  const transporter = createZohoTransporter();

  const mailOptions = {
    from: `"JUS-TECH Support" <${process.env.ZOHO_EMAIL}>`, // Updated sender name
    to: toEmail,
    subject: `Ticket #${ticketNumber} Received - Confirmation`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
          <h2 style="color: #333; margin-bottom: 20px;">Service Ticket Confirmation</h2>
          <p>Respected Sir,</p>
          <p>Thank you for contacting JUS-TECH Support. Your service ticket has been successfully received and logged in our system.</p>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #e8f5e8; border-left: 4px solid #4caf50;">
            <strong>Ticket Details:</strong><br/>
            <strong>Ticket Number:</strong> #${ticketNumber}<br/>
            <strong>Issue Reported:</strong> ${incidentDetails}<br/>
            <strong>Status:</strong> Open 
          </div>
          
          <p>Our technical support team will review your request and assign it to the appropriate engineer. You will receive updates as we progress with the resolution.</p>
          
          <p><strong>What happens next?</strong></p>
          <ul>
            <li>Our team will review your ticket within 24 hours</li>
            <li>We may ask you to send the equipment to our head office so that we can inspect and service it</li>
            <li>An engineer will be assigned to your case</li>
            <li>You'll receive regular updates on the progress</li>
          </ul>
          
          <p>If you need to provide additional information or have urgent queries, please reply to this email with your ticket number #${ticketNumber}.</p>
          
          <p>Thank you for choosing JUS-TECH.</p>
          
          <p>Best regards,<br/>
          Ajinkya Patil<br/>
          Customer Service Engineer<br/>
          <strong>Jatayu Unmanned Technologies Pvt. Ltd.</strong><br/>
          Email: customer_support@jus-tech.in<br/>
          Phone: +91 9921149607</p>
          
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

async function sendStatusUpdateEmail(toEmail, userName, ticketId, message) {
  const transporter = createZohoTransporter();

  const mailOptions = {
    from: `"JUS-TECH Support" <${process.env.ZOHO_EMAIL}>`, // Updated sender name
    to: toEmail,
    subject: `Update on Ticket #${ticketId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
          <h2 style="color: #333; margin-bottom: 20px;">Ticket Update Notification</h2>
          <p>Dear ${userName},</p>
          <p>There has been an update on your support ticket <strong>#${ticketId}</strong>:</p>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
            <strong>Update:</strong><br/>
            ${message}
          </div>
          
          <p>We will continue to keep you informed of any further developments. If you have any questions or concerns, please don't hesitate to contact us.</p>
          
          <p>Thank you for your patience.</p>
          
          <p>Best regards,<br/>
          <strong>JUS-TECH Support Team</strong><br/>
          customer_support@jus-tech.in</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
