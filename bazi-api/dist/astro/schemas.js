"use strict";
// 점성술 모듈 Zod 스키마
// 입력 검증 및 타입 안전성 보장
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.TransitInputSchema = exports.SynastryInputSchema = exports.ChartInputSchema = void 0;
exports.validateChartInput = validateChartInput;
exports.validateSynastryInput = validateSynastryInput;
exports.validateTransitInput = validateTransitInput;
const zod_1 = require("zod");
const luxon_1 = require("luxon");
// 기본 스키마
const dateSchema = zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '날짜는 YYYY-MM-DD 형식이어야 합니다');
const timeSchema = zod_1.z.string().regex(/^\d{2}:\d{2}$/, '시간은 HH:mm 형식이어야 합니다');
const latitudeSchema = zod_1.z.number().min(-90).max(90);
const longitudeSchema = zod_1.z.number().min(-180).max(180);
// 타임존 검증 함수
function isValidTimezone(tz) {
    try {
        luxon_1.DateTime.now().setZone(tz);
        return true;
    }
    catch {
        return false;
    }
}
// 차트 입력 스키마
exports.ChartInputSchema = zod_1.z.object({
    date: dateSchema,
    time: timeSchema,
    tz: zod_1.z.string().refine(isValidTimezone, '유효한 IANA 타임존이어야 합니다 (예: Asia/Seoul)'),
    lat: latitudeSchema,
    lon: longitudeSchema,
    houseSystem: zod_1.z.enum(['whole-sign', 'placidus']).optional().default('whole-sign'),
    lang: zod_1.z.enum(['ko', 'en']).optional().default('ko')
});
// 시너스트리 입력 스키마
exports.SynastryInputSchema = zod_1.z.object({
    personA: exports.ChartInputSchema,
    personB: exports.ChartInputSchema
});
// 트랜짓 입력 스키마
exports.TransitInputSchema = zod_1.z.object({
    natal: exports.ChartInputSchema,
    date: dateSchema.optional(),
    rangeDays: zod_1.z.number().int().min(1).max(30).optional().default(7)
});
// 검증 함수들
function validateChartInput(input) {
    return exports.ChartInputSchema.parse(input);
}
function validateSynastryInput(input) {
    return exports.SynastryInputSchema.parse(input);
}
function validateTransitInput(input) {
    return exports.TransitInputSchema.parse(input);
}
// 에러 메시지 (한국어)
exports.ERROR_MESSAGES = {
    INVALID_DATE: '날짜 형식이 올바르지 않습니다 (YYYY-MM-DD)',
    INVALID_TIME: '시간 형식이 올바르지 않습니다 (HH:mm)',
    INVALID_TIMEZONE: '유효한 타임존이어야 합니다 (예: Asia/Seoul, America/New_York)',
    INVALID_LATITUDE: '위도는 -90에서 90 사이여야 합니다',
    INVALID_LONGITUDE: '경도는 -180에서 180 사이여야 합니다',
    INVALID_HOUSE_SYSTEM: '하우스 시스템은 whole-sign 또는 placidus여야 합니다',
    INVALID_LANGUAGE: '언어는 ko 또는 en이어야 합니다',
    INVALID_RANGE_DAYS: '기간은 1에서 30일 사이여야 합니다'
};
//# sourceMappingURL=schemas.js.map