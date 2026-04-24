"use server";

import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

// Using Service Role to bypass RLS for inserting inquiries safely from the server
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function submitInquiry(formData: {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
}) {
  try {
    // 1. Save to Database (contact_inquiries)
    const { error: dbError } = await supabaseAdmin
      .from("contact_inquiries")
      .insert([
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          service_interested: formData.service || null,
          message: formData.message || null,
          status: "new"
        }
      ]);

    if (dbError) {
      console.error("Database Insert Error:", dbError);
      return { success: false, error: "Failed to save inquiry to database." };
    }

    // 2. Send Email via Nodemailer
    // Only attempt to send email if SMTP credentials exist
    if (process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "solutionstruecare@gmail.com",
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const mailOptions = {
        from: '"TrueCare Website" <solutionstruecare@gmail.com>',
        to: "solutionstruecare@gmail.com", // Send to self
        subject: `New Lead: ${formData.name} - ${formData.service || 'General Inquiry'}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Contact Form Submission</h2>
            <p>You have received a new inquiry from the TrueCare website.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; width: 150px;">Name</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${formData.name}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Phone</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">
                  <a href="tel:${formData.phone}">${formData.phone}</a>
                </td>
              </tr>
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Email</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">
                  ${formData.email ? `<a href="mailto:${formData.email}">${formData.email}</a>` : 'Not provided'}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Service Interested</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${formData.service || 'Not specified'}</td>
              </tr>
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; vertical-align: top;">Message</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${formData.message || 'No message provided.'}</td>
              </tr>
            </table>
            
            <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">
              This email was generated automatically from your website's contact form.
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } else {
      console.warn("GMAIL_APP_PASSWORD not set in environment variables. Email notification skipped, but database insertion succeeded.");
    }

    return { success: true };
  } catch (error) {
    console.error("Action Error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
