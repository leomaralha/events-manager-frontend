import { useActionState } from "react";
import { Button } from "../ui/Button";
import { TextField } from "../ui/TextField";
import { ErrorBanner } from "../ui/ErrorBanner";
import type { LoginFormProps } from "../../types/contracts";

type LoginState = { status: "idle" | "error"; message?: string };

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    async (_previous, formData) => {
      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");
      const result = await onSubmit(email, password);
      return result.ok ? { status: "idle" } : { status: "error", message: result.error };
    },
    { status: "idle" },
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <TextField label="Email" name="email" type="email" required />
      <TextField label="Password" name="password" type="password" required />
      {state.status === "error" ? <ErrorBanner message={state.message ?? "Login failed"} /> : null}
      <Button type="submit" isLoading={isPending}>
        Log in
      </Button>
    </form>
  );
}
