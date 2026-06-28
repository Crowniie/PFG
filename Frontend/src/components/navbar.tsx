import { Link, useLocation } from "react-router-dom";
import { TrendingUp, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  function isActive(path: string) {
    return location.pathname === path;
  }

  // build the avatar initials from the user's name
  let initials = "?";
  if (user && user.name) {
    const parts = user.name.split(" ");
    let result = "";
    for (const p of parts) {
      if (p[0]) {
        result = result + p[0];
      }
    }
    initials = result.slice(0, 2).toUpperCase();
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Left section: brand + tabs */}
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
            <TrendingUp className="w-5 h-5 text-teal-400" />
            <span className="text-slate-100">Investment Advisor</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/dashboard" active={isActive("/dashboard")}>
              Dashboard
            </NavLink>
            <NavLink to="/history" active={isActive("/history")}>
              History
            </NavLink>
            <NavLink to="/knowledge" active={isActive("/knowledge")}>
              Knowledge
            </NavLink>
          </div>
        </div>

        {/* Right section: user + logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 text-xs font-semibold">
              {initials}
            </div>
            <span className="text-sm text-slate-300">{user?.name}</span>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="md:hidden border-t border-slate-800 px-4 py-2 flex items-center gap-2">
        <NavLink to="/dashboard" active={isActive("/dashboard")}>
          Dashboard
        </NavLink>
        <NavLink to="/history" active={isActive("/history")}>
          History
        </NavLink>
        <NavLink to="/knowledge" active={isActive("/knowledge")}>
          Knowledge
        </NavLink>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

function NavLink({ to, active, children }: NavLinkProps) {
  let className =
    "text-slate-400 hover:text-slate-100 transition-colors text-sm px-3 py-2";
  if (active) {
    className =
      "text-teal-400 font-medium text-sm px-3 py-2 border-b-2 border-teal-400 -mb-px";
  }

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}
