import { Clock3 } from "lucide-react";
import { AppPage } from "../components/AppLayout";
import { getHistory } from "../services/storage";
import { useState } from "react";
export default function History() {
  const [items, setItems] = useState(getHistory());
  const clear = () => {
    localStorage.removeItem("mindrush-history");
    setItems([]);
  };
  return (
    <AppPage>
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-3xl font-extrabold text-[#142b62] sm:text-4xl">
                Quiz History
              </h1>
              <p className="mt-2 text-[#6a81b4]">
                Your completed live quiz attempts.
              </p>
            </div>
            {items.length > 0 && (
              <button onClick={clear} className="secondary-btn">
                Clear History
              </button>
            )}
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-[#dfe8f7] bg-white shadow-card">
            {items.length === 0 ? (
              <div className="p-10 text-center text-[#7a8eb6]">
                No quiz attempts yet. Start a live quiz from Categories.
              </div>
            ) : (
              items.map((x) => (
                <div
                  key={x.id}
                  className="flex flex-wrap items-center gap-4 border-b border-[#edf1f8] p-4 last:border-0 sm:p-5"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#eef3ff] text-[#5361ff]">
                    <Clock3 size={21} />
                  </span>
                  <span className="min-w-[180px] flex-1 font-bold capitalize text-[#243b70]">
                    {x.category}
                  </span>
                  <span className="font-extrabold text-[#536bff]">
                    {x.score} / {x.total}
                  </span>
                  <span className="text-sm text-[#7a8eb6]">
                    {new Date(x.date).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </AppPage>
  );
}
