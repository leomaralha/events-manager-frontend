import { Navigate, useNavigate } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";
import { useAuth } from "../context/AuthContext";
import type { LoginOutcome } from "../types/domain";

export function LoginPage() {
  const { currentUser, signIn } = useAuth();
  const navigate = useNavigate();

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleLogin(
    email: string,
    password: string,
  ): Promise<LoginOutcome> {
    const outcome = await signIn(email, password);
    if (outcome.ok) {
      navigate("/dashboard", { replace: true });
    }
    return outcome;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-slate-900">Log in</h1>
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}
