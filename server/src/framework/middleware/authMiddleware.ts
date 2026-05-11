import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
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
    throw new AppError("No token provided", StatusCodes.UNAUTHORIZED);
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new AppError("JWT secret not configured", StatusCodes.INTERNAL_SERVER_ERROR);
  }

  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;

    if (decoded.type !== "access") {
      throw new AppError("Invalid token type", StatusCodes.UNAUTHORIZED);
    }

    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      throw new AppError("Access token expired", StatusCodes.UNAUTHORIZED);
    }
    throw new AppError("Invalid access token", StatusCodes.UNAUTHORIZED);
  }
};



