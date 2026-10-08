import { CheckCircle2, GraduationCap, Target, Award } from "lucide-react";
import Logo from "./Logo";

function StudentIllustration() {
  return (
    <div className="relative h-full min-h-[280px] overflow-hidden rounded-[36px] bg-gradient-to-br from-[#e7f3ff] via-[#f1f6ff] to-[#dceaff]">
      <div className="absolute -left-8 bottom-3 h-44 w-44 rounded-full bg-white/50" />
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
      <div className="absolute left-[9%] bottom-[10%] h-4 w-44 rounded-full bg-[#8bb9ed]/50" />
      <div className="absolute left-[8%] bottom-[14%] flex gap-1">
        <span className="h-5 w-32 rounded bg-white shadow" />
        <span className="h-5 w-28 rounded bg-[#ff5d68] shadow" />
        <span className="h-5 w-36 rounded bg-[#ffc02d] shadow" />
      </div>
      <div className="absolute right-[7%] top-[33%] rounded-2xl bg-white px-4 py-3 shadow-card">
        <div className="flex items-center gap-2 text-sm font-bold text-[#536eac]">
          <CheckCircle2 className="text-[#5570ff]" size={18} /> Keep learning!
        </div>
      </div>
    </div>
  );
}

export default function AuthShell({ children, mode }) {
  return (
    <div className="min-h-screen bg-[#f7fbff] px-3 py-3 sm:px-5 sm:py-5 lg:px-8 lg:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-24px)] max-w-[1450px] overflow-hidden rounded-[24px] bg-gradient-to-br from-[#eef7ff] to-[#f7fbff] shadow-soft sm:min-h-[calc(100vh-40px)] sm:rounded-[28px] lg:min-h-[calc(100vh-48px)] lg:rounded-[32px] lg:grid-cols-[1fr_1.03fr]">
        <section className="relative hidden overflow-hidden p-10 lg:block xl:p-14">
          <div className="absolute -left-16 top-16 h-36 w-36 rounded-full bg-[#d8e9ff]/60" />
          <div className="absolute right-10 top-12 h-20 w-20 rounded-full bg-[#dfeeff]" />
          <Logo />
          <div className="relative z-10 mt-16 max-w-[590px]">
            <h1 className="text-5xl font-extrabold leading-[1.06] tracking-[-2px] text-[#142a61] xl:text-6xl">
              {mode === "signup" ? (
                <>
                  Join <span className="brand-gradient">MindRush</span> and
                  <br />
                  Start Your Learning Journey
                </>
              ) : (
                <>
                  Test Your Knowledge
                  <br />
                  with <span className="brand-gradient">MindRush</span>
                </>
              )}
            </h1>
            <p className="mt-5 max-w-[570px] text-xl leading-relaxed text-[#5874ad]">
              Challenge yourself with fun quizzes, learn new things and improve
              your skills!
            </p>
            <div className="mt-8 space-y-6">
              {[
                [
                  "Explore Categories",
                  "10+ categories with endless quizzes.",
                  GraduationCap,
                  "blue",
                ],
                [
                  "Track Your Progress",
                  "See your improvement over time.",
                  Target,
                  "purple",
                ],
                [
                  "Compete Globally",
                  "Climb the leaderboard and earn rewards.",
                  Award,
                  "amber",
                ],
              ].map(([a, b, I, t]) => (
                <div key={a} className="flex items-center gap-5">
                  <span
                    className={`grid h-14 w-14 place-items-center rounded-full ${t === "blue" ? "bg-[#d9edff] text-[#2569ed]" : t === "purple" ? "bg-[#eadfff] text-[#743cf3]" : "bg-[#fff0bf] text-[#f3a916]"}`}
                  >
                    <I size={29} />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[#17316d]">{a}</h3>
                    <p className="text-[#6682bb]">{b}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[43%] px-5">
            <StudentIllustration />
          </div>
        </section>
        <section className="flex items-center justify-center bg-white/60 p-5 sm:p-8 lg:p-12">
          <div className="w-full max-w-[680px]">{children}</div>
        </section>
      </div>
    </div>
  );
}
