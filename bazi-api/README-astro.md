# 점성술 API 모듈

Swiss Ephemeris 기반 서양 점성술 계산 API입니다.

## 설치 및 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. Swiss Ephemeris 데이터 다운로드
```bash
npm run fetch-ephe
```

### 3. 개발 서버 실행
```bash
npm run dev
```

## API 엔드포인트

### 1. 나탈 차트 생성
**POST** `/api/astro/chart`

```json
{
  "date": "1990-04-03",
  "time": "08:30",
  "tz": "Asia/Seoul",
  "lat": 37.5665,
  "lon": 126.9780,
  "houseSystem": "whole-sign"
}
```

### 2. 트랜짓 계산
**POST** `/api/astro/transits`

```json
{
  "natal": {
    "date": "1990-04-03",
    "time": "08:30",
    "tz": "Asia/Seoul",
    "lat": 37.5665,
    "lon": 126.9780
  },
  "date": "2024-01-15",
  "rangeDays": 7
}
```

### 3. 시너스트리 분석
**POST** `/api/astro/synastry`

```json
{
  "personA": {
    "date": "1990-04-03",
    "time": "08:30",
    "tz": "Asia/Seoul",
    "lat": 37.5665,
    "lon": 126.9780
  },
  "personB": {
    "date": "1992-08-15",
    "time": "14:20",
    "tz": "Asia/Seoul",
    "lat": 37.5665,
    "lon": 126.9780
  }
}
```

### 4. 헬스체크
**GET** `/api/astro/health`

## 주요 기능

### 하우스 시스템
- **Whole Sign**: ASC가 속한 별자리의 0°를 1하우스 시작으로
- **Placidus**: 전통적인 Placidus 하우스 시스템

### 어스펙트
- **Conjunction** (0°): ±8° 오브
- **Sextile** (60°): ±6° 오브
- **Square** (90°): ±8° 오브
- **Trine** (120°): ±8° 오브
- **Opposition** (180°): ±8° 오브

### 행성별 오브 가중치
- **Sun**: 15°
- **Moon**: 12°
- **Mercury/Venus**: 7°
- **Mars**: 8°
- **Jupiter/Saturn**: 9°
- **Uranus/Neptune/Pluto**: 6°

## 캐싱

- **TTL**: 10분
- **최대 크기**: 100개 항목
- **키**: 입력 데이터 SHA-256 해시

## 테스트

```bash
# 전체 테스트
npm test

# 점성술 모듈만 테스트
npm run test:astro
```

## 문서

Swagger UI 문서: `http://localhost:3000/docs`

## 정확도 및 한계

### 정확도
- Swiss Ephemeris 2.10.03 기준
- Geocentric ecliptic coordinates
- 전통 서양 점성술 표준

### 한계
- 주요 행성만 계산 (Chiron, Ceres 등 소행성 제외)
- 기본적인 하우스 시스템만 지원
- Minor aspects 제외

## 파일 구조

```
src/astro/
├── types.ts          # 타입 정의
├── schemas.ts        # Zod 스키마
├── swe.ts           # Swiss Ephemeris 래퍼
├── aspects.ts       # 어스펙트 계산
├── cache.ts         # LRU 캐시
├── service.ts       # 비즈니스 로직
├── routes.ts        # Express 라우터
└── swagger.ts       # API 문서

tests/astro/
├── swe.test.ts      # Swiss Ephemeris 테스트
└── aspects.test.ts  # 어스펙트 계산 테스트
```

## 문제 해결

### Swiss Ephemeris 빌드 실패
```bash
# Windows에서 필요한 도구 설치
npm install -g windows-build-tools

# 또는 수동 설치
npm rebuild swisseph --build-from-source
```

### Ephemeris 데이터 없음
```bash
# 자동 다운로드
npm run fetch-ephe

# 또는 수동 다운로드
# https://www.astro.com/ftp/swisseph/ephe/
```

## 라이선스

MIT License



