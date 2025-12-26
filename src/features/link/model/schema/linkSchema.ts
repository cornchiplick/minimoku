import {z} from "zod";

export const linkSchema = z.object({
  title: z.string({required_error: "링크 제목을 입력해주세요."}).trim().min(1, "링크 제목을 입력해주세요."),
  url: z
    .string({required_error: "링크 URL을 입력해주세요."})
    .trim()
    .min(1, "링크 URL을 입력해주세요.")
    .url("유효한 URL을 입력해주세요."),
  imageUrl: z.string().url("유효한 이미지 URL을 입력해주세요.").optional().or(z.literal("")),
  folderId: z.string({required_error: "폴더를 선택해주세요."}).min(1, "폴더를 선택해주세요.").refine(
    (val) => {
      const folderId = Number(val);
      return !isNaN(folderId);
    },
    {message: "올바르지 않은 폴더입니다."}
  ),
  tags: z.string().optional(),
  memo: z.string().optional().or(z.literal("")),
});

export type LinkSchemaType = z.infer<typeof linkSchema>;
