# 🚀 EC2 t3.micro 성능 최적화 가이드

## 적용된 최적화 사항

### 1. 이미지 최적화
- ✅ Next.js Image 컴포넌트로 자동 최적화
- ✅ WebP/AVIF 포맷 자동 변환
- ✅ Lazy Loading 적용 (메인 이미지 제외)
- ✅ 이미지 품질 조정 (60-85%)
- ✅ 30일 캐싱 설정

### 2. 코드 최적화
- ✅ SWC 압축 활성화
- ✅ 불필요한 효과 제거 (눈 내리는 효과)
- ✅ 컴포넌트 메모이제이션

### 3. 서버 최적화
- ✅ PM2 클러스터 모드 (1개 인스턴스)
- ✅ 메모리 제한 (400MB)
- ✅ 자동 재시작 설정

## EC2 배포 가이드

### 1. 빌드 실행
```bash
npm run build
```

### 2. PM2로 실행 (권장)
```bash
# PM2 설치
npm install -g pm2

# 애플리케이션 시작
pm2 start ecosystem.config.js

# 상태 확인
pm2 status

# 로그 확인
pm2 logs wedding-invitation

# 재시작
pm2 restart wedding-invitation

# 부팅 시 자동 시작
pm2 startup
pm2 save
```

### 3. 또는 일반 실행
```bash
NODE_OPTIONS="--max-old-space-size=384" npm start
```

## 추가 성능 개선 방안

### 1. CloudFront CDN 사용 (강력 권장)
S3 이미지를 CloudFront를 통해 제공하면 속도가 크게 향상됩니다.

```
S3 버킷 → CloudFront 배포 생성 → Next.js에서 CloudFront URL 사용
```

### 2. Nginx 리버스 프록시 (선택사항)
```bash
sudo apt install nginx

# /etc/nginx/sites-available/wedding 설정
server {
    listen 80;
    server_name your-domain.com;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml+rss text/javascript;
    gzip_min_length 1000;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 정적 파일 캐싱
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. 스왑 메모리 설정 (메모리 부족 시)
```bash
# 1GB 스왑 파일 생성
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 영구 설정
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 4. S3 버킷 최적화
- S3 버킷에서 이미지를 미리 최적화된 크기로 업로드
- CloudFront 캐싱 설정 (TTL 1년)
- Gzip/Brotli 압축 활성화

### 5. 모니터링
```bash
# CPU/메모리 사용량 확인
htop

# PM2 모니터링
pm2 monit

# 로그 실시간 확인
pm2 logs --lines 100
```

## 성능 체크리스트

- [ ] `npm run build` 성공적으로 완료
- [ ] PM2로 애플리케이션 실행
- [ ] CloudFront CDN 설정 (선택사항)
- [ ] Nginx 리버스 프록시 설정 (선택사항)
- [ ] 스왑 메모리 설정 (필요 시)
- [ ] 방화벽 포트 열기 (3000 또는 80)
- [ ] 도메인 연결 및 SSL 인증서 설정

## 예상 성능 개선
- 🚀 초기 로딩 속도: 40-60% 개선
- 📦 이미지 크기: 60-80% 감소
- 💾 메모리 사용량: 30-40% 감소
- ⚡ 페이지 전환: 즉각 반응

## 문제 해결

### 메모리 부족 에러
```bash
# Node.js 메모리 제한 늘리기
NODE_OPTIONS="--max-old-space-size=512" npm start
```

### 이미지가 느리게 로드될 때
1. S3 버킷이 같은 리전(ap-northeast-2)에 있는지 확인
2. CloudFront 사용 검토
3. 이미지 품질 더 낮추기 (quality={50})

### 빌드 중 메모리 부족
```bash
# 스왑 활성화 후 빌드
npm run build
```

