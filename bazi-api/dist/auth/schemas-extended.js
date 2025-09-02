"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponseSchema = exports.AuthResponseSchema = exports.LoginSchema = exports.Step3SignUpSchema = exports.Step2SignUpSchema = exports.Step1SignUpSchema = exports.CompleteSignUpSchema = exports.UserPrefsSchema = exports.BirthDataSchema = exports.BasicSignUpSchema = void 0;
const zod_1 = require("zod");
// 언어 옵션
const LanguageEnum = zod_1.z.enum(['ko', 'en', 'km']);
// 성별 옵션
const SexAtBirthEnum = zod_1.z.enum(['male', 'female']);
// 시간 정밀도 옵션
const TimeAccuracyEnum = zod_1.z.enum(['exact', 'about', 'unknown']);
// 시간 소스 옵션
const TimeSourceEnum = zod_1.z.enum(['hospital_record', 'family_memory', 'other']);
// 해석 톤 옵션
const InterpretationToneEnum = zod_1.z.enum(['business', 'emotional']);
// 의사결정 시계열 옵션
const DecisionTimelineEnum = zod_1.z.enum(['thisMonth', '3m', '6m', '12m']);
// 관심 주제 옵션
const InterestEnum = zod_1.z.enum(['재물/투자', '직업/사업', '관계/배우자', '건강', '타이밍']);
// 사건 앵커 스키마
const RectificationAnchorSchema = zod_1.z.object({
    event: zod_1.z.string().min(1, '사건명을 입력해주세요'),
    date: zod_1.z.string().regex(/^\d{4}-\d{2}$/, 'YYYY-MM 형식으로 입력해주세요'),
    description: zod_1.z.string().optional()
});
// 기본 회원가입 스키마 (1단계)
exports.BasicSignUpSchema = zod_1.z.object({
    email: zod_1.z.string().email('올바른 이메일 형식을 입력해주세요'),
    password: zod_1.z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
    displayName: zod_1.z.string().min(2, '이름은 2자 이상이어야 합니다').max(40, '이름은 40자 이하여야 합니다'),
    termsAccepted: zod_1.z.boolean().refine(val => val === true, '이용약관에 동의해야 합니다'),
    privacyAccepted: zod_1.z.boolean().refine(val => val === true, '개인정보처리방침에 동의해야 합니다'),
    consentProcessingBirthData: zod_1.z.boolean().refine(val => val === true, '생년월일시 데이터 처리에 동의해야 합니다')
});
// 출생 정보 스키마 (2단계 - 필수)
exports.BirthDataSchema = zod_1.z.object({
    birthDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 형식으로 입력해주세요'),
    birthTime: zod_1.z.string().regex(/^\d{2}:\d{2}$/, 'HH:mm 형식으로 입력해주세요'),
    birthPlace: zod_1.z.string().min(1, '출생지를 입력해주세요'),
    birthCountry: zod_1.z.string().min(1, '국가를 입력해주세요'),
    birthTimezone: zod_1.z.string().min(1, '시간대를 선택해주세요'),
    sexAtBirth: SexAtBirthEnum,
    timeAccuracy: TimeAccuracyEnum,
    timeSource: TimeSourceEnum.optional(),
    rectificationAnchors: zod_1.z.array(RectificationAnchorSchema).optional(),
    notes: zod_1.z.string().optional()
});
// 사용자 설정 스키마 (3단계 - 권장)
exports.UserPrefsSchema = zod_1.z.object({
    language: LanguageEnum.default('ko'),
    reportTimezone: zod_1.z.string().min(1, '시간대를 선택해주세요').default('Asia/Phnom_Penh'),
    notificationEmailOptIn: zod_1.z.boolean().default(false),
    currentResidenceCity: zod_1.z.string().optional(),
    occupation: zod_1.z.string().optional(),
    role: zod_1.z.string().optional(),
    goals: zod_1.z.string().optional(),
    constraints: zod_1.z.string().optional(),
    interpretationExperience: InterpretationToneEnum.optional(),
    interpretationTone: InterpretationToneEnum.optional(),
    interests: zod_1.z.array(InterestEnum).optional(),
    decisionTimeline: DecisionTimelineEnum.optional()
});
// 완전한 회원가입 스키마 (모든 단계)
exports.CompleteSignUpSchema = exports.BasicSignUpSchema.merge(exports.BirthDataSchema).merge(exports.UserPrefsSchema);
// 단계별 회원가입 스키마
exports.Step1SignUpSchema = exports.BasicSignUpSchema;
exports.Step2SignUpSchema = exports.BirthDataSchema;
exports.Step3SignUpSchema = exports.UserPrefsSchema;
// 로그인 스키마
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('올바른 이메일 형식을 입력해주세요'),
    password: zod_1.z.string().min(1, '비밀번호를 입력해주세요')
});
// API 응답 스키마
exports.AuthResponseSchema = zod_1.z.object({
    user: zod_1.z.object({
        id: zod_1.z.string(),
        email: zod_1.z.string().email(),
        displayName: zod_1.z.string()
    }),
    prefs: zod_1.z.object({
        id: zod_1.z.string(),
        language: LanguageEnum,
        reportTimezone: zod_1.z.string(),
        notificationEmailOptIn: zod_1.z.boolean(),
        termsAcceptedAt: zod_1.z.string().nullable(),
        privacyAcceptedAt: zod_1.z.string().nullable(),
        consentProcessingBirthData: zod_1.z.boolean(),
        currentResidenceCity: zod_1.z.string().nullable(),
        occupation: zod_1.z.string().nullable(),
        role: zod_1.z.string().nullable(),
        goals: zod_1.z.string().nullable(),
        constraints: zod_1.z.string().nullable(),
        interpretationExperience: InterpretationToneEnum.nullable(),
        interpretationTone: InterpretationToneEnum.nullable(),
        interests: zod_1.z.string().nullable(), // JSON string
        decisionTimeline: DecisionTimelineEnum.nullable()
    }),
    birthData: zod_1.z.object({
        id: zod_1.z.string(),
        birthDate: zod_1.z.string(),
        birthTime: zod_1.z.string(),
        birthPlace: zod_1.z.string(),
        birthCountry: zod_1.z.string(),
        birthTimezone: zod_1.z.string(),
        sexAtBirth: SexAtBirthEnum,
        timeAccuracy: TimeAccuracyEnum,
        timeSource: TimeSourceEnum.nullable(),
        rectificationAnchors: zod_1.z.string().nullable(), // JSON string
        notes: zod_1.z.string().nullable()
    }),
    token: zod_1.z.string()
});
// 에러 응답 스키마
exports.ErrorResponseSchema = zod_1.z.object({
    error: zod_1.z.object({
        code: zod_1.z.string(),
        message: zod_1.z.string()
    })
});
