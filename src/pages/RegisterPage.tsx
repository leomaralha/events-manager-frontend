import { RegisterForm } from "../components/auth/RegisterForm";
import type { SubmitResult } from "../types/domain";

export function RegisterPage() {
  async function handleRegister(): Promise<SubmitResult> {
    return { ok: true };
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-slate-900">Register</h1>
      <RegisterForm onSubmit={handleRegister} />
    </div>
  );
}
