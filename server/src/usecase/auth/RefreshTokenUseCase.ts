import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../domain/interfaces/IUseCase";
import { Tokens } from "../../di/tokens";
import { ITokenService } from "../../domain/services/ITokenService";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UnauthorizedError } from "../../domain/exceptions/AppError";
import { User } from "../../domain/entities/User";

interface IResponse {
  accessToken: string;
  user: User;
}

@injectable()
export class RefreshTokenUseCase implements IUseCase<string, IResponse> {
  constructor(
    @inject(Tokens.TokenService) private tokenService: ITokenService,
    @inject(Tokens.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(refreshToken: string): Promise<IResponse> {
    // Will throw AppError if invalid/expired
    const decoded = this.tokenService.verifyRefreshToken(refreshToken);

    // Confirm user still exists
    const user = await this.userRepository.findByEmail(decoded.email);
    if (!user) {
      throw new UnauthorizedError("User no longer exists");
    }

    const accessToken = this.tokenService.generateAccessToken({
      id: user.id,
      email: user.email,
    });

    return { accessToken, user };
  }
}
