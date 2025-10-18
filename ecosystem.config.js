// PM2 설정 파일 - EC2에서 최적화된 실행
module.exports = {
  apps: [{
    name: 'wedding-invitation',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 1, // t3.micro는 1 vCPU이므로 1개 인스턴스만 실행
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '400M', // t3.micro 메모리 제한 고려
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      // 메모리 최적화
      NODE_OPTIONS: '--max-old-space-size=384',
    },
    // 로그 설정
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    // 자동 재시작 설정
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    // CPU 제한
    node_args: '--max-old-space-size=384',
  }],
};

