import { z } from "zod";
import { ErrorMessages } from "../../domain/constants/ErrorMessages";

export const RegisterUserSchema = z.object({
  name: z
    .string()
    .min(2, ErrorMessages.VALIDATION.NAME_MIN)
    .max(50, ErrorMessages.VALIDATION.NAME_MAX),
  email: z
    .string()
    .email(ErrorMessages.VALIDATION.INVALID_EMAIL)
    .max(255, ErrorMessages.VALIDATION.EMAIL_MAX),
  password: z
    .string()
    .min(6, ErrorMessages.VALIDATION.PASSWORD_MIN)
    .max(100, ErrorMessages.VALIDATION.PASSWORD_MAX),
});

export const LoginUserSchema = z.object({
  email: z
    .string()
    .email(ErrorMessages.VALIDATION.INVALID_EMAIL)
    .max(255, ErrorMessages.VALIDATION.EMAIL_MAX),
  password: z
    .string()
    .min(1, ErrorMessages.VALIDATION.PASSWORD_REQUIRED)
    .max(100, ErrorMessages.VALIDATION.PASSWORD_MAX),
});

export const VerifyOtpSchema = z.object({
  email: z
    .string()
    .email(ErrorMessages.VALIDATION.INVALID_EMAIL)
    .max(255, ErrorMessages.VALIDATION.EMAIL_MAX),
  otp: z
    .string()
    .length(6, ErrorMessages.VALIDATION.OTP_LENGTH)
    .regex(/^[0-9]+$/, ErrorMessages.VALIDATION.OTP_NUMERIC),
});

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
export type LoginUserInput = z.infer<typeof LoginUserSchema>;
export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;
