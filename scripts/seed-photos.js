const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("시작: photo 테이블에 초기 데이터 추가...");

  const photoIds = [
    "IMG_4919",
    "IMG_4981",
    "IMG_5097",
    "IMG_5127",
    "IMG_5282",
    "IMG_5355",
    "IMG_5573",
    "IMG_5667",
    "IMG_5853",
    "IMG_6080",
    "IMG_6104",
    "IMG_6145",
    "IMG_6303",
    "IMG_6391",
    "IMG_6473",
    "IMG_6484",
    "IMG_6766",
    "IMG_6800",
    "IMG_6910",
    "IMG_7025",
  ];

  // 기존 데이터 삭제
  await prisma.photo.deleteMany();
  console.log("기존 데이터 삭제 완료");

  // 각 사진에 대해 초기 좋아요 수 설정
  for (let i = 0; i < photoIds.length; i++) {
    const imgId = photoIds[i]; // 실제 파일명 사용
    const likeCount = Math.floor(Math.random() * 50) + 10; // 10-60 랜덤 좋아요

    await prisma.photo.create({
      data: {
        img_id: imgId,
        like_count: likeCount,
      },
    });

    console.log(`${imgId}: ${likeCount}개 좋아요 설정`);
  }

  console.log(`완료: ${photoIds.length}개의 photo 데이터가 추가되었습니다.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
