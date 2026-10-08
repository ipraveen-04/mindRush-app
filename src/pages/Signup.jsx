import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import AuthHeader from "../components/AuthHeader";
import PasswordInput from "../components/PasswordInput";
import { registerAccount } from "../services/storage";

export default function Signup() {
  const [message, setMessage] = useState("");
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setMessage("Passwords do not match.");
      return;
    }
    const result = registerAccount({
      name: form.name || "Guest Player",
      email: form.email,
      password: form.password,
    });
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    nav("/dashboard", { replace: true });
  };
  return (
    <AuthShell mode="signup">
      <AuthHeader signup showAccountLink={false} />
      <h2 className="text-4xl font-extrabold tracking-[-1px] text-[#142a61]">
        Create Your Account
      </h2>
      <p className="mt-3 text-lg text-[#6580b9]">
        Join MindRush and start exploring amazing
        <br className="hidden sm:block" /> quizzes, challenges and more!
      </p>
      <form onSubmit={submit} className="mt-7 space-y-4">
        <label className="block">
          <span className="label">Full Name</span>
          <div className="relative">
            <UserRound
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5d79b7]"
              size={22}
            />
            <input
              required
              placeholder="Enter your full name"
              value={form.name}
              onChange={update("name")}
              className="field field-icon-input"
            />
          </div>
        </label>
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
              placeholder="Enter your email address"
              value={form.email}
              onChange={update("email")}
              className="field field-icon-input"
            />
          </div>
        </label>
        <label className="block">
          <span className="label">Password</span>
          <PasswordInput
            placeholder="Create a strong password"
            value={form.password}
            onChange={update("password")}
          />
        </label>
        <label className="block">
          <span className="label">Confirm Password</span>
          <PasswordInput
            placeholder="Confirm your password"
            value={form.confirm}
            onChange={update("confirm")}
          />
        </label>
        <label className="flex items-start gap-3 py-1 text-sm text-[#5c73ac]">
          <input
            required
            type="checkbox"
            defaultChecked
            className="mt-0.5 h-5 w-5 accent-[#5260ff]"
          />{" "}
          <span>
            I agree to the{" "}
            <button type="button" className="text-[#315cff]">
              Terms of Service
            </button>{" "}
            and{" "}
            <button type="button" className="text-[#315cff]">
              Privacy Policy
            </button>
          </span>
        </label>
        {message && (
          <p
            role="status"
            className="rounded-xl bg-[#eef3ff] px-4 py-3 text-sm font-semibold text-[#4966a4]"
          >
            {message}
          </p>
        )}
        <button className="primary-btn">
          Create Account <ArrowRight size={21} />
        </button>
        <div className="pt-1 text-center text-sm text-[#6c82b3]">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-[#315cff]">
            Log In →
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
