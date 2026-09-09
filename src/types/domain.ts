export interface EventSummary {
  id: number;
  slug: string;
  name: string;
  date: string;
}

export interface EventDetails extends EventSummary {
  giftCount: number;
  guestCount: number;
}

export interface Gift {
  id: number;
  eventId: number;
  name: string;
  description?: string;
  price?: number;
  claimed: boolean;
}

export interface Guest {
  id: number;
  name: string;
  email: string;
}

export interface OrderSummary {
  id: number;
  giftName: string;
  guestName: string;
  guestEmail: string;
  message?: string;
  status: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export type SubmitResult = { ok: true } | { ok: false; error: string };

export type LoginOutcome =
  | { ok: true; token: string; expiresAt: string }
  | { ok: false; error: string };
