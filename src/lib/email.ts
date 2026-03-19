export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationEmail(to: string, code: string, firstName: string) {
  const html = `
    <div style="background-color: #000; padding: 40px 20px; font-family: 'Inter', system-ui, sans-serif;">
      <div style="max-width: 480px; margin: 0 auto; background: linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.1)); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px;">
        <h1 style="color: #fff; font-size: 24px; margin: 0 0 8px 0; text-align: center;">CSN 2026 Coding Challenge</h1>
        <p style="color: rgba(255,255,255,0.6); font-size: 14px; text-align: center; margin: 0 0 32px 0;">Email Verification</p>
        <p style="color: rgba(255,255,255,0.8); font-size: 16px; margin: 0 0 24px 0;">Hi ${firstName},</p>
        <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 0 0 24px 0;">Enter this verification code to complete your registration:</p>
        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 24px 0;">
          <span style="color: #fff; font-size: 36px; font-weight: 700; letter-spacing: 8px;">${code}</span>
        </div>
        <p style="color: rgba(255,255,255,0.4); font-size: 12px; text-align: center; margin: 0;">This code expires in 10 minutes.</p>
      </div>
    </div>
  `;

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.log(`[DEV] No RESEND_API_KEY set. Verification code for ${to}: ${code}`);
    return { success: false, error: "No API key" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "CSN 2026 <onboarding@resend.dev>",
        to: [to],
        subject: "CSN 2026 - Your Verification Code",
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", data);
      console.log(`[DEV] Verification code for ${to}: ${code}`);
      return { success: false, error: data };
    }

    console.log("Verification email sent:", data.id);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error("Failed to send email:", error);
    console.log(`[DEV] Verification code for ${to}: ${code}`);
    return { success: false, error };
  }
}
