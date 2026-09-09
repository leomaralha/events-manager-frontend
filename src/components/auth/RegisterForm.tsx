import { useActionState } from "react";
import { Button } from "../ui/Button";
import { TextField } from "../ui/TextField";
import { ErrorBanner } from "../ui/ErrorBanner";
import type { RegisterFormProps } from "../../types/contracts";

type RegisterState = { status: "idle" | "success" | "error"; message?: string };

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [state, formAction, isPending] = useActionState<RegisterState, FormData>(
    async (_previous, formData) => {
      const name = String(formData.get("name") ?? "");
      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");
      const result = await onSubmit({ name, email, password });
      return result.ok ? { status: "success" } : { status: "error", message: result.error };
    },
    { status: "idle" },
  );

  if (state.status === "success") {
    return <p className="text-indigo-600">Account created — you can log in now.</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <TextField label="Name" name="name" required />
      <TextField label="Email" name="email" type="email" required />
      <TextField label="Password" name="password" type="password" required />
      {state.status === "error" ? <ErrorBanner message={state.message ?? "Registration failed"} /> : null}
      <Button type="submit" isLoading={isPending}>
        Register
      </Button>
    </form>
  );
}
