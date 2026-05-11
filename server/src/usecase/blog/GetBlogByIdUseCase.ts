import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../domain/interfaces/IUseCase";
import { Tokens } from "../../di/tokens";
import { IBlogRepository } from "../../domain/repositories/IBlogRepository";
import { NotFoundError } from "../../domain/exceptions/AppError";
import { Blog } from "../../domain/entities/Blog";

@injectable()
export class GetBlogByIdUseCase implements IUseCase<string, Blog> {
  constructor(
    @inject(Tokens.BlogRepository) private blogRepository: IBlogRepository
  ) {}

  async execute(id: string): Promise<Blog> {
    const blog = await this.blogRepository.findById(id);
    if (!blog) {
      throw new NotFoundError("Blog post");
    }
    return blog;
  }
}
