import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../domain/interfaces/IUseCase";
import { Tokens } from "../../di/tokens";
import { IBlogRepository } from "../../domain/repositories/IBlogRepository";
import { IFileService } from "../../domain/services/IFileService";
import { CreateBlogInput } from "../validators/BlogValidators";
import { Blog } from "../../domain/entities/Blog";

export interface CreateBlogRequest extends CreateBlogInput {
  authorId: string;
  localImagePath?: string; // Path to the temp file on server
}

@injectable()
export class CreateBlogUseCase implements IUseCase<CreateBlogRequest, Blog> {
  constructor(
    @inject(Tokens.BlogRepository) private blogRepository: IBlogRepository,
    @inject(Tokens.FileService) private fileService: IFileService
  ) {}

  async execute(request: CreateBlogRequest): Promise<Blog> {
    let imageUrl = undefined;

    // If an image was uploaded to the server, move it to Cloudinary
    if (request.localImagePath) {
      imageUrl = await this.fileService.upload(request.localImagePath);
    }

    return await this.blogRepository.create({
      title: request.title,
      content: request.content,
      authorId: request.authorId,
      imageUrl,
    });
  }
}
