"use server";

import db from "@/lib/db";
import {z} from "zod";

const formSchema = z.object({
  japanese: z.string({required_error: "일본어 원문을 입력해주세요."}).trim(),
  romaji: z.string().trim(),
  pronunciation: z.string().trim(),
  translation: z.string().trim(),
});

export const addCardAction = async (formData: FormData) => {
  const data = {
    japanese: formData.get("japanese"),
    romaji: formData.get("romaji"),
    pronunciation: formData.get("pronunciation"),
    translation: formData.get("translation"),
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    // const card = await db.phrase.create({
    await db.phrase.create({
      data: {
        japanese: result.data.japanese,
        romaji: result.data.romaji,
        pronunciation: result.data.pronunciation,
        translation: result.data.translation,
      },
    });
  }
};
