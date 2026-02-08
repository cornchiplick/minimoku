import db from "@/shared/lib/db";
import {NextResponse} from "next/server";

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const userId = Number(searchParams.get("userId")!);

  try {
    // 폴더 목록과 함께 각 폴더의 링크 개수를 조회
    const folders = await db.folder.findMany({
      select: {
        id: true,
        name: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {links: true},
        },
      },
      where: {
        userId: userId,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    // _count.links를 count 필드로 변환하여 기존 인터페이스와 호환
    const foldersWithCount = folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      sortOrder: folder.sortOrder,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
      count: folder._count.links,
    }));

    return NextResponse.json(foldersWithCount, {status: 200});
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json({error: "폴더 조회 실패"}, {status: 500});
  }
}
