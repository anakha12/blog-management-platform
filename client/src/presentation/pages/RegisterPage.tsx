import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useRegisterMutation, useVerifyOtpMutation } from "../../application/queries/useAuthQueries";
import { Input } from "../components/ui/Input";

interface InfoValues {
  name: string;
  email: string;
  password: string;
}

interface OtpValues {
  otp: string;
}

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"info" | "otp">("info");
  const [userEmail, setUserEmail] = useState("");

  const registerMutation = useRegisterMutation();
  const verifyOtpMutation = useVerifyOtpMutation();

  const { register: infoForm, handleSubmit: handleInfoSubmit, formState: { errors: infoErrors } } = useForm<InfoValues>();
  const { register: otpForm, handleSubmit: handleOtpSubmit, formState: { errors: otpErrors } } = useForm<OtpValues>();

  const onInfoSubmit = (data: InfoValues) => {
    setUserEmail(data.email);
    registerMutation.mutate(data, {
      onSuccess: () => setStep("otp")
    });
  };

  const onOtpSubmit = (data: OtpValues) => {
    verifyOtpMutation.mutate(
      { email: userEmail, otp: data.otp },
      { onSuccess: () => navigate("/dashboard") }
    );
  };

  const error = registerMutation.error || verifyOtpMutation.error;
  const apiError = error
    ? (error instanceof Error && (error as any).response?.data?.message) || "Something went wrong"
    : null;

  const isPending = registerMutation.isPending || verifyOtpMutation.isPending;

  return (
    <div className="min-h-screen bg-grid flex items-center justify-center px-4">
      {/* Glow blobs */}
      <div className="fixed top-20 left-20 w-80 h-80 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
      <div className="fixed bottom-20 right-20 w-64 h-64 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #2563eb, transparent)" }} />

      <div className="glass-card p-8 w-full max-w-md fade-in">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">✦</div>
          <h1 className="text-2xl font-bold gradient-text mb-1">
            {step === "info" ? "Create Account" : "Verify Email"}
          </h1>
          <p className="text-slate-500 text-sm">
            {step === "info" ? "Join BlogSpace and start writing" : `Enter the OTP sent to ${userEmail}`}
          </p>
        </div>

        {step === "info" ? (
          <form onSubmit={handleInfoSubmit(onInfoSubmit)} className="space-y-5">
            <Input
              id="name"
              label="What's your name?"
              type="text"
              placeholder="e.g. John Doe"
              error={infoErrors.name?.message}
              {...infoForm("name", { required: "Name is required", minLength: { value: 2, message: "Min 2 characters" } })}
            />
            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="e.g. john@example.com"
              error={infoErrors.email?.message}
              {...infoForm("email", { required: "Email is required" })}
            />
            <Input
              id="password"
              label="Create Password"
              type="password"
              placeholder="Choose a strong password"
              error={infoErrors.password?.message}
              {...infoForm("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
            />

            {apiError && (
              <div className="text-center p-3 rounded-xl text-sm text-red-400"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                {apiError}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={isPending}>
              {isPending ? "Sending OTP…" : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-5">
            <Input
              id="otp"
              label="Enter OTP Code"
              type="text"
              placeholder="Enter the 6-digit code"
              error={otpErrors.otp?.message}
              {...otpForm("otp", { 
                required: "OTP is required", 
                minLength: { value: 6, message: "Must be 6 digits" },
                maxLength: { value: 6, message: "Must be 6 digits" },
                pattern: { value: /^[0-9]+$/, message: "Only numbers allowed" }
              })}
            />

            {apiError && (
              <div className="text-center p-3 rounded-xl text-sm text-red-400"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                {apiError}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={isPending}>
              {isPending ? "Verifying…" : "Complete Registration"}
            </button>
            
            <button 
              type="button" 
              onClick={() => setStep("info")}
              className="w-full text-sm text-slate-400 hover:text-white transition-colors"
            >
              Back to registration
            </button>
          </form>
        )}

        {step === "info" && (
          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};
