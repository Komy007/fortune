"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schemas_1 = require("./schemas");
const service_1 = require("./service");
const jwt_1 = require("./jwt");
const router = (0, express_1.Router)();
// 인증 미들웨어
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = (0, jwt_1.extractTokenFromHeader)(authHeader);
    if (!token) {
        return res.status(401).json({
            error: {
                code: 'UNAUTHORIZED',
                message: '인증 토큰이 필요합니다'
            }
        });
    }
    const payload = (0, jwt_1.verifyToken)(token);
    if (!payload) {
        return res.status(401).json({
            error: {
                code: 'INVALID_TOKEN',
                message: '유효하지 않은 토큰입니다'
            }
        });
    }
    // 요청 객체에 사용자 정보 추가
    req.user = payload;
    next();
};
/**
 * POST /api/auth/signup
 * 회원가입
 */
router.post('/signup', async (req, res) => {
    try {
        // 입력 데이터 검증
        const validatedData = schemas_1.SignUpSchema.parse(req.body);
        // 회원가입 처리
        const result = await (0, service_1.signUp)(validatedData);
        // HttpOnly 쿠키 설정
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7일
        });
        // 응답
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Signup error:', error);
        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: error.errors[0]?.message || '입력 데이터가 올바르지 않습니다'
                }
            });
        }
        if (error.message === '이미 사용 중인 이메일입니다') {
            return res.status(409).json({
                error: {
                    code: 'EMAIL_EXISTS',
                    message: error.message
                }
            });
        }
        res.status(500).json({
            error: {
                code: 'INTERNAL_ERROR',
                message: '서버 오류가 발생했습니다'
            }
        });
    }
});
/**
 * POST /api/auth/login
 * 로그인
 */
router.post('/login', async (req, res) => {
    try {
        // 입력 데이터 검증
        const validatedData = schemas_1.LoginSchema.parse(req.body);
        // 로그인 처리
        const result = await (0, service_1.login)(validatedData);
        // HttpOnly 쿠키 설정
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7일
        });
        // 응답
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Login error:', error);
        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: error.errors[0]?.message || '입력 데이터가 올바르지 않습니다'
                }
            });
        }
        if (error.message === '이메일 또는 비밀번호가 올바르지 않습니다') {
            return res.status(401).json({
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: error.message
                }
            });
        }
        res.status(500).json({
            error: {
                code: 'INTERNAL_ERROR',
                message: '서버 오류가 발생했습니다'
            }
        });
    }
});
/**
 * GET /api/auth/me
 * 현재 사용자 정보 조회 (인증 필요)
 */
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const result = await (0, service_1.getUserById)(user.userId);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Get user error:', error);
        if (error.message === '사용자를 찾을 수 없습니다') {
            return res.status(404).json({
                error: {
                    code: 'USER_NOT_FOUND',
                    message: error.message
                }
            });
        }
        res.status(500).json({
            error: {
                code: 'INTERNAL_ERROR',
                message: '서버 오류가 발생했습니다'
            }
        });
    }
});
/**
 * POST /api/auth/logout
 * 로그아웃
 */
router.post('/logout', (req, res) => {
    // 쿠키 삭제
    res.clearCookie('token');
    res.status(200).json({
        message: '로그아웃되었습니다'
    });
});
exports.default = router;
//# sourceMappingURL=routes.js.map