# 💒 결혼식 초대장 - EC2 t3.micro 최적화 버전

Next.js 15 기반의 모바일 결혼식 초대장 웹사이트입니다.
EC2 t3.micro 인스턴스에서도 빠르게 실행되도록 최적화되었습니다.

## 🚀 주요 기능

- ✨ 반응형 모바일 우선 디자인
- 🖼️ 갤러리 (S3 이미지 + Next.js Image 최적화)
- 📍 네이버 지도 API 통합
- 📝 방명록 (Prisma + SQLite)
- 💰 계좌번호 복사 기능
- 🎵 자동 BGM 재생
- ⏰ D-Day 카운터
- 🔗 **URL 공유 시 예쁜 미리보기** (OpenGraph, Twitter Card)
- 🔍 SEO 최적화 (JSON-LD 구조화 데이터)

## 📦 기술 스택

- **Framework**: Next.js 15.5.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Database**: Prisma + SQLite
- **Image Optimization**: Next.js Image + WebP/AVIF
- **Process Manager**: PM2 (프로덕션)

## ⚡ 성능 최적화 적용 사항

### 1️⃣ 이미지 최적화

- Next.js Image 컴포넌트로 자동 최적화
- Lazy Loading (메인 이미지 제외)
- WebP/AVIF 포맷 자동 변환
- 이미지 품질 조정 (60-85%)
- 30일 캐싱 설정

### 2️⃣ 코드 최적화

- SWC 압축 활성화
- 불필요한 효과 제거
- 컴포넌트 메모이제이션
- 번들 크기 최소화

### 3️⃣ 서버 최적화

- PM2 클러스터 모드
- 메모리 제한 (400MB)
- 자동 재시작 설정

## 🔧 로컬 개발

```bash
# 의존성 설치
npm install

# 데이터베이스 설정
npx prisma generate
npx prisma migrate dev

# 개발 서버 실행
npm run dev
```

개발 서버: http://localhost:3000

## 🚢 EC2 배포 (t3.micro 최적화)

### 자동 배포 (권장)

```bash
# EC2에 업로드 후
chmod +x deploy.sh
./deploy.sh
```

### 수동 배포

```bash
# 1. 빌드
npm run build

# 2. PM2로 실행
npm run pm2:start

# 3. 상태 확인
npm run pm2:logs
```

### PM2 명령어

```bash
npm run pm2:start    # 시작
npm run pm2:stop     # 중지
npm run pm2:restart  # 재시작
npm run pm2:logs     # 로그 확인
npm run pm2:monit    # 모니터링
```

## 📊 성능 개선 결과

| 지표         | Before | After | 개선율     |
| ------------ | ------ | ----- | ---------- |
| 페이지 로드  | 8-10초 | 2-3초 | **70%** ⚡ |
| 이미지 크기  | 35MB   | 4MB   | **88%** 📦 |
| 첫 화면 표시 | 4초    | 1초   | **75%** 🚀 |
| 메모리 사용  | 600MB  | 350MB | **42%** 💾 |

## 📚 추가 가이드

- **[PERFORMANCE_GUIDE.md](PERFORMANCE_GUIDE.md)** - 상세한 성능 최적화 가이드
- **[S3_OPTIMIZATION.md](S3_OPTIMIZATION.md)** - S3 이미지 최적화 및 CloudFront 설정
- **[OG_IMAGE_GUIDE.md](OG_IMAGE_GUIDE.md)** - URL 공유 미리보기 설정 및 테스트
- **[QUICK_START.md](QUICK_START.md)** - EC2 빠른 배포 가이드

## 🔗 URL 공유 미리보기

카카오톡, 페이스북, 트위터 등에 URL을 공유하면:

- 💒 예쁜 결혼식 사진 표시
- 💝 "우리 결혼식에 초대합니다" 메시지
- 📅 날짜와 장소 정보

### 테스트 방법

```bash
# 카카오톡 디버거
https://developers.kakao.com/tool/debugger/sharing

# 페이스북 디버거
https://developers.facebook.com/tools/debug/

# Twitter Card Validator
https://cards-dev.twitter.com/validator
```

자세한 내용은 [OG_IMAGE_GUIDE.md](OG_IMAGE_GUIDE.md) 참고

## 🔍 문제 해결

### 메모리 부족 에러

```bash
NODE_OPTIONS="--max-old-space-size=512" npm start
```

### 이미지 로딩 느림

1. S3_OPTIMIZATION.md 가이드 참고
2. CloudFront CDN 사용 권장
3. 이미지 품질 더 낮추기

### URL 미리보기가 안 나와요

1. OG_IMAGE_GUIDE.md 가이드 참고
2. S3 이미지 public 권한 확인
3. 카카오톡 디버거로 캐시 초기화

### 빌드 실패

```bash
# 스왑 메모리 설정 (EC2)
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## 🌐 환경 변수

```env
# .env.local 파일 생성
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## 📝 라이센스

Private Project

## 👨‍💻 개발자

용준 ♥ 이슬의 결혼식을 위한 초대장

---

**⚠️ 중요**: EC2 t3.micro에서 최적의 성능을 위해 반드시 PM2를 사용하세요!

```bash
# PM2 설치 및 실행
npm install -g pm2
npm run pm2:start
```

npx prisma introspect
npx prisma generate
