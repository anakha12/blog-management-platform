import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../domain/interfaces/IUseCase";
import { Tokens } from "../../di/tokens";
import { IBlogRepository } from "../../domain/repositories/IBlogRepository";
import { Blog } from "../../domain/entities/Blog";

@injectable()
export class GetAllBlogsUseCase implements IUseCase<void, Blog[]> {
  constructor(
    @inject(Tokens.BlogRepository) private blogRepository: IBlogRepository
  ) {}

  async execute(): Promise<Blog[]> {
    return await this.blogRepository.findAll();
  }
}
