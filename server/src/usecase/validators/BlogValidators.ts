import { z } from "zod";
import { ErrorMessages } from "../../domain/constants/ErrorMessages";

export const CreateBlogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, ErrorMessages.VALIDATION.TITLE_MIN)
    .max(100, ErrorMessages.VALIDATION.TITLE_MAX),
  content: z
    .string()
    .trim()
    .min(10, ErrorMessages.VALIDATION.CONTENT_MIN)
    .max(5000, ErrorMessages.VALIDATION.CONTENT_MAX),
});

export const UpdateBlogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, ErrorMessages.VALIDATION.TITLE_MIN)
    .max(100, ErrorMessages.VALIDATION.TITLE_MAX)
    .optional(),
  content: z
    .string()
    .trim()
    .min(10, ErrorMessages.VALIDATION.CONTENT_MIN)
    .max(5000, ErrorMessages.VALIDATION.CONTENT_MAX)
    .optional(),
});

export type CreateBlogInput = z.infer<typeof CreateBlogSchema>;
export type UpdateBlogInput = z.infer<typeof UpdateBlogSchema>;
