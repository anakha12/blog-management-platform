import { Router } from "express";
import { container } from "../../di/container";
import { BlogController } from "../controllers/BlogController";
import { authenticate } from "../middleware/authMiddleware";
import { uploadMiddleware } from "../middleware/uploadMiddleware";

const blogController = container.resolve(BlogController);

export const blogRouter = Router();

blogRouter.get("/", blogController.getAll);
blogRouter.get("/:id", blogController.getById);

// Protected routes (require auth)
blogRouter.post("/", authenticate, uploadMiddleware.single("image"), blogController.create);
blogRouter.put("/:id", authenticate, uploadMiddleware.single("image"), blogController.update);
blogRouter.delete("/:id", authenticate, blogController.delete);

