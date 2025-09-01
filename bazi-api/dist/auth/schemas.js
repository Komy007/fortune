"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponseSchema = exports.AuthResponseSchema = exports.LoginSchema = exports.SignUpSchema = void 0;
const zod_1 = require("zod");
// 언어 옵션
const LanguageEnum = zod_1.z.enum(['ko', 'en', 'km']);
// 회원가입 스키마
exports.SignUpSchema = zod_1.z.object({
    email: zod_1.z.string().email('올바른 이메일 형식을 입력해주세요'),
    password: zod_1.z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
    displayName: zod_1.z.string().min(2, '이름은 2자 이상이어야 합니다').max(40, '이름은 40자 이하여야 합니다'),
    language: LanguageEnum.default('ko'),
    reportTimezone: zod_1.z.string().min(1, '시간대를 선택해주세요').default('Asia/Phnom_Penh'),
    notificationEmailOptIn: zod_1.z.boolean().default(false),
    termsAccepted: zod_1.z.boolean().refine(val => val === true, '이용약관에 동의해야 합니다'),
    privacyAccepted: zod_1.z.boolean().refine(val => val === true, '개인정보처리방침에 동의해야 합니다'),
    consentProcessingBirthData: zod_1.z.boolean().refine(val => val === true, '생년월일시 데이터 처리에 동의해야 합니다')
});
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
        consentProcessingBirthData: zod_1.z.boolean()
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
//# sourceMappingURL=schemas.js.map