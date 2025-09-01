import { z } from 'zod';

// 기본 입력 스키마
export const BirthDataSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 형식이어야 합니다'),
  time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'HH:mm 또는 HH:mm:ss 형식이어야 합니다'),
  place: z.string().min(1, '출생지가 필요합니다'),
  unknownTime: z.boolean().optional(),
  placeGeo: z.object({
    lat: z.number(),
    lon: z.number()
  }).optional()
});

export const BaziRequestSchema = z.object({
  fullName: z.string().min(2, '이름은 2자 이상이어야 합니다').max(40, '이름은 40자 이하여야 합니다'),
  sexAtBirth: z.enum(['male', 'female']),
  birth: BirthDataSchema,
  calendarNote: z.literal('solar').optional(),
  contact: z.string().email('올바른 이메일 형식이어야 합니다').optional(),
  locale: z.enum(['ko', 'en', 'km']).default('ko')
});

export type BirthData = z.infer<typeof BirthDataSchema>;
export type BaziRequest = z.infer<typeof BaziRequestSchema>;

// 사주 기둥 타입
export interface Pillar {
  stem: string;
  branch: string;
  element: string;
  confidence?: number;
}

export interface Pillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar & { confidence: number };
}

// 오행 분석
export interface FiveElements {
  목: number;
  화: number;
  토: number;
  금: number;
  수: number;
}

// 십신 강도
export interface TenGodsStrength {
  wealth: number;    // 재성
  officer: number;   // 관성
  output: number;    // 식상
  resource: number;  // 인성
  peer: number;      // 비겁
}

// 타임라인
export interface LuckPillar {
  period: string;
  pillar: string;
  theme: string;
}

export interface AnnualPillar {
  year: number;
  pillar: string;
  focus: string;
}

export interface MonthlyPillar {
  month: string;
  window: string;
  pillar: string;
  actions: string[];
}

export interface Timeline {
  luck_pillars: LuckPillar[];
  annual: AnnualPillar[];
  monthly: MonthlyPillar[];
}

// 답변 카드
export interface AnswerCard {
  topic: string;
  one_liner: string;
  why: string;
  detail: string[];
  todo: string[];
}

// 경계 감도 검사
export interface BoundarySensitivity {
  boundaryAlert: boolean;
  candidates: Pillars[];
  hourConfidence: number;
}

// Rectification 요청
export const RectificationRequestSchema = z.object({
  candidateIndex: z.number(),
  userResponse: z.string()
});

export type RectificationRequest = z.infer<typeof RectificationRequestSchema>;

// 메인 응답
export interface BaziResponse {
  pillars: Pillars;
  five_elements: FiveElements;
  ten_gods_strength: TenGodsStrength;
  useful_god: string[];
  boundaryAlert: boolean;
  candidates?: Pillars[];
  timeline: Timeline;
  answers: AnswerCard[];
}

// API 응답 래퍼
export interface ApiResponse<T> {
  success: boolean;
  result?: T;
  error?: string;
  message?: string;
}

// 24절기 데이터
export interface JieQiData {
  name: string;
  date: string;
  solarLongitude: number;
  type: 'major' | 'minor';
}

// 도시 정보
export interface CityInfo {
  name: string;
  timezone: string;
  lat?: number;
  lon?: number;
}

// 경계 감도 검사 결과
export interface BoundaryCheck {
  hasHourBoundary: boolean;
  hasMonthBoundary: boolean;
  hasYearBoundary: boolean;
  confidence: number;
  alternativePillars: Pillars[];
}

// 간지 관련 타입
export type HeavenlyStem = '갑' | '을' | '병' | '정' | '무' | '기' | '경' | '신' | '임' | '계';
export type EarthlyBranch = '자' | '축' | '인' | '묘' | '진' | '사' | '오' | '미' | '신' | '유' | '술' | '해';
export type Element = '목' | '화' | '토' | '금' | '수';
