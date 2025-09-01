"use strict";
// 관상학 API 라우터
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schemas_1 = require("./schemas");
const service_1 = require("./service");
const lru_cache_1 = require("lru-cache");
const router = express_1.default.Router();
// LRU 캐시 설정 (10분 TTL)
const cache = new lru_cache_1.LRUCache({
    max: 100,
    ttl: 1000 * 60 * 10, // 10분
    updateAgeOnGet: true
});
// 관상학 분석 API
router.post('/analyze', async (req, res) => {
    try {
        console.log('🔍 관상학 분석 요청 받음');
        // 입력 데이터 검증
        const validationResult = schemas_1.PhysioInputSchema.safeParse(req.body);
        if (!validationResult.success) {
            console.log('❌ 입력 데이터 검증 실패:', validationResult.error);
            return res.status(400).json({
                success: false,
                error: 'invalid_input',
                message: '입력 데이터가 올바르지 않습니다',
                details: validationResult.error.errors
            });
        }
        const input = validationResult.data;
        console.log('✅ 입력 데이터 검증 완료');
        // 캐시 확인
        const cacheKey = (0, service_1.getCacheKey)(input);
        const cachedResult = cache.get(cacheKey);
        if (cachedResult) {
            console.log('✅ 캐시된 결과 반환');
            return res.json({
                success: true,
                result: cachedResult,
                message: '관상학 분석이 완료되었습니다 (캐시)'
            });
        }
        // 관상학 분석 수행
        console.log('🔄 관상학 분석 시작');
        const result = await (0, service_1.analyzePhysiognomy)(input);
        // 결과 검증
        const resultValidation = schemas_1.PhysioResponseSchema.safeParse({
            success: true,
            result
        });
        if (!resultValidation.success) {
            console.log('❌ 결과 검증 실패:', resultValidation.error);
            return res.status(500).json({
                success: false,
                error: 'analysis_failed',
                message: '분석 결과 생성에 실패했습니다'
            });
        }
        // 캐시에 저장
        cache.set(cacheKey, result);
        console.log('✅ 분석 완료 및 캐시 저장');
        res.json({
            success: true,
            result,
            message: '관상학 분석이 완료되었습니다'
        });
    }
    catch (error) {
        console.error('❌ 관상학 분석 오류:', error);
        res.status(500).json({
            success: false,
            error: 'internal_error',
            message: '서버 내부 오류가 발생했습니다'
        });
    }
});
// 캐시 상태 확인 API
router.get('/cache/status', (req, res) => {
    try {
        const stats = {
            size: cache.size,
            max: cache.max,
            ttl: cache.ttl,
            keys: Array.from(cache.keys())
        };
        res.json({
            success: true,
            cache: stats
        });
    }
    catch (error) {
        console.error('캐시 상태 확인 오류:', error);
        res.status(500).json({
            success: false,
            error: 'cache_error',
            message: '캐시 상태 확인에 실패했습니다'
        });
    }
});
// 캐시 초기화 API
router.post('/cache/clear', (req, res) => {
    try {
        cache.clear();
        console.log('✅ 관상학 캐시 초기화 완료');
        res.json({
            success: true,
            message: '캐시가 초기화되었습니다'
        });
    }
    catch (error) {
        console.error('캐시 초기화 오류:', error);
        res.status(500).json({
            success: false,
            error: 'cache_clear_error',
            message: '캐시 초기화에 실패했습니다'
        });
    }
});
// 헬스체크 API
router.get('/health', (req, res) => {
    res.json({
        success: true,
        service: 'physiognomy',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
// API 문서
router.get('/docs', (req, res) => {
    const docs = {
        title: '관상학 API 문서',
        version: '1.0.0',
        endpoints: {
            'POST /analyze': {
                description: '관상학 분석 수행',
                body: {
                    frontalImageBase64: 'string (정면 이미지 Base64)',
                    profileImageBase64: 'string (측면 이미지 Base64)',
                    goal: 'string (선택: career, finance, relationship, health)',
                    lang: 'string (선택: ko, en, km)'
                },
                response: {
                    success: 'boolean',
                    result: 'PhysioAnalysis object',
                    message: 'string'
                }
            },
            'GET /health': {
                description: '서비스 상태 확인',
                response: {
                    success: 'boolean',
                    service: 'string',
                    status: 'string'
                }
            },
            'GET /cache/status': {
                description: '캐시 상태 확인',
                response: {
                    success: 'boolean',
                    cache: 'object'
                }
            },
            'POST /cache/clear': {
                description: '캐시 초기화',
                response: {
                    success: 'boolean',
                    message: 'string'
                }
            }
        }
    };
    res.json(docs);
});
exports.default = router;
//# sourceMappingURL=routes.js.map