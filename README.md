# MindRush Quiz App

Responsive React + Vite + Tailwind quiz application with separated pages/components.

## Quiz data

- General Knowledge: The Trivia API
- Science, Mathematics, History, Geography and Video Games: Open Trivia DB
- Category-specific fallback questions are included so the quiz remains usable if a provider is unavailable.

## MindRush leaderboard

The leaderboard is now calculated from **completed MindRush quiz tests** rather than unrelated third-party leaderboard players.

- Every completed quiz creates a MindRush attempt record.
- The current signed-in account is attached to the attempt.
- One unique account counts as one participant.
- If the same person completes multiple quizzes, their completed scores are aggregated.
- Ranking is sorted by total correct answers, then accuracy.
- The page displays both unique participant count and total completed quiz attempts.
- The dashboard leaderboard preview uses the same MindRush data source.
