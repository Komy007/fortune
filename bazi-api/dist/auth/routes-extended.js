"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schemas_extended_1 = require("./schemas-extended");
const service_extended_1 = require("./service-extended");
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
 * POST /api/auth/signup/step1
 * 1단계: 기본 회원가입 (계정 생성)
 */
router.post('/signup/step1', async (req, res) => {
    try {
        // 입력 데이터 검증
        const validatedData = schemas_extended_1.BasicSignUpSchema.parse(req.body);
        // 기본 회원가입 처리
        const result = await (0, service_extended_1.basicSignUp)(validatedData);
        // HttpOnly 쿠키 설정
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7일
        });
        // 응답
        res.status(201).json({
            success: true,
            message: '1단계 회원가입이 완료되었습니다. 출생 정보를 입력해주세요.',
            userId: result.userId,
            token: result.token
        });
    }
    catch (error) {
        console.error('Step 1 signup error:', error);
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
 * POST /api/auth/signup/step2
 * 2단계: 출생 정보 저장
 */
router.post('/signup/step2', authenticateToken, async (req, res) => {
    try {
        // 입력 데이터 검증
        const validatedData = schemas_extended_1.BirthDataSchema.parse(req.body);
        const user = req.user;
        // 출생 정보 저장
        await (0, service_extended_1.saveBirthData)(user.userId, validatedData);
        // 응답
        res.status(200).json({
            success: true,
            message: '출생 정보가 저장되었습니다. 사용자 설정을 입력해주세요.'
        });
    }
    catch (error) {
        console.error('Step 2 signup error:', error);
        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: error.errors[0]?.message || '입력 데이터가 올바르지 않습니다'
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
 * POST /api/auth/signup/step3
 * 3단계: 사용자 설정 저장
 */
router.post('/signup/step3', authenticateToken, async (req, res) => {
    try {
        // 입력 데이터 검증
        const validatedData = schemas_extended_1.UserPrefsSchema.parse(req.body);
        const user = req.user;
        // 사용자 설정 저장
        await (0, service_extended_1.saveUserPrefs)(user.userId, validatedData);
        // 응답
        res.status(200).json({
            success: true,
            message: '회원가입이 완료되었습니다!'
        });
    }
    catch (error) {
        console.error('Step 3 signup error:', error);
        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: error.errors[0]?.message || '입력 데이터가 올바르지 않습니다'
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
 * POST /api/auth/signup/complete
 * 완전한 회원가입 (모든 단계 한번에)
 */
router.post('/signup/complete', async (req, res) => {
    try {
        // 입력 데이터 검증
        const validatedData = schemas_extended_1.CompleteSignUpSchema.parse(req.body);
        // 완전한 회원가입 처리
        const result = await (0, service_extended_1.completeSignUp)(validatedData);
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
        console.error('Complete signup error:', error);
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
 * 로그인 (확장된 정보 포함)
 */
router.post('/login', async (req, res) => {
    try {
        // 입력 데이터 검증
        const validatedData = schemas_extended_1.LoginSchema.parse(req.body);
        // 로그인 처리
        const result = await (0, service_extended_1.loginExtended)(validatedData);
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
 * 현재 사용자 정보 조회 (확장된 정보 포함)
 */
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const result = await (0, service_extended_1.getUserByIdExtended)(user.userId);
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
 * PUT /api/auth/birth-data
 * 출생 정보 업데이트
 */
router.put('/birth-data', authenticateToken, async (req, res) => {
    try {
        // 입력 데이터 검증
        const validatedData = schemas_extended_1.BirthDataSchema.parse(req.body);
        const user = req.user;
        // 출생 정보 업데이트
        await (0, service_extended_1.saveBirthData)(user.userId, validatedData);
        res.status(200).json({
            success: true,
            message: '출생 정보가 업데이트되었습니다.'
        });
    }
    catch (error) {
        console.error('Update birth data error:', error);
        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: error.errors[0]?.message || '입력 데이터가 올바르지 않습니다'
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
 * PUT /api/auth/preferences
 * 사용자 설정 업데이트
 */
router.put('/preferences', authenticateToken, async (req, res) => {
    try {
        // 입력 데이터 검증
        const validatedData = schemas_extended_1.UserPrefsSchema.parse(req.body);
        const user = req.user;
        // 사용자 설정 업데이트
        await (0, service_extended_1.saveUserPrefs)(user.userId, validatedData);
        res.status(200).json({
            success: true,
            message: '사용자 설정이 업데이트되었습니다.'
        });
    }
    catch (error) {
        console.error('Update preferences error:', error);
        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: error.errors[0]?.message || '입력 데이터가 올바르지 않습니다'
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
