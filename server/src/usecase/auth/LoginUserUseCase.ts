import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../domain/interfaces/IUseCase";
import { Tokens } from "../../di/tokens";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IHashService } from "../../domain/services/IHashService";
import { ITokenService } from "../../domain/services/ITokenService";
import { UnauthorizedError } from "../../domain/exceptions/AppError";
import { LoginUserInput } from "../validators/AuthValidators";
import { User } from "../../domain/entities/User";

interface IResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

@injectable()
export class LoginUserUseCase implements IUseCase<LoginUserInput, IResponse> {
  constructor(
    @inject(Tokens.UserRepository) private userRepository: IUserRepository,
    @inject(Tokens.HashService) private hashService: IHashService,
    @inject(Tokens.TokenService) private tokenService: ITokenService
  ) {}

  async execute(request: LoginUserInput): Promise<IResponse> {
    const user = await this.userRepository.findByEmail(request.email);
    if (!user || !user.password) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isMatch = await this.hashService.compare(request.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const tokenPayload = { id: user.id, email: user.email };
    const accessToken = this.tokenService.generateAccessToken(tokenPayload);
    const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

    return { user, accessToken, refreshToken };
  }
}

