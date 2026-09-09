import { useActionState, useState } from "react";
import { Button } from "../ui/Button";
import { TextField } from "../ui/TextField";
import { ErrorBanner } from "../ui/ErrorBanner";
import type { GiftClaimFormProps } from "../../types/contracts";

type ClaimState = { status: "idle" | "success" | "error"; message?: string };

export function GiftClaimForm({ gift, onClaim }: GiftClaimFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<ClaimState, FormData>(
    async (_previous, formData) => {
      const guestName = String(formData.get("guestName") ?? "");
      const guestEmail = String(formData.get("guestEmail") ?? "");
      const message = String(formData.get("message") ?? "");
      const result = await onClaim({ guestName, guestEmail, message });
      return result.ok ? { status: "success" } : { status: "error", message: result.error };
    },
    { status: "idle" },
  );

  if (state.status === "success") {
    return <p className="text-indigo-600">Thanks for claiming {gift.name}!</p>;
  }

  if (!isOpen) {
    return <Button variant="secondary" onClick={() => setIsOpen(true)}>Claim this gift</Button>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-2 rounded-md border border-slate-200 p-3">
      <TextField label="Your name" name="guestName" required />
      <TextField label="Your email" name="guestEmail" type="email" required />
      <TextField label="Message (optional)" name="message" />
      {state.status === "error" ? <ErrorBanner message={state.message ?? "Something went wrong"} /> : null}
      <Button type="submit" isLoading={isPending}>
        Submit claim
      </Button>
    </form>
  );
}
