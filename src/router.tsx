import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { RouteGuard } from "./components/layout/RouteGuard";
import { BrowseEventsPage } from "./pages/BrowseEventsPage";
import { EventDetailPage } from "./pages/EventDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CreateEventPage } from "./pages/CreateEventPage";
import { EditEventPage } from "./pages/EditEventPage";
import { EventGiftsPage } from "./pages/EventGiftsPage";
import { EventGuestsPage } from "./pages/EventGuestsPage";
import { EventOrdersPage } from "./pages/EventOrdersPage";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <BrowseEventsPage /> },
      { path: "/events/:slug", element: <EventDetailPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        path: "/dashboard",
        element: (
          <RouteGuard>
            <DashboardPage />
          </RouteGuard>
        ),
      },
      {
        path: "/dashboard/events/new",
        element: (
          <RouteGuard>
            <CreateEventPage />
          </RouteGuard>
        ),
      },
      {
        path: "/dashboard/events/:id/edit",
        element: (
          <RouteGuard>
            <EditEventPage />
          </RouteGuard>
        ),
      },
      {
        path: "/dashboard/events/:id/gifts",
        element: (
          <RouteGuard>
            <EventGiftsPage />
          </RouteGuard>
        ),
      },
      {
        path: "/dashboard/events/:id/guests",
        element: (
          <RouteGuard>
            <EventGuestsPage />
          </RouteGuard>
        ),
      },
      {
        path: "/dashboard/events/:id/orders",
        element: (
          <RouteGuard>
            <EventOrdersPage />
          </RouteGuard>
        ),
      },
    ],
  },
]);
