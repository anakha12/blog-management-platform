import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../domain/constants/HttpStatus";
import { ErrorMessages } from "../../domain/constants/ErrorMessages";
import { AppError } from "../../domain/exceptions/AppError";
import { logger } from "../../infrastructure/logger/logger";
import { ZodError, ZodIssue } from "zod";
import multer from "multer";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(err.stack || err.message);

  // Multer errors (file upload size limit etc.)
  if (err instanceof multer.MulterError) {
    let message = err.message;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = ErrorMessages.STORAGE.FILE_TOO_LARGE;
    }
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message,
    });
    return;
  }

  // Custom file upload filter error
  if (err.message === ErrorMessages.STORAGE.INVALID_FILE_TYPE) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: ErrorMessages.SYSTEM.VALIDATION_FAILED,
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
    res.status(HttpStatus.CONFLICT).json({
      success: false,
      message: ErrorMessages.SYSTEM.DUPLICATE_KEY,
    });
    return;
  }

  // Fallback 500
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message:
      process.env.NODE_ENV === "production" ? ErrorMessages.SYSTEM.INTERNAL_SERVER_ERROR : err.message,
  });
};
