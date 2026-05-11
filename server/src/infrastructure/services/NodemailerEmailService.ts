import { injectable } from "tsyringe";
import nodemailer from "nodemailer";
import { IEmailService } from "../../domain/services/IEmailService";
import { logger } from "../logger/logger";

@injectable()
export class NodemailerEmailService implements IEmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: "Your OTP for Registration",
        text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
        html: `<b>Your OTP is: ${otp}</b><p>It will expire in 5 minutes.</p>`,
      });
      logger.info(`OTP sent to ${email}`);
    } catch (error) {
      logger.error(`Failed to send email to ${email}:`, error);
      throw error;
    }
  }
}
