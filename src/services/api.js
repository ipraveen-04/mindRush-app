import { quizCategories } from "../data/appData";
import { fallbackQuestionsByCategory } from "../data/quizFallback";
import { getMindRushLeaderboard } from "./storage";

const OPENTDB_BASE = "https://opentdb.com/api.php";
const TRIVIA_API_BASE = "https://the-trivia-api.com/v2/questions";
const PROFILE_API = "https://randomuser.me/api/";
const CATEGORY_CACHE_KEY = "mindrush-quiz-categories-v3";

const decode = (value = "") => {
  if (typeof document === "undefined") return value;
  const el = document.createElement("textarea");
  el.innerHTML = value;
  return el.value;
};

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithTimeout = async (url, options = {}, timeout = 9000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const externalSignal = options.signal;
  const onAbort = () => controller.abort();

  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener("abort", onAbort, { once: true });
  }

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener("abort", onAbort);
  }
};

const normalizeOpenTdb = (results = []) =>
  results.map((item) => {
    const correct = decode(item.correct_answer);
    const options = shuffle([...item.incorrect_answers.map(decode), correct]);
    return {
      q: decode(item.question),
      opts: options,
      answer: options.indexOf(correct),
      category: decode(item.category),
      difficulty: item.difficulty || "mixed",
    };
  });

const normalizeTriviaApi = (results = []) =>
  results
    .filter((item) => item?.question?.text && item.correctAnswer)
    .map((item) => {
      const correct = decode(item.correctAnswer);
      const incorrect = (item.incorrectAnswers || []).map(decode);
      const options = shuffle([...incorrect, correct]);
      return {
        q: decode(item.question.text),
        opts: options,
        answer: options.indexOf(correct),
        category: decode(item.category || "General Knowledge"),
        difficulty: item.difficulty || "mixed",
      };
    });

export function getQuizCategories() {
  return quizCategories;
}

export async function fetchLeaderboard(limit = 10, signal) {
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  // MindRush ranking is based on completed MindRush quiz attempts, not
  // unrelated third-party players. The storage layer aggregates multiple
  // attempts made by the same account into one participant row.
  const rows = getMindRushLeaderboard(limit);
  return rows;
}

export async function fetchTriviaCategories(signal) {
  try {
    sessionStorage.setItem(
      CATEGORY_CACHE_KEY,
      JSON.stringify({ time: Date.now(), data: quizCategories }),
    );
  } catch {}
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  return quizCategories;
}

async function fetchGeneralKnowledgeQuestions(amount, signal) {
  const url = `${TRIVIA_API_BASE}?categories=general_knowledge&limit=${Math.min(amount, 10)}&types=text_choice`;
  const response = await fetchWithTimeout(url, { signal });
  if (!response.ok)
    throw new Error(`General Knowledge API failed (${response.status})`);
  const data = await response.json();
  const questions = normalizeTriviaApi(data);
  if (!questions.length)
    throw new Error("General Knowledge API returned no usable questions.");
  return questions;
}

async function fetchOpenTriviaQuestions(
  categoryId,
  amount,
  difficulty,
  signal,
) {
  const params = new URLSearchParams({
    amount: String(Math.min(amount, 10)),
    category: String(categoryId),
    type: "multiple",
  });
  if (difficulty) params.set("difficulty", difficulty);

  const url = `${OPENTDB_BASE}?${params}`;
  let response = await fetchWithTimeout(url, { signal });
  if (!response.ok)
    throw new Error(`Open Trivia DB failed (${response.status})`);

  let data = await response.json();

  // Open Trivia DB has an IP rate limit of one request every 5 seconds.
  // If that is returned, wait once and retry instead of immediately failing.
  if (data.response_code === 5) {
    await sleep(5200);
    response = await fetchWithTimeout(url, { signal });
    if (!response.ok)
      throw new Error(`Open Trivia DB failed (${response.status})`);
    data = await response.json();
  }

  if (data.response_code !== 0 || !data.results?.length) {
    throw new Error(
      `Open Trivia DB returned response code ${data.response_code ?? "unknown"}.`,
    );
  }

  return normalizeOpenTdb(data.results);
}

function getFallbackQuestions(config, amount) {
  const source = fallbackQuestionsByCategory[config.slug] || [];
  if (!source.length)
    throw new Error(`No fallback questions configured for ${config.name}.`);
  return shuffle(source).slice(0, Math.min(amount, source.length));
}

export async function fetchQuizQuestions({
  category,
  categoryId,
  amount = 5,
  difficulty = "",
  signal,
}) {
  const config =
    typeof category === "object"
      ? category
      : quizCategories.find((item) => item.slug === category) ||
        quizCategories.find((item) => String(item.id) === String(categoryId));

  if (!config) throw new Error("Unknown quiz category.");

  try {
    if (config.provider === "trivia-api") {
      return await fetchGeneralKnowledgeQuestions(amount, signal);
    }
    return await fetchOpenTriviaQuestions(
      config.apiCategory,
      amount,
      difficulty,
      signal,
    );
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    return getFallbackQuestions(config, amount);
  }
}

export async function fetchRandomProfile(signal) {
  try {
    const response = await fetchWithTimeout(
      `${PROFILE_API}?inc=name,picture&results=1`,
      { signal },
    );
    if (!response.ok) throw new Error("Unable to load profile.");
    const data = await response.json();
    const user = data.results?.[0];
    return user
      ? {
          name: `${user.name.first} ${user.name.last}`,
          avatar: user.picture.large,
        }
      : null;
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    return null;
  }
}
