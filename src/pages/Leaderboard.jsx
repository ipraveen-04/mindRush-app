import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshCw, Trophy, Users, Target } from "lucide-react";
import { AppPage } from "../components/AppLayout";
import { fetchLeaderboard } from "../services/api";
import { getMindRushParticipantCount, getHistory } from "../services/storage";

const medal = ["🥇", "🥈", "🥉"];

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [participants, setParticipants] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const controllerRef = useRef(null);

  const load = useCallback(async () => {
    // Cancel an older refresh before starting a new one.
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);

    try {
      // Re-read localStorage on every refresh so the button always reflects
      // the latest completed quiz attempts in this browser.
      const nextRows = await fetchLeaderboard(10, controller.signal);
      if (!controller.signal.aborted) {
        setRows([...nextRows]);
        setParticipants(getMindRushParticipantCount());
        setAttempts(getHistory().length);
        setLastRefreshed(new Date());
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        // Keep the existing leaderboard visible if a refresh fails.
        console.error("Leaderboard refresh failed:", error);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    load();
    return () => controllerRef.current?.abort();
  }, [load]);

  return (
    <AppPage>
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl bg-gradient-to-r from-[#e7f3ff] to-[#e5efff] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#f3a916]">
                  <Trophy size={30} />
                </span>
                <div>
                  <h1 className="text-3xl font-extrabold text-[#142b62] sm:text-4xl">
                    Leaderboard
                  </h1>
                  <p className="mt-1 text-[#6680b8]">
                    Ranking of people who completed a MindRush quiz.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => load()}
                disabled={loading}
                aria-label="Refresh leaderboard"
                className="secondary-btn inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />{" "}
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
          {lastRefreshed && (
            <p className="mt-2 text-right text-xs text-[#8a9bc0]">
              Last refreshed: {lastRefreshed.toLocaleTimeString()}
            </p>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#dfe8f7] bg-white p-5 shadow-card">
              <div className="flex items-center gap-3">
                <Users size={22} className="text-[#536bff]" />
                <span className="text-sm font-bold text-[#7a8eb6]">
                  Participants
                </span>
              </div>
              <p className="mt-2 text-3xl font-extrabold text-[#142b62]">
                {participants}
              </p>
              <p className="mt-1 text-xs text-[#8a9bc0]">
                Unique people who completed a quiz
              </p>
            </div>
            <div className="rounded-2xl border border-[#dfe8f7] bg-white p-5 shadow-card">
              <div className="flex items-center gap-3">
                <Target size={22} className="text-[#536bff]" />
                <span className="text-sm font-bold text-[#7a8eb6]">
                  Quiz attempts
                </span>
              </div>
              <p className="mt-2 text-3xl font-extrabold text-[#142b62]">
                {attempts}
              </p>
              <p className="mt-1 text-xs text-[#8a9bc0]">
                Completed MindRush tests
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-[#dfe8f7] bg-white shadow-card">
            {loading ? (
              <div className="space-y-3 p-5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-xl bg-[#f3f6fb]"
                  />
                ))}
              </div>
            ) : rows.length === 0 ? (
              <div className="p-10 text-center">
                <Trophy className="mx-auto text-[#b7c4dc]" size={42} />
                <p className="mt-4 font-bold text-[#243b70]">
                  No participants yet
                </p>
                <p className="mt-1 text-sm text-[#7a8eb6]">
                  Complete a MindRush quiz to appear on the leaderboard.
                </p>
              </div>
            ) : (
              rows.map((row, index) => (
                <div
                  key={row.id}
                  className="flex items-center gap-3 border-b border-[#edf1f8] p-4 last:border-0 sm:gap-5 sm:p-5"
                >
                  <span className="w-8 text-center text-lg font-extrabold text-[#536bff]">
                    {index < 3 ? medal[index] : row.rank}
                  </span>
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[#edf4ff] font-bold text-[#536bff]">
                    {row.name.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-[#243b70]">
                      {row.name}
                    </p>
                    <p className="text-xs text-[#7a8eb6]">
                      Rank #{row.rank} · {row.quizzes} quiz
                      {row.quizzes === 1 ? "" : "zes"} · {row.accuracy}%
                      accuracy
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-[#536bff]">{row.score}</p>
                    <p className="text-xs text-[#7a8eb6]">points</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <p className="mt-4 text-xs text-[#7a8eb6]">
            Ranking is calculated from completed MindRush quiz tests. Each
            account counts once, while all of that participant's completed quiz
            scores are aggregated.
          </p>
        </div>
      </main>
    </AppPage>
  );
}
