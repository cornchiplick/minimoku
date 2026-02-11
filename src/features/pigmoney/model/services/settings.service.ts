"use server";

import { PigMoneySettingsInterface } from "@/entities/pigmoney/types";
import { DEFAULT_MONTH_START_DAY, DEFAULT_WEEK_START_DAY } from "@/shared/constants/pigmoney";
import db from "@/shared/lib/db";
import { getSessionUser } from "@/shared/lib/utils/authUtils";

// 설정 조회 (없으면 기본값으로 생성 후 반환)
export async function getSettings(): Promise<PigMoneySettingsInterface> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  let settings = await db.pigMoneySettings.findUnique({
    where: { userId: user.id },
  });

  // 설정이 없으면 기본값으로 생성
  if (!settings) {
    settings = await db.pigMoneySettings.create({
      data: {
        userId: user.id!,
        monthStartDay: DEFAULT_MONTH_START_DAY,
        weekStartDay: DEFAULT_WEEK_START_DAY,
      },
    });
  }

  return {
    id: settings.id,
    monthStartDay: settings.monthStartDay,
    weekStartDay: settings.weekStartDay,
  };
}

// 설정 수정
export async function updateSettings(formData: FormData) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const monthStartDay = Number(formData.get("monthStartDay"));
  const weekStartDay = Number(formData.get("weekStartDay"));

  // 유효성 검증
  if (monthStartDay < 1 || monthStartDay > 28) {
    return { error: "월 시작일은 1~28 사이여야 합니다." };
  }
  if (weekStartDay < 0 || weekStartDay > 6) {
    return { error: "주 시작 요일이 올바르지 않습니다." };
  }

  try {
    await db.pigMoneySettings.upsert({
      where: { userId: user.id },
      update: { monthStartDay, weekStartDay },
      create: {
        userId: user.id!,
        monthStartDay,
        weekStartDay,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Update Settings Error:", error);
    return { error: "설정 저장 중 오류가 발생했습니다." };
  }
}
