import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received body:", body);

    const { name, email, message } = body;

    if (!name || !email || !message) {
      console.warn("Missing fields", { name, email, message });
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.TO_EMAIL,
      subject: "New Message from Portfolio",
      text: message,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    console.log("Email sent:", info);

    return NextResponse.json({ message: "Message sent successfully!" }, { status: 200 });
  } catch (error: any) {
    console.error("API error:", error.message, error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
export async function GET() {
  console.log("GET route hit ✅");
  return new Response("API route is working", { status: 200 });
}