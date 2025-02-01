import { Suspense } from "react";
import TodoPage from "./todo/page";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen p-8">
          <h1 className="text-3xl font-bold mb-8">Weekly Pomodoros 🍅</h1>
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <TodoPage />
    </Suspense>
  );
}
