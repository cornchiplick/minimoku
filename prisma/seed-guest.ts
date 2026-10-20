import {PrismaClient} from "@prisma/client";
import {seedGuestShowcase} from "./guest-showcase";

// 게스트 User 1행과 체험용 샘플 데이터를 시드한다.
// 운영 정책: 모든 비로그인 사용자가 이 단일 계정을 공유한다 (정책 A).
// 매일 04:00 KST 에 lambda/guest-reset 이 데이터를 비우고 같은 샘플로 다시 채운다.
const prisma = new PrismaClient();

const GUEST_PROVIDER = "guest";
const GUEST_PROVIDER_ID = "guest";

/** 게스트 계정에 딸린 도메인 데이터를 모두 지운다 (User 행 자체는 보존) */
async function clearGuestData(userId: number) {
  const folders = await prisma.folder.findMany({where: {userId}, select: {id: true}});
  const folderIds = folders.map((f) => f.id);

  await prisma.$transaction(async (tx) => {
    if (folderIds.length > 0) {
      await tx.link.deleteMany({where: {folderId: {in: folderIds}}});
    }
    await tx.folder.deleteMany({where: {userId}});
    await tx.cashRecord.deleteMany({where: {userId}});
    await tx.category.deleteMany({where: {userId}});
    await tx.pigMoneySettings.deleteMany({where: {userId}});
  });
}

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

  // 여러 번 실행해도 같은 상태가 되도록, 비우고 다시 심는다
  await clearGuestData(guest.id);
  const counts = await seedGuestShowcase(prisma, guest.id);

  console.log(`[seed-guest] guest user id = ${guest.id}`);
  console.log(
    `[seed-guest] 샘플 데이터: 폴더 ${counts.folders} · 링크 ${counts.links} · ` +
      `카테고리 ${counts.categories} · 거래 ${counts.cashRecords}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
