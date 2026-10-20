"use server";

import {PigMoneySettingsInterface} from "@/entities/pigmoney/types";
import {DEFAULT_MONTH_START_DAY, DEFAULT_WEEK_START_DAY} from "@/shared/constants/pigmoney";
import {cacheTags} from "@/shared/lib/cacheTags";
import db from "@/shared/lib/db";
import {getSessionUser} from "@/shared/lib/utils/authUtils";
import {cacheLife, cacheTag, updateTag} from "next/cache";

// 설정 조회 (저장된 값이 없으면 기본값)
export async function getSettings(): Promise<PigMoneySettingsInterface> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  // 세션 확인은 캐시 밖에서 한다 (캐시 범위 안에서는 cookies/headers 에 접근할 수 없다)
  return getCachedSettings(user.id!);
}

/**
 * 설정 조회 본문 — 사용자별 태그를 달아 캐시한다.
 *
 * 행이 없을 때 만들어 두지 않고 기본값을 돌려준다. 조회는 렌더 중에 일어나는데
 * 그 안에서는 DB 를 바꿔서도, 캐시를 무효화해서도 안 되기 때문이다.
 * 행은 첫 저장(updateSettings 의 upsert) 때 생긴다.
 */
async function getCachedSettings(userId: number): Promise<PigMoneySettingsInterface> {
  "use cache";
  cacheTag(cacheTags.settings(userId));
  cacheLife("max");

  const settings = await db.pigMoneySettings.findUnique({
    where: {userId},
  });

  return {
    monthStartDay: settings?.monthStartDay ?? DEFAULT_MONTH_START_DAY,
    weekStartDay: settings?.weekStartDay ?? DEFAULT_WEEK_START_DAY,
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

    updateTag(cacheTags.settings(user.id!));
    // 월·주 경계가 바뀌므로 집계 결과도 다시 계산해야 한다
    updateTag(cacheTags.cashRecords(user.id!));

    return {success: true};
  } catch (error) {
    console.error("Update Settings Error:", error);
    return {error: "설정 저장 중 오류가 발생했습니다."};
  }
}
