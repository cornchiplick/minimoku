import { z } from "zod";
import { cashRecordSchema } from "./cashRecordSchema";

// 다중 거래 배치 스키마 (작성 시 사용)
export const cashRecordBatchSchema = z.object({
  records: z
    .array(cashRecordSchema)
    .min(1, "최소 1개의 거래를 입력해주세요."),
});

export type CashRecordBatchSchemaType = z.infer<typeof cashRecordBatchSchema>;
