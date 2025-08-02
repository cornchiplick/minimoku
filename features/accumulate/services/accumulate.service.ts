"use server";

import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import {getServerSession} from "next-auth";
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
  }

  // 서버에서 유저 세션정보 가져오기
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("로그인이 필요합니다.");
  }

  // user 추출
  const user = await db.user.findUnique({
    where: {
      provider_provider_id: {
        provider: session.user.provider!,
        provider_id: session.user.id!,
      },
    },
  });

  if (!user) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  // insert phrase
  await db.phrase.create({
    data: {
      japanese: result.data.japanese,
      romaji: result.data.romaji,
      pronunciation: result.data.pronunciation,
      translation: result.data.translation,
      userId: user.id,
    },
  });
};
