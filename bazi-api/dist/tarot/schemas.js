"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawResultSchema = exports.DrawRequestSchema = exports.DonationSchema = exports.SummarySchema = exports.CardSchema = void 0;
const zod_1 = require("zod");
// 카드 스키마
exports.CardSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    orientation: zod_1.z.enum(['upright', 'reversed']),
    position: zod_1.z.string().optional(),
    meaning: zod_1.z.string()
});
// 요약 스키마
exports.SummarySchema = zod_1.z.object({
    archetype: zod_1.z.string(),
    summary: zod_1.z.array(zod_1.z.string()),
    actions: zod_1.z.array(zod_1.z.string()),
    caution: zod_1.z.string()
});
// 도네이션 스키마
exports.DonationSchema = zod_1.z.object({
    paypal: zod_1.z.object({
        address: zod_1.z.string(),
        qr: zod_1.z.string()
    }),
    usdt: zod_1.z.object({
        address: zod_1.z.string(),
        qr: zod_1.z.string()
    })
});
// 카드 뽑기 요청 스키마
exports.DrawRequestSchema = zod_1.z.object({
    spread: zod_1.z.enum(['one', 'three']),
    question: zod_1.z.string().optional(),
    lang: zod_1.z.enum(['ko', 'en', 'km']).default('ko'),
    userId: zod_1.z.string().optional(),
    seed: zod_1.z.string().optional()
});
// 카드 뽑기 결과 스키마
exports.DrawResultSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    result: zod_1.z.object({
        spread: zod_1.z.string(),
        question: zod_1.z.string().optional(),
        lang: zod_1.z.string(),
        cards: zod_1.z.array(exports.CardSchema),
        summary: exports.SummarySchema,
        donation: exports.DonationSchema
    }).optional(),
    error: zod_1.z.string().optional()
});
//# sourceMappingURL=schemas.js.map