import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../domain/constants/HttpStatus";
import { ErrorMessages } from "../../domain/constants/ErrorMessages";
import jwt from "jsonwebtoken";
import { AppError } from "../../domain/exceptions/AppError";

export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

interface TokenPayload {
  id: string;
  email: string;
  type: "access" | "refresh";
}

export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError(ErrorMessages.AUTH.NO_TOKEN, HttpStatus.UNAUTHORIZED);
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new AppError(ErrorMessages.AUTH.JWT_SECRET_NOT_CONFIGURED, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;

    if (decoded.type !== "access") {
      throw new AppError(ErrorMessages.AUTH.INVALID_TOKEN_TYPE, HttpStatus.UNAUTHORIZED);
    }

    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      throw new AppError(ErrorMessages.AUTH.ACCESS_TOKEN_EXPIRED, HttpStatus.UNAUTHORIZED);
    }
    throw new AppError(ErrorMessages.AUTH.INVALID_ACCESS_TOKEN, HttpStatus.UNAUTHORIZED);
  }
};



