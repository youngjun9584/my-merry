import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const guestBooks = await prisma.guestBook.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(guestBooks);
  } catch (error) {
    console.error("Error fetching guestbook entries:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, relationship, message, to, password } = body;

    // 입력값 검증
    if (!name || !message || !to || !password) {
      return NextResponse.json(
        { error: "필수 필드가 누락되었습니다." },
        { status: 400 }
      );
    }

    if (!["신랑", "신부"].includes(to)) {
      return NextResponse.json(
        { error: "유효하지 않은 수신자입니다." },
        { status: 400 }
      );
    }

    const guestBook = await prisma.guestBook.create({
      data: {
        name,
        relationship: relationship || null,
        message,
        to,
        password,
      },
    });

    // 비밀번호는 응답에서 제외
    const { password: _, ...guestBookWithoutPassword } = guestBook;

    return NextResponse.json(guestBookWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Error creating guestbook entry:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
