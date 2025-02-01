"use client";

import { Todo } from "@/types/todo";
import { useState } from "react";

interface AddTodoFormProps {
  onAdd: (todo: Omit<Todo, "id" | "createdAt">) => void;
}

export default function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAdd({
      content,
      date,
      completed: false,
    });

    setContent("");
    setDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div className="flex space-x-4">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="할일을 입력하세요"
          className="flex-1 p-2 text-black border rounded outline-none"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 text-black border rounded"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-point text-white rounded hover:bg-point-hover whitespace-nowrap"
        >
          추가
        </button>
      </div>
    </form>
  );
}
