import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../domain/interfaces/IUseCase";
import { Tokens } from "../../di/tokens";
import { IBlogRepository } from "../../domain/repositories/IBlogRepository";
import { IFileService } from "../../domain/services/IFileService";
import { NotFoundError, ForbiddenError } from "../../domain/exceptions/AppError";
import { UpdateBlogInput } from "../validators/BlogValidators";
import { Blog } from "../../domain/entities/Blog";

export interface UpdateBlogRequest {
  id: string;
  data: UpdateBlogInput;
  authorId: string;
  imageUrl?: string; // This will be the local temp path
}

@injectable()
export class UpdateBlogUseCase implements IUseCase<UpdateBlogRequest, Blog | null> {
  constructor(
    @inject(Tokens.BlogRepository) private blogRepository: IBlogRepository,
    @inject(Tokens.FileService) private fileService: IFileService
  ) {}

  async execute(request: UpdateBlogRequest): Promise<Blog | null> {
    const blog = await this.blogRepository.findById(request.id);
    if (!blog) {
      throw new NotFoundError("Blog post");
    }
    
    // Authorization check
    if (blog.authorId !== request.authorId) {
      throw new ForbiddenError("You are not authorized to update this blog post");
    }

    const updateData: Partial<Blog> = { ...request.data };

    // If a new image was uploaded, upload to cloud and delete the old one
    if (request.imageUrl) {
      // 1. Upload new image
      const newUrl = await this.fileService.upload(request.imageUrl);
      
      // 2. Delete old image if it was on Cloudinary
      if (blog.imageUrl && blog.imageUrl.includes("cloudinary")) {
        await this.fileService.delete(blog.imageUrl);
      }

      updateData.imageUrl = newUrl;
    }

    return await this.blogRepository.update(request.id, updateData);
  }
}
