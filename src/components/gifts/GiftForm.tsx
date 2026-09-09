import { useActionState } from "react";
import { Button } from "../ui/Button";
import { TextField } from "../ui/TextField";
import { ErrorBanner } from "../ui/ErrorBanner";
import type { GiftFormProps } from "../../types/contracts";

type FormState = { status: "idle" | "error"; message?: string };

export function GiftForm({ onSubmit }: GiftFormProps) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_previous, formData) => {
      const name = String(formData.get("name") ?? "");
      const description = String(formData.get("description") ?? "") || undefined;
      const rawPrice = String(formData.get("price") ?? "");
      const price = rawPrice ? Number(rawPrice) : undefined;
      const result = await onSubmit({ name, description, price });
      return result.ok ? { status: "idle" } : { status: "error", message: result.error };
    },
    { status: "idle" },
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <TextField label="Gift name" name="name" required />
      <TextField label="Description (optional)" name="description" />
      <TextField label="Price (optional)" name="price" type="number" min="0" step="0.01" />
      {state.status === "error" ? <ErrorBanner message={state.message ?? "Could not add gift"} /> : null}
      <Button type="submit" isLoading={isPending}>
        Add gift
      </Button>
    </form>
  );
}
