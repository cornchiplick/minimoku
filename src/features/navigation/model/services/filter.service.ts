"use server";

import {FilterConstants} from "@/shared/constants/navigation";
import db from "@/shared/lib/db";
import {getSessionUser} from "@/shared/lib/utils/authUtils";

// 필터별 읽지 않은 링크 개수를 조회하는 타입
export interface FilterCountResult {
  [FilterConstants.FILTER_ALL]: number;
  [FilterConstants.FILTER_UNREAD]: number;
  [FilterConstants.FILTER_FAVORITE]: number;
}

/**
 * 각 필터에 해당하는 읽지 않은 링크 개수를 조회하는 함수
 * - 전체: 모든 읽지 않은 링크 개수
 * - 읽지 않음: 읽지 않은 링크 개수 (전체와 동일)
 * - 즐겨찾기: 즐겨찾기 중 읽지 않은 링크 개수
 */
export async function getFilterCounts(): Promise<FilterCountResult> {
  const user = await getSessionUser();
  if (!user) {
    return {
      [FilterConstants.FILTER_ALL]: 0,
      [FilterConstants.FILTER_UNREAD]: 0,
      [FilterConstants.FILTER_FAVORITE]: 0,
    };
  }

  // 사용자의 모든 폴더 ID 조회
  const userFolders = await db.folder.findMany({
    where: {userId: user.id},
    select: {id: true},
  });

  const folderIds = userFolders.map((folder) => folder.id);

  // 필터별 읽지 않은 링크 개수 조회 (병렬 처리)
  const [allUnreadCount, favoriteUnreadCount] = await Promise.all([
    // 전체 읽지 않은 링크 개수
    db.link.count({
      where: {
        folderId: {in: folderIds},
        isRead: false,
      },
    }),
    // 즐겨찾기 중 읽지 않은 링크 개수
    db.link.count({
      where: {
        folderId: {in: folderIds},
        isRead: false,
        isFavorite: true,
      },
    }),
  ]);

  return {
    [FilterConstants.FILTER_ALL]: allUnreadCount,
    [FilterConstants.FILTER_UNREAD]: allUnreadCount,
    [FilterConstants.FILTER_FAVORITE]: favoriteUnreadCount,
  };
}
