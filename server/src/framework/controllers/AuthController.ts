import { Request, Response } from "express";
import { SendOtpUseCase } from "../../usecase/auth/SendOtpUseCase";
import { VerifyOtpAndRegisterUseCase } from "../../usecase/auth/VerifyOtpAndRegisterUseCase";
import { LoginUserUseCase } from "../../usecase/auth/LoginUserUseCase";
import { RefreshTokenUseCase } from "../../usecase/auth/RefreshTokenUseCase";
import { RegisterUserSchema, LoginUserSchema, VerifyOtpSchema } from "../../usecase/validators/AuthValidators";
import { UserMapper } from "../mappers/UserMapper";
import { HttpStatus } from "../../domain/constants/HttpStatus";
import { ErrorMessages } from "../../domain/constants/ErrorMessages";
import { SuccessMessages } from "../../domain/constants/SuccessMessages";
import { injectable, inject } from "tsyringe";
import { Tokens } from "../../di/tokens";
import { AppError } from "../../domain/exceptions/AppError";

const REFRESH_COOKIE = "refreshToken";
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; 

@injectable()
export class AuthController {
  constructor(
    @inject(Tokens.SendOtpUseCase) private sendOtpUseCase: SendOtpUseCase,
    @inject(Tokens.VerifyOtpAndRegisterUseCase) private verifyOtpAndRegisterUseCase: VerifyOtpAndRegisterUseCase,
    @inject(Tokens.LoginUserUseCase) private loginUserUseCase: LoginUserUseCase,
    @inject(Tokens.RefreshTokenUseCase) private refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const validatedData = RegisterUserSchema.parse(req.body);
    await this.sendOtpUseCase.execute(validatedData);

    res.status(HttpStatus.OK).json({
      success: true,
      message: SuccessMessages.AUTH.OTP_SENT,
    });
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const validatedData = VerifyOtpSchema.parse(req.body);
    const result = await this.verifyOtpAndRegisterUseCase.execute(validatedData);

    res.cookie(REFRESH_COOKIE, result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: COOKIE_MAX_AGE_MS,
    });

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: SuccessMessages.AUTH.REGISTERED,
      data: {
        user: UserMapper.toResponse(result.user),
        accessToken: result.accessToken,
      },
    });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const validatedData = LoginUserSchema.parse(req.body);
    const result = await this.loginUserUseCase.execute(validatedData);

    res.cookie(REFRESH_COOKIE, result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: COOKIE_MAX_AGE_MS,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: SuccessMessages.AUTH.LOGGED_IN,
      data: {
        user: UserMapper.toResponse(result.user),
        accessToken: result.accessToken,
      },
    });
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    if (!refreshToken) {
      throw new AppError(ErrorMessages.AUTH.REFRESH_TOKEN_NOT_FOUND, HttpStatus.UNAUTHORIZED);
    }

    const result = await this.refreshTokenUseCase.execute(refreshToken);

    res.status(HttpStatus.OK).json({
      success: true,
      data: { 
        accessToken: result.accessToken,
        user: UserMapper.toResponse(result.user)
      },
    });
  };

  logout = async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie(REFRESH_COOKIE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: SuccessMessages.AUTH.LOGGED_OUT,
    });
  };
}
