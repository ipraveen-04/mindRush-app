import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import AuthShell from "../components/AuthShell";
import AuthHeader from "../components/AuthHeader";
import PasswordInput from "../components/PasswordInput";
import { authenticateAccount, saveCurrentUser } from "../services/storage";

const REMEMBER_KEY = "mindrush-remembered-email";

export default function Login() {
  const nav = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const remembered = localStorage.getItem(REMEMBER_KEY);
    if (remembered) setEmail(remembered);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (loading) return;
    setMessage("");
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    const result = authenticateAccount(normalizedEmail, password);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }

    setLoading(true);
    if (remember) localStorage.setItem(REMEMBER_KEY, normalizedEmail);
    else localStorage.removeItem(REMEMBER_KEY);

    window.setTimeout(() => {
      saveCurrentUser(result.user);
      nav(location.state?.from?.pathname || "/dashboard", { replace: true });
    }, 250);
  };

  const forgotPassword = () => {
    setMessage(
      email.trim()
        ? `Password reset instructions would be sent to ${email.trim()}.`
        : "Enter your email address first to reset your password.",
    );
  };

  return (
    <AuthShell mode="login">
      <AuthHeader signup={false} showAccountLink={false} />
      <h2 className="text-4xl font-extrabold tracking-[-1px] text-[#142a61]">
        Welcome Back!
      </h2>
      <p className="mt-3 text-lg leading-relaxed text-[#6580b9]">
        Log in to continue your
        <br className="sm:hidden" /> learning journey.
      </p>
      <form onSubmit={submit} noValidate className="mt-8 space-y-5 sm:mt-9">
        <label className="block">
          <span className="label">Email Address</span>
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5d79b7]"
              size={22}
            />
            <input
              required
              type="email"
              autoComplete="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setMessage("");
              }}
              className="field !pl-14"
            />
          </div>
        </label>
        <label className="block">
          <span className="label">Password</span>
          <PasswordInput
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setMessage("");
            }}
          />
        </label>
        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="flex items-center gap-2 text-[#5570aa]">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-5 w-5 accent-[#5260ff]"
            />{" "}
            Remember me
          </label>
          <button
            type="button"
            onClick={forgotPassword}
            className="font-semibold text-[#315cff] hover:underline"
          >
            Forgot password?
          </button>
        </div>
        {message && (
          <p
            role="status"
            className="rounded-xl bg-[#eef3ff] px-4 py-3 text-sm font-semibold text-[#4966a4]"
          >
            {message}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="primary-btn disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Logging In..." : "Log In"}{" "}
          {!loading && <ArrowRight size={21} />}
        </button>
      </form>
      <div className="mt-5 text-center text-sm text-[#6c82b3]">
        Don’t have an account?{" "}
        <Link to="/signup" className="font-bold text-[#315cff]">
          Sign Up →
        </Link>
      </div>
    </AuthShell>
  );
}
