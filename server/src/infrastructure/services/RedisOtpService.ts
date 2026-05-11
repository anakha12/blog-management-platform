import Redis from "ioredis";
import { injectable } from "tsyringe";
import { IOtpService, OtpRecord } from "../../domain/services/IOtpService";
import { RegisterUserInput } from "../../usecase/validators/AuthValidators";

@injectable()
export class RedisOtpService implements IOtpService {
  private redis: Redis;
  private readonly OTP_EXPIRY = parseInt(process.env.OTP_EXPIRES_SECONDS || "300");

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
  }

  async storeOtp(email: string, data: RegisterUserInput): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const payload = JSON.stringify({ otp, data });
    await this.redis.set(`otp:${email}`, payload, "EX", this.OTP_EXPIRY);
    return otp;
  }

  async getOtpRecord(email: string): Promise<OtpRecord | null> {
    const record = await this.redis.get(`otp:${email}`);
    if (!record) return null;
    return JSON.parse(record) as OtpRecord;
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const record = await this.redis.get(`otp:${email}`);
    if (!record) return false;

    const parsed = JSON.parse(record) as OtpRecord;
    return parsed.otp === otp;
  }

  async deleteOtp(email: string): Promise<void> {
    await this.redis.del(`otp:${email}`);
  }
}
