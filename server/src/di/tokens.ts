export const Tokens = {
  UserRepository: Symbol.for("UserRepository"),
  BlogRepository: Symbol.for("BlogRepository"),
  HashService: Symbol.for("HashService"),
  TokenService: Symbol.for("TokenService"),
  OtpService: Symbol.for("OtpService"),
  EmailService: Symbol.for("EmailService"),
  FileService: Symbol.for("FileService"),
  
  // Auth UseCases
  SendOtpUseCase: Symbol.for("SendOtpUseCase"),
  VerifyOtpAndRegisterUseCase: Symbol.for("VerifyOtpAndRegisterUseCase"),
  LoginUserUseCase: Symbol.for("LoginUserUseCase"),
  RefreshTokenUseCase: Symbol.for("RefreshTokenUseCase"),

  // Blog UseCases
  CreateBlogUseCase: Symbol.for("CreateBlogUseCase"),
  GetAllBlogsUseCase: Symbol.for("GetAllBlogsUseCase"),
  GetBlogByIdUseCase: Symbol.for("GetBlogByIdUseCase"),
  UpdateBlogUseCase: Symbol.for("UpdateBlogUseCase"),
  DeleteBlogUseCase: Symbol.for("DeleteBlogUseCase"),
};
