import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
export default function AuthHeader({ signup, showAccountLink = true }) {
  return (
    <div className="mb-8 flex items-start justify-between">
      <Logo />
      <div
        className={`${showAccountLink ? "hidden text-sm text-[#6078b1] sm:block" : "hidden"}`}
      >
        {signup ? "Already have an account?" : "Don’t have an account?"}{" "}
        <Link
          className="ml-2 font-bold text-[#315cff]"
          to={signup ? "/login" : "/signup"}
        >
          {signup ? "Log In" : "Sign Up"}{" "}
          <ArrowRight className="inline" size={15} />
        </Link>
      </div>
    </div>
  );
}
