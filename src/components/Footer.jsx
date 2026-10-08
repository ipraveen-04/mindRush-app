import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-auto shrink-0 border-t border-[#e2eaf6] bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center gap-3 text-center text-xs text-[#6f84b2] sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center justify-center gap-3 sm:justify-start">
          <Logo />
          <span>© 2026 MindRush. All rights reserved.</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-end">
          <a href="#terms" className="transition-colors hover:text-[#315cff]">
            Terms of Service
          </a>
          <a href="#privacy" className="transition-colors hover:text-[#315cff]">
            Privacy Policy
          </a>
          <a href="#contact" className="transition-colors hover:text-[#315cff]">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
