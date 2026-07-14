import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../domain/interfaces/IUseCase";
import { Tokens } from "../../di/tokens";
import { IBlogRepository } from "../../domain/repositories/IBlogRepository";
import { IFileService } from "../../domain/services/IFileService";
import { NotFoundError, ForbiddenError } from "../../domain/exceptions/AppError";
import { ErrorMessages } from "../../domain/constants/ErrorMessages";

export interface DeleteBlogRequest {
  id: string;
  authorId: string;
}

@injectable()
export class DeleteBlogUseCase implements IUseCase<DeleteBlogRequest, boolean> {
  constructor(
    @inject(Tokens.BlogRepository) private blogRepository: IBlogRepository,
    @inject(Tokens.FileService) private fileService: IFileService
  ) {}

  async execute(request: DeleteBlogRequest): Promise<boolean> {
    const blog = await this.blogRepository.findById(request.id);
    if (!blog) {
      throw new NotFoundError("Blog post");
    }

    // Authorization check
    if (blog.authorId !== request.authorId) {
      throw new ForbiddenError(ErrorMessages.BLOG.UNAUTHORIZED_DELETE);
    }

    // Delete from cloud if image exists
    if (blog.imageUrl && blog.imageUrl.includes("cloudinary")) {
      await this.fileService.delete(blog.imageUrl);
    }

    return await this.blogRepository.delete(request.id);
  }
}
