import {PrismaClient} from "@prisma/client";

const TELEGRAM_API_BASE = "https://api.telegram.org/bot";

// Lambda cold start 시 1회 생성, warm 상태에서 재사용
const prisma = new PrismaClient();

// 텔레그램 메시지 발송
async function sendMessage(chatId: string, text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error("TELEGRAM_BOT_TOKEN 미설정");
    return false;
  }

  try {
    const response = await fetch(`${TELEGRAM_API_BASE}${token}/sendMessage`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      console.error("메시지 발송 실패:", await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("메시지 발송 오류:", error);
    return false;
  }
}

// 현재 KST 시각을 "HH:mm" 형식으로 반환
function getCurrentKSTTime(): string {
  const now = new Date();
  // UTC → KST (+9시간)
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const hours = String(kst.getUTCHours()).padStart(2, "0");
  const minutes = String(kst.getUTCMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Lambda 핸들러 - EventBridge에서 매분 트리거
export const handler = async (): Promise<void> => {
  const currentTime = getCurrentKSTTime();
  console.log(`알림 체크 시작: ${currentTime} KST`);

  try {
    // 현재 시각과 일치하는 활성 todo 조회
    const todos = await prisma.telegramTodo.findMany({
      where: {isActive: true, time: currentTime},
    });

    if (todos.length === 0) {
      console.log("발송할 알림 없음");
      return;
    }

    console.log(`${todos.length}건 알림 발송 시작`);

    // 각 todo에 대해 메시지 발송
    const results = await Promise.allSettled(
      todos.map((todo) => sendMessage(todo.chatId, `🔔 <b>리마인더</b>\n📌 ${todo.title}`))
    );

    // 결과 로깅
    const success = results.filter((r) => r.status === "fulfilled" && r.value).length;
    const failed = results.length - success;
    console.log(`발송 완료: 성공 ${success}건, 실패 ${failed}건`);
  } catch (error) {
    console.error("Lambda 실행 오류:", error);
    throw error;
  }
};
