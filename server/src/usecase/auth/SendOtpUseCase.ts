import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../domain/interfaces/IUseCase";
import { Tokens } from "../../di/tokens";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IOtpService } from "../../domain/services/IOtpService";
import { IEmailService } from "../../domain/services/IEmailService";
import { ConflictError } from "../../domain/exceptions/AppError";
import { ErrorMessages } from "../../domain/constants/ErrorMessages";
import { RegisterUserInput } from "../validators/AuthValidators";

@injectable()
export class SendOtpUseCase implements IUseCase<RegisterUserInput, void> {
  constructor(
    @inject(Tokens.UserRepository) private userRepository: IUserRepository,
    @inject(Tokens.OtpService) private otpService: IOtpService,
    @inject(Tokens.EmailService) private emailService: IEmailService
  ) {}

  async execute(request: RegisterUserInput): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new ConflictError(ErrorMessages.AUTH.EMAIL_REGISTERED);
    }

    // storeOtp now handles generation internally and returns the OTP
    const otp = await this.otpService.storeOtp(request.email, request);

    // Send OTP via email
    await this.emailService.sendOtp(request.email, otp);
  }
}
