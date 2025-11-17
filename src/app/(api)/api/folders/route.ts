import db from "@/shared/lib/db";
import {NextResponse} from "next/server";

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const userId = Number(searchParams.get("userId")!);

  try {
    const folders = await db.folder.findMany({
      select: {
        id: true,
        name: true,
        count: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        userId: userId,
      },
    });

    return NextResponse.json(folders, {status: 200});
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json({error: "폴더 조회 실패"}, {status: 500});
  }
}
