import { injectable } from "tsyringe";
import { Resend } from "resend";
import { IEmailService } from "../../domain/services/IEmailService";
import { logger } from "../logger/logger";

@injectable()
export class ResendEmailService implements IEmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: process.env.RESEND_FROM || "BlogSpace <onboarding@resend.dev>",
        to: email,
        subject: "Your OTP for Registration",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0f172a; color: #e2e8f0; border-radius: 12px;">
            <h2 style="color: #a78bfa; margin-bottom: 8px;">✦ BlogSpace</h2>
            <p style="color: #94a3b8; margin-bottom: 24px;">Your One-Time Password for registration:</p>
            <div style="background: #1e293b; border-radius: 8px; padding: 24px; text-align: center; letter-spacing: 8px; font-size: 32px; font-weight: bold; color: #a78bfa;">
              ${otp}
            </div>
            <p style="color: #64748b; font-size: 13px; margin-top: 24px;">This OTP expires in <strong>5 minutes</strong>. Do not share it with anyone.</p>
          </div>
        `,
      });
      logger.info(`OTP sent to ${email}`);
    } catch (error) {
      logger.error(`Failed to send email to ${email}:`, error);
      throw error;
    }
  }
}
