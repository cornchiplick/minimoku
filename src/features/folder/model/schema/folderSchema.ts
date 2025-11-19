import {z} from "zod";

export const folderSchema = z.object({
  name: z.string({required_error: "폴더 제목을 입력해주세요."}).trim(),
});

export type FolderSchemaType = z.infer<typeof folderSchema>;
