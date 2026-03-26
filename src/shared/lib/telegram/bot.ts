import {TELEGRAM} from "./constants";

// 텔레그램 Bot API 토큰
function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN 환경변수가 설정되지 않았습니다.");
  return token;
}

// 텔레그램 메시지 발송
export async function sendTelegramMessage(chatId: string, text: string): Promise<boolean> {
  try {
    const response = await fetch(`${TELEGRAM.API_BASE}${getBotToken()}/sendMessage`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      console.error("텔레그램 메시지 발송 실패:", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("텔레그램 메시지 발송 오류:", error);
    return false;
  }
}

// 텔레그램 Webhook 설정 (최초 1회 실행용)
export async function setWebhook(url: string): Promise<boolean> {
  try {
    const response = await fetch(`${TELEGRAM.API_BASE}${getBotToken()}/setWebhook`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({url}),
    });

    const result = await response.json();
    console.log("Webhook 설정 결과:", result);
    return result.ok === true;
  } catch (error) {
    console.error("Webhook 설정 오류:", error);
    return false;
  }
}
