"use server";

import {cacheTags} from "@/shared/lib/cacheTags";
import {cacheLife, cacheTag, updateTag} from "next/cache";
import {z} from "zod";
import {cashRecordSchema} from "@/features/pigmoney/model/schema/cashRecordSchema";
import {cashRecordBatchSchema} from "@/features/pigmoney/model/schema/cashRecordBatchSchema";
import db from "@/shared/lib/db";
import {getSessionUser} from "@/shared/lib/utils/authUtils";
import {toKSTEndOfDay, toKSTStartOfDay} from "@/shared/lib/utils/dateUtils";

// 거래 목록 조회
export async function getCashRecords(
  parameters: {
    params?: Record<string, string | number | boolean>;
  } = {}
) {
  const {params = {}} = parameters;

  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }
  return getCachedCashRecords(user.id!, params);
}

async function getCachedCashRecords(
  userId: number,
  params: Record<string, string | number | boolean>
) {
  "use cache";
  cacheTag(cacheTags.cashRecords(userId));
  cacheLife("hours");

  const type = typeof params.type === "string" ? params.type : null;
  const fromDate = typeof params.fromDate === "string" ? params.fromDate : null;
  const toDate = typeof params.toDate === "string" ? params.toDate : null;

  return db.cashRecord.findMany({
    where: {
      userId,
      // 타입 필터
      ...(type && {type: type as "INCOME" | "EXPENSE"}),
      // 날짜 구간 필터 (KST 기준 자정~23:59)
      ...(fromDate &&
        toDate && {
          date: {
            gte: toKSTStartOfDay(fromDate),
            lte: toKSTEndOfDay(toDate),
          },
        }),
    },
    include: {
      category: true,
    },
    orderBy: {
      date: "desc",
    },
  });
}

// 다중 거래 생성 (작성 모달)
export async function postCashRecords(formData: FormData) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  // JSON 문자열로 전달된 거래 목록 파싱
  const recordsString = formData.get("records") as string;
  let parsedRecords;
  try {
    parsedRecords = JSON.parse(recordsString);
  } catch {
    return {_form: "잘못된 데이터 형식입니다."};
  }

  // 배치 스키마 검증
  const result = cashRecordBatchSchema.safeParse({records: parsedRecords});
  if (!result.success) {
    return z.flattenError(result.error);
  }

  try {
    // 각 거래를 일괄 생성
    await db.cashRecord.createMany({
      data: result.data.records.map((record) => ({
        type: record.type,
        date: new Date(record.date),
        description: record.description,
        amount: Number(record.amount),
        note: record.note || null,
        categoryId: Number(record.categoryId),
        userId: user.id!,
      })),
    });

    updateTag(cacheTags.cashRecords(user.id!));
    return {success: true};
  } catch (error) {
    console.error("Post CashRecords Error:", error);
    return {_form: "거래 저장 중 오류가 발생했습니다."};
  }
}

// 단일 거래 수정
export async function updateCashRecord(formData: FormData) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const recordId = Number(formData.get("recordId"));

  const data = {
    type: formData.get("type"),
    date: formData.get("date"),
    categoryId: formData.get("categoryId"),
    description: formData.get("description"),
    amount: formData.get("amount"),
    note: formData.get("note"),
  };

  // 스키마 검증
  const result = cashRecordSchema.safeParse(data);
  if (!result.success) {
    return z.flattenError(result.error);
  }

  try {
    // 소유권 확인
    const existing = await db.cashRecord.findFirst({
      where: {id: recordId, userId: user.id},
    });

    if (!existing) {
      return {_form: "존재하지 않는 거래이거나 권한이 없습니다."};
    }

    await db.cashRecord.update({
      where: {id: recordId},
      data: {
        type: result.data.type,
        date: new Date(result.data.date),
        description: result.data.description,
        amount: Number(result.data.amount),
        note: result.data.note || null,
        categoryId: Number(result.data.categoryId),
      },
    });

    updateTag(cacheTags.cashRecords(user.id!));
    return {success: true};
  } catch (error) {
    console.error("Update CashRecord Error:", error);
    return {_form: "거래 수정 중 오류가 발생했습니다."};
  }
}

// 기간별 수입/지출 합계 조회 (사이드바 요약용)
export async function getCashRecordSummary({
  fromDate,
  toDate,
}: {
  fromDate: string;
  toDate: string;
}): Promise<{income: number; expense: number}> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  // KST 기준 날짜 범위를 UTC Date로 변환
  const rangeStart = toKSTStartOfDay(fromDate);
  const rangeEnd = toKSTEndOfDay(toDate);

  const [incomeResult, expenseResult] = await Promise.all([
    db.cashRecord.aggregate({
      where: {
        userId: user.id,
        type: "INCOME",
        date: {
          gte: rangeStart,
          lte: rangeEnd,
        },
      },
      _sum: {amount: true},
    }),
    db.cashRecord.aggregate({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: {
          gte: rangeStart,
          lte: rangeEnd,
        },
      },
      _sum: {amount: true},
    }),
  ]);

  return {
    income: incomeResult._sum.amount ?? 0,
    expense: expenseResult._sum.amount ?? 0,
  };
}

// 거래 삭제
export async function deleteCashRecord({recordId}: {recordId: number}) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    // 소유권 확인
    const existing = await db.cashRecord.findFirst({
      where: {id: recordId, userId: user.id},
    });

    if (!existing) {
      return {error: "존재하지 않는 거래이거나 권한이 없습니다."};
    }

    await db.cashRecord.delete({
      where: {id: recordId},
    });

    updateTag(cacheTags.cashRecords(user.id!));
    return {success: true};
  } catch (error) {
    console.error("Delete CashRecord Error:", error);
    return {error: "거래 삭제 중 오류가 발생했습니다."};
  }
}
