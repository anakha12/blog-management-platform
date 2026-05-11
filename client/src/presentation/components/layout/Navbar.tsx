import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../application/state/authStore";
import { useLogoutMutation } from "../../../application/queries/useAuthQueries";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { mutate: logoutMutate } = useLogoutMutation();

  const handleLogout = () => {
    logoutMutate(undefined, { onSettled: () => navigate("/login") });
  };

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="text-xl font-bold gradient-text cursor-pointer bg-transparent border-none"
        >
          ✦ BlogSpace
        </button>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-400">
                Welcome, <span className="text-violet-400 font-medium">{user?.name ?? "User"}</span>
              </span>
              <button
                onClick={() => navigate("/dashboard")}
                className="btn-ghost"
              >
                Dashboard
              </button>
              <button onClick={handleLogout} className="btn-danger">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="btn-ghost">
                Login
              </button>
              <button onClick={() => navigate("/register")} className="btn-primary" style={{ width: "auto" }}>
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
