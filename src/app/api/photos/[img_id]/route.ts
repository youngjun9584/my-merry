import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 좋아요 증가
export async function PUT(
  request: NextRequest,
  { params }: { params: { img_id: string } }
) {
  try {
    const { img_id } = params;

    if (!img_id) {
      return NextResponse.json(
        { error: "img_id가 필요합니다." },
        { status: 400 }
      );
    }

    // 좋아요 수 증가
    const updatedPhoto = await prisma.photo.upsert({
      where: { img_id },
      update: {
        like_count: {
          increment: 1,
        },
      },
      create: {
        img_id,
        like_count: 1,
      },
    });

    return NextResponse.json(updatedPhoto);
  } catch (error) {
    console.error("Error updating photo likes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 특정 사진 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { img_id: string } }
) {
  try {
    const { img_id } = params;

    const photo = await prisma.photo.findUnique({
      where: { img_id },
    });

    if (!photo) {
      return NextResponse.json(
        { error: "사진을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(photo);
  } catch (error) {
    console.error("Error fetching photo:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
