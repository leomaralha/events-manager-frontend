import { RouterProvider } from "react-router-dom";
import { MockAuthProvider } from "./context/AuthContext";
import { router } from "./router";

export default function App() {
  return (
    <MockAuthProvider>
      <RouterProvider router={router} />
    </MockAuthProvider>
  );
}
