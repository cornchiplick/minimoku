import db from "@/shared/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const userId = Number(searchParams.get("userId")!);

  try {
    const categories = await db.category.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "카테고리 조회 실패" }, { status: 500 });
  }
}
