"use server";

import { CategoryInterface } from "@/entities/pigmoney/types";
import { categorySchema } from "@/features/pigmoney/model/schema/categorySchema";
import { APIConstants } from "@/shared/constants/api";
import { DEFAULT_CATEGORIES } from "@/shared/constants/pigmoney";
import db from "@/shared/lib/db";
import { getSessionUser } from "@/shared/lib/utils/authUtils";
import { getQueryString, getTags } from "@/shared/lib/utils/commonUtils";
import { fetchAPI } from "@/shared/utils/fetchAPI";
import { revalidateTag } from "next/cache";

// 카테고리 목록 조회
export async function getCategories(
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

  const res = await fetchAPI<CategoryInterface[]>(
    `/api/${APIConstants.API_CATEGORIES}${getQueryString({ ...params, userId: user.id! })}`,
    {
      method: "GET",
      revalidate: revalidateTime,
      next: { tags: [getTags(user.id!, APIConstants.API_CATEGORIES)] },
    },
  );

  return res ?? [];
}

// 기본 카테고리 생성 (첫 접속 시)
export async function seedDefaultCategories() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    // 이미 카테고리가 있으면 스킵
    const existingCount = await db.category.count({
      where: { userId: user.id },
    });

    if (existingCount > 0) return;

    // 기본 카테고리 일괄 생성
    await db.category.createMany({
      data: DEFAULT_CATEGORIES.map((name) => ({
        name,
        userId: user.id!,
      })),
    });

    // 렌더링 중 호출되므로 revalidateTag 사용 불가 — seed 직후 getCategories로 조회하므로 불필요
  } catch (error) {
    console.error("Seed Categories Error:", error);
  }
}

// 카테고리 추가
export async function postCategory(formData: FormData) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const data = { name: formData.get("name") };

  // 스키마 검증
  const result = categorySchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  }

  try {
    // 동일한 이름의 카테고리가 있는지 확인
    const existing = await db.category.findUnique({
      where: {
        name_userId: {
          name: result.data.name,
          userId: user.id!,
        },
      },
    });

    if (existing) {
      return { _form: "이미 존재하는 카테고리입니다." };
    }

    await db.category.create({
      data: {
        name: result.data.name,
        userId: user.id!,
      },
    });

    revalidateTag(getTags(user.id!, APIConstants.API_CATEGORIES));
    return { success: true };
  } catch (error) {
    console.error("Post Category Error:", error);
    return { _form: "카테고리 추가 중 오류가 발생했습니다." };
  }
}

// 카테고리 수정
export async function updateCategory(formData: FormData) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const categoryId = Number(formData.get("categoryId"));
  const data = { name: formData.get("name") };

  // 스키마 검증
  const result = categorySchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  }

  try {
    // 소유권 확인
    const existing = await db.category.findFirst({
      where: { id: categoryId, userId: user.id },
    });

    if (!existing) {
      return { _form: "존재하지 않는 카테고리이거나 권한이 없습니다." };
    }

    // 동일한 이름 중복 확인
    const duplicate = await db.category.findFirst({
      where: {
        name: result.data.name,
        userId: user.id!,
        id: { not: categoryId },
      },
    });

    if (duplicate) {
      return { _form: "이미 존재하는 카테고리 이름입니다." };
    }

    await db.category.update({
      where: { id: categoryId },
      data: { name: result.data.name },
    });

    revalidateTag(getTags(user.id!, APIConstants.API_CATEGORIES));
    return { success: true };
  } catch (error) {
    console.error("Update Category Error:", error);
    return { _form: "카테고리 수정 중 오류가 발생했습니다." };
  }
}

// 카테고리 삭제
export async function deleteCategory({ categoryId }: { categoryId: number }) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    // 소유권 확인
    const existing = await db.category.findFirst({
      where: { id: categoryId, userId: user.id },
    });

    if (!existing) {
      return { error: "존재하지 않는 카테고리이거나 권한이 없습니다." };
    }

    // 연결된 거래가 있는지 확인
    const linkedCount = await db.cashRecord.count({
      where: { categoryId },
    });

    if (linkedCount > 0) {
      return { error: `이 카테고리에 ${linkedCount}개의 거래가 연결되어 있어 삭제할 수 없습니다.` };
    }

    await db.category.delete({
      where: { id: categoryId },
    });

    revalidateTag(getTags(user.id!, APIConstants.API_CATEGORIES));
    return { success: true };
  } catch (error) {
    console.error("Delete Category Error:", error);
    return { error: "카테고리 삭제 중 오류가 발생했습니다." };
  }
}
