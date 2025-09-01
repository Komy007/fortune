import { z } from 'zod';
declare const JWTPayloadSchema: z.ZodObject<{
    userId: z.ZodString;
    email: z.ZodString;
    displayName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    displayName: string;
    userId: string;
}, {
    email: string;
    displayName: string;
    userId: string;
}>;
export type JWTPayload = z.infer<typeof JWTPayloadSchema>;
/**
 * JWT 토큰 발급
 * @param payload JWT 페이로드
 * @returns JWT 토큰
 */
export declare function generateToken(payload: JWTPayload): string;
/**
 * JWT 토큰 검증
 * @param token JWT 토큰
 * @returns 검증된 페이로드 또는 null
 */
export declare function verifyToken(token: string): JWTPayload | null;
/**
 * Authorization 헤더에서 토큰 추출
 * @param authHeader Authorization 헤더 값
 * @returns 토큰 또는 null
 */
export declare function extractTokenFromHeader(authHeader: string | undefined): string | null;
export {};
//# sourceMappingURL=jwt.d.ts.map