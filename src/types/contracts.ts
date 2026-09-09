import type { ReactNode } from "react";
import type {
  EventSummary,
  EventDetails,
  Gift,
  Guest,
  OrderSummary,
  AuthUser,
  SubmitResult,
  LoginOutcome,
} from "./domain";

export interface EventFilterBarProps {
  value: string;
  onChange: (value: string) => void;
}

export interface EventCardProps {
  event: EventSummary;
  href: string;
}

export interface EventListProps {
  eventsPromise: Promise<EventSummary[]>;
  filterQuery: string;
}

export interface EventDetailProps {
  eventPromise: Promise<EventDetails>;
}

export interface EventFormValues {
  name: string;
  date: string;
}

export interface EventFormProps {
  initialValues?: EventFormValues;
  onSubmit: (values: EventFormValues) => Promise<SubmitResult>;
  submitLabel: string;
}

export interface GiftListProps {
  giftsPromise: Promise<Gift[]>;
  renderAction?: (gift: Gift) => ReactNode;
}

export interface GiftFormProps {
  onSubmit: (values: {
    name: string;
    description?: string;
    price?: number;
  }) => Promise<SubmitResult>;
}

export interface GiftClaimFormProps {
  gift: Gift;
  onClaim: (details: {
    guestName: string;
    guestEmail: string;
    message?: string;
  }) => Promise<SubmitResult>;
}

export interface GuestListProps {
  guestsPromise: Promise<Guest[]>;
}

export interface RsvpFormProps {
  onRsvp: (details: { guestName: string; guestEmail: string }) => Promise<SubmitResult>;
}

export interface OrderListProps {
  ordersPromise: Promise<OrderSummary[]>;
}

export interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<LoginOutcome>;
}

export interface RegisterFormProps {
  onSubmit: (values: {
    name: string;
    email: string;
    password: string;
  }) => Promise<SubmitResult>;
}

export interface AuthContextValue {
  currentUser: AuthUser | null;
  onLogout: () => void;
}
