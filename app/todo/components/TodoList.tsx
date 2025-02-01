"use client";

import { Todo } from "@/types/todo";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";

interface TodoListProps {
  todos: Todo[];
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({ todos = [], onUpdate, onDelete }: TodoListProps) {
  const [today, setToday] = useState<string>("");
  const [timeOption, setTimeOption] = useState<number>(0); // 분 단위
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [tomatoCount, setTomatoCount] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editDate, setEditDate] = useState("");

  // 컴포넌트 마운트 시 today 값 설정
  useEffect(() => {
    setToday(format(new Date(), "yyyy-MM-dd"));
  }, []);

  // 컴포넌트 마운트 시 쿠키에서 토마토 카운트 불러오기
  useEffect(() => {
    if (!today) return; // today가 설정되기 전에는 실행하지 않음

    const savedDate = Cookies.get("tomatoDate");
    const savedCount = Cookies.get("tomatoCount");

    if (savedDate === today && savedCount) {
      setTomatoCount(parseInt(savedCount));
    } else {
      // 날짜가 다르거나 저장된 카운트가 없으면 초기화
      setTomatoCount(0);
      Cookies.set("tomatoDate", today, { expires: 1 });
      Cookies.set("tomatoCount", "0", { expires: 1 });
    }
  }, [today]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && !isPaused && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsPaused(false);
            const newCount = tomatoCount + 1;
            setTomatoCount(newCount);
            // 토마토 카운트가 증가할 때마다 쿠키 업데이트
            Cookies.set("tomatoCount", newCount.toString(), { expires: 1 });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, isPaused, remainingTime, tomatoCount]);

  const startTimer = () => {
    if (timeOption === 0) return;
    if (!isRunning && !isPaused) {
      setRemainingTime(timeOption * 60);
    }
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const renderTomatoes = useCallback(() => {
    if(!tomatoCount) return null;
    return Array(tomatoCount).fill('🍅').join('');
  }, [tomatoCount]);

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditContent(todo.content);
    setEditDate(todo.date);
  };

  const handleUpdate = (id: string) => {
    onUpdate(id, { content: editContent, date: editDate });
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent("");
    setEditDate("");
  };

  const TodoItem = ({ todo, isWeekly = false }: { todo: Todo; isWeekly?: boolean }) => (
    <div
      key={todo.id}
      className="flex items-center justify-between p-4 text-black bg-white rounded-lg shadow"
    >
      {editingId === todo.id ? (
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
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="flex-1 p-2 text-black border rounded"
            />
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="p-2 text-black border rounded"
            />
            <button
              onClick={() => handleUpdate(todo.id)}
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
              onChange={(e) => onUpdate(todo.id, { completed: e.target.checked })}
              className="h-4 w-4 text-black"
            />
            <div className="flex flex-col">
              <span className={todo.completed ? "line-through text-gray-500" : ""}>
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
              onClick={() => startEditing(todo)}
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

  return (
    <div className="space-y-8">
      {today && (
        <>
          <div className="flex flex-col bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-black">
              <span aria-label="tomato" role="img">🍅</span> Pomodoro Timer
            </h2>
            <div className="flex items-center space-x-4">
              <select
                value={timeOption}
                onChange={(e) => setTimeOption(Number(e.target.value))}
                className="p-2 rounded border text-black"
                disabled={isRunning || isPaused}
              >
                <option value={0}>시간 선택</option>
                <option value={20}>20분</option>
                <option value={30}>30분</option>
                <option value={60}>1시간</option>
              </select>
              {(!isRunning && !isPaused) || (isPaused && remainingTime > 0) ? (
                <button
                  onClick={startTimer}
                  disabled={!isPaused && timeOption === 0}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300"
                >
                  {isPaused ? "계속하기" : "시작"}
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  일시정지
                </button>
              )}
              <div className="text-2xl font-mono text-black">
                {formatTime(remainingTime)}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-black">
                오늘의 수확량: {tomatoCount}개 
                <span aria-label={`${tomatoCount} tomatoes`} role="img">
                  {renderTomatoes()}
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Today&apos;s Todos</h2>
            <div className="space-y-2">
              {todos
                .filter((todo) => todo.date === today)
                .map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Weekly Todos</h2>
            <div className="space-y-2">
              {todos
                .filter((todo) => todo.date !== today)
                .map((todo) => (
                  <TodoItem key={todo.id} todo={todo} isWeekly={true} />
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
