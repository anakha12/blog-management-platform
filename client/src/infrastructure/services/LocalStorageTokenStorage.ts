import { injectable } from "tsyringe";
import { ITokenStorage } from "../../domain/services/ITokenStorage";

const TOKEN_KEY = "token";

@injectable()
export class LocalStorageTokenStorage implements ITokenStorage {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}
