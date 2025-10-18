# ⚡ 빠른 시작 가이드 (EC2 t3.micro)

## 1단계: 파일 업로드 (로컬 → EC2)

```bash
# 로컬에서 EC2로 파일 전송
scp -i your-key.pem -r . ec2-user@your-ec2-ip:/home/ec2-user/wedding
```

## 2단계: EC2 접속 및 설정

```bash
# EC2 접속
ssh -i your-key.pem ec2-user@your-ec2-ip

# 프로젝트 폴더로 이동
cd /home/ec2-user/wedding

# Node.js 설치 (없는 경우)
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# PM2 설치
sudo npm install -g pm2
```

## 3단계: 배포 실행

```bash
# 자동 배포 스크립트 실행
chmod +x deploy.sh
./deploy.sh
```

또는 수동으로:

```bash
# 1. 의존성 설치
npm ci

# 2. 데이터베이스 설정
npx prisma generate
npx prisma migrate deploy

# 3. 빌드
npm run build

# 4. PM2로 실행
npm run pm2:start
```

## 4단계: 방화벽 설정

```bash
# 포트 3000 열기
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload

# 또는 iptables
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
sudo service iptables save
```

AWS 보안 그룹에서도 포트 3000 열기:
- EC2 Console → Security Groups → Inbound Rules
- Add Rule: Custom TCP, Port 3000, Source 0.0.0.0/0

## 5단계: 확인

```bash
# 상태 확인
pm2 status

# 로그 확인
pm2 logs wedding-invitation

# 브라우저에서 접속
http://your-ec2-ip:3000
```

## 🔧 유용한 명령어

```bash
# 재시작
pm2 restart wedding-invitation

# 중지
pm2 stop wedding-invitation

# 삭제
pm2 delete wedding-invitation

# 모니터링
pm2 monit

# 로그 실시간 확인
pm2 logs --lines 50

# 메모리 사용량 확인
free -h
htop
```

## 🚨 문제 해결

### 메모리 부족
```bash
# 스왑 메모리 추가 (1GB)
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 빌드 실패
```bash
# 메모리 제한 늘리기
NODE_OPTIONS="--max-old-space-size=512" npm run build
```

### 포트 사용 중
```bash
# 포트 3000 사용 중인 프로세스 확인
sudo lsof -i :3000

# 프로세스 종료
sudo kill -9 <PID>
```

## 🎯 Nginx 리버스 프록시 (선택사항)

80번 포트로 서비스하려면:

```bash
# Nginx 설치
sudo yum install nginx

# 설정 파일 생성
sudo nano /etc/nginx/conf.d/wedding.conf
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Nginx 시작
sudo systemctl start nginx
sudo systemctl enable nginx
```

## ✅ 완료!

이제 `http://your-ec2-ip` 또는 `http://your-domain.com`에서 확인하세요!

## 📊 성능 모니터링

```bash
# PM2 대시보드
pm2 monit

# 시스템 리소스
htop

# 디스크 사용량
df -h

# 네트워크 연결
netstat -tulpn | grep 3000
```

---

**💡 팁**: 
- CloudFront CDN 사용하면 이미지 로딩 속도가 5-10배 빨라집니다!
- S3_OPTIMIZATION.md 가이드 참고하세요.

