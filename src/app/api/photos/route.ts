import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 모든 사진의 좋아요 수 조회
export async function GET() {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: {
        img_id: "asc",
      },
    });

    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 새 사진 데이터 생성 (초기 설정용)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { img_id, like_count = 0 } = body;

    if (!img_id) {
      return NextResponse.json(
        { error: "img_id가 필요합니다." },
        { status: 400 }
      );
    }

    const photo = await prisma.photo.create({
      data: {
        img_id,
        like_count,
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error("Error creating photo:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
