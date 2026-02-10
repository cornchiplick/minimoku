import db from "@/shared/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const userId = Number(searchParams.get("userId")!);
  const type = searchParams.get("type"); // "INCOME" | "EXPENSE" | null
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  try {
    const cashRecords = await db.cashRecord.findMany({
      where: {
        userId,
        // 타입 필터
        ...(type && { type: type as "INCOME" | "EXPENSE" }),
        // 날짜 구간 필터
        ...(fromDate &&
          toDate && {
            date: {
              gte: new Date(fromDate),
              lte: new Date(toDate),
            },
          }),
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(cashRecords, { status: 200 });
  } catch (error) {
    console.error("Error fetching cash records:", error);
    return NextResponse.json({ error: "거래 조회 실패" }, { status: 500 });
  }
}
