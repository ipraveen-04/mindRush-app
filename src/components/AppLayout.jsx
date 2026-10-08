import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { fetchLeaderboard } from "../services/api";
import {
  getCurrentUser,
  getMindRushParticipantCount,
} from "../services/storage";

export function Topbar({ onMenu }) {
  return <Header onMenu={onMenu} />;
}

export function AppPage({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#f7faff] lg:flex">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setOpen(true)} />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <Footer />
      </div>
    </div>
  );
}

export function ProfileCard({
  stats = { quizzes: 0, correct: 0, average: 0 },
}) {
  const user = getCurrentUser();
  const parts = user.name.trim().split(/\s+/).filter(Boolean);
  const initials =
    parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : (parts[0]?.slice(0, 2) || "?").toUpperCase();
  return (
    <div className="rounded-2xl border border-[#dfe8f7] bg-white p-4 shadow-card">
      <div className="flex items-center gap-4">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt=""
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#dbeaff] to-[#c6dcff] text-lg font-extrabold text-[#315cff]">
            {initials}
          </span>
        )}
        <div>
          <h3 className="font-extrabold text-[#162b61]">{user.name}</h3>
          <p className="text-sm text-[#6a82b5]">Quiz Enthusiast</p>
        </div>
        <button className="ml-auto text-[#6782bd]">✎</button>
      </div>
      <div className="mt-5 grid grid-cols-3 divide-x rounded-xl border border-[#e2eaf7] py-3 text-center">
        <div>
          <b className="text-[#172d65]">{stats.quizzes}</b>
          <small className="block text-[11px] text-[#7187b6]">
            Quizzes Taken
          </small>
        </div>
        <div>
          <b className="text-[#172d65]">{stats.correct}</b>
          <small className="block text-[11px] text-[#7187b6]">
            Correct Answers
          </small>
        </div>
        <div>
          <b className="text-[#172d65]">{stats.average}%</b>
          <small className="block text-[11px] text-[#7187b6]">
            Average Score
          </small>
        </div>
      </div>
      <div className="mt-4 flex justify-between text-sm font-bold text-[#17306a]">
        <span>Level 2</span>
      </div>
      <div className="mt-2 h-3 rounded-full bg-[#e5ecf8]">
        <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-[#7139ee] to-[#5361ff]" />
      </div>
      <p className="mt-2 text-sm text-[#6c83b5]">60 / 100 XP</p>
    </div>
  );
}

export function LeaderboardCard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetchLeaderboard(5, controller.signal)
      .then(setRows)
      .catch(() => {})
      .finally(() => {
        setParticipants(getMindRushParticipantCount());
        setLoading(false);
      });
    return () => controller.abort();
  }, []);
  return (
    <div className="rounded-2xl border border-[#dfe8f7] bg-white p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-[#142b62]">Recent Leaderboard</h3>
          <p className="text-[11px] text-[#8a9bc0]">
            {participants} participant{participants === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          to="/leaderboard"
          className="text-sm font-semibold text-[#315cff]"
        >
          View All →
        </Link>
      </div>
      {loading
        ? [1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="my-2 h-10 animate-pulse rounded-lg bg-[#f3f6fb]"
            />
          ))
        : rows.map((r, i) => (
            <div
              key={r.id || i}
              className="flex items-center gap-3 border-t border-[#edf1f8] py-3 text-sm"
            >
              <span className="w-5 text-center font-bold">
                {i < 3 ? ["🥇", "🥈", "🥉"][i] : r.rank}
              </span>
              {r.avatar ? (
                <img
                  src={r.avatar}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#edf4ff] text-sm font-bold text-[#536bff]">
                  {r.name.slice(0, 1).toUpperCase()}
                </span>
              )}
              <span className="min-w-0 flex-1 truncate font-semibold text-[#243b70]">
                {r.name}
              </span>
              <span className="font-bold text-[#536bff]">
                {r.score.toLocaleString()}
              </span>
            </div>
          ))}
    </div>
  );
}
