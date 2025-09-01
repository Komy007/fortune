import { SignUpInput, LoginInput, AuthResponse } from './schemas';
/**
 * 회원가입 서비스
 * @param input 회원가입 입력 데이터
 * @returns 인증 응답
 */
export declare function signUp(input: SignUpInput): Promise<AuthResponse>;
/**
 * 로그인 서비스
 * @param input 로그인 입력 데이터
 * @returns 인증 응답
 */
export declare function login(input: LoginInput): Promise<AuthResponse>;
/**
 * 사용자 정보 조회 서비스
 * @param userId 사용자 ID
 * @returns 사용자 정보 (토큰 제외)
 */
export declare function getUserById(userId: string): Promise<{
    user: {
        id: string;
        email: string;
        displayName: string;
    };
    prefs: {
        id: string;
        language: string;
        reportTimezone: string;
        notificationEmailOptIn: boolean;
        termsAcceptedAt: string | null;
        privacyAcceptedAt: string | null;
        consentProcessingBirthData: boolean;
    };
}>;
//# sourceMappingURL=service.d.ts.map