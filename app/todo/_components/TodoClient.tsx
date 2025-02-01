"use client";

import { Todo } from "@/types/todo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import AddTodoForm from "./AddTodoForm";
import TodoList from "./TodoList";

interface TodoClientProps {
  initialTodos: Todo[];
}

export default function TodoClient({ initialTodos }: TodoClientProps) {
  const [error, setError] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: todos = initialTodos } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await fetch("/api/todos");
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // 1시간동안 캐시 데이터를 사용
    initialData: initialTodos,
  });

  // Add todo mutation
  const addTodoMutation = useMutation({
    mutationFn: async (todo: Omit<Todo, "id" | "createdAt">) => {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo),
      });
      return response.json();
    },
    onSuccess: () => {
      // 쿼리 즉시 무효화
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setError("");
    },
    onError: () => {
      setError("할일을 추가하는데 실패했습니다.");
    },
  });

  // Update todo mutation
  const updateTodoMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Todo>;
    }) => {
      const response = await fetch("/api/todos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      return response.json();
    },
    onSuccess: () => {
      // 쿼리 즉시 무효화
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setError("");
    },
    onError: () => {
      setError("할일을 수정하는데 실패했습니다.");
    },
  });

  // Delete todo mutation
  const deleteTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/todos?id=${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      // 쿼리 즉시 무효화
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setError("");
    },
    onError: () => {
      setError("할일을 삭제하는데 실패했습니다.");
    },
  });

  const addTodo = async (todo: Omit<Todo, "id" | "createdAt">) => {
    if (!todo.date) {
      setError("날짜를 선택해주세요!");
      return;
    }

    const selectedDate = new Date(todo.date);
    const today = new Date();

    if (selectedDate < new Date(today.setHours(0, 0, 0, 0))) {
      setError("과거의 날짜는 선택할 수 없습니다!");
      return;
    }

    addTodoMutation.mutate(todo);
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const todoDate = new Date(todo.date);
    const today = new Date();

    if (todoDate < new Date(today.setHours(0, 0, 0, 0))) {
      setError("과거의 할일은 수정할 수 없습니다!");
      return;
    }

    updateTodoMutation.mutate({ id, updates });
  };

  const deleteTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const todoDate = new Date(todo.date);
    const today = new Date();

    if (todoDate < new Date(today.setHours(0, 0, 0, 0))) {
      setError("과거의 할일은 삭제할 수 없습니다!");
      return;
    }

    deleteTodoMutation.mutate(id);
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Weekly Pomodoros 🍅</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <AddTodoForm onAdd={addTodo} />
      <TodoList todos={todos} onUpdate={updateTodo} onDelete={deleteTodo} />
    </main>
  );
}
