import { injectable } from "tsyringe";
import { IAuthRepository, RegisterInput, LoginInput, AuthResponse } from "../../domain/repositories/IAuthRepository";
import { apiClient } from "../api/apiClient";

@injectable()
export class ApiAuthRepository implements IAuthRepository {
  async register(data: RegisterInput): Promise<{ message: string }> {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  }

  async verifyOtp(data: { email: string; otp: string }): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/verify-otp", data);
    return response.data.data;
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/login", data);
    return response.data.data;
  }

  async refresh(): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/refresh");
    return response.data.data;
  }

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  }
}
