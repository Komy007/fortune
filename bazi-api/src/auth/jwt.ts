import jwt from 'jsonwebtoken';
import { z } from 'zod';

// JWT 페이로드 스키마
const JWTPayloadSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  displayName: z.string()
});

export type JWTPayload = z.infer<typeof JWTPayloadSchema>;

/**
 * JWT 토큰 발급
 * @param payload JWT 페이로드
 * @returns JWT 토큰
 */
export function generateToken(payload: JWTPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  return jwt.sign(payload, secret, {
    expiresIn: '7d',
    issuer: 'bazi-api',
    audience: 'bazi-app'
  });
}

/**
 * JWT 토큰 검증
 * @param token JWT 토큰
 * @returns 검증된 페이로드 또는 null
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    const decoded = jwt.verify(token, secret, {
      issuer: 'bazi-api',
      audience: 'bazi-app'
    });

    return JWTPayloadSchema.parse(decoded);
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Authorization 헤더에서 토큰 추출
 * @param authHeader Authorization 헤더 값
 * @returns 토큰 또는 null
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}



