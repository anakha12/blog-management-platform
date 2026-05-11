import { RegisterUserInput } from "../../usecase/validators/AuthValidators";

export interface OtpRecord {
  otp: string;
  data: RegisterUserInput;
}

export interface IOtpService {
  storeOtp(email: string, data: RegisterUserInput): Promise<string>; // Returns the generated OTP
  getOtpRecord(email: string): Promise<OtpRecord | null>;
  verifyOtp(email: string, otp: string): Promise<boolean>;
  deleteOtp(email: string): Promise<void>;
}
