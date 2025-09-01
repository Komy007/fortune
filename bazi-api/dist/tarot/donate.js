"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DONATE = void 0;
exports.trackClick = trackClick;
exports.getDonationInfo = getDonationInfo;
const pino_1 = __importDefault(require("pino"));
const logger = (0, pino_1.default)();
// 도네이션 정보
exports.DONATE = {
    paypal: {
        address: "cambodia.bae@gmail.com",
        qr: "/assets/donate/paypal-qr.png"
    },
    usdt: {
        address: "TRC20: TQn9Y2khDD8LKPcLJbTvB2VnJkK5mNpQrS",
        qr: "/assets/donate/usdt-qr.png"
    }
};
// 클릭 추적
function trackClick(kind) {
    logger.info('Donation click tracked', {
        kind,
        timestamp: new Date().toISOString(),
        userAgent: 'web-client'
    });
}
// 도네이션 정보 가져오기
function getDonationInfo() {
    return exports.DONATE;
}
//# sourceMappingURL=donate.js.map