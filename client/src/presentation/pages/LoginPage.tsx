import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useLoginMutation } from "../../application/queries/useAuthQueries";
import { Input } from "../components/ui/Input";

interface FormValues {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useLoginMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    mutate(data, { onSuccess: () => navigate("/dashboard") });
  };

  const apiError = error
    ? (error instanceof Error && (error as any).response?.data?.message) || "Login failed"
    : null;

  return (
    <div className="min-h-screen bg-grid flex items-center justify-center px-4">
      <div className="fixed top-10 right-20 w-96 h-96 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #4f46e5, transparent)" }} />
      <div className="fixed bottom-10 left-10 w-72 h-72 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }} />

      <div className="glass-card p-8 w-full max-w-md fade-in">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔑</div>
          <h1 className="text-2xl font-bold gradient-text mb-1">Welcome Back</h1>
          <p className="text-slate-500 text-sm">Sign in to your BlogSpace account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="e.g. john@example.com"
            error={errors.email?.message}
            {...register("email", { required: "Email is required" })}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password", { required: "Password is required" })}
          />

          {apiError && (
            <div className="text-center p-3 rounded-xl text-sm text-red-400"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              {apiError}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};
