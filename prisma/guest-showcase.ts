import type {PrismaClient} from "@prisma/client";
import showcaseJson from "./guest-showcase.json";

/** JSON 리터럴에서 추론되는 유니온 타입 대신 명시적 형태를 쓴다 (선택 필드가 일부 항목에만 있기 때문) */
interface ShowcaseLink {
  title: string;
  url: string;
  tags: string[];
  dayOffset: number;
  memo?: string;
  isFavorite?: boolean;
  isRead?: boolean;
  isAlarm?: boolean;
}

interface ShowcaseFolder {
  name: string;
  sortOrder: number;
  links: ShowcaseLink[];
}

interface ShowcaseRecord {
  dayOffset: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  description: string;
  amount: number;
  note?: string;
}

interface Showcase {
  folders: ShowcaseFolder[];
  categories: string[];
  settings: {monthStartDay: number; weekStartDay: number};
  cashRecords: ShowcaseRecord[];
}

const showcase = showcaseJson as unknown as Showcase;

/**
 * 게스트(체험) 계정에 심는 샘플 데이터.
 *
 * 체험 모드로 들어온 방문자가 빈 화면 대신 실제로 쓰이는 모습의 화면을 보게 하는 것이 목적이다.
 * 매일 04:00 KST 에 lambda/guest-reset 이 게스트 데이터를 지운 뒤 이 함수로 다시 심는다.
 *
 * 날짜는 JSON 에 절대값이 아니라 `dayOffset`(오늘로부터 며칠 전)으로 적혀 있다.
 * 그래야 몇 달이 지나도 항상 "최근 데이터"로 보인다.
 *
 * 이 파일과 guest-showcase.json 은 lambda/guest-reset 빌드 시 복사되어 함께 쓰인다
 * (lambda/guest-reset/package.json 의 build 스크립트 참고).
 */

/** 트랜잭션 클라이언트와 일반 클라이언트 양쪽에서 쓸 수 있도록 메서드만 추린 타입 */
type DbClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends">;

/** 오늘 00:00(로컬) 기준으로 n일 전 날짜 */
function daysAgo(offset: number, base: Date): Date {
  const d = new Date(base);
  d.setHours(12, 0, 0, 0); // 시간대 경계에서 날짜가 밀리지 않도록 정오로 고정
  d.setDate(d.getDate() - offset);
  return d;
}

export async function seedGuestShowcase(db: DbClient, userId: number, now = new Date()) {
  // ── LinkLocker: 폴더와 링크 ────────────────────────────────
  for (const folder of showcase.folders) {
    const created = await db.folder.create({
      data: {
        name: folder.name,
        sortOrder: folder.sortOrder,
        count: folder.links.length,
        userId,
      },
    });

    for (const link of folder.links) {
      await db.link.create({
        data: {
          title: link.title,
          url: link.url,
          tags: link.tags ?? [],
          memo: link.memo ?? null,
          isFavorite: link.isFavorite ?? false,
          isRead: link.isRead ?? false,
          isAlarm: link.isAlarm ?? false,
          createdAt: daysAgo(link.dayOffset, now),
          folderId: created.id,
        },
      });
    }
  }

  // ── PigMoney: 카테고리 ─────────────────────────────────────
  const categoryIdByName = new Map<string, number>();
  for (const name of showcase.categories) {
    const category = await db.category.create({data: {name, userId}});
    categoryIdByName.set(name, category.id);
  }

  // ── PigMoney: 거래 내역 ────────────────────────────────────
  await db.cashRecord.createMany({
    data: showcase.cashRecords.map((record) => {
      const categoryId = categoryIdByName.get(record.category);
      if (!categoryId) {
        throw new Error(`[guest-showcase] 알 수 없는 카테고리: ${record.category}`);
      }
      return {
        type: record.type,
        date: daysAgo(record.dayOffset, now),
        description: record.description,
        amount: record.amount,
        note: record.note ?? null,
        userId,
        categoryId,
      };
    }),
  });

  // ── PigMoney: 사용자 설정 ──────────────────────────────────
  await db.pigMoneySettings.create({
    data: {
      monthStartDay: showcase.settings.monthStartDay,
      weekStartDay: showcase.settings.weekStartDay,
      userId,
    },
  });

  return {
    folders: showcase.folders.length,
    links: showcase.folders.reduce((sum, f) => sum + f.links.length, 0),
    categories: showcase.categories.length,
    cashRecords: showcase.cashRecords.length,
  };
}
