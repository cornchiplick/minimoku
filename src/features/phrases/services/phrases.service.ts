"use server";

import db from "@/shared/lib/db";
import {getSessionUser} from "@/shared/lib/utils/authUtils";

interface GetPhrasesParams {
  searchType?: string;
  keyword?: string;
  order?: string;
}

// export async function getPhrases(page: number) {
export async function getPhrases({searchType, keyword, order}: GetPhrasesParams) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const orderColumn = order === "asc" ? "asc" : "desc";
  const isCorrectSearchType =
    !!searchType && ["japanese", "romaji", "pronunciation", "translation"].includes(searchType);

  const products = await db.phrase.findMany({
    select: {
      id: true,
      japanese: true,
      romaji: true,
      pronunciation: true,
      translation: true,
      createdAt: true,
      updatedAt: true,
      description: true,
    },
    where: {
      ...(isCorrectSearchType && keyword
        ? {
            [searchType]: {
              contains: keyword,
              mode: "insensitive", // 대소문자 구분 없이 검색
            },
          }
        : {}),
      userId: user.id,
    },
    // skip: page * 1,
    // take: 1,
    orderBy: {
      createdAt: orderColumn,
    },
  });
  return products;
}

export const deletePhrase = async (id: number) => {
  // const session = await getSession();
  // try {
  await db.phrase.delete({
    where: {
      id,
    },
  });
  // } catch (e) {}
};

interface GetPhraseParams {
  id: string;
}

export async function getPhrase({id}: GetPhraseParams) {
  if (!id || isNaN(Number(id))) {
    return null;
  }

  const phrase = await db.phrase.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      japanese: true,
      romaji: true,
      pronunciation: true,
      translation: true,
      createdAt: true,
      updatedAt: true,
      description: true,
    },
  });

  if (!phrase) {
    return null;
  }

  return phrase;
}
