import {z} from "zod";

export const linkSchema = z.object({
  title: z.string({error: "링크 제목을 입력해주세요."}).trim().min(1, "링크 제목을 입력해주세요."),
  // zod 4 부터 문자열 포맷 검증은 최상위 함수(z.url 등)를 쓴다 — .url() 메서드는 폐지 예정
  url: z
    .string({error: "링크 URL을 입력해주세요."})
    .trim()
    .min(1, "링크 URL을 입력해주세요.")
    .pipe(z.url("유효한 URL을 입력해주세요.")),
  imageUrl: z.union([z.url("유효한 이미지 URL을 입력해주세요."), z.literal("")]).optional(),
  folderId: z
    .string({error: "폴더를 선택해주세요."})
    .min(1, "폴더를 선택해주세요.")
    .refine(
      (val) => {
        const folderId = Number(val);
        return !isNaN(folderId);
      },
      {message: "올바르지 않은 폴더입니다."}
    ),
  tags: z.array(z.string()),
  memo: z.string().optional().or(z.literal("")),
});

export type LinkSchemaType = z.infer<typeof linkSchema>;
