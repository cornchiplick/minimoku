import {PrismaClient} from "@prisma/client";

// 매일 04:00 KST 에 EventBridge 가 트리거하여 게스트 계정의 데이터를 초기화한다.
// 운영 정책 (정책 A): 단일 게스트 User 1행을 모든 게스트가 공유.
// User row 자체는 보존하고, 그에 종속된 도메인 데이터만 비운다.
//
// Cloudflare 이미지 정리는 의도적으로 생략한다 — 게스트는 이미지 업로드가
// 서버 액션 단에서 차단되어 imageUrl 이 채워지지 않기 때문.
//
// EventBridge cron 표현식: cron(0 19 * * ? *)  (UTC 19:00 = KST 04:00)

// Lambda cold start 시 1회 생성
const prisma = new PrismaClient();

// 게스트 식별자 — src/shared/lib/utils/guestUtils.ts 와 prisma/seed-guest.ts 와 동일해야 함.
const GUEST_PROVIDER = "guest";
const GUEST_PROVIDER_ID = "guest";

// CashRecord/Category 등은 onDelete: Cascade 가 걸려있지 않은 모델도 있어
// 명시적 트랜잭션으로 일괄 삭제한다.
async function resetGuestData(guestUserId: number) {
  // 게스트 폴더 id 목록을 먼저 조회 (Link 가 Folder.id 로 종속되어 있음)
  const folders = await prisma.folder.findMany({
    where: {userId: guestUserId},
    select: {id: true},
  });
  const folderIds = folders.map((f) => f.id);

  await prisma.$transaction(async (tx) => {
    // LinkLocker
    if (folderIds.length > 0) {
      await tx.link.deleteMany({where: {folderId: {in: folderIds}}});
    }
    await tx.folder.deleteMany({where: {userId: guestUserId}});

    // jpStudy
    await tx.phrase.deleteMany({where: {userId: guestUserId}});

    // PigMoney
    await tx.cashRecord.deleteMany({where: {userId: guestUserId}});
    await tx.category.deleteMany({where: {userId: guestUserId}});
    await tx.pigMoneySettings.deleteMany({where: {userId: guestUserId}});

    // 다음날 진입 시 폴더가 없어 UX 가 어색해지지 않도록 기본 폴더 1개 재생성
    await tx.folder.create({
      data: {
        name: "기본",
        userId: guestUserId,
      },
    });
  });
}

export const handler = async (): Promise<{ok: boolean; deletedFor?: number; error?: string}> => {
  try {
    const guest = await prisma.user.findUnique({
      where: {
        provider_provider_id: {
          provider: GUEST_PROVIDER,
          provider_id: GUEST_PROVIDER_ID,
        },
      },
      select: {id: true},
    });

    if (!guest) {
      console.error("[guest-reset] 게스트 User 가 시드되지 않았습니다.");
      return {ok: false, error: "guest user not seeded"};
    }

    await resetGuestData(guest.id);
    console.log(`[guest-reset] guest user ${guest.id} 데이터 초기화 완료`);
    return {ok: true, deletedFor: guest.id};
  } catch (e) {
    console.error("[guest-reset] 초기화 실패", e);
    return {ok: false, error: e instanceof Error ? e.message : String(e)};
  }
};
