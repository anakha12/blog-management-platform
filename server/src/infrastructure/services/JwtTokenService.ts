import jwt from "jsonwebtoken";
import { ITokenService } from "../../domain/services/ITokenService";
import { injectable } from "tsyringe";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../domain/constants/HttpStatus";
import { ErrorMessages } from "../../domain/constants/ErrorMessages";

@injectable()
export class JwtTokenService implements ITokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor() {
    this.accessSecret = process.env.JWT_ACCESS_SECRET!;
    this.refreshSecret = process.env.JWT_REFRESH_SECRET!;
    this.accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN ?? "15m";
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";
  }

  generateAccessToken(payload: object): string {
    return jwt.sign({ ...payload, type: "access" }, this.accessSecret, {
      expiresIn: this.accessExpiresIn,
    } as jwt.SignOptions);
  }

  generateRefreshToken(payload: object): string {
    return jwt.sign({ ...payload, type: "refresh" }, this.refreshSecret, {
      expiresIn: this.refreshExpiresIn,
    } as jwt.SignOptions);
  }

  verifyAccessToken(token: string): { id: string; email: string } {
    try {
      return jwt.verify(token, this.accessSecret) as { id: string; email: string };
    } catch {
      throw new AppError(ErrorMessages.AUTH.INVALID_EXPIRED_ACCESS, HttpStatus.UNAUTHORIZED);
    }
  }

  verifyRefreshToken(token: string): { id: string; email: string } {
    try {
      return jwt.verify(token, this.refreshSecret) as { id: string; email: string };
    } catch {
      throw new AppError(ErrorMessages.AUTH.INVALID_EXPIRED_REFRESH, HttpStatus.UNAUTHORIZED);
    }
  }
}
