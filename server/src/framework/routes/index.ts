import { Router } from "express";
import { authRouter } from "./auth.routes";
import { userRouter } from "./user.routes";
import { blogRouter } from "./blog.routes";

export const apiRouter = Router();

// Health check
apiRouter.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "API is healthy 🟢",
    timestamp: new Date().toISOString(),
  });
});

// Feature routes
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/blogs", blogRouter);
