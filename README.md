# Fortune Teller App (운세마스터)

AI 기반 사주명리학과 서양점성술 분석 애플리케이션입니다. 사용자 관리, 상세한 운세 분석, 다국어 지원을 제공합니다.

## 🚀 주요 기능

- **🔐 사용자 관리**: SQLite 기반 회원가입/로그인 시스템
- **📊 사주명리학**: 상세한 사주 분석 (4주, 오행, 십신, 월별운세)
- **⭐ 서양점성술**: 태양궁 기반 성격 및 운세 분석
- **🌍 다국어 지원**: 한국어, 영어 등 7개 언어
- **📱 반응형 디자인**: 모바일 최적화
- **🎨 신비로운 UI**: 동적 배경과 글래스모피즘 디자인
- **📈 분석 기록**: 사용자별 분석 결과 저장 및 조회

## 🛠 기술 스택

### Frontend
- **HTML5/CSS3**: 반응형 레이아웃, 글래스모피즘 UI
- **JavaScript (ES6+)**: 순수 JS, 모듈화된 구조
- **CSS Grid/Flexbox**: 현대적 레이아웃
- **CSS Animations**: 동적 배경 효과

### Backend
- **Node.js**: 서버 런타임
- **Express.js**: 웹 프레임워크
- **SQLite3**: 경량 데이터베이스
- **better-sqlite3**: 고성능 SQLite 드라이버

### 보안 & 인증
- **bcrypt**: 비밀번호 해싱
- **JWT**: 토큰 기반 인증
- **httpOnly Cookies**: 보안 쿠키
- **dotenv**: 환경변수 관리

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/yourusername/fortune-teller-app.git
cd fortune-teller-app
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경변수 설정
```bash
# .env 파일 생성
cp env.example .env

# .env 파일 편집
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
NODE_ENV=development
```

### 4. 서버 실행
```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm start
```

### 5. 브라우저에서 접속
```
http://localhost:3000
```

## 🗄 데이터베이스 구조

### Users 테이블
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  username TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  birth_year INTEGER,
  birth_month INTEGER,
  birth_day INTEGER,
  birth_hour INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Readings 테이블
```sql
CREATE TABLE readings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  result TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### User_KV 테이블
```sql
CREATE TABLE user_kv (
  user_id INTEGER NOT NULL,
  k TEXT NOT NULL,
  v TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, k),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🔌 API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃

### 사용자 관리
- `GET /api/user` - 사용자 정보 조회
- `PUT /api/user` - 사용자 정보 업데이트

### 운세 분석
- `POST /api/bazi` - 사주명리학 분석
- `POST /api/astrology` - 서양점성술 분석
- `GET /api/readings` - 분석 기록 조회

### 시스템
- `GET /api/health` - 서버 상태 확인
- `POST /api/kv` - 사용자 키-값 저장
- `GET /api/kv/:k` - 사용자 키-값 조회

## 🚀 배포 가이드

### Render (추천)
1. GitHub 저장소 연결
2. Web Service 생성
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Environment Variables 설정:
   - `JWT_SECRET`: 긴 랜덤 문자열
   - `NODE_ENV`: production
6. Persistent Disk 추가: `./data` 마운트

### Railway
1. New Project → Deploy from Repo
2. Service에 Volume 추가 (`/app/data`)
3. Environment Variables 설정
4. 배포 완료

### Fly.io
1. Dockerfile 생성:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```
2. `fly launch` 실행
3. Volume 생성: `fly volumes create app_data --size 1`
4. 배포: `fly deploy`

## 🔒 보안 고려사항

### 현재 구현
- ✅ bcrypt 비밀번호 해싱
- ✅ JWT 토큰 인증
- ✅ httpOnly 쿠키
- ✅ SQL 인젝션 방지 (prepared statements)
- ✅ 환경변수 분리

### 권장 개선사항
- 🔄 HTTPS 강제 적용
- 🔄 Rate Limiting 추가
- 🔄 CORS 정책 설정
- 🔄 입력값 검증 강화
- 🔄 로그 모니터링

## 🧪 테스트

### API 테스트
```bash
# 회원가입
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Tester","password":"pass1234"}'

# 로그인
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass1234"}'

# 헬스체크
curl http://localhost:3000/api/health
```

### 브라우저 테스트
1. 회원가입 → 로그인
2. 프로필 정보 입력
3. 사주/점성술 분석 실행
4. 분석 기록 확인

## 📁 프로젝트 구조

```
fortune-teller-app/
├── public/                 # 정적 파일
│   ├── index.html         # 메인 페이지
│   ├── css/
│   │   └── styles.css     # 스타일시트
│   └── js/
│       └── main.js        # 프론트엔드 로직
├── data/                  # 데이터베이스 파일
│   └── app.db            # SQLite 데이터베이스
├── server.js             # Express 서버
├── package.json          # 프로젝트 설정
├── .env                  # 환경변수 (gitignore)
├── env.example           # 환경변수 예시
├── .gitignore           # Git 제외 파일
└── README.md            # 프로젝트 문서
```

## 🎨 디자인 특징

### 색상 팔레트
- **Primary**: `#6b46c1` (보라)
- **Secondary**: `#f59e0b` (주황)
- **Background**: `#0f172a` (다크 블루)
- **Surface**: `rgba(255, 255, 255, 0.1)` (글래스)

### 타이포그래피
- **Headings**: Noto Sans KR
- **Body**: Inter, system-ui
- **Icons**: Material Icons

### 애니메이션
- **Background**: 별, 달, 안개 효과
- **Transitions**: 부드러운 모달 전환
- **Hover Effects**: 인터랙티브 요소

## 🔄 마이그레이션 계획

### 현재 (SQLite)
- ✅ 로컬 개발 및 소규모 서비스
- ✅ 단일 파일 데이터베이스
- ✅ 빠른 설정 및 배포

### 향후 확장 (PostgreSQL/MySQL)
- 🔄 대규모 사용자 지원
- 🔄 동시 접속 처리
- 🔄 고급 쿼리 최적화
- 🔄 백업 및 복구 시스템

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

- **이슈 리포트**: [GitHub Issues](https://github.com/yourusername/fortune-teller-app/issues)
- **문서**: [Wiki](https://github.com/yourusername/fortune-teller-app/wiki)
- **이메일**: support@fortuneteller.com

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!