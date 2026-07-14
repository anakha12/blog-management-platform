import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../domain/constants/HttpStatus";
import { ErrorMessages } from "../../domain/constants/ErrorMessages";

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    message: ErrorMessages.SYSTEM.ROUTE_NOT_FOUND(req.method, req.originalUrl),
  });
};
