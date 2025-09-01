"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schemas_1 = require("./schemas");
const service_1 = require("./service");
const donate_1 = require("./donate");
const spreads_1 = require("./spreads");
const pino_1 = __importDefault(require("pino"));
const logger = (0, pino_1.default)();
const router = express_1.default.Router();
// 카드 뽑기 API
router.post('/draw', async (req, res) => {
    try {
        // 요청 검증
        const validation = schemas_1.DrawRequestSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                error: 'Invalid request data',
                details: validation.error.errors
            });
        }
        const request = validation.data;
        logger.info('Tarot draw request', {
            userId: request.userId,
            spread: request.spread,
            lang: request.lang,
            hasQuestion: !!request.question
        });
        // 카드 뽑기 실행
        const result = await (0, service_1.drawCards)(request);
        if (result.success) {
            logger.info('Tarot draw successful', {
                userId: request.userId,
                cardsCount: result.result?.cards.length
            });
        }
        else {
            logger.error('Tarot draw failed', {
                userId: request.userId,
                error: result.error
            });
        }
        res.json(result);
    }
    catch (error) {
        logger.error('Tarot draw error', { error });
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// 스프레드 목록 API
router.get('/spreads', (req, res) => {
    try {
        const spreads = Object.entries(spreads_1.SPREADS).map(([id, positions]) => ({
            id,
            name: id === 'one' ? '오늘의 카드' : '과거-현재-미래',
            description: id === 'one' ? '단일 카드로 오늘의 메시지를 받아보세요' : '시간의 흐름을 따라 상황을 파악하세요',
            positions: positions.length
        }));
        res.json({
            success: true,
            spreads
        });
    }
    catch (error) {
        logger.error('Get spreads error', { error });
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// 카드 정보 API
router.get('/cards/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { lang = 'ko' } = req.query;
        // 실제로는 덱에서 카드 정보를 찾아야 함
        res.json({
            success: true,
            card: {
                id,
                name: '카드 이름',
                description: '카드 설명'
            }
        });
    }
    catch (error) {
        logger.error('Get card error', { error });
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// 도네이션 클릭 추적 API
router.post('/donate/click', (req, res) => {
    try {
        const { type } = req.body;
        if (type === 'paypal' || type === 'usdt') {
            (0, donate_1.trackClick)(type);
            logger.info('Donation click tracked', { type });
            res.json({
                success: true,
                message: 'Click tracked successfully'
            });
        }
        else {
            res.status(400).json({
                success: false,
                error: 'Invalid donation type'
            });
        }
    }
    catch (error) {
        logger.error('Donation click error', { error });
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=routes.js.map