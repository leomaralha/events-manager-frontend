import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { EventDetail } from "../components/events/EventDetail";
import { GiftList } from "../components/gifts/GiftList";
import { GiftClaimForm } from "../components/gifts/GiftClaimForm";
import { RsvpForm } from "../components/guests/RsvpForm";
import { fetchMockEventDetails } from "../mocks/events";
import { fetchMockGifts } from "../mocks/gifts";
import type { SubmitResult } from "../types/domain";
import { apiFetch } from "../services/api";

export function EventDetailPage() {
  const { slug = "" } = useParams();
  const eventPromise = useMemo(() => fetchMockEventDetails(slug), [slug]);
  const giftsPromise = useMemo(
    () => eventPromise.then((event) => fetchMockGifts(event.id)),
    [eventPromise],
  );

async function handleRsvp({
  guestName,
  guestEmail,
}: {
  guestName: string;
  guestEmail: string;
}): Promise<SubmitResult> {
  try {
    const event = await eventPromise;

    await apiFetch(`/wedding/${event.id}/guest`, {
      method: "POST",
      body: JSON.stringify({
        name: guestName,
        email: guestEmail,
      }),
    });

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error
        ? error.message
        : "It was not possible to confirm attendance.",
    };
  }
}

  async function handleClaim(): Promise<SubmitResult> {
    return { ok: true };
  }

  return (
    <div className="flex flex-col gap-6">
      <EventDetail eventPromise={eventPromise} />
      <div>
        <h2 className="mb-2 text-lg font-semibold text-slate-900">RSVP</h2>
        <RsvpForm onRsvp={handleRsvp} />
      </div>
      <div>
        <h2 className="mb-2 text-lg font-semibold text-slate-900">Gifts</h2>
        <GiftList
          giftsPromise={giftsPromise}
          renderAction={(gift) =>
            gift.claimed ? null : <GiftClaimForm gift={gift} onClaim={handleClaim} />
          }
        />
      </div>
    </div>
  );
}
