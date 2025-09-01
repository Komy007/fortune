"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.extractTokenFromHeader = extractTokenFromHeader;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
// JWT 페이로드 스키마
const JWTPayloadSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    email: zod_1.z.string().email(),
    displayName: zod_1.z.string()
});
/**
 * JWT 토큰 발급
 * @param payload JWT 페이로드
 * @returns JWT 토큰
 */
function generateToken(payload) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    return jsonwebtoken_1.default.sign(payload, secret, {
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
function verifyToken(token) {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET environment variable is not set');
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret, {
            issuer: 'bazi-api',
            audience: 'bazi-app'
        });
        return JWTPayloadSchema.parse(decoded);
    }
    catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
}
/**
 * Authorization 헤더에서 토큰 추출
 * @param authHeader Authorization 헤더 값
 * @returns 토큰 또는 null
 */
function extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}
//# sourceMappingURL=jwt.js.map