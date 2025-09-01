import { BasicSignUpInput, BirthDataInput, UserPrefsInput, CompleteSignUpInput, LoginInput, AuthResponse } from './schemas-extended';
/**
 * 1단계: 기본 회원가입 (계정 생성)
 */
export declare function basicSignUp(input: BasicSignUpInput): Promise<{
    userId: string;
    token: string;
}>;
/**
 * 2단계: 출생 정보 저장
 */
export declare function saveBirthData(userId: string, input: BirthDataInput): Promise<void>;
/**
 * 3단계: 사용자 설정 저장
 */
export declare function saveUserPrefs(userId: string, input: UserPrefsInput): Promise<void>;
/**
 * 완전한 회원가입 (모든 단계 한번에)
 */
export declare function completeSignUp(input: CompleteSignUpInput): Promise<AuthResponse>;
/**
 * 로그인 서비스 (확장된 정보 포함)
 */
export declare function loginExtended(input: LoginInput): Promise<AuthResponse>;
/**
 * 사용자 정보 조회 서비스 (확장된 정보 포함)
 */
export declare function getUserByIdExtended(userId: string): Promise<{
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
        currentResidenceCity: string | null;
        occupation: string | null;
        role: string | null;
        goals: string | null;
        constraints: string | null;
        interpretationExperience: string | null;
        interpretationTone: string | null;
        interests: string | null;
        decisionTimeline: string | null;
    };
    birthData: {
        id: string;
        birthDate: string;
        birthTime: string;
        birthPlace: string;
        birthCountry: string;
        birthTimezone: string;
        sexAtBirth: string;
        timeAccuracy: string;
        timeSource: string | null;
        rectificationAnchors: string | null;
        notes: string | null;
    } | null;
}>;
//# sourceMappingURL=service-extended.d.ts.map