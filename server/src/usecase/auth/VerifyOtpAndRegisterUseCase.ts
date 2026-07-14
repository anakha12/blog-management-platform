import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../domain/interfaces/IUseCase";
import { Tokens } from "../../di/tokens";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IOtpService } from "../../domain/services/IOtpService";
import { IHashService } from "../../domain/services/IHashService";
import { ITokenService } from "../../domain/services/ITokenService";
import { UnauthorizedError } from "../../domain/exceptions/AppError";
import { ErrorMessages } from "../../domain/constants/ErrorMessages";
import { VerifyOtpInput } from "../validators/AuthValidators";
import { User } from "../../domain/entities/User";

export interface VerifyOtpResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

@injectable()
export class VerifyOtpAndRegisterUseCase implements IUseCase<VerifyOtpInput, VerifyOtpResponse> {
  constructor(
    @inject(Tokens.UserRepository) private userRepository: IUserRepository,
    @inject(Tokens.OtpService) private otpService: IOtpService,
    @inject(Tokens.HashService) private hashService: IHashService,
    @inject(Tokens.TokenService) private tokenService: ITokenService
  ) {}

  async execute(request: VerifyOtpInput): Promise<VerifyOtpResponse> {
    // 1. Get the record from Redis
    const record = await this.otpService.getOtpRecord(request.email);
    
    if (!record) {
      throw new UnauthorizedError(ErrorMessages.AUTH.OTP_EXPIRED_OR_INVALID);
    }

    // 2. Verify OTP
    if (record.otp !== request.otp) {
      throw new UnauthorizedError(ErrorMessages.AUTH.INVALID_OTP);
    }

    // 3. Hash password and create user
    const hashedPassword = await this.hashService.hash(record.data.password);
    
    const user = await this.userRepository.create({
      name: record.data.name,
      email: record.data.email,
      password: hashedPassword,
    });

    // 4. Generate tokens
    const accessToken = this.tokenService.generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = this.tokenService.generateRefreshToken({ id: user.id, email: user.email });

    // 5. Cleanup Redis
    await this.otpService.deleteOtp(request.email);

    return { user, accessToken, refreshToken };
  }
}
