import { useActionState } from "react";
import { Button } from "../ui/Button";
import { TextField } from "../ui/TextField";
import { ErrorBanner } from "../ui/ErrorBanner";
import type { RsvpFormProps } from "../../types/contracts";

type RsvpState = { status: "idle" | "success" | "error"; message?: string };

export function RsvpForm({ onRsvp }: RsvpFormProps) {
  const [state, formAction, isPending] = useActionState<RsvpState, FormData>(
    async (_previous, formData) => {
      const guestName = String(formData.get("guestName") ?? "");
      const guestEmail = String(formData.get("guestEmail") ?? "");
      const result = await onRsvp({ guestName, guestEmail });
      return result.ok ? { status: "success" } : { status: "error", message: result.error };
    },
    { status: "idle" },
  );

  if (state.status === "success") {
    return <p className="text-indigo-600">You're confirmed! See you there.</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <TextField label="Your name" name="guestName" required />
      <TextField label="Your email" name="guestEmail" type="email" required />
      {state.status === "error" ? <ErrorBanner message={state.message ?? "Something went wrong"} /> : null}
      <Button type="submit" isLoading={isPending}>
        Confirm attendance
      </Button>
    </form>
  );
}
