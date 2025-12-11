import {z} from "zod";

export const linkSearchSchema = z.object({
  keyword: z
    .string({required_error: "검색어를 입력해주세요."})
    .trim()
    .min(1, "검색어를 입력해주세요."),
});

export type LinkSearchSchemaType = z.infer<typeof linkSearchSchema>;
