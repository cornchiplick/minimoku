import {FilterConstants} from "@/shared/constants/navigation";
import db from "@/shared/lib/db";
import {NextResponse} from "next/server";

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);

  // 사용자 ID 가져오기
  const userId = Number(searchParams.get("userId")!);

  // folderId 파라미터 처리
  const folderIdParam = searchParams.get("folderId");
  const folderId =
    folderIdParam !== null && !Number.isNaN(Number(folderIdParam)) ? Number(folderIdParam) : null;

  // filter 처리
  const filterValue = validFilterValue(searchParams.get("filter"));

  try {
    const links = await db.link.findMany({
      select: {
        id: true,
        title: true,
        url: true,
        imageUrl: true,
        folderId: true,
        tags: true,
        isAlarm: true,
        isFavorite: true,
        isRead: true,
        createdAt: true,
        updatedAt: true,
        memo: true,
      },
      where: {
        folder: {
          ...(folderId !== null && {id: folderId}),
          userId,
        },
        ...(filterValue ?? {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(links, {status: 200});
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json({error: "링크 조회 실패"}, {status: 500});
  }
}

const validFilterValue = (filter: string | null) => {
  if (!filter) return null;

  switch (filter) {
    case FilterConstants.FILTER_UNREAD:
      return {isRead: false};
    case FilterConstants.FILTER_FAVORITE:
      return {isFavorite: true};
    default:
      return null;
  }
};
