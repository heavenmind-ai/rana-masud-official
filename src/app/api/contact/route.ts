import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import { verifySession } from "@/lib/auth";
import { Message } from "@/models/Message";
import { Page } from "@/models/Page";
import nodemailer from "nodemailer";

// POST: Public submission endpoint
export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    // Create the message in MongoDB
    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
      read: false,
    });

    // Retrieve contact configuration for notification email
    const contactDoc = await Page.findOne({ slug: "contact" }).lean();
    const notificationEmail = (contactDoc as any)?.frontmatter?.notificationEmail;

    if (notificationEmail) {
      try {
        await sendNotificationEmail(notificationEmail, { name, email, subject, message });
      } catch (mailErr) {
        console.error("Failed to send notification email:", mailErr);
      }
    }

    return NextResponse.json({ success: true, messageId: newMessage._id });
  } catch (error: any) {
    console.error("Contact POST endpoint error:", error);
    return NextResponse.json({ error: "Failed to submit contact message" }, { status: 500 });
  }
}

// GET: Secure inbox retrieval
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const isAuthenticated = await verifySession(token);

    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    await connectToDatabase();
    const messages = await Message.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(messages);
  } catch (error: any) {
    console.error("Contact GET inbox error:", error);
    return NextResponse.json({ error: "Failed to fetch inbox messages" }, { status: 500 });
  }
}

// PATCH: Secure update read status
export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const isAuthenticated = await verifySession(token);

    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { id, read } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Message ID is required." }, { status: 400 });
    }

    await connectToDatabase();
    await Message.findByIdAndUpdate(id, { $set: { read } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Contact PATCH error:", error);
    return NextResponse.json({ error: "Failed to update read status" }, { status: 500 });
  }
}

// DELETE: Secure delete message
export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const isAuthenticated = await verifySession(token);

    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Message ID is required." }, { status: 400 });
    }

    await connectToDatabase();
    await Message.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Contact DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}

async function sendNotificationEmail(toEmail: string, messageDetails: { name: string; email: string; subject: string; message: string }) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const smtpFrom = process.env.SMTP_FROM || smtpUser || "no-reply@ranamasudbd.com";

  const emailSubject = `[Rana Masud Site Inquiry]: ${messageDetails.subject}`;
  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-top: 0;">New Contact Form Inquiry</h2>
      <p style="margin: 15px 0;">You have received a new message through the website contact form.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; width: 120px; border: 1px solid #ddd;">Name:</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${messageDetails.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Email:</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${messageDetails.email}">${messageDetails.email}</a></td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Subject:</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${messageDetails.subject}</td>
        </tr>
      </table>

      <div style="background-color: #fdfdfd; border-left: 4px solid #d4af37; padding: 15px; margin: 20px 0; font-style: italic;">
        ${messageDetails.message.replace(/\n/g, "<br>")}
      </div>
      
      <p style="font-size: 11px; color: #888; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
        Sent from Rana Masud Portfolio CMS system.
      </p>
    </div>
  `;

  if (!smtpUser || !smtpPass) {
    console.log("=== [SMTP MOCK NOTIFICATION EMAIL] ===");
    console.log(`To: ${toEmail}`);
    console.log(`From: ${smtpFrom}`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`Content:\nName: ${messageDetails.name}\nEmail: ${messageDetails.email}\nSubject: ${messageDetails.subject}\nMessage: ${messageDetails.message}`);
    console.log("======================================");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  await transporter.sendMail({
    from: smtpFrom,
    to: toEmail,
    subject: emailSubject,
    html: emailHtml,
  });
}
