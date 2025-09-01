"use strict";
// 관상학 모듈 Zod 스키마
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageQualitySchema = exports.PhysioResponseSchema = exports.PhysioAnalysisSchema = exports.FaceRatiosSchema = exports.QualityMetricsSchema = exports.PhysioInputSchema = void 0;
exports.generateCacheKey = generateCacheKey;
const zod_1 = require("zod");
// 입력 데이터 검증 스키마
exports.PhysioInputSchema = zod_1.z.object({
    frontalImageBase64: zod_1.z.string()
        .min(1000, '정면 이미지가 필요합니다')
        .refine((val) => {
        try {
            // Base64 형식 검증
            const header = val.substring(0, 30);
            return header.includes('data:image/') || header.includes('/9j/') || header.includes('iVBORw0KGgo');
        }
        catch {
            return false;
        }
    }, '올바른 이미지 형식이 아닙니다'),
    profileImageBase64: zod_1.z.string()
        .min(1000, '측면 이미지가 필요합니다')
        .refine((val) => {
        try {
            const header = val.substring(0, 30);
            return header.includes('data:image/') || header.includes('/9j/') || header.includes('iVBORw0KGgo');
        }
        catch {
            return false;
        }
    }, '올바른 이미지 형식이 아닙니다'),
    goal: zod_1.z.enum(['career', 'finance', 'relationship', 'health']).optional(),
    lang: zod_1.z.enum(['ko', 'en', 'km']).optional().default('ko')
});
// 품질 메트릭스 스키마
exports.QualityMetricsSchema = zod_1.z.object({
    frontalScore: zod_1.z.number().min(0).max(1),
    profileScore: zod_1.z.number().min(0).max(1),
    issues: zod_1.z.array(zod_1.z.string())
});
// 얼굴 비율 스키마
exports.FaceRatiosSchema = zod_1.z.object({
    faceThirds: zod_1.z.object({
        upper: zod_1.z.number().min(0).max(2),
        middle: zod_1.z.number().min(0).max(2),
        lower: zod_1.z.number().min(0).max(2)
    }),
    eyeSpacing: zod_1.z.number().min(0).max(2),
    eyeCornerAngle: zod_1.z.number().min(-45).max(45),
    nasalStraightness: zod_1.z.number().min(0).max(1),
    nasalProjection: zod_1.z.number().min(0).max(1),
    philtrumToUpperLip: zod_1.z.number().min(0).max(3),
    lipCornerSlope: zod_1.z.number().min(-45).max(45),
    chinProjection: zod_1.z.number().min(0).max(1),
    jawAngle: zod_1.z.number().min(0).max(180),
    jawWidthToCheek: zod_1.z.number().min(0).max(2),
    asymmetry: zod_1.z.number().min(0).max(1)
});
// 분석 결과 스키마
exports.PhysioAnalysisSchema = zod_1.z.object({
    quality: exports.QualityMetricsSchema,
    ratios: exports.FaceRatiosSchema,
    summary: zod_1.z.string().min(50).max(200),
    reportMarkdown: zod_1.z.string().min(1000).max(5000)
});
// 응답 스키마
exports.PhysioResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    result: exports.PhysioAnalysisSchema.optional(),
    error: zod_1.z.string().optional(),
    message: zod_1.z.string().optional()
});
// 이미지 품질 검증 스키마
exports.ImageQualitySchema = zod_1.z.object({
    width: zod_1.z.number().min(720, '최소 720px 해상도가 필요합니다'),
    height: zod_1.z.number().min(720, '최소 720px 해상도가 필요합니다'),
    faceDetected: zod_1.z.boolean().refine(val => val, '얼굴이 검출되지 않았습니다'),
    tiltAngle: zod_1.z.number().max(15, '15도 이하의 기울기만 허용됩니다'),
    brightness: zod_1.z.number().min(0.3).max(0.9, '적절한 밝기가 아닙니다'),
    contrast: zod_1.z.number().min(0.4).max(0.8, '적절한 대비가 아닙니다')
});
// 캐시 키 생성 함수
function generateCacheKey(input) {
    const { frontalImageBase64, profileImageBase64, goal, lang } = input;
    const hash = require('crypto').createHash('md5');
    hash.update(frontalImageBase64.substring(0, 1000));
    hash.update(profileImageBase64.substring(0, 1000));
    hash.update(goal || '');
    hash.update(lang || 'ko');
    return `physio:${hash.digest('hex')}`;
}
//# sourceMappingURL=schemas.js.map