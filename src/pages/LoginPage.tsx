import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";
import { apiFetch } from "../services/api";
import type { LoginOutcome } from "../types/domain";

export function LoginPage() {
  const navigate = useNavigate();

  async function handleLogin(
    email: string,
    password: string,
  ): Promise<LoginOutcome> {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPassword = password.trim();

      if (!normalizedEmail || !normalizedPassword) {
        return {
          ok: false,
          error: "Informe o email e a senha.",
        };
      }

      const result = await apiFetch<{
        token: string;
        expiresAt: string;
      }>("/user/login", {
        method: "POST",
        body: JSON.stringify({
          email: normalizedEmail,
          password: normalizedPassword,
        }),
      });

      localStorage.setItem("sessionToken", result.token);
      navigate("/dashboard");

      return {
        ok: true,
        token: result.token,
        expiresAt: result.expiresAt,
      };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-slate-900">Log in</h1>
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}