import { useMutation } from "@tanstack/react-query";
import { container } from "../../di/container";
import { Tokens } from "../../di/tokens";
import { IAuthRepository, RegisterInput, LoginInput } from "../../domain/repositories/IAuthRepository";
import { useAuthStore } from "../state/authStore";

const authRepo = container.resolve<IAuthRepository>(Tokens.AuthRepository);

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterInput) => authRepo.register(data),
  });
};

export const useVerifyOtpMutation = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (data: { email: string; otp: string }) => authRepo.verifyOtp(data),
    onSuccess: (result) => setAuth(result.user, result.accessToken),
  });
};

export const useLoginMutation = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (data: LoginInput) => authRepo.login(data),
    onSuccess: (result) => setAuth(result.user, result.accessToken),
  });
};

export const useLogoutMutation = () => {
  const logout = useAuthStore((s) => s.logout);
  return useMutation({
    mutationFn: () => authRepo.logout(),
    onSuccess: () => logout(),
    onError: () => logout(), // always clear local state even if server fails
  });
};
