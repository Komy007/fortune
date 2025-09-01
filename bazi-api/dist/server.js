"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const zod_1 = require("zod");
const bazi_1 = require("./core/bazi");
const types_1 = require("./types");
const routes_extended_1 = __importDefault(require("./auth/routes-extended"));
const routes_1 = __importDefault(require("./astro/routes"));
const routes_2 = __importDefault(require("./tarot/routes"));
const routes_3 = __importDefault(require("./physio/routes"));
const swe_1 = require("./astro/swe");
const swagger_1 = require("./astro/swagger");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// 미들웨어 설정
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 정적 파일 서빙
app.use(express_1.default.static('public'));
// Bazi 엔진 인스턴스
const baziEngine = new bazi_1.BaziEngine();
// Swiss Ephemeris 초기화
try {
    (0, swe_1.initSwissEphemeris)();
    console.log('✅ Swiss Ephemeris initialized successfully');
}
catch (error) {
    console.error('❌ Swiss Ephemeris initialization failed:', error);
    console.log('📋 Please run: npm run fetch-ephe');
}
// Auth 라우터 연결
app.use('/api/auth', routes_extended_1.default);
// Astrology 라우터 연결
app.use('/api/astro', routes_1.default);
// Physiognomy 라우터 연결
app.use('/api/physio', routes_3.default);
// Tarot 라우터 연결
app.use('/api/tarot', routes_2.default);
// Swagger UI 문서
app.use('/docs', swagger_1.swaggerUiSetup);
// 입력 검증 스키마
const BaziInputSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2, '이름은 2자 이상이어야 합니다').max(40, '이름은 40자 이하여야 합니다'),
    sexAtBirth: zod_1.z.enum(['male', 'female']),
    birth: zod_1.z.object({
        date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 형식이어야 합니다'),
        time: zod_1.z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'HH:mm 또는 HH:mm:ss 형식이어야 합니다'),
        place: zod_1.z.string().min(1, '출생지가 필요합니다'),
        unknownTime: zod_1.z.boolean().optional(),
        placeGeo: zod_1.z.object({
            lat: zod_1.z.number(),
            lon: zod_1.z.number()
        }).optional()
    }),
    calendarNote: zod_1.z.literal('solar').optional(),
    contact: zod_1.z.string().email('올바른 이메일 형식이어야 합니다').optional(),
    locale: zod_1.z.enum(['ko', 'en', 'km']).default('ko')
});
// 명리학 분석 메인 엔드포인트
app.post('/api/bazi', async (req, res) => {
    try {
        console.log('🔮 명리학 분석 요청 받음:', req.body);
        // 입력 검증
        const validatedData = BaziInputSchema.parse(req.body);
        // Bazi 계산 수행
        const result = baziEngine.calculateBazi(validatedData.birth, validatedData.sexAtBirth);
        const response = {
            success: true,
            result
        };
        console.log('✅ 명리학 분석 완료');
        return res.json(response);
    }
    catch (error) {
        console.error('❌ 명리학 분석 오류:', error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: 'validation_error',
                message: '입력 데이터 검증 실패',
                details: error.errors
            });
        }
        return res.status(500).json({
            success: false,
            error: 'internal_error',
            message: '서버 내부 오류가 발생했습니다.'
        });
    }
});
// Rectification 엔드포인트
app.post('/api/rectify', async (req, res) => {
    try {
        console.log('🔧 Rectification 요청 받음:', req.body);
        // 입력 검증
        const validatedData = types_1.RectificationRequestSchema.parse(req.body);
        // 여기서는 간단한 응답만 반환
        // 실제로는 사용자 응답을 기반으로 후보를 확정하는 로직 필요
        const response = {
            success: true,
            result: {
                confirmed: true,
                confidence: 0.9
            }
        };
        console.log('✅ Rectification 완료');
        return res.json(response);
    }
    catch (error) {
        console.error('❌ Rectification 오류:', error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: 'validation_error',
                message: '입력 데이터 검증 실패',
                details: error.errors
            });
        }
        return res.status(500).json({
            success: false,
            error: 'internal_error',
            message: '서버 내부 오류가 발생했습니다.'
        });
    }
});
// 헬스체크 엔드포인트
app.get('/health', (req, res) => {
    const healthCheck = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        service: 'Bazi Analysis API',
        uptime: process.uptime(),
        memory: process.memoryUsage()
    };
    res.json(healthCheck);
});
// 기존 호환성 엔드포인트들
app.post('/api/bazi/simple', async (req, res) => {
    try {
        const { birthData } = req.body;
        if (!birthData) {
            return res.status(400).json({
                success: false,
                error: 'missing_birth_data',
                message: '생년월일 정보가 필요합니다.'
            });
        }
        // 기존 형식으로 변환
        const convertedBirthData = {
            date: `${birthData.year}-${birthData.month.toString().padStart(2, '0')}-${birthData.day.toString().padStart(2, '0')}`,
            time: `${birthData.hour.toString().padStart(2, '0')}:00`,
            place: birthData.place || '서울',
            unknownTime: false
        };
        const result = baziEngine.calculateBazi(convertedBirthData, 'male');
        return res.json({
            success: true,
            result: {
                pillars: result.pillars,
                dayMaster: result.pillars.day.stem,
                dayElement: result.pillars.day.element,
                elementCounts: result.five_elements,
                calculationTime: new Date().toISOString()
            }
        });
    }
    catch (error) {
        console.error('Simple Bazi analysis error:', error);
        return res.status(500).json({
            success: false,
            error: 'analysis_failed',
            message: '분석 중 오류가 발생했습니다.'
        });
    }
});
// 오행 분석 엔드포인트
app.post('/api/elements', async (req, res) => {
    try {
        const { birthData } = req.body;
        if (!birthData) {
            return res.status(400).json({
                success: false,
                error: 'missing_birth_data',
                message: '생년월일 정보가 필요합니다.'
            });
        }
        // 기존 형식으로 변환
        const convertedBirthData = {
            date: `${birthData.year}-${birthData.month.toString().padStart(2, '0')}-${birthData.day.toString().padStart(2, '0')}`,
            time: `${birthData.hour.toString().padStart(2, '0')}:00`,
            place: birthData.place || '서울',
            unknownTime: false
        };
        const result = baziEngine.calculateBazi(convertedBirthData, 'male');
        const elementAnalysis = {
            dayElement: result.pillars.day.element,
            elementCounts: result.five_elements,
            strongestElement: Object.entries(result.five_elements)
                .reduce((a, b) => result.five_elements[a[0]] > result.five_elements[b[0]] ? a : b)[0] || '목',
            weakestElement: Object.entries(result.five_elements)
                .reduce((a, b) => result.five_elements[a[0]] < result.five_elements[b[0]] ? a : b)[0] || '수',
            balanceScore: calculateBalanceScore(result.five_elements)
        };
        return res.json({
            success: true,
            result: elementAnalysis
        });
    }
    catch (error) {
        console.error('Elements analysis error:', error);
        return res.status(500).json({
            success: false,
            error: 'analysis_failed',
            message: '분석 중 오류가 발생했습니다.'
        });
    }
});
// 운세 기둥 엔드포인트
app.post('/api/luck-pillars', async (req, res) => {
    try {
        const { birthData } = req.body;
        if (!birthData) {
            return res.status(400).json({
                success: false,
                error: 'missing_birth_data',
                message: '생년월일 정보가 필요합니다.'
            });
        }
        // 기존 형식으로 변환
        const convertedBirthData = {
            date: `${birthData.year}-${birthData.month.toString().padStart(2, '0')}-${birthData.day.toString().padStart(2, '0')}`,
            time: `${birthData.hour.toString().padStart(2, '0')}:00`,
            place: birthData.place || '서울',
            unknownTime: false
        };
        const result = baziEngine.calculateBazi(convertedBirthData, 'male');
        return res.json({
            success: true,
            result: {
                timeline: result.timeline,
                answers: result.answers
            }
        });
    }
    catch (error) {
        console.error('Luck pillars analysis error:', error);
        return res.status(500).json({
            success: false,
            error: 'analysis_failed',
            message: '분석 중 오류가 발생했습니다.'
        });
    }
});
// 오행 균형 점수 계산
function calculateBalanceScore(elementCounts) {
    const values = Object.values(elementCounts);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);
    // 표준편차가 작을수록 균형잡힌 상태 (0~100 점수)
    const balanceScore = Math.max(0, 100 - (standardDeviation * 100));
    return Math.round(balanceScore);
}
// 404 핸들러
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: '요청한 엔드포인트를 찾을 수 없습니다'
    });
});
// 전역 에러 핸들러
app.use((error, req, res, next) => {
    console.error('🚨 서버 오류:', error);
    res.status(500).json({
        success: false,
        error: '서버 내부 오류가 발생했습니다'
    });
});
// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 Bazi Analysis API 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    console.log(`📊 환경: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔮 서비스: 명리학 분석 API`);
    console.log(`📅 버전: 1.0.0`);
});
exports.default = app;
//# sourceMappingURL=server.js.map