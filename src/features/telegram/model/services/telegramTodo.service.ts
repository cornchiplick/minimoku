import db from "@/shared/lib/db";

// Todo 생성
export async function createTelegramTodo(chatId: string, title: string, time: string) {
  return db.telegramTodo.create({
    data: {chatId, title, time},
  });
}

// 활성 Todo 목록 조회
export async function getActiveTodos(chatId: string) {
  return db.telegramTodo.findMany({
    where: {chatId, isActive: true},
    orderBy: {createdAt: "asc"},
  });
}

// Todo 완료 처리 (비활성화)
export async function completeTodo(chatId: string, todoId: number) {
  return db.telegramTodo.updateMany({
    where: {id: todoId, chatId},
    data: {isActive: false},
  });
}

// Todo 삭제
export async function deleteTodo(chatId: string, todoId: number) {
  return db.telegramTodo.deleteMany({
    where: {id: todoId, chatId},
  });
}

// 특정 시각의 활성 Todo 조회 (Lambda에서 사용)
export async function getTodosByTime(time: string) {
  return db.telegramTodo.findMany({
    where: {isActive: true, time},
  });
}
