import { Todo } from "@/types/todo";
import { format } from "date-fns";
import { useState } from "react";

export default function TodoItem({
  todo,
  isWeekly,
  onUpdate,
  onDelete,
}: {
  todo: Todo;
  isWeekly?: boolean;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(todo.content);
  const [editedDate, setEditedDate] = useState(todo.date);

  const handleUpdate = () => {
    onUpdate(todo.id, { content: editedContent, date: editedDate });
    setIsEditing(false);
  };

  const startEditing = () => {
    setEditedContent(todo.content);
    setEditedDate(todo.date);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedContent(todo.content);
    setEditedDate(todo.date);
  };

  return (
    <div className="flex items-center justify-between p-4 text-black bg-white rounded-lg shadow">
      {isEditing ? (
        <div className="flex items-center space-x-4 flex-1">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={(e) => onUpdate(todo.id, { completed: e.target.checked })}
            className="h-4 w-4 text-black"
          />
          <div className="flex flex-1 items-center space-x-2">
            <input
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="flex-1 p-2 text-black border rounded"
            />
            <input
              type="date"
              value={editedDate}
              onChange={(e) => setEditedDate(e.target.value)}
              className="p-2 text-black border rounded"
            />
            <button
              onClick={handleUpdate}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              저장
            </button>
            <button
              onClick={cancelEditing}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={(e) =>
                onUpdate(todo.id, { completed: e.target.checked })
              }
              className="h-4 w-4 text-black"
            />
            <div className="flex flex-col">
              <span
                className={todo.completed ? "line-through text-gray-500" : ""}
              >
                {todo.content}
              </span>
              {isWeekly && (
                <span className="text-sm text-gray-500">
                  {format(new Date(todo.date), "M월 d일")}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={startEditing}
              className="text-blue-500 hover:text-blue-700"
            >
              수정
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              삭제
            </button>
          </div>
        </>
      )}
    </div>
  );
}
