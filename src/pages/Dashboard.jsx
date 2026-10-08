import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Target } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { AppPage, ProfileCard, LeaderboardCard } from "../components/AppLayout";
import { CategoryCard } from "../components/QuizCards";
import { fetchTriviaCategories } from "../services/api";
import { fallbackCategories } from "../data/appData";
import { getStats } from "../services/storage";
function StudentIllustration() {
  return (
    <div className="relative h-full min-h-[220px] overflow-hidden rounded-[36px] bg-gradient-to-br from-[#e7f3ff] via-[#f1f6ff] to-[#dceaff]">
      <div className="absolute right-5 top-8 h-28 w-28 rounded-full bg-[#d7e9ff]" />
      <div className="absolute bottom-10 left-1/2 h-44 w-72 -translate-x-1/2 rounded-[50%] bg-[#cfe3fb]" />
      <div className="absolute left-[22%] bottom-[18%] h-28 w-28 rounded-full bg-[#173b85]" />
      <div className="absolute left-[26%] bottom-[13%] h-36 w-32 rounded-t-[52px] bg-[#2870e9]" />
      <div className="absolute left-[32%] bottom-[29%] h-28 w-28 rounded-full bg-[#ffd1aa]" />
      <div className="absolute left-[35%] bottom-[48%] h-10 w-20 rounded-t-full bg-[#13295e]" />
      <div className="absolute left-[42%] bottom-[14%] h-28 w-40 rotate-[-7deg] rounded-2xl border-8 border-[#243fc9] bg-[#4f4cf1] shadow-xl" />
      <div className="absolute right-[17%] bottom-[43%] grid h-14 w-14 place-items-center rounded-full bg-[#ffc84e] text-3xl shadow-lg">
        💡
      </div>
      <div className="absolute right-[7%] top-[33%] rounded-2xl bg-white px-4 py-3 shadow-card">
        <div className="flex items-center gap-2 text-sm font-bold text-[#536eac]">
          <CheckCircle2 className="text-[#5570ff]" size={18} /> Keep learning!
        </div>
      </div>
    </div>
  );
}
export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(getStats());
  const [searchParams] = useSearchParams();
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const filteredCategories = useMemo(() => {
    if (!search) return categories;
    return categories.filter((c) => {
      const haystack =
        `${c.name || ""} ${c.slug || ""} ${c.source || ""} ${c.provider || ""}`.toLowerCase();
      return haystack.includes(search);
    });
  }, [categories, search]);
  useEffect(() => {
    let mounted = true;
    const c = new AbortController();
    fetchTriviaCategories(c.signal)
      .then((data) => {
        if (mounted) setCategories(data.length ? data : fallbackCategories);
      })
      .catch(() => {
        if (mounted) setCategories(fallbackCategories);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
      c.abort();
    };
  }, []);
  useEffect(() => {
    const on = () => setStats(getStats());
    window.addEventListener("storage", on);
    return () => window.removeEventListener("storage", on);
  }, []);
  return (
    <AppPage>
      <main className="mx-auto w-full max-w-[1500px] p-3 sm:p-5 lg:p-6">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_335px]">
          <div className="min-w-0">
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#e7f3ff] to-[#e5efff] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
              <div className="relative z-10 max-w-[560px]">
                <span className="inline-flex rounded-full bg-[#d6e9ff] px-3 py-1 text-sm font-semibold text-[#315cff]">
                  👋 Welcome Back!
                </span>
                <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-[-1.5px] text-[#132b63] sm:text-4xl lg:text-5xl">
                  Sharpen Your Mind
                  <br />
                  with <span className="brand-gradient">MindRush</span>
                </h1>
                <p className="mt-3 max-w-[500px] text-base leading-relaxed text-[#5573af] sm:text-lg">
                  Challenge yourself with live quizzes powered by MindRush.
                </p>
                <Link
                  to="/categories"
                  className="mt-5 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#4459ff] to-[#5d49f3] px-6 py-3 font-bold text-white shadow-lg"
                >
                  Explore Categories <ArrowRight size={18} />
                </Link>
              </div>
              <div className="mt-5 h-44 sm:absolute sm:bottom-0 sm:right-0 sm:mt-0 sm:h-full sm:w-[45%] lg:w-[47%]">
                <StudentIllustration />
              </div>
            </section>
            <section className="mt-7">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-[#142b62] sm:text-2xl">
                  {search
                    ? `Search results for “${searchParams.get("search")}”`
                    : "Explore Categories"}
                </h2>
                <Link
                  to="/categories"
                  className="text-sm font-semibold text-[#315cff]"
                >
                  View All →
                </Link>
              </div>
              {loading ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-32 animate-pulse rounded-xl bg-white"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
                  {filteredCategories.slice(0, 6).map((c, i) => (
                    <CategoryCard key={c.id} c={c} index={i} />
                  ))}
                </div>
              )}
              {!loading && search && filteredCategories.length === 0 && (
                <div className="mt-4 rounded-2xl border border-dashed border-[#cbd9ef] bg-white p-8 text-center text-sm font-semibold text-[#6b80ad]">
                  No quizzes or categories found for “
                  {searchParams.get("search")}”.
                </div>
              )}
            </section>
          </div>
          <aside className="space-y-5">
            <ProfileCard stats={stats} />
            <LeaderboardCard />
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#657dff] to-[#5965e8] p-6 text-white shadow-card">
              <div className="flex items-center gap-3">
                <Target size={34} />
                <h3 className="text-lg font-extrabold">Keep Going!</h3>
              </div>
              <p className="mt-4 leading-relaxed text-white/85">
                Great minds don’t stop. Challenge yourself with fresh questions.
              </p>
              <Link
                to="/leaderboard"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#4d5be9]"
              >
                View Leaderboard <ArrowRight size={16} />
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </AppPage>
  );
}
