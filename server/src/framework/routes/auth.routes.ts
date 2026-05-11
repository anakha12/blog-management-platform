import { Router } from "express";
import { container } from "../../di/container";
import { AuthController } from "../controllers/AuthController";

const authController = container.resolve(AuthController);

export const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/verify-otp", authController.verifyOtp);
authRouter.post("/login", authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);
