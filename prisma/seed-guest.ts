import {PrismaClient} from "@prisma/client";

// 게스트 User 1행을 시드한다.
// 운영 정책: 모든 비로그인 사용자가 이 단일 계정을 공유한다 (정책 A).
// 매일 04:00 KST에 lambda/guest-reset 이 이 계정에 종속된 데이터를 일괄 삭제한다.
const prisma = new PrismaClient();

const GUEST_PROVIDER = "guest";
const GUEST_PROVIDER_ID = "guest";

async function main() {
  // upsert 로 idempotent 보장
  const guest = await prisma.user.upsert({
    where: {
      provider_provider_id: {
        provider: GUEST_PROVIDER,
        provider_id: GUEST_PROVIDER_ID,
      },
    },
    update: {},
    create: {
      username: "Guest",
      provider: GUEST_PROVIDER,
      provider_id: GUEST_PROVIDER_ID,
      avatar: null,
    },
  });

  // 게스트 전용 기본 폴더가 없다면 1개 생성 (LinkLocker 진입 시 비어있으면 폴더가 없어 UX가 어색함)
  const folderCount = await prisma.folder.count({where: {userId: guest.id}});
  if (folderCount === 0) {
    await prisma.folder.create({
      data: {
        name: "기본",
        userId: guest.id,
      },
    });
  }

  console.log(`[seed-guest] guest user id = ${guest.id}`);
  console.log(`[seed-guest] 다음 환경변수에 이 값을 설정하세요: GUEST_USER_ID=${guest.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
