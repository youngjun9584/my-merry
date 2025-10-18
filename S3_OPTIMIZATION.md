# 📦 S3 이미지 최적화 가이드

## 현재 문제
- S3 이미지가 원본 크기 그대로 업로드되어 있어 로딩이 느림
- CloudFront CDN 미사용으로 한국에서만 빠름

## 해결 방법

### 1. 이미지 최적화 후 재업로드 (권장)

#### 방법 1: ImageMagick 사용
```bash
# ImageMagick 설치
sudo apt-get install imagemagick

# 이미지 최적화 (품질 80%, 리사이즈)
convert input.jpg -quality 80 -resize 1920x1080\> output.jpg

# WebP로 변환 (더 작은 파일 크기)
convert input.jpg -quality 75 output.webp

# 배치 처리
for img in *.jpg; do
  convert "$img" -quality 80 -resize 1920x1080\> "optimized_$img"
done
```

#### 방법 2: Sharp (Node.js)
```javascript
// optimize-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageDir = './public/img';
const outputDir = './optimized';

fs.readdirSync(imageDir).forEach(file => {
  if (file.match(/\.(jpg|jpeg|png)$/i)) {
    sharp(path.join(imageDir, file))
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true })
      .toFile(path.join(outputDir, file))
      .then(() => console.log(`✅ Optimized: ${file}`))
      .catch(err => console.error(`❌ Error: ${file}`, err));
  }
});
```

```bash
npm install sharp
node optimize-images.js
```

### 2. S3 버킷 설정 최적화

#### 캐시 헤더 설정
```bash
# AWS CLI로 캐시 설정
aws s3 cp s3://edi-img/uploads/merry/ s3://edi-img/uploads/merry/ \
  --recursive \
  --metadata-directive REPLACE \
  --cache-control "public, max-age=31536000, immutable" \
  --content-type "image/jpeg"
```

#### S3 버킷 정책 확인
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::edi-img/uploads/merry/*"
    }
  ]
}
```

### 3. CloudFront CDN 설정 (강력 권장) ⚡

#### 왜 CloudFront?
- 전 세계 엣지 로케이션에서 캐싱
- S3 다이렉트 접근보다 5-10배 빠름
- 대역폭 비용 절감
- 자동 이미지 압축 지원

#### 설정 방법
1. **AWS Console → CloudFront → Create Distribution**
2. **Origin Settings:**
   - Origin Domain: `edi-img.s3.ap-northeast-2.amazonaws.com`
   - Origin Path: `/uploads/merry`
   - Name: `wedding-s3-origin`

3. **Default Cache Behavior:**
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Allowed HTTP Methods: GET, HEAD
   - Cache Policy: CachingOptimized
   - Compress Objects Automatically: Yes ✅

4. **Distribution Settings:**
   - Price Class: Use Only North America and Europe (또는 All)
   - Alternate Domain Names (CNAMEs): `cdn.your-domain.com` (선택사항)

5. **배포 완료 후 URL 변경:**
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d1234567890.cloudfront.net", // CloudFront 도메인
        port: "",
        pathname: "/**",
      },
    ],
  },
};
```

```typescript
// page.tsx에서 URL 변경
const photos = [
  "https://d1234567890.cloudfront.net/1.jpg",
  "https://d1234567890.cloudfront.net/2.jpg",
  // ...
];
```

### 4. 이미지 크기 가이드

| 용도 | 권장 크기 | 품질 | 예상 파일 크기 |
|------|----------|------|---------------|
| 히어로 이미지 | 1920x1080 | 85% | 150-300KB |
| 갤러리 썸네일 | 800x800 | 70% | 50-100KB |
| 포트레이트 | 1000x1350 | 75% | 100-200KB |
| 슬라이드 이미지 | 600x900 | 60% | 40-80KB |

### 5. 이미지 파일명 규칙
```
original/IMG_4981.jpg (5.2MB) ❌
↓
optimized/hero-main.jpg (280KB) ✅
optimized/hero-main.webp (180KB) ✅ (더 좋음)
```

### 6. 실제 적용 예시

#### Before (현재)
```
https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_4981.jpg
- 파일 크기: 4.2MB
- 로딩 시간: 2-3초 (t3.micro에서)
```

#### After (최적화)
```
https://d1234567890.cloudfront.net/hero-main.webp
- 파일 크기: 180KB
- 로딩 시간: 0.3초
- 용량 절감: 95% ⚡
```

### 7. 체크리스트

- [ ] 이미지 최적화 (리사이즈 + 품질 조정)
- [ ] WebP 포맷으로 변환
- [ ] S3에 최적화된 이미지 업로드
- [ ] S3 캐시 헤더 설정
- [ ] CloudFront Distribution 생성
- [ ] Next.js 설정에 CloudFront URL 추가
- [ ] 코드에서 이미지 URL 변경
- [ ] 빌드 및 배포
- [ ] 성능 테스트 (Lighthouse)

### 8. 성능 테스트

```bash
# Lighthouse로 성능 측정
npx lighthouse https://your-domain.com --view

# 목표 점수
- Performance: 90+ 🎯
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Total Blocking Time: < 200ms
```

## 예상 개선 효과

| 지표 | Before | After | 개선율 |
|------|--------|-------|--------|
| 페이지 로드 시간 | 8-10초 | 2-3초 | 70% ⚡ |
| 이미지 크기 | 35MB | 4MB | 88% 📦 |
| 첫 화면 표시 | 4초 | 1초 | 75% 🚀 |
| 대역폭 사용량 | 100% | 15% | 85% 💰 |

## 추가 팁

1. **WebP 폴백**: 구형 브라우저를 위해 JPEG도 함께 제공
2. **Lazy Loading**: 화면에 보이는 이미지만 먼저 로드
3. **Progressive JPEG**: 점진적으로 로드되는 이미지
4. **Blur Placeholder**: 로딩 중 흐릿한 이미지 표시

이 가이드를 따라하면 EC2 t3.micro에서도 빠르게 실행됩니다! 🎉

