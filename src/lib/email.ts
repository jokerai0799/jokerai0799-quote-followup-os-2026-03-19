import { createEmailVerificationToken } from './email-verification'

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@quotefollowup.online'
  const appUrl = process.env.APP_URL || 'https://quotefollowup.online'

  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY')
  }

  return { apiKey, fromEmail, appUrl }
}

export async function sendSignupVerificationEmail({
  email,
  name,
}: {
  email: string
  name: string
}) {
  const { apiKey, fromEmail, appUrl } = getResendConfig()
  const token = createEmailVerificationToken(email)
  const verifyUrl = `${appUrl}/verify-email?token=${encodeURIComponent(token)}`
  const firstName = name.trim().split(/\s+/)[0] || 'there'

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [email],
      subject: 'Verify your QuoteFollowUp email',
      html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a;line-height:1.6">
          <h1 style="font-size:24px;margin:0 0 16px">Verify your email</h1>
          <p style="margin:0 0 16px">Hi ${firstName},</p>
          <p style="margin:0 0 16px">Click the button below to verify your email and activate your QuoteFollowUp account.</p>
          <p style="margin:24px 0">
            <a href="${verifyUrl}" style="display:inline-block;background:#0284c7;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:12px;font-weight:600">Verify email</a>
          </p>
          <p style="margin:0 0 16px">If the button does not work, use this link:</p>
          <p style="word-break:break-all;margin:0 0 16px"><a href="${verifyUrl}">${verifyUrl}</a></p>
          <p style="margin:0;color:#475569;font-size:14px">This link expires in 24 hours.</p>
        </div>
      `,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Failed to send verification email: ${body}`)
  }
}
