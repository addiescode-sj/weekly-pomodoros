import dynamic from "next/dynamic";

// Dynamic import of TodoPage
const TodoPage = dynamic(() => import("./todo/page"), {
  loading: () => (
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
  ),
});

export default async function Home() {
  // 서버 사이드에서 직접 API 핸들러 로직을 호출
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const todosStr = cookieStore.get("todos")?.value;
  const initialTodos = todosStr ? JSON.parse(todosStr) : [];

  return <TodoPage initialTodos={initialTodos} />;
}
