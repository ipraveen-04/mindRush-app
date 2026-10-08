import { Settings as SettingsIcon } from "lucide-react";
import { AppPage } from "../components/AppLayout";
export default function Settings() {
  return (
    <AppPage>
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white p-6 shadow-card sm:rounded-3xl sm:p-8">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#eef3ff] text-[#5361ff]">
                <SettingsIcon />
              </span>
              <div>
                <h1 className="text-3xl font-extrabold text-[#142b62]">
                  Settings
                </h1>
                <p className="mt-1 text-[#6a81b4]">
                  Manage your MindRush preferences.
                </p>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <label className="flex items-center justify-between rounded-xl border border-[#e3eaf6] p-4">
                <span>
                  <b className="block text-[#243b70]">Email notifications</b>
                  <small className="text-[#7a8eb6]">
                    Receive updates about quizzes and achievements.
                  </small>
                </span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5 accent-[#5361ff]"
                />
              </label>
              <label className="flex items-center justify-between rounded-xl border border-[#e3eaf6] p-4">
                <span>
                  <b className="block text-[#243b70]">Sound effects</b>
                  <small className="text-[#7a8eb6]">
                    Play sounds during quiz interactions.
                  </small>
                </span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5 accent-[#5361ff]"
                />
              </label>
            </div>
          </div>
        </div>
      </main>
    </AppPage>
  );
}
