const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("시작: guest 테이블에 테스트 데이터 추가...");

  const guestData = [
    {
      name: "김민수",
      content:
        "결혼을 진심으로 축하드립니다! 두 분의 앞날에 행복만이 가득하길 바라며, 언제나 서로를 아끼고 사랑하는 부부가 되시길 기원합니다. 💕",
    },
    {
      name: "이영희",
      content:
        "오늘 이 기쁜날을 함께 할 수 있어서 정말 행복해요! 신랑님과 신부님 모두 너무 아름다우시고, 앞으로도 지금처럼 행복한 모습 변치 마세요~ 축하드려요! 🎉",
    },
    {
      name: "박철민",
      content:
        "두 분의 결혼을 축하합니다! 서로를 이해하고 배려하는 아름다운 가정을 이루시길 바랍니다. 항상 건강하고 행복하세요! ✨",
    },
    {
      name: "최수진",
      content:
        "정말 축하드려요! 두 분이 만나서 이런 아름다운 사랑을 이루어가는 모습을 보니 제 마음도 따뜻해집니다. 앞으로도 서로 의지하며 행복한 날들만 가득하길 바라요~ 💖",
    },
    {
      name: "정현우",
      content:
        "결혼 축하드립니다! 두 분의 사랑이 더욱 깊어지고, 함께하는 모든 날들이 기쁨과 감사로 가득하길 기원합니다. 행복한 신혼생활 되세요! 🌸",
    },
    {
      name: "한지영",
      content:
        "진심으로 축하드려요! 오늘부터 두 분이 함께 만들어갈 새로운 이야기들이 모두 행복하고 아름답기를 바랍니다. 언제나 지금처럼 사랑하세요! 💝",
    },
  ];

  // 기존 데이터 삭제
  await prisma.guest.deleteMany();
  console.log("기존 데이터 삭제 완료");

  // 새 데이터 추가
  for (const guest of guestData) {
    await prisma.guest.create({
      data: guest,
    });
  }

  console.log(`완료: ${guestData.length}개의 테스트 데이터가 추가되었습니다.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
