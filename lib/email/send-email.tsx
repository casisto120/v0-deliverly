import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: options.from || process.env.EMAIL_FROM || "noreply@deliverly.app",
      to: options.to,
      subject: options.subject,
      html: options.html,
    })

    return true
  } catch (error) {
    console.error("[v0] Email send error:", error)
    return false
  }
}

export function generateFileDeliveryEmail(customerName: string, downloadUrl: string, fileName: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
          .content { padding: 30px 0; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; margin: 20px 0; }
          .footer { color: #999; font-size: 12px; text-align: center; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your File is Ready!</h1>
          </div>
          <div class="content">
            <p>Hi ${customerName},</p>
            <p>Thank you for your purchase! Your digital file is ready to download.</p>
            <p><strong>File:</strong> ${fileName}</p>
            <a href="${downloadUrl}" class="button">Download File</a>
            <p style="color: #999; font-size: 13px;">This download link will expire in 30 days.</p>
          </div>
          <div class="footer">
            <p>Delivered by <strong>Deliverly</strong></p>
            <p>© ${new Date().getFullYear()} All rights reserved</p>
          </div>
        </div>
      </body>
    </html>
  `
}
