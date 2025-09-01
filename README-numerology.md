# 명리학 기반 숫자 택일 서비스

## 개요

명리학 기반의 숫자 택일 서비스는 사주를 기반으로 하여 전화번호, 차량번호, 개인숫자의 길흉을 분석하고, 목적에 맞는 날짜를 선택하는 서비스입니다.

## 주요 기능

### 1. 길한 숫자 분석
- 사주를 기반으로 한 길한 숫자 추천
- 길한 색상 및 방향 추천
- 오행 상생 관계를 고려한 분석

### 2. 전화번호 길흉 분석
- 전화번호의 각 자릿수를 사주와 연관하여 분석
- 점수 기반 등급 평가 (A+, A, B+, B, C+, C, D)
- 개선 방안 제시

### 3. 차량번호 길흉 분석
- 차량번호의 길흉 분석
- 안전 운전을 위한 번호 추천
- 점수 기반 등급 평가

### 4. 개인숫자 길흉 분석
- 자주 사용하는 개인 숫자의 길흉 분석
- 사주와의 조화도 평가
- 개인 숫자 사용 가이드

### 5. 택일 서비스
- 목적별 날짜 선택 (미팅, 계약, 이사, 결혼, 사업)
- 사주 기반 길한 날짜 추천
- 상위 10개 날짜 제공

### 6. 종합 숫자 운세 분석
- 모든 숫자 정보를 종합적으로 분석
- 전체적인 운세 제공
- 종합 추천사항 제시

## 기술 스택

### 백엔드
- **Node.js** - 서버 런타임
- **Express.js** - 웹 프레임워크
- **SQLite** - 데이터베이스
- **JWT** - 인증 시스템

### 프론트엔드
- **HTML5** - 마크업
- **CSS3** - 스타일링
- **JavaScript (ES6+)** - 클라이언트 로직
- **Font Awesome** - 아이콘

### 명리학 엔진
- **BaziEngine** - 사주 계산 엔진
- **오행 상생/상극 관계** - 명리학 기반 분석
- **천간/지지 오행 매핑** - 전통 명리학 적용

## API 엔드포인트

### 1. 길한 숫자 분석
```
POST /api/numerology/lucky-numbers
```

**요청 본문:**
```json
{
  "birthYear": 1990,
  "birthMonth": 5,
  "birthDay": 15,
  "birthHour": 14
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "luckyNumbers": [1, 3, 6, 9],
    "luckyColors": ["검정색", "초록색", "흰색", "빨간색"],
    "luckyDirections": ["북쪽", "동쪽", "서쪽", "남쪽"],
    "baziData": { ... }
  }
}
```

### 2. 전화번호 분석
```
POST /api/numerology/phone-analysis
```

**요청 본문:**
```json
{
  "phoneNumber": "01012345678",
  "birthYear": 1990,
  "birthMonth": 5,
  "birthDay": 15,
  "birthHour": 14
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "phoneNumber": "01012345678",
    "score": 85,
    "percentage": 85,
    "grade": "A",
    "analysis": [
      {
        "position": 1,
        "digit": 0,
        "element": "土",
        "status": "길",
        "reason": "사주에 길한 숫자"
      }
    ],
    "recommendation": "매우 좋은 전화번호입니다. 현재 번호를 유지하시기 바랍니다."
  }
}
```

### 3. 차량번호 분석
```
POST /api/numerology/car-analysis
```

### 4. 개인숫자 분석
```
POST /api/numerology/personal-analysis
```

### 5. 택일 서비스
```
POST /api/numerology/date-selection
```

**요청 본문:**
```json
{
  "purpose": "미팅",
  "birthYear": 1990,
  "birthMonth": 5,
  "birthDay": 15,
  "birthHour": 14,
  "startDate": "2024-01-01",
  "days": 30
}
```

### 6. 종합 분석
```
POST /api/numerology/comprehensive-analysis
```

### 7. 히스토리 조회
```
GET /api/numerology/history
```

## 명리학 기반 분석 로직

### 1. 오행 매핑
- **숫자 → 오행**: 1(水), 2(土), 3(木), 4(木), 5(土), 6(金), 7(金), 8(土), 9(火), 0(土)

### 2. 천간 오행
- **甲, 乙**: 木
- **丙, 丁**: 火
- **戊, 己**: 土
- **庚, 辛**: 金
- **壬, 癸**: 水

### 3. 지지 오행
- **寅, 卯**: 木
- **巳, 午**: 火
- **辰, 戌, 丑, 未**: 土
- **申, 酉**: 金
- **亥, 子**: 水

### 4. 상생 관계
- **木 → 火 → 土 → 金 → 水 → 木**

### 5. 상극 관계
- **木 → 土 → 水 → 火 → 金 → 木**

## 사용 방법

### 1. 웹 인터페이스
1. 메인 페이지에서 "손금학 & 숫자 택일" 섹션으로 이동
2. "숫자 택일 시작하기" 버튼 클릭
3. 원하는 서비스 탭 선택
4. 생년월일 및 필요한 정보 입력
5. 분석 결과 확인

### 2. API 사용
```javascript
// 길한 숫자 분석 예시
const response = await fetch('/api/numerology/lucky-numbers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    birthYear: 1990,
    birthMonth: 5,
    birthDay: 15,
    birthHour: 14
  })
});

const result = await response.json();
console.log(result.data.luckyNumbers);
```

## 데이터베이스 스키마

### readings 테이블
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

**type 값들:**
- `phone_numerology`: 전화번호 분석
- `car_numerology`: 차량번호 분석
- `personal_numerology`: 개인숫자 분석
- `date_selection`: 택일 서비스
- `comprehensive_numerology`: 종합 분석

## 파일 구조

```
src/
├── services/
│   └── numerologyService.js    # 숫자 택일 서비스 로직
├── controllers/
│   └── numerologyController.js # API 컨트롤러
└── routes/
    └── numerology.js          # API 라우터

public/
├── numfit.html               # 숫자 택일 서비스 페이지
├── css/
│   └── numfit.css           # 숫자 택일 서비스 스타일
└── js/
    └── numfit.js            # 숫자 택일 서비스 JavaScript
```

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
```bash
cp env.example .env
# .env 파일에서 필요한 설정 수정
```

### 3. 서버 실행
```bash
npm start
```

### 4. 접속
- 웹 인터페이스: `http://localhost:3000/numfit.html`
- API 문서: 각 엔드포인트별로 위의 API 문서 참조

## 주요 특징

### 1. 명리학 기반 분석
- 전통 명리학 이론을 바탕으로 한 정확한 분석
- 오행 상생/상극 관계를 고려한 종합적 평가
- 사주 개인화 분석

### 2. 사용자 친화적 인터페이스
- 직관적인 탭 기반 네비게이션
- 실시간 분석 결과 표시
- 반응형 디자인

### 3. 종합적 서비스
- 단일 숫자부터 종합 분석까지 다양한 서비스 제공
- 목적별 맞춤형 택일 서비스
- 히스토리 관리 기능

### 4. 확장 가능한 구조
- 모듈화된 서비스 구조
- API 기반 설계로 다양한 클라이언트 지원 가능
- 데이터베이스 연동으로 사용자별 히스토리 관리

## 라이선스

MIT License

## 기여

이 프로젝트에 기여하고 싶으시다면:
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.



