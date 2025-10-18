#!/bin/bash
# EC2 t3.micro 최적화 배포 스크립트

echo "🚀 결혼식 초대장 배포 시작..."

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. 환경 확인
echo -e "${YELLOW}1️⃣  환경 확인 중...${NC}"
node --version
npm --version

# 2. 의존성 설치
echo -e "${YELLOW}2️⃣  의존성 설치 중...${NC}"
npm ci --prefer-offline --no-audit

# 3. Prisma 설정
echo -e "${YELLOW}3️⃣  데이터베이스 설정 중...${NC}"
npx prisma generate
npx prisma migrate deploy

# 4. 빌드 (메모리 제한 적용)
echo -e "${YELLOW}4️⃣  프로덕션 빌드 중... (메모리 제한: 384MB)${NC}"
NODE_OPTIONS="--max-old-space-size=384" npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 빌드 성공!${NC}"
else
    echo -e "${RED}❌ 빌드 실패${NC}"
    exit 1
fi

# 5. PM2가 설치되어 있는지 확인
if ! command -v pm2 &> /dev/null
then
    echo -e "${YELLOW}PM2가 설치되어 있지 않습니다. 설치 중...${NC}"
    npm install -g pm2
fi

# 6. 기존 프로세스 종료
echo -e "${YELLOW}5️⃣  기존 프로세스 종료 중...${NC}"
pm2 delete wedding-invitation 2>/dev/null || true

# 7. 애플리케이션 시작
echo -e "${YELLOW}6️⃣  애플리케이션 시작 중...${NC}"
pm2 start ecosystem.config.js

# 8. PM2 저장
pm2 save

# 9. 상태 확인
echo -e "${GREEN}✅ 배포 완료!${NC}"
echo ""
pm2 status
echo ""
echo -e "${GREEN}🎉 배포가 성공적으로 완료되었습니다!${NC}"
echo -e "${YELLOW}📊 모니터링: pm2 monit${NC}"
echo -e "${YELLOW}📋 로그 확인: pm2 logs wedding-invitation${NC}"
echo -e "${YELLOW}🔄 재시작: pm2 restart wedding-invitation${NC}"

