"use server";

import { CashRecordInterface } from "@/entities/pigmoney/types";
import { cashRecordSchema } from "@/features/pigmoney/model/schema/cashRecordSchema";
import { cashRecordBatchSchema } from "@/features/pigmoney/model/schema/cashRecordBatchSchema";
import { APIConstants } from "@/shared/constants/api";
import db from "@/shared/lib/db";
import { getSessionUser } from "@/shared/lib/utils/authUtils";
import { getQueryString, getTags } from "@/shared/lib/utils/commonUtils";
import { fetchAPI } from "@/shared/utils/fetchAPI";
import { revalidateTag } from "next/cache";

// 거래 목록 조회
export async function getCashRecords(
  parameters: {
    revalidateTime?: number;
    params?: Record<string, string | number | boolean>;
  } = {},
) {
  const { revalidateTime = 10, params = {} } = parameters;

  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const res = await fetchAPI<CashRecordInterface[]>(
    `/api/${APIConstants.API_CASH_RECORDS}${getQueryString({ ...params, userId: user.id! })}`,
    {
      method: "GET",
      revalidate: revalidateTime,
      next: { tags: [getTags(user.id!, APIConstants.API_CASH_RECORDS)] },
    },
  );

  return res ?? [];
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
    return { _form: "잘못된 데이터 형식입니다." };
  }

  // 배치 스키마 검증
  const result = cashRecordBatchSchema.safeParse({ records: parsedRecords });
  if (!result.success) {
    return result.error.flatten();
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

    revalidateTag(getTags(user.id!, APIConstants.API_CASH_RECORDS));
    return { success: true };
  } catch (error) {
    console.error("Post CashRecords Error:", error);
    return { _form: "거래 저장 중 오류가 발생했습니다." };
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
    return result.error.flatten();
  }

  try {
    // 소유권 확인
    const existing = await db.cashRecord.findFirst({
      where: { id: recordId, userId: user.id },
    });

    if (!existing) {
      return { _form: "존재하지 않는 거래이거나 권한이 없습니다." };
    }

    await db.cashRecord.update({
      where: { id: recordId },
      data: {
        type: result.data.type,
        date: new Date(result.data.date),
        description: result.data.description,
        amount: Number(result.data.amount),
        note: result.data.note || null,
        categoryId: Number(result.data.categoryId),
      },
    });

    revalidateTag(getTags(user.id!, APIConstants.API_CASH_RECORDS));
    return { success: true };
  } catch (error) {
    console.error("Update CashRecord Error:", error);
    return { _form: "거래 수정 중 오류가 발생했습니다." };
  }
}

// 거래 삭제
export async function deleteCashRecord({ recordId }: { recordId: number }) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    // 소유권 확인
    const existing = await db.cashRecord.findFirst({
      where: { id: recordId, userId: user.id },
    });

    if (!existing) {
      return { error: "존재하지 않는 거래이거나 권한이 없습니다." };
    }

    await db.cashRecord.delete({
      where: { id: recordId },
    });

    revalidateTag(getTags(user.id!, APIConstants.API_CASH_RECORDS));
    return { success: true };
  } catch (error) {
    console.error("Delete CashRecord Error:", error);
    return { error: "거래 삭제 중 오류가 발생했습니다." };
  }
}
