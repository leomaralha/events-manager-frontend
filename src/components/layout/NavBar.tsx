import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";

export function NavBar() {
  const { currentUser, onLogout } = useAuth();

  return (
    <nav className="flex items-center justify-between border-b border-slate-200 px-6 py-3">
      <Link to="/" className="text-lg font-semibold text-slate-900">
        Event Manager
      </Link>
      <div className="flex items-center gap-4">
        {currentUser ? (
          <>
            <Link to="/dashboard" className="text-sm text-slate-700 hover:underline">
              Dashboard
            </Link>
            <Button variant="secondary" onClick={onLogout}>
              Log out
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-slate-700 hover:underline">
              Log in
            </Link>
            <Link to="/register" className="text-sm text-slate-700 hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
