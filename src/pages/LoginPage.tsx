import { LoginForm } from "../components/auth/LoginForm";
import type { LoginOutcome } from "../types/domain";

export function LoginPage() {
  async function handleLogin(): Promise<LoginOutcome> {
    return { ok: true, token: "demo-token", expiresAt: new Date().toISOString() };
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-slate-900">Log in</h1>
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}
