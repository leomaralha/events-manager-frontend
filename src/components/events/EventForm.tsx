import { useActionState } from "react";
import { Button } from "../ui/Button";
import { TextField } from "../ui/TextField";
import { ErrorBanner } from "../ui/ErrorBanner";
import type { EventFormProps } from "../../types/contracts";

type FormState = { status: "idle" | "error"; message?: string };

export function EventForm({ initialValues, onSubmit, submitLabel }: EventFormProps) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_previous, formData) => {
      const name = String(formData.get("name") ?? "");
      const date = String(formData.get("date") ?? "");
      const result = await onSubmit({ name, date });
      return result.ok ? { status: "idle" } : { status: "error", message: result.error };
    },
    { status: "idle" },
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <TextField label="Event name" name="name" defaultValue={initialValues?.name} required />
      <TextField
        label="Event date"
        name="date"
        type="date"
        defaultValue={initialValues?.date}
        required
      />
      {state.status === "error" ? <ErrorBanner message={state.message ?? "Save failed"} /> : null}
      <Button type="submit" isLoading={isPending}>
        {submitLabel}
      </Button>
    </form>
  );
}
