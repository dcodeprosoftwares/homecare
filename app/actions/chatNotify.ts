"use server";

import nodemailer from "nodemailer";

export async function notifyAdminChatStart(visitorId: string, firstMessage: string) {
  try {
    if (!process.env.GMAIL_APP_PASSWORD) {
      console.warn("GMAIL_APP_PASSWORD not set. Skipping chat notification email.");
      return { success: false, error: "SMTP credentials not configured." };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "solutionstruecare@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: '"TrueCare Chat" <solutionstruecare@gmail.com>',
      to: "solutionstruecare@gmail.com",
      subject: `New Live Chat Started - Visitor ${visitorId.substring(0, 4)}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #0891b2; margin-top: 0;">New Chat Session Started</h2>
          <p style="color: #374151;">A visitor has just started a new live chat session on your website.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: bold; text-transform: uppercase;">Visitor ID</p>
            <p style="margin: 4px 0 16px 0; font-family: monospace;">${visitorId}</p>
            
            <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: bold; text-transform: uppercase;">Their First Message</p>
            <p style="margin: 4px 0 0 0; color: #111827; font-size: 15px;">"${firstMessage}"</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://truecare.com'}/admin/chats" style="display: inline-block; background-color: #0891b2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Reply in Admin Panel
            </a>
          </div>
          
          <p style="margin-top: 30px; font-size: 11px; color: #9ca3af; text-align: center;">
            This is an automated notification from the TrueCare website chat system.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Chat Notify Error:", error);
    return { success: false, error: "Failed to send notification email." };
  }
}
