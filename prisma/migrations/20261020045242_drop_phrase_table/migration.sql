-- jpStudy 서비스 제거에 따른 Phrase 테이블 삭제
-- 적용 순서 주의: 이 마이그레이션은 lambda/guest-reset 재배포 "이후"에 적용해야 한다.
-- (배포 중인 Lambda 가 phrase.deleteMany 를 호출하고 있으면 04:00 실행이 실패한다)

-- DropForeignKey
ALTER TABLE "Phrase" DROP CONSTRAINT IF EXISTS "Phrase_userId_fkey";

-- DropTable
DROP TABLE IF EXISTS "Phrase";
