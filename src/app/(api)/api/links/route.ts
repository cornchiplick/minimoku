import db from "@/shared/lib/db";
import {NextResponse} from "next/server";

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const userId = Number(searchParams.get("userId")!);
  let folderId = null;
  const value = searchParams.get("folderId");
  if (value) {
    folderId = Number(value);
  }

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
          userId: userId,
        },
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
