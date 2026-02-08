-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- 기존 폴더들에 createdAt 순서대로 sortOrder 값 할당
WITH ranked_folders AS (
  SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY "userId" ORDER BY "createdAt" ASC) - 1 AS new_sort_order
  FROM "Folder"
)
UPDATE "Folder"
SET "sortOrder" = ranked_folders.new_sort_order
FROM ranked_folders
WHERE "Folder".id = ranked_folders.id;
