"use server";

import db from "@/lib/db";

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
