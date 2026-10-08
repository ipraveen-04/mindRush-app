import { useEffect, useMemo, useState } from "react";
import { AppPage } from "../components/AppLayout";
import { CategoryCard } from "../components/QuizCards";
import { useSearchParams } from "react-router-dom";
import { fetchTriviaCategories } from "../services/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const filteredCategories = useMemo(() => {
    if (!search) return categories;
    return categories.filter((category) => {
      const haystack =
        `${category.name || ""} ${category.slug || ""} ${category.source || ""} ${category.provider || ""}`.toLowerCase();
      return haystack.includes(search);
    });
  }, [categories, search]);

  useEffect(() => {
    const controller = new AbortController();
    fetchTriviaCategories(controller.signal)
      .then(setCategories)
      .catch((error) => {
        if (error?.name !== "AbortError") setCategories([]);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  return (
    <AppPage>
      <main className="flex-1 bg-[#f7faff] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1200px]">
          <h1 className="text-3xl font-extrabold text-[#142b62] sm:text-4xl">
            {search
              ? `Search results for “${searchParams.get("search")}”`
              : "Explore Categories"}
          </h1>
          {/* <p className="mt-2 text-sm text-[#6a81b4] sm:text-base">
            Each category uses a quiz API selected for that subject.
          </p> */}

          {loading ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-2xl bg-white shadow-card"
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((category, index) => (
                <CategoryCard key={category.id} c={category} index={index} />
              ))}
            </div>
          )}
          {!loading && search && filteredCategories.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-[#cbd9ef] bg-white p-10 text-center text-sm font-semibold text-[#6b80ad]">
              No quizzes or categories found for “{searchParams.get("search")}”.
            </div>
          )}
        </div>
      </main>
    </AppPage>
  );
}
