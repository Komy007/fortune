"use strict";
// 점성술 API 라우터
// Express Router를 사용한 RESTful API 엔드포인트
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schemas_1 = require("./schemas");
const service_1 = require("./service");
const cache_1 = require("./cache");
const router = (0, express_1.Router)();
// 에러 핸들러 미들웨어
const errorHandler = (err, req, res, next) => {
    console.error('Astrology API Error:', err);
    if (err.name === 'ZodError') {
        return res.status(400).json({
            success: false,
            error: 'validation_error',
            message: '입력 데이터 검증 실패',
            details: err.errors
        });
    }
    res.status(500).json({
        success: false,
        error: 'internal_error',
        message: '서버 내부 오류가 발생했습니다'
    });
};
// 출생 천궁도 API
router.post('/chart', async (req, res, next) => {
    try {
        // 입력 검증
        const validatedInput = (0, schemas_1.validateChartInput)(req.body);
        // 천궁도 계산
        const natalChart = (0, service_1.buildNatal)(validatedInput);
        // 요약 생성
        const summary = (0, service_1.generateChartSummary)(natalChart, validatedInput.lang);
        res.json({
            success: true,
            result: {
                ...natalChart,
                summary
            },
            message: '천궁도 계산이 완료되었습니다'
        });
    }
    catch (error) {
        next(error);
    }
});
// 트랜짓 API
router.post('/transits', async (req, res, next) => {
    try {
        // 입력 검증
        const validatedInput = (0, schemas_1.validateTransitInput)(req.body);
        // 나탈 차트 계산 (캐시 활용)
        const natalChart = (0, service_1.buildNatal)(validatedInput.natal);
        // 트랜짓 계산
        const transitChart = (0, service_1.buildTransits)(natalChart, validatedInput.date, validatedInput.rangeDays);
        res.json({
            success: true,
            result: transitChart,
            message: '트랜짓 계산이 완료되었습니다'
        });
    }
    catch (error) {
        next(error);
    }
});
// 시너스트리 API
router.post('/synastry', async (req, res, next) => {
    try {
        // 입력 검증
        const validatedInput = (0, schemas_1.validateSynastryInput)(req.body);
        // 시너스트리 계산
        const synastryChart = (0, service_1.buildSynastry)(validatedInput.personA, validatedInput.personB);
        // 호환성 해석
        const compatibility = interpretCompatibility(synastryChart.compositeScore);
        res.json({
            success: true,
            result: {
                ...synastryChart,
                compatibility
            },
            message: '시너스트리 분석이 완료되었습니다'
        });
    }
    catch (error) {
        next(error);
    }
});
// 헬스체크 API
router.get('/health', (req, res) => {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    res.json({
        success: true,
        status: 'healthy',
        uptime: `${Math.floor(uptime)}s`,
        memory: {
            used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
            total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
        },
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});
// 캐시 상태 API
router.get('/cache/status', (req, res) => {
    (0, cache_1.logCacheStatus)();
    res.json({
        success: true,
        message: '캐시 상태가 로그에 출력되었습니다'
    });
});
// 캐시 클리어 API
router.post('/cache/clear', (req, res) => {
    const { clearCache } = require('./cache');
    clearCache();
    res.json({
        success: true,
        message: '캐시가 초기화되었습니다'
    });
});
// 호환성 해석 함수
function interpretCompatibility(score) {
    if (score >= 80) {
        return '매우 높은 호환성 - 이상적인 파트너십';
    }
    else if (score >= 60) {
        return '높은 호환성 - 좋은 관계 발전 가능';
    }
    else if (score >= 40) {
        return '보통 호환성 - 서로 이해하고 노력하면 가능';
    }
    else if (score >= 20) {
        return '낮은 호환성 - 많은 이해와 노력 필요';
    }
    else {
        return '매우 낮은 호환성 - 상당한 도전과제';
    }
}
// 입력 검증 에러 핸들러
router.use((err, req, res, next) => {
    if (err.name === 'ZodError') {
        const errors = err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message
        }));
        return res.status(400).json({
            success: false,
            error: 'validation_error',
            message: '입력 데이터가 올바르지 않습니다',
            details: errors
        });
    }
    next(err);
});
// 일반 에러 핸들러
router.use(errorHandler);
exports.default = router;
//# sourceMappingURL=routes.js.map