import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

export default function PasswordInput({ placeholder, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <LockKeyhole
        className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#5d79b7]"
        size={22}
      />
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="field field-icon-input !pl-16 !pr-14"
      />
      <button
        type="button"
        aria-label={show ? "Hide password" : "Show password"}
        onClick={() => setShow(!show)}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-[#5d79b7]"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}
