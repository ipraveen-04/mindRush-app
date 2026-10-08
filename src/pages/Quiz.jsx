import { useEffect, useState } from "react";
import { ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../components/Logo";
import { fetchQuizQuestions, fetchTriviaCategories } from "../services/api";
import { getCurrentUser, saveAttempt } from "../services/storage";
import { quizCategories } from "../data/appData";

export default function Quiz() {
  const nav = useNavigate();
  const { category } = useParams();
  const [questions, setQuestions] = useState([]);
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryName, setCategoryName] = useState(
    category?.replaceAll("-", " "),
  );
  const loadQuiz = async () => {
    setLoading(true);
    setError("");
    setDone(false);
    setI(0);
    setSelected(null);
    setScore(0);
    try {
      const cat = quizCategories.find((c) => c.slug === category);
      if (!cat) throw new Error("This quiz category could not be found.");
      setCategoryName(cat.name);
      const qs = await fetchQuizQuestions({ category: cat, amount: 5 });
      if (!qs?.length)
        throw new Error("No quiz questions are available right now.");
      setQuestions(qs);
    } catch (e) {
      setError(e.message || "Unable to load quiz.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadQuiz();
  }, [category]);
  const choose = (n) => {
    if (selected !== null) return;
    setSelected(n);
    if (n === questions[i].answer) setScore((s) => s + 1);
  };
  const next = () => {
    if (i === questions.length - 1) {
      const finalScore = score + (selected === questions[i].answer ? 1 : 0);
      const user = getCurrentUser();
      saveAttempt({
        category: categoryName,
        score: finalScore,
        total: questions.length,
        participantId: user.id,
        participantName: user.name,
      });
      setDone(true);
    } else {
      setI(i + 1);
      setSelected(null);
    }
  };
  if (loading)
    return (
      <div className="grid min-h-screen place-items-center bg-[#f7faff] p-6">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#dfe7ff] border-t-[#5361ff]" />
          <p className="mt-4 font-bold text-[#536bff]">
            Loading live questions...
          </p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="grid min-h-screen place-items-center bg-[#f7faff] p-6">
        <div className="max-w-lg rounded-3xl bg-white p-8 text-center shadow-soft">
          <h1 className="text-2xl font-extrabold text-[#142b62]">
            Quiz unavailable
          </h1>
          <p className="mt-3 text-[#6a81b4]">{error}</p>
          <button onClick={loadQuiz} className="primary-btn mt-6">
            Try Again
          </button>
        </div>
      </div>
    );
  if (done)
    return (
      <div className="min-h-screen bg-[#f7faff] p-4 sm:p-6">
        <div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-white p-5 text-center shadow-soft sm:mt-16 sm:rounded-3xl sm:p-10">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#e5f8ee] text-[#21ad69]">
            <Trophy size={40} />
          </div>
          <h1 className="mt-6 text-4xl font-extrabold text-[#142b62]">
            Quiz Complete!
          </h1>
          <p className="mt-3 text-lg text-[#6a81b4]">
            You scored {score} out of {questions.length}.
          </p>
          <p className="mt-2 text-sm capitalize text-[#8a9bc0]">
            Category: {categoryName}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button onClick={loadQuiz} className="secondary-btn">
              <RotateCcw size={18} /> New Questions
            </button>
            <button
              onClick={() => nav("/dashboard")}
              className="primary-btn w-full sm:max-w-[220px]"
            >
              Back to Dashboard <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  const q = questions[i];
  return (
    <div className="min-h-screen bg-[#f7faff] p-3 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <Logo />
          <button
            onClick={() => nav("/dashboard")}
            className="text-sm font-bold text-[#315cff]"
          >
            Exit Quiz
          </button>
        </div>
        <div className="mt-6 rounded-2xl bg-white p-4 shadow-soft sm:mt-10 sm:rounded-3xl sm:p-8 lg:p-10">
          <div className="flex items-center justify-between text-sm font-bold text-[#6078b1]">
            <span>
              Question {i + 1} of {questions.length}
            </span>
            <span>{Math.round(((i + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-[#e7edf8]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#4d5eff] to-[#773ef0]"
              style={{ width: `${((i + 1) / questions.length) * 100}%` }}
            />
          </div>
          <div className="mt-8 flex gap-2 text-xs font-bold uppercase tracking-wide text-[#7a8eb6]">
            <span>{q.difficulty}</span>
            <span>•</span>
            <span>{q.category}</span>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold leading-snug text-[#142b62] sm:mt-5 sm:text-3xl">
            {q.q}
          </h1>
          <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
            {q.opts.map((o, n) => (
              <button
                key={o}
                onClick={() => choose(n)}
                className={`rounded-2xl border-2 p-4 text-left text-sm font-bold transition sm:p-5 sm:text-base ${selected === null ? "border-[#dce6f6] hover:border-[#6572ff] hover:bg-[#f4f6ff]" : selected === n ? (n === q.answer ? "border-[#27b676] bg-[#ebfaf2] text-[#18865a]" : "border-[#ff6070] bg-[#fff0f2] text-[#c53d4e]") : "border-[#edf1f7] text-[#9aa8bf]"}`}
              >
                <span className="mr-3 inline-grid h-8 w-8 place-items-center rounded-full bg-[#eef3fb] text-sm">
                  {String.fromCharCode(65 + n)}
                </span>
                {o}
              </button>
            ))}
          </div>
          <button
            disabled={selected === null}
            onClick={next}
            className="primary-btn mt-8 ml-auto max-w-[210px] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {i === questions.length - 1 ? "Finish Quiz" : "Next Question"}{" "}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
