import { Todo } from "@/types/todo";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// 쿠키에서 todos를 가져오는 헬퍼 함수
const getTodosFromCookies = async (): Promise<Todo[]> => {
  const cookieStore = await cookies();
  const todosStr = cookieStore.get("todos")?.value;
  return todosStr ? JSON.parse(todosStr) : [];
};

// 쿠키에 todos를 저장하는 헬퍼 함수
const saveTodosToCookies = async (todos: Todo[]) => {
  const cookieStore = await cookies();
  cookieStore.set("todos", JSON.stringify(todos), {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일
  });
};

export async function GET() {
  const todos = await getTodosFromCookies();
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const todos = await getTodosFromCookies();

  const todo: Todo = {
    ...body,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };

  todos.push(todo);
  saveTodosToCookies(todos);

  return NextResponse.json(todo, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;
  const todos = await getTodosFromCookies();

  const todoIndex = todos.findIndex((todo) => todo.id === id);
  if (todoIndex === -1) {
    return NextResponse.json({ message: "Todo not found" }, { status: 404 });
  }

  todos[todoIndex] = { ...todos[todoIndex], ...updates };
  saveTodosToCookies(todos);

  return NextResponse.json(todos[todoIndex]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const todos = await getTodosFromCookies();

  const deleteIndex = todos.findIndex((todo) => todo.id === id);
  if (deleteIndex === -1) {
    return NextResponse.json({ message: "Todo not found" }, { status: 404 });
  }

  const deletedTodo = todos.splice(deleteIndex, 1)[0];
  saveTodosToCookies(todos);

  return NextResponse.json(deletedTodo);
}
