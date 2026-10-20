"use server";

import {cacheTags} from "@/shared/lib/cacheTags";
import {cacheLife, cacheTag, revalidateTag} from "next/cache";
import {z} from "zod";
import {categorySchema} from "@/features/pigmoney/model/schema/categorySchema";
import {DEFAULT_CATEGORIES} from "@/shared/constants/pigmoney";
import db from "@/shared/lib/db";
import {getSessionUser} from "@/shared/lib/utils/authUtils";

// 카테고리 목록 조회
export async function getCategories() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }
  return getCachedCategories(user.id!);
}

async function getCachedCategories(userId: number) {
  "use cache";
  cacheTag(cacheTags.categories(userId));
  cacheLife("max");

  return db.category.findMany({
    where: {userId},
    orderBy: {name: "asc"},
  });
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
      where: {userId: user.id},
    });

    if (existingCount > 0) return;

    // 기본 카테고리 일괄 생성
    await db.category.createMany({
      data: DEFAULT_CATEGORIES.map((name) => ({
        name,
        userId: user.id!,
      })),
    });

    // seed 직후 getCategories 로 다시 조회하므로 별도 갱신 처리가 필요 없다
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

  const data = {name: formData.get("name")};

  // 스키마 검증
  const result = categorySchema.safeParse(data);
  if (!result.success) {
    return z.flattenError(result.error);
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
      return {_form: "이미 존재하는 카테고리입니다."};
    }

    await db.category.create({
      data: {
        name: result.data.name,
        userId: user.id!,
      },
    });

    revalidateTag(cacheTags.categories(user.id!), "max");
    revalidateTag(cacheTags.cashRecords(user.id!), "max");
    return {success: true};
  } catch (error) {
    console.error("Post Category Error:", error);
    return {_form: "카테고리 추가 중 오류가 발생했습니다."};
  }
}

// 카테고리 수정
export async function updateCategory(formData: FormData) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const categoryId = Number(formData.get("categoryId"));
  const data = {name: formData.get("name")};

  // 스키마 검증
  const result = categorySchema.safeParse(data);
  if (!result.success) {
    return z.flattenError(result.error);
  }

  try {
    // 소유권 확인
    const existing = await db.category.findFirst({
      where: {id: categoryId, userId: user.id},
    });

    if (!existing) {
      return {_form: "존재하지 않는 카테고리이거나 권한이 없습니다."};
    }

    // 동일한 이름 중복 확인
    const duplicate = await db.category.findFirst({
      where: {
        name: result.data.name,
        userId: user.id!,
        id: {not: categoryId},
      },
    });

    if (duplicate) {
      return {_form: "이미 존재하는 카테고리 이름입니다."};
    }

    await db.category.update({
      where: {id: categoryId},
      data: {name: result.data.name},
    });

    revalidateTag(cacheTags.categories(user.id!), "max");
    revalidateTag(cacheTags.cashRecords(user.id!), "max");
    return {success: true};
  } catch (error) {
    console.error("Update Category Error:", error);
    return {_form: "카테고리 수정 중 오류가 발생했습니다."};
  }
}

// 카테고리 삭제
export async function deleteCategory({categoryId}: {categoryId: number}) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    // 소유권 확인
    const existing = await db.category.findFirst({
      where: {id: categoryId, userId: user.id},
    });

    if (!existing) {
      return {error: "존재하지 않는 카테고리이거나 권한이 없습니다."};
    }

    // 연결된 거래가 있는지 확인
    const linkedCount = await db.cashRecord.count({
      where: {categoryId},
    });

    if (linkedCount > 0) {
      return {error: `이 카테고리에 ${linkedCount}개의 거래가 연결되어 있어 삭제할 수 없습니다.`};
    }

    await db.category.delete({
      where: {id: categoryId},
    });

    revalidateTag(cacheTags.categories(user.id!), "max");
    revalidateTag(cacheTags.cashRecords(user.id!), "max");
    return {success: true};
  } catch (error) {
    console.error("Delete Category Error:", error);
    return {error: "카테고리 삭제 중 오류가 발생했습니다."};
  }
}
