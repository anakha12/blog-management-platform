import { v2 as cloudinary } from "cloudinary";
import { injectable } from "tsyringe";
import { IFileService } from "../../domain/services/IFileService";
import { logger } from "../logger/logger";
import { ErrorMessages } from "../../domain/constants/ErrorMessages";
import fs from "fs";

@injectable()
export class CloudinaryFileService implements IFileService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async upload(filePath: string): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "blog_platform",
        fetch_format: "auto",
        quality: "auto",
      });

      // Remove local temp file after upload
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return result.secure_url;
    } catch (error) {
      logger.error("Cloudinary Upload Error:", error);
      throw new Error(ErrorMessages.STORAGE.CLOUDINARY_UPLOAD_FAILED);
    }
  }

  async delete(fileUrl: string): Promise<void> {
    try {
      // Extract public_id from URL: .../folder/public_id.jpg
      const parts = fileUrl.split("/");
      const fileName = parts[parts.length - 1];
      const publicId = `blog_platform/${fileName.split(".")[0]}`;

      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      logger.error("Cloudinary Delete Error:", error);
    }
  }
}
