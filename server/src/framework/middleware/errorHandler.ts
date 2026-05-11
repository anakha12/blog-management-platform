import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../domain/exceptions/AppError";
import { logger } from "../../infrastructure/logger/logger";
import { ZodError, ZodIssue } from "zod";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(err.stack || err.message);

  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((e: ZodIssue) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  // Known operational errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Mongoose duplicate key (code 11000)
  if ((err as NodeJS.ErrnoException & { code?: number }).code === 11000) {
    res.status(StatusCodes.CONFLICT).json({
      success: false,
      message: "A resource with that value already exists",
    });
    return;
  }

  // Fallback 500
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message:
      process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
};
