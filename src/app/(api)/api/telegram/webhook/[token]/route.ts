import {NextResponse} from "next/server";
import {TELEGRAM} from "@/shared/lib/telegram/constants";
import {parseTodoCommand, parseIndexCommand} from "@/shared/lib/telegram/parser";
import {sendTelegramMessage} from "@/shared/lib/telegram/bot";
import {
  createTelegramTodo,
  getActiveTodos,
  completeTodo,
  deleteTodo,
} from "@/features/telegram/model/services/telegramTodo.service";

// 텔레그램 Webhook 메시지 타입
interface TelegramUpdate {
  message?: {
    chat: {id: number};
    text?: string;
  };
}

// 허용된 chatId 확인
function isAllowedChat(chatId: number): boolean {
  return String(chatId) === process.env.TELEGRAM_ALLOWED_CHAT_ID;
}

// 사용법 안내 메시지
const HELP_MESSAGE = `📋 <b>Todo 봇 사용법</b>

<b>등록</b>
/todo 제목 → 매일 18:10 알림
/todo 제목 07:30 → 매일 07:30 알림
/todo 제목 22:00 every → 동일

<b>조회</b>
/list → 활성 todo 목록

<b>완료/삭제</b>
/done 번호 → 완료 처리
/delete 번호 → 삭제

※ 제목은 공백 없이 작성 (예: 계란_사기)`;

export async function POST(
  request: Request,
  {params}: {params: Promise<{token: string}>}
) {
  const {token} = await params;

  // 1차 보안: URL 토큰 검증
  if (token !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ok: true});
  }

  try {
    const update: TelegramUpdate = await request.json();
    const message = update.message;

    // 메시지가 없거나 텍스트가 없으면 무시
    if (!message?.text) {
      return NextResponse.json({ok: true});
    }

    const chatId = message.chat.id;

    // 2차 보안: chatId 허용 확인
    if (!isAllowedChat(chatId)) {
      return NextResponse.json({ok: true});
    }

    const text = message.text.trim();
    const chatIdStr = String(chatId);

    // 명령어 분기
    if (text.startsWith(TELEGRAM.COMMAND.TODO)) {
      await handleTodoCommand(chatIdStr, text);
    } else if (text.startsWith(TELEGRAM.COMMAND.LIST)) {
      await handleListCommand(chatIdStr);
    } else if (text.startsWith(TELEGRAM.COMMAND.DONE)) {
      await handleDoneCommand(chatIdStr, text);
    } else if (text.startsWith(TELEGRAM.COMMAND.DELETE)) {
      await handleDeleteCommand(chatIdStr, text);
    } else {
      // 미인식 명령어 → 사용법 안내
      await sendTelegramMessage(chatIdStr, HELP_MESSAGE);
    }
  } catch (error) {
    console.error("Webhook 처리 오류:", error);
  }

  // 항상 200 OK 반환 (텔레그램 재전송 방지)
  return NextResponse.json({ok: true});
}

// /todo 명령 처리
async function handleTodoCommand(chatId: string, text: string) {
  const parsed = parseTodoCommand(text);

  if (!parsed) {
    await sendTelegramMessage(chatId, "❌ 형식 오류\n사용법: /todo 제목 [HH:mm] [every]");
    return;
  }

  const todo = await createTelegramTodo(chatId, parsed.title, parsed.time);
  await sendTelegramMessage(
    chatId,
    `✅ 등록 완료\n📌 ${todo.title}\n⏰ 매일 ${todo.time}`
  );
}

// /list 명령 처리
async function handleListCommand(chatId: string) {
  const todos = await getActiveTodos(chatId);

  if (todos.length === 0) {
    await sendTelegramMessage(chatId, "📭 등록된 todo가 없습니다.");
    return;
  }

  const list = todos
    .map((todo: {title: string; time: string}, i: number) => `${i + 1}. ${todo.title} (⏰ ${todo.time})`)
    .join("\n");

  await sendTelegramMessage(chatId, `📋 <b>활성 Todo 목록</b>\n\n${list}`);
}

// /done 명령 처리
async function handleDoneCommand(chatId: string, text: string) {
  const parsed = parseIndexCommand(text);

  if (!parsed) {
    await sendTelegramMessage(chatId, "❌ 형식 오류\n사용법: /done 번호");
    return;
  }

  // 번호 → 실제 todo ID 매핑
  const todos = await getActiveTodos(chatId);
  const targetIndex = parsed.index - 1;

  if (targetIndex < 0 || targetIndex >= todos.length) {
    await sendTelegramMessage(chatId, `❌ ${parsed.index}번 todo가 없습니다.`);
    return;
  }

  const target = todos[targetIndex];
  await completeTodo(chatId, target.id);
  await sendTelegramMessage(chatId, `✔️ 완료: ${target.title}`);
}

// /delete 명령 처리
async function handleDeleteCommand(chatId: string, text: string) {
  const parsed = parseIndexCommand(text);

  if (!parsed) {
    await sendTelegramMessage(chatId, "❌ 형식 오류\n사용법: /delete 번호");
    return;
  }

  // 번호 → 실제 todo ID 매핑
  const todos = await getActiveTodos(chatId);
  const targetIndex = parsed.index - 1;

  if (targetIndex < 0 || targetIndex >= todos.length) {
    await sendTelegramMessage(chatId, `❌ ${parsed.index}번 todo가 없습니다.`);
    return;
  }

  const target = todos[targetIndex];
  await deleteTodo(chatId, target.id);
  await sendTelegramMessage(chatId, `🗑️ 삭제: ${target.title}`);
}
