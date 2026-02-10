import { z } from "zod";

// 카테고리 Zod 스키마
export const categorySchema = z.object({
  name: z
    .string({ required_error: "카테고리명을 입력해주세요." })
    .trim()
    .min(1, "카테고리명을 입력해주세요.")
    .max(50, "카테고리명은 50자 이하로 입력해주세요."),
});

export type CategorySchemaType = z.infer<typeof categorySchema>;
