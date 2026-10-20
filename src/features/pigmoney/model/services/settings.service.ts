"use server";

import {PigMoneySettingsInterface} from "@/entities/pigmoney/types";
import {cacheTags} from "@/shared/lib/cacheTags";
import {DEFAULT_MONTH_START_DAY, DEFAULT_WEEK_START_DAY} from "@/shared/constants/pigmoney";
import db from "@/shared/lib/db";
import {getSessionUser} from "@/shared/lib/utils/authUtils";
import {cacheLife, cacheTag, revalidateTag} from "next/cache";

// 설정 조회 (없으면 기본값으로 생성 후 반환)
export async function getSettings(): Promise<PigMoneySettingsInterface> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  // 세션 확인은 캐시 밖에서 한다 (캐시 범위 안에서는 cookies/headers 에 접근할 수 없다)
  const cached = await getCachedSettings(user.id!);
  if (cached) {
    return cached;
  }

  // 설정이 없으면 기본값으로 생성한다 (쓰기는 캐시 범위 밖에서 해야 한다)
  const created = await db.pigMoneySettings.create({
    data: {
      userId: user.id!,
      monthStartDay: DEFAULT_MONTH_START_DAY,
      weekStartDay: DEFAULT_WEEK_START_DAY,
    },
  });

  revalidateTag(cacheTags.settings(user.id!), "max");

  return {
    id: created.id,
    monthStartDay: created.monthStartDay,
    weekStartDay: created.weekStartDay,
  };
}

// 설정 조회 본문 — 사용자별 태그를 달아 캐시한다
async function getCachedSettings(userId: number): Promise<PigMoneySettingsInterface | null> {
  "use cache";
  cacheTag(cacheTags.settings(userId));
  cacheLife("max");

  const settings = await db.pigMoneySettings.findUnique({
    where: {userId},
  });

  if (!settings) {
    return null;
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
    return {error: "월 시작일은 1~28 사이여야 합니다."};
  }
  if (weekStartDay < 0 || weekStartDay > 6) {
    return {error: "주 시작 요일이 올바르지 않습니다."};
  }

  try {
    await db.pigMoneySettings.upsert({
      where: {userId: user.id},
      update: {monthStartDay, weekStartDay},
      create: {
        userId: user.id!,
        monthStartDay,
        weekStartDay,
      },
    });

    revalidateTag(cacheTags.settings(user.id!), "max");
    // 월·주 경계가 바뀌므로 집계 결과도 다시 계산해야 한다
    revalidateTag(cacheTags.cashRecords(user.id!), "max");

    return {success: true};
  } catch (error) {
    console.error("Update Settings Error:", error);
    return {error: "설정 저장 중 오류가 발생했습니다."};
  }
}
