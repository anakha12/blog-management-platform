import { User } from "../models/User";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface IAuthRepository {
  register(data: RegisterInput): Promise<{ message: string }>;
  verifyOtp(data: { email: string; otp: string }): Promise<AuthResponse>;
  login(data: LoginInput): Promise<AuthResponse>;
  refresh(): Promise<AuthResponse>;
  logout(): Promise<void>;
}
