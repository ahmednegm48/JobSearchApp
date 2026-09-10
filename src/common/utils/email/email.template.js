export const emailTemplate = (OTP) => {
    return `<div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f0f4f8; padding: 40px 20px;">
  <div style="max-width: 480px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden;">

    <div style="background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%); padding: 28px 32px 0; text-align: center; border-radius: 12px 12px 0 0;">
      <p style="margin: 16px 0 0; color: rgba(255,255,255,0.85); font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">Verification Code</p>
      <h1 style="margin: 8px 0 0; color: #ffffff; font-size: 22px; font-weight: 600; padding-bottom: 24px;">Confirm your identity</h1>
    </div>

    <div style="padding: 32px;">

      <p style="color: #3c4043; font-size: 15px; margin: 0 0 8px;">Hi there,</p>
      <p style="color: #5f6368; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
        Use the one-time code below to complete your verification. It expires shortly — do not share it with anyone.
      </p>

      <div style="background: #f0f4f8; border: 2px dashed #c5cae9; border-radius: 10px; text-align: center; padding: 24px 16px; margin: 0 0 28px;">
        <p style="margin: 0 0 6px; color: #5f6368; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;">Your OTP</p>
        <span style="font-size: 36px; letter-spacing: 10px; font-weight: 700; color: #1a73e8; font-variant-numeric: tabular-nums;">
          ${OTP}
        </span>
      </div>

      <p style="color: #9aa0a6; font-size: 12px; line-height: 1.6; margin: 0;">
        If you didn't request this, you can safely ignore this email. No action is required.
      </p>
    </div>

    <div style="border-top: 1px solid #e8eaed; padding: 16px 32px; background: #fafafa;">
      <p style="margin: 0; color: #b0b8c1; font-size: 11px; text-align: center;">
        This is an automated message — please do not reply.
      </p>
      <p style="margin: 8px 0 0; color: #b0b8c1; font-size: 11px; text-align: center;">
        © 2026 Saraha. All rights reserved.
      </p>
    </div>

  </div>
</div>`
}