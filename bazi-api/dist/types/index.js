"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RectificationRequestSchema = exports.BaziRequestSchema = exports.BirthDataSchema = void 0;
const zod_1 = require("zod");
// 기본 입력 스키마
exports.BirthDataSchema = zod_1.z.object({
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 형식이어야 합니다'),
    time: zod_1.z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'HH:mm 또는 HH:mm:ss 형식이어야 합니다'),
    place: zod_1.z.string().min(1, '출생지가 필요합니다'),
    unknownTime: zod_1.z.boolean().optional(),
    placeGeo: zod_1.z.object({
        lat: zod_1.z.number(),
        lon: zod_1.z.number()
    }).optional()
});
exports.BaziRequestSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2, '이름은 2자 이상이어야 합니다').max(40, '이름은 40자 이하여야 합니다'),
    sexAtBirth: zod_1.z.enum(['male', 'female']),
    birth: exports.BirthDataSchema,
    calendarNote: zod_1.z.literal('solar').optional(),
    contact: zod_1.z.string().email('올바른 이메일 형식이어야 합니다').optional(),
    locale: zod_1.z.enum(['ko', 'en', 'km']).default('ko')
});
// Rectification 요청
exports.RectificationRequestSchema = zod_1.z.object({
    candidateIndex: zod_1.z.number(),
    userResponse: zod_1.z.string()
});
