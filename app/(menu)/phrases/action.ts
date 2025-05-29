"use server";

import db from "@/lib/db";

interface GetPhrasesParams {
  searchType?: string | undefined;
  keyword?: string;
}

// export async function getPhrases(page: number) {
export async function getPhrases({searchType, keyword}: GetPhrasesParams) {
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
    },
    // skip: page * 1,
    // take: 1,
    orderBy: {
      createdAt: "desc",
    },
  });
  console.log("products : ", products);
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
