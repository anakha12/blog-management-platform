import { HttpStatus } from "../constants/HttpStatus";
import { ErrorMessages } from "../constants/ErrorMessages";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(ErrorMessages.BLOG.NOT_FOUND(resource), HttpStatus.NOT_FOUND);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, HttpStatus.CONFLICT);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

