import "reflect-metadata";
import { container } from "tsyringe";
import { Tokens } from "./tokens";
import { ApiAuthRepository } from "../infrastructure/repositories/ApiAuthRepository";
import { ApiBlogRepository } from "../infrastructure/repositories/ApiBlogRepository";
import { LocalStorageTokenStorage } from "../infrastructure/services/LocalStorageTokenStorage";

container.registerSingleton(Tokens.AuthRepository, ApiAuthRepository);
container.registerSingleton(Tokens.BlogRepository, ApiBlogRepository);
container.registerSingleton(Tokens.TokenStorage, LocalStorageTokenStorage);

export { container };
