import { Request, Response } from "express";
import { CreateBlogUseCase } from "../../usecase/blog/CreateBlogUseCase";
import { GetAllBlogsUseCase } from "../../usecase/blog/GetAllBlogsUseCase";
import { GetBlogByIdUseCase } from "../../usecase/blog/GetBlogByIdUseCase";
import { UpdateBlogUseCase } from "../../usecase/blog/UpdateBlogUseCase";
import { DeleteBlogUseCase } from "../../usecase/blog/DeleteBlogUseCase";
import { CreateBlogSchema, UpdateBlogSchema } from "../../usecase/validators/BlogValidators";
import { BlogMapper } from "../mappers/BlogMapper";
import { HttpStatus } from "../../domain/constants/HttpStatus";
import { SuccessMessages } from "../../domain/constants/SuccessMessages";
import { injectable, inject } from "tsyringe";
import { Tokens } from "../../di/tokens";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  user?: { id: string; email: string };
}

@injectable()
export class BlogController {
  constructor(
    @inject(Tokens.CreateBlogUseCase) private createBlogUseCase: CreateBlogUseCase,
    @inject(Tokens.GetAllBlogsUseCase) private getAllBlogsUseCase: GetAllBlogsUseCase,
    @inject(Tokens.GetBlogByIdUseCase) private getBlogByIdUseCase: GetBlogByIdUseCase,
    @inject(Tokens.UpdateBlogUseCase) private updateBlogUseCase: UpdateBlogUseCase,
    @inject(Tokens.DeleteBlogUseCase) private deleteBlogUseCase: DeleteBlogUseCase
  ) {}

  create = async (req: MulterRequest, res: Response): Promise<void> => {
    const validatedData = CreateBlogSchema.parse(req.body);
    const authorId = req.user!.id;
    const localImagePath = req.file?.path;

    const result = await this.createBlogUseCase.execute({ 
      ...validatedData, 
      authorId, 
      localImagePath 
    });

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: SuccessMessages.BLOG.CREATED,
      data: BlogMapper.toResponse(result),
    });
  };

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const result = await this.getAllBlogsUseCase.execute();
    
    res.status(HttpStatus.OK).json({
      success: true,
      data: result.map(BlogMapper.toResponse),
    });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const result = await this.getBlogByIdUseCase.execute(req.params.id as string);
    
    res.status(HttpStatus.OK).json({
      success: true,
      data: BlogMapper.toResponse(result),
    });
  };

  update = async (req: MulterRequest, res: Response): Promise<void> => {
    const validatedData = UpdateBlogSchema.parse(req.body);
    const authorId = req.user!.id;
    const localImagePath = req.file?.path;

    const result = await this.updateBlogUseCase.execute({ 
      id: req.params.id as string, 
      data: validatedData, 
      authorId, 
      imageUrl: localImagePath // Note: UpdateBlogUseCase also needs logic change
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: SuccessMessages.BLOG.UPDATED,
      data: result ? BlogMapper.toResponse(result) : null,
    });
  };

  delete = async (req: MulterRequest, res: Response): Promise<void> => {
    const authorId = req.user!.id;
    await this.deleteBlogUseCase.execute({ id: req.params.id as string, authorId });

    res.status(HttpStatus.OK).json({
      success: true,
      message: SuccessMessages.BLOG.DELETED,
    });
  };
}
