import { container } from "tsyringe";
import { Tokens } from "./tokens";

// Repositories
import { MongoUserRepository } from "../infrastructure/repositories/MongoUserRepository";
import { MongoBlogRepository } from "../infrastructure/repositories/MongoBlogRepository";

// Services
import { BcryptHashService } from "../infrastructure/services/BcryptHashService";
import { JwtTokenService } from "../infrastructure/services/JwtTokenService";
import { RedisOtpService } from "../infrastructure/services/RedisOtpService";
import { NodemailerEmailService } from "../infrastructure/services/NodemailerEmailService";
import { CloudinaryFileService } from "../infrastructure/services/CloudinaryFileService";

// Auth UseCases
import { SendOtpUseCase } from "../usecase/auth/SendOtpUseCase";
import { VerifyOtpAndRegisterUseCase } from "../usecase/auth/VerifyOtpAndRegisterUseCase";
import { LoginUserUseCase } from "../usecase/auth/LoginUserUseCase";
import { RefreshTokenUseCase } from "../usecase/auth/RefreshTokenUseCase";

// Blog UseCases
import { CreateBlogUseCase } from "../usecase/blog/CreateBlogUseCase";
import { GetAllBlogsUseCase } from "../usecase/blog/GetAllBlogsUseCase";
import { GetBlogByIdUseCase } from "../usecase/blog/GetBlogByIdUseCase";
import { UpdateBlogUseCase } from "../usecase/blog/UpdateBlogUseCase";
import { DeleteBlogUseCase } from "../usecase/blog/DeleteBlogUseCase";

// Register Repositories
container.registerSingleton(Tokens.UserRepository, MongoUserRepository);
container.registerSingleton(Tokens.BlogRepository, MongoBlogRepository);

// Register Services
container.registerSingleton(Tokens.HashService, BcryptHashService);
container.registerSingleton(Tokens.TokenService, JwtTokenService);
container.registerSingleton(Tokens.OtpService, RedisOtpService);
container.registerSingleton(Tokens.EmailService, NodemailerEmailService);
container.registerSingleton(Tokens.FileService, CloudinaryFileService);

// Register Auth UseCases
container.registerSingleton(Tokens.SendOtpUseCase, SendOtpUseCase);
container.registerSingleton(Tokens.VerifyOtpAndRegisterUseCase, VerifyOtpAndRegisterUseCase);
container.registerSingleton(Tokens.LoginUserUseCase, LoginUserUseCase);
container.registerSingleton(Tokens.RefreshTokenUseCase, RefreshTokenUseCase);

// Register Blog UseCases
container.registerSingleton(Tokens.CreateBlogUseCase, CreateBlogUseCase);
container.registerSingleton(Tokens.GetAllBlogsUseCase, GetAllBlogsUseCase);
container.registerSingleton(Tokens.GetBlogByIdUseCase, GetBlogByIdUseCase);
container.registerSingleton(Tokens.UpdateBlogUseCase, UpdateBlogUseCase);
container.registerSingleton(Tokens.DeleteBlogUseCase, DeleteBlogUseCase);

export { container };
