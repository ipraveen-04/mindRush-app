/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 12px 40px rgba(58,94,173,.12)",
        card: "0 8px 26px rgba(28,60,120,.08)",
      },
      colors: {
        ink: "#12285f",
        brand: "#4d58ff",
        violet: "#7542f4",
        sky: "#eaf4ff",
      },
    },
  },
  plugins: [],
};
