import { z } from "zod";

// 단일 거래 Zod 스키마 (수정 시 사용)
export const cashRecordSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"], {
    required_error: "수입/지출을 선택해주세요.",
  }),
  date: z.coerce.date({ required_error: "날짜를 선택해주세요." }),
  categoryId: z
    .string({ required_error: "카테고리를 선택해주세요." })
    .min(1, "카테고리를 선택해주세요.")
    .refine((val) => !isNaN(Number(val)), {
      message: "올바르지 않은 카테고리입니다.",
    }),
  description: z
    .string({ required_error: "내용을 입력해주세요." })
    .trim()
    .min(1, "내용을 입력해주세요.")
    .max(200, "내용은 200자 이하로 입력해주세요."),
  amount: z
    .string({ required_error: "금액을 입력해주세요." })
    .min(1, "금액을 입력해주세요.")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "금액은 양의 정수여야 합니다.",
    }),
  note: z.string().max(500, "비고는 500자 이하로 입력해주세요.").optional().or(z.literal("")),
});

export type CashRecordSchemaType = z.infer<typeof cashRecordSchema>;
