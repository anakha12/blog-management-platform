import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/authMiddleware";

export const userRouter = Router();

// GET /api/v1/users/me
userRouter.get("/me", authenticate, (_req: Request, res: Response) => {
  res.json({ success: true, message: "Get current user — coming soon" });
});

// PUT /api/v1/users/me
userRouter.put("/me", authenticate, (_req: Request, res: Response) => {
  res.json({ success: true, message: "Update profile — coming soon" });
});
