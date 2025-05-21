"use server";

import db from "@/lib/db";

// export async function getPhrases(page: number) {
export async function getPhrases() {
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
    // skip: page * 1,
    // take: 1,
    orderBy: {
      createdAt: "desc",
    },
  });
  console.log("products : ", products);
  return products;
}
