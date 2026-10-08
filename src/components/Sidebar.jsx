import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Home,
  Grid2X2,
  Trophy,
  Clock3,
  Settings,
  X,
  HelpCircle,
} from "lucide-react";
import Logo from "./Logo";

function Sidebar({ open, onClose }) {
  const nav = useNavigate();
  const location = useLocation();
  const items = [
    ["/dashboard", "Home", Home],
    ["/categories", "Categories", Grid2X2],
    ["/leaderboard", "Leaderboard", Trophy],
    ["/history", "History", Clock3],
    // ['/settings', 'Settings', Settings],
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-[#081b44]/40 lg:hidden ${open ? "block" : "hidden"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[235px] flex-col overflow-hidden bg-[#0d204b] px-5 py-6 text-white shadow-xl transition-transform lg:sticky lg:top-0 lg:z-30 lg:h-dvh lg:translate-x-0 lg:shadow-none ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex shrink-0 items-center justify-between">
          <Logo light />
          <button
            className="rounded-lg p-1 hover:bg-white/10 lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="mt-10 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
          {items.map(([to, label, Icon]) => (
            <Link
              onClick={onClose}
              key={to}
              to={to}
              className={`flex items-center gap-4 rounded-xl px-4 py-3.5 font-semibold transition-colors ${
                location.pathname === to
                  ? "bg-gradient-to-r from-[#4655f8] to-[#5561ff] shadow-lg"
                  : "text-[#d8e4ff] hover:bg-white/10"
              }`}
            >
              <Icon size={22} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-5 shrink-0 rounded-2xl bg-gradient-to-br from-[#172f68] to-[#223b80] p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10">
              <Trophy size={21} />
            </span>
            <div className="text-sm font-bold leading-tight">
              Small steps
              <br />
              lead to big
              <br />
              achievements!
            </div>
          </div>
        </div>

        <button
          className="mt-5 flex shrink-0 items-center gap-2 rounded-lg py-1 text-sm font-semibold text-[#d8e4ff] hover:text-white"
          onClick={() => {
            localStorage.removeItem("mindrush-user");
            nav("/login");
            onClose?.();
          }}
        >
          <HelpCircle size={18} />
          Need help?
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
