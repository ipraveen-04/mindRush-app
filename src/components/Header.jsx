import { ChevronDown, LogOut, Menu, Search, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getCurrentUser, logoutCurrentUser } from "../services/storage";

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function Header({ onMenu }) {
  const nav = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [user, setUser] = useState(getCurrentUser());
  const [imageFailed, setImageFailed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const refresh = () => {
      setUser(getCurrentUser());
      setImageFailed(false);
    };
    window.addEventListener("storage", refresh);
    window.addEventListener("mindrush-user-updated", refresh);
    window.addEventListener("mindrush-user-logged-out", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("mindrush-user-updated", refresh);
      window.removeEventListener("mindrush-user-logged-out", refresh);
    };
  }, []);

  const showSearch =
    location.pathname === "/dashboard" || location.pathname === "/categories";
  const avatar = user.avatar && !imageFailed;
  const displayName = user.name || "Guest Player";

  return (
    <header className="sticky top-0 z-30 flex min-h-[68px] items-center gap-3 border-b border-[#e2eafb] bg-white/95 px-3 py-3 backdrop-blur sm:px-5 lg:px-7">
      <button
        aria-label="Open navigation"
        className="shrink-0 rounded-xl bg-[#eff4ff] p-2 text-[#315cff] lg:hidden"
        onClick={onMenu}
      >
        <Menu size={21} />
      </button>

      {showSearch ? (
        <div className="relative min-w-0 max-w-[510px] flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5876b5] sm:left-4"
            size={19}
          />
          <input
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              const trimmed = value.trim();
              setSearchParams(trimmed ? { search: value } : {}, {
                replace: true,
              });
            }}
            className="h-10 w-full rounded-xl border border-[#d8e4f6] bg-white pl-10 pr-3 text-xs outline-none focus:border-[#5260ff] sm:h-11 sm:pl-12 sm:pr-4 sm:text-sm"
            placeholder="Search quizzes, categories..."
            aria-label="Search quizzes and categories"
          />
        </div>
      ) : (
        <div className="flex-1" aria-hidden="true" />
      )}

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
        <div className="relative">
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-2 sm:gap-3"
            aria-label={`Open account menu for ${displayName}`}
            aria-expanded={menuOpen}
          >
            {avatar ? (
              <img
                src={user.avatar}
                alt=""
                onError={() => setImageFailed(true)}
                className="h-9 w-9 rounded-full border border-[#dce6f7] object-cover sm:h-10 sm:w-10"
              />
            ) : (
              <span
                aria-hidden="true"
                className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#dbeaff] to-[#c6dcff] text-sm font-extrabold text-[#315cff] sm:h-10 sm:w-10 sm:text-base"
              >
                {initials(displayName)}
              </span>
            )}
            <span className="hidden max-w-[150px] text-left md:block">
              <b className="block truncate text-sm text-[#162c61]">
                {displayName}
              </b>
              <small className="text-[#6780b5]">Quiz Enthusiast</small>
            </span>
            <ChevronDown
              size={16}
              className={`hidden text-[#5975ae] transition-transform sm:block ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>
          {menuOpen && (
            <>
              <button
                aria-label="Close account menu"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-[#dfe7f5] bg-white p-2 shadow-xl">
                <div className="border-b border-[#edf1f7] px-3 py-2">
                  <p className="truncate text-sm font-extrabold text-[#162c61]">
                    {displayName}
                  </p>
                  {user.email && (
                    <p className="truncate text-xs text-[#7185ad]">
                      {user.email}
                    </p>
                  )}
                </div>
                {/* <button
                  onClick={() => {
                    setMenuOpen(false);
                    nav("/settings");
                  }}
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[#314878] hover:bg-[#f3f6ff]"
                >
                  <UserCircle size={18} /> Profile & Settings
                </button> */}
                <button
                  onClick={() => {
                    logoutCurrentUser();
                    setMenuOpen(false);
                    nav("/login", { replace: true });
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[#e0475a] hover:bg-[#fff2f4]"
                >
                  <LogOut size={18} /> Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
