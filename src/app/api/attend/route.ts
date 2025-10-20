import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 참석 정보 저장
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = (body?.name ?? "").trim();
    const is_come = (body?.is_come ?? "").trim(); // "참석" | "불참"

    if (!name || !is_come) {
      return NextResponse.json(
        { error: "이름과 참석 여부를 입력해주세요." },
        { status: 400 }
      );
    }

    if (name.length > 600) {
      return NextResponse.json(
        { error: "이름은 600자를 초과할 수 없습니다." },
        { status: 400 }
      );
    }

    // Prisma 모델 기반 저장
    const created = await prisma.come.create({
      data: {
        name,
        is_come,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating attend entry:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 목록 조회 (옵션)
export async function GET() {
  try {
    const rows = await prisma.come.findMany({
      orderBy: { idx: "desc" },
      select: { idx: true, name: true, is_come: true },
    });
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching attend entries:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
