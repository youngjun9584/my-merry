import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const guests = await prisma.guest.findMany({
      orderBy: {
        idx: "desc",
      },
    });

    return NextResponse.json(guests);
  } catch (error) {
    console.error("Error fetching guest entries:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, content } = body;

    // 입력값 검증
    if (!name || !content) {
      return NextResponse.json(
        { error: "이름과 내용을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    // 이름과 내용 길이 검증
    if (name.length > 50) {
      return NextResponse.json(
        { error: "이름은 50자를 초과할 수 없습니다." },
        { status: 400 }
      );
    }

    if (content.length > 600) {
      return NextResponse.json(
        { error: "내용은 600자를 초과할 수 없습니다." },
        { status: 400 }
      );
    }

    const guest = await prisma.guest.create({
      data: {
        name,
        content,
      },
    });

    return NextResponse.json(guest, { status: 201 });
  } catch (error) {
    console.error("Error creating guest entry:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
