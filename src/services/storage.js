const HISTORY_KEY = "mindrush-history";
const USER_KEY = "mindrush-user";
const ACCOUNTS_KEY = "mindrush-accounts";

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

export function getCurrentUser() {
  const raw = localStorage.getItem(USER_KEY) || "Guest Player";
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      const name = String(parsed.name || "").trim() || "Guest Player";
      const email = String(parsed.email || "")
        .trim()
        .toLowerCase();
      return {
        id: String(parsed.id || email || name)
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-"),
        name,
        email,
        avatar: parsed.avatar || parsed.avatarUrl || "",
      };
    }
  } catch {}

  if (raw.includes("@")) {
    const name = raw
      .split("@")[0]
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      id: raw.toLowerCase(),
      name,
      email: raw.toLowerCase(),
      avatar: "",
    };
  }
  return {
    id: raw.toLowerCase().trim().replace(/\s+/g, "-"),
    name: raw || "Guest Player",
    email: "",
    avatar: "",
  };
}

export function getRegisteredAccounts() {
  return readJson(ACCOUNTS_KEY, []);
}

export function registerAccount({ name, email, password }) {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();
  const accounts = getRegisteredAccounts();
  if (accounts.some((account) => account.email === normalizedEmail)) {
    return {
      ok: false,
      error: "An account with this email already exists. Please log in.",
    };
  }

  const account = {
    id: normalizedEmail,
    name: String(name || "Guest Player").trim(),
    email: normalizedEmail,
    password: String(password || ""),
  };
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]));
  saveCurrentUser(account);
  return { ok: true, user: account };
}

export function authenticateAccount(email, password) {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();
  const account = getRegisteredAccounts().find(
    (item) => item.email === normalizedEmail,
  );
  if (!account)
    return {
      ok: false,
      error: "No account found with this email. Please sign up first.",
    };
  if (account.password !== String(password || ""))
    return { ok: false, error: "Incorrect password. Please try again." };
  return { ok: true, user: account };
}

export function saveCurrentUser(user) {
  const current = getCurrentUser();
  const next = {
    id: user?.id || current.id,
    name: String(user?.name || current.name || "Guest Player").trim(),
    email: String(user?.email || current.email || "")
      .trim()
      .toLowerCase(),
    avatar: user?.avatar || user?.avatarUrl || current.avatar || "",
  };
  localStorage.setItem(USER_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("mindrush-user-updated"));
  return next;
}

export function logoutCurrentUser() {
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new CustomEvent("mindrush-user-logged-out"));
}

export function getHistory() {
  return readJson(HISTORY_KEY, []);
}

export function saveAttempt(attempt) {
  const history = getHistory();
  const user = getCurrentUser();
  const next = [
    {
      ...attempt,
      participantId: attempt.participantId || user.id,
      participantName: attempt.participantName || user.name,
      id: crypto.randomUUID?.() || String(Date.now()),
      date: new Date().toISOString(),
    },
    ...history,
  ].slice(0, 1000);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}

export function getStats() {
  const history = getHistory();
  const total = history.reduce((s, x) => s + Number(x.total || 0), 0);
  const correct = history.reduce((s, x) => s + Number(x.score || 0), 0);
  return {
    quizzes: history.length,
    correct,
    average: total ? Math.round((correct / total) * 100) : 0,
  };
}

/**
 * Builds the MindRush leaderboard from completed quiz attempts.
 * One participant = one unique account/user. Multiple quiz attempts are
 * aggregated into that participant's total score and quiz count.
 */
export function getMindRushLeaderboard(limit = 10) {
  const attempts = getHistory();
  const byParticipant = new Map();

  attempts.forEach((attempt) => {
    const participantId = attempt.participantId || getCurrentUser().id;
    const participantName = attempt.participantName || getCurrentUser().name;
    const score = Number(attempt.score || 0);
    const total = Number(attempt.total || 0);
    const existing = byParticipant.get(participantId) || {
      id: participantId,
      name: participantName,
      score: 0,
      questions: 0,
      quizzes: 0,
      lastPlayed: attempt.date || "",
      avatar: "",
    };

    existing.score += score;
    existing.questions += total;
    existing.quizzes += 1;
    if (new Date(attempt.date || 0) > new Date(existing.lastPlayed || 0))
      existing.lastPlayed = attempt.date || existing.lastPlayed;
    byParticipant.set(participantId, existing);
  });

  const ranked = [...byParticipant.values()]
    .map((player) => ({
      ...player,
      accuracy: player.questions
        ? Math.round((player.score / player.questions) * 100)
        : 0,
    }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.accuracy - a.accuracy ||
        new Date(a.lastPlayed) - new Date(b.lastPlayed),
    )
    .map((player, index) => ({ ...player, rank: index + 1 }));

  return ranked.slice(0, limit);
}

export function getMindRushParticipantCount() {
  return new Set(
    getHistory().map((attempt) => attempt.participantId || getCurrentUser().id),
  ).size;
}
