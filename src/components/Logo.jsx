import { Brain } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo({ light = false }) {
  return (
    <Link to="/dashboard" className="flex items-center gap-3 select-none">
      <span
        className={`grid h-11 w-11 place-items-center rounded-2xl ${light ? "bg-white/10" : "bg-[#edf3ff]"}`}
      >
        <Brain size={30} strokeWidth={2.4} className="text-[#315cff]" />
      </span>
      <span
        className={`text-[29px] font-extrabold tracking-[-1.5px] ${light ? "text-white" : "text-[#142a61]"}`}
      >
        Mind
        <span className="bg-gradient-to-r from-[#315cff] to-[#8141ef] bg-clip-text text-transparent">
          Rush
        </span>
      </span>
    </Link>
  );
}
