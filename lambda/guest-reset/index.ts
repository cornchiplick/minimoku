import {PrismaClient} from "@prisma/client";
import {seedGuestShowcase} from "./guest-showcase";

// 매일 04:00 KST 에 EventBridge 가 트리거하여 게스트 계정의 데이터를 초기화한다.
// "비우기"가 아니라 "체험용 샘플 상태로 되돌리기"다 — 방문자가 빈 화면 대신
// 실제로 쓰이는 모습의 화면을 보게 하기 위함.
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

    // PigMoney
    await tx.cashRecord.deleteMany({where: {userId: guestUserId}});
    await tx.category.deleteMany({where: {userId: guestUserId}});
    await tx.pigMoneySettings.deleteMany({where: {userId: guestUserId}});
  });
}

/**
 * 샘플 날짜의 기준이 되는 "오늘".
 *
 * 이 함수는 19:00 UTC(= 04:00 KST)에 돌기 때문에, 그냥 `new Date()` 를 쓰면 UTC 로는
 * 아직 전날이다. 그러면 dayOffset 0 인 기록이 한국 사용자에게 "어제" 로 보이고,
 * 달력의 오늘 표시가 가리키는 날에는 아무것도 없게 된다.
 * 9시간을 더해 날짜 부분이 한국 날짜와 맞게 한다 (Lambda 의 로컬 시간대는 UTC 고정).
 */
const kstToday = () => new Date(Date.now() + 9 * 60 * 60 * 1000);

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

    // 비운 뒤 체험용 샘플을 다시 심는다. 빈 화면이 아니라 실제로 쓰이는 모습을 보여주는 것이 목적이다.
    // 시드는 쓰기가 60여 건이라 위 삭제 트랜잭션 밖에서 한다 (트랜잭션 제한 시간에 걸리지 않도록).
    const counts = await seedGuestShowcase(prisma, guest.id, kstToday());

    console.log(
      `[guest-reset] guest user ${guest.id} 초기화 완료 — ` +
        `폴더 ${counts.folders} · 링크 ${counts.links} · ` +
        `카테고리 ${counts.categories} · 거래 ${counts.cashRecords}`
    );
    return {ok: true, deletedFor: guest.id};
  } catch (e) {
    console.error("[guest-reset] 초기화 실패", e);
    return {ok: false, error: e instanceof Error ? e.message : String(e)};
  }
};
