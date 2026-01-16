import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const mailjetApiKey = process.env.MAILJET_API_KEY;
const mailjetSecretKey = process.env.MAILJET_SECRET_KEY;
const senderEmail = process.env.NEXT_PUBLIC_EMAIL;

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "in-v3.mailjet.com",
      port: 587,
      secure: false,
      auth: {
        user: mailjetApiKey,
        pass: mailjetSecretKey,
      },
    });

    const emailHtmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Contact Form Submission</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333333;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        border: 1px solid #e0e0e0;
                    }
                    .header {
                        background-color: #4CAF50; /* A nice green for success */
                        color: #ffffff;
                        padding: 15px 20px;
                        border-radius: 8px 8px 0 0;
                        text-align: center;
                    }
                    .content-section {
                        padding: 20px;
                        border-bottom: 1px solid #eeeeee;
                    }
                    .content-section:last-child {
                        border-bottom: none;
                    }
                    .footer {
                        text-align: center;
                        padding: 20px;
                        font-size: 0.8em;
                        color: #777777;
                    }
                    .value {
                        font-weight: bold;
                        color: #0056b3; /* A blue color for values */
                    }
                    .label {
                        color: #555555;
                    }
                    h2 {
                        color: #333333;
                    }
                    /* Simple responsiveness */
                    @media only screen and (max-width: 600px) {
                        .container {
                            width: 100% !important;
                            margin: 0 !important;
                            border-radius: 0 !important;
                            box-shadow: none !important;
                        }
                    }
                </style>
            </head>
            <body>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4;">
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0;">
                                <tr>
                                    <td class="header" style="background-color: #4CAF50; color: #ffffff; padding: 15px 20px; border-radius: 8px 8px 0 0; text-align: center;">
                                        <h2 style="margin: 0; color: #ffffff;">New Contact Form Submission</h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="content-section" style="padding: 20px; border-bottom: 1px solid #eeeeee;">
                                        <p style="margin-top: 0; margin-bottom: 15px;">You have received a new message from your contact form:</p>
                                        <p><span class="label" style="color: #555555;"><strong>Name:</strong></span> <span class="value" style="font-weight: bold; color: #0056b3;">${name}</span></p>
                                        <p><span class="label" style="color: #555555;"><strong>Email:</strong></span> <span class="value" style="font-weight: bold; color: #0056b3;"><a href="mailto:${email}" style="color: #0056b3; text-decoration: none;">${email}</a></span></p>
                                        <p><span class="label" style="color: #555555;"><strong>Subject:</strong></span> <span class="value" style="font-weight: bold; color: #0056b3;">${
                                          subject || "N/A"
                                        }</span></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="content-section" style="padding: 20px;">
                                        <p style="margin-top: 0; margin-bottom: 10px;"><span class="label" style="color: #555555;"><strong>Message:</strong></span></p>
                                        <p style="margin-bottom: 0;">${message.replace(
                                          /\n/g,
                                          "<br>"
                                        )}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="footer" style="text-align: center; padding: 20px; font-size: 0.8em; color: #777777;">
                                        <p style="margin: 0;">This email was sent from your website's contact form.</p>
                                        <p style="margin: 5px 0 0;">&copy; ${new Date().getFullYear()} Portfolio Alim</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

    await transporter.sendMail({
      from: `"${name}" <${senderEmail}>`,
      to: senderEmail,
      replyTo: email,
      subject: subject || "New Contact Form Submission",
      html: emailHtmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling POST request:", error);
    let errorMessage = "Error sending message.";
    if (error.code === "EAUTH") {
      errorMessage =
        "Authentication failed. Check your Mailjet API Key and Secret Key.";
    } else if (error.responseCode) {
      errorMessage = `Mailjet error: ${error.responseCode} - ${error.response}`;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
