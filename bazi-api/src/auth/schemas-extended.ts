import { z } from 'zod';

// 언어 옵션
const LanguageEnum = z.enum(['ko', 'en', 'km']);

// 성별 옵션
const SexAtBirthEnum = z.enum(['male', 'female']);

// 시간 정밀도 옵션
const TimeAccuracyEnum = z.enum(['exact', 'about', 'unknown']);

// 시간 소스 옵션
const TimeSourceEnum = z.enum(['hospital_record', 'family_memory', 'other']);

// 해석 톤 옵션
const InterpretationToneEnum = z.enum(['business', 'emotional']);

// 의사결정 시계열 옵션
const DecisionTimelineEnum = z.enum(['thisMonth', '3m', '6m', '12m']);

// 관심 주제 옵션
const InterestEnum = z.enum(['재물/투자', '직업/사업', '관계/배우자', '건강', '타이밍']);

// 사건 앵커 스키마
const RectificationAnchorSchema = z.object({
  event: z.string().min(1, '사건명을 입력해주세요'),
  date: z.string().regex(/^\d{4}-\d{2}$/, 'YYYY-MM 형식으로 입력해주세요'),
  description: z.string().optional()
});

// 기본 회원가입 스키마 (1단계)
export const BasicSignUpSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
  displayName: z.string().min(2, '이름은 2자 이상이어야 합니다').max(40, '이름은 40자 이하여야 합니다'),
  termsAccepted: z.boolean().refine(val => val === true, '이용약관에 동의해야 합니다'),
  privacyAccepted: z.boolean().refine(val => val === true, '개인정보처리방침에 동의해야 합니다'),
  consentProcessingBirthData: z.boolean().refine(val => val === true, '생년월일시 데이터 처리에 동의해야 합니다')
});

// 출생 정보 스키마 (2단계 - 필수)
export const BirthDataSchema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 형식으로 입력해주세요'),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, 'HH:mm 형식으로 입력해주세요'),
  birthPlace: z.string().min(1, '출생지를 입력해주세요'),
  birthCountry: z.string().min(1, '국가를 입력해주세요'),
  birthTimezone: z.string().min(1, '시간대를 선택해주세요'),
  sexAtBirth: SexAtBirthEnum,
  timeAccuracy: TimeAccuracyEnum,
  timeSource: TimeSourceEnum.optional(),
  rectificationAnchors: z.array(RectificationAnchorSchema).optional(),
  notes: z.string().optional()
});

// 사용자 설정 스키마 (3단계 - 권장)
export const UserPrefsSchema = z.object({
  language: LanguageEnum.default('ko'),
  reportTimezone: z.string().min(1, '시간대를 선택해주세요').default('Asia/Phnom_Penh'),
  notificationEmailOptIn: z.boolean().default(false),
  currentResidenceCity: z.string().optional(),
  occupation: z.string().optional(),
  role: z.string().optional(),
  goals: z.string().optional(),
  constraints: z.string().optional(),
  interpretationExperience: InterpretationToneEnum.optional(),
  interpretationTone: InterpretationToneEnum.optional(),
  interests: z.array(InterestEnum).optional(),
  decisionTimeline: DecisionTimelineEnum.optional()
});

// 완전한 회원가입 스키마 (모든 단계)
export const CompleteSignUpSchema = BasicSignUpSchema.merge(BirthDataSchema).merge(UserPrefsSchema);

// 단계별 회원가입 스키마
export const Step1SignUpSchema = BasicSignUpSchema;
export const Step2SignUpSchema = BirthDataSchema;
export const Step3SignUpSchema = UserPrefsSchema;

// 로그인 스키마
export const LoginSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요')
});

// API 응답 스키마
export const AuthResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    displayName: z.string()
  }),
  prefs: z.object({
    id: z.string(),
    language: LanguageEnum,
    reportTimezone: z.string(),
    notificationEmailOptIn: z.boolean(),
    termsAcceptedAt: z.string().nullable(),
    privacyAcceptedAt: z.string().nullable(),
    consentProcessingBirthData: z.boolean(),
    currentResidenceCity: z.string().nullable(),
    occupation: z.string().nullable(),
    role: z.string().nullable(),
    goals: z.string().nullable(),
    constraints: z.string().nullable(),
    interpretationExperience: InterpretationToneEnum.nullable(),
    interpretationTone: InterpretationToneEnum.nullable(),
    interests: z.string().nullable(), // JSON string
    decisionTimeline: DecisionTimelineEnum.nullable()
  }),
  birthData: z.object({
    id: z.string(),
    birthDate: z.string(),
    birthTime: z.string(),
    birthPlace: z.string(),
    birthCountry: z.string(),
    birthTimezone: z.string(),
    sexAtBirth: SexAtBirthEnum,
    timeAccuracy: TimeAccuracyEnum,
    timeSource: TimeSourceEnum.nullable(),
    rectificationAnchors: z.string().nullable(), // JSON string
    notes: z.string().nullable()
  }),
  token: z.string()
});

// 에러 응답 스키마
export const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string()
  })
});

// 타입 정의
export type BasicSignUpInput = z.infer<typeof BasicSignUpSchema>;
export type BirthDataInput = z.infer<typeof BirthDataSchema>;
export type UserPrefsInput = z.infer<typeof UserPrefsSchema>;
export type CompleteSignUpInput = z.infer<typeof CompleteSignUpSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type RectificationAnchor = z.infer<typeof RectificationAnchorSchema>;




