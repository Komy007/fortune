import { z } from 'zod';

// 언어 옵션
const LanguageEnum = z.enum(['ko', 'en', 'km']);

// 회원가입 스키마
export const SignUpSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
  displayName: z.string().min(2, '이름은 2자 이상이어야 합니다').max(40, '이름은 40자 이하여야 합니다'),
  language: LanguageEnum.default('ko'),
  reportTimezone: z.string().min(1, '시간대를 선택해주세요').default('Asia/Phnom_Penh'),
  notificationEmailOptIn: z.boolean().default(false),
  termsAccepted: z.boolean().refine(val => val === true, '이용약관에 동의해야 합니다'),
  privacyAccepted: z.boolean().refine(val => val === true, '개인정보처리방침에 동의해야 합니다'),
  consentProcessingBirthData: z.boolean().refine(val => val === true, '생년월일시 데이터 처리에 동의해야 합니다')
});

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
    consentProcessingBirthData: z.boolean()
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

export type SignUpInput = z.infer<typeof SignUpSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;



