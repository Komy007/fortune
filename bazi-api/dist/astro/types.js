"use strict";
// 점성술 모듈 타입 정의
// 정확도: Meeus 천문학 알고리즘 기반, 정밀도 ±0.1°
Object.defineProperty(exports, "__esModule", { value: true });
exports.NEUTRAL_ASPECTS = exports.CHALLENGING_ASPECTS = exports.HARMONIOUS_ASPECTS = exports.ASPECT_ANGLES = exports.ASPECT_ORBS = exports.PLANET_NAMES = void 0;
// 상수 정의
exports.PLANET_NAMES = {
    Sun: '태양',
    Moon: '달',
    Mercury: '수성',
    Venus: '금성',
    Mars: '화성',
    Jupiter: '목성',
    Saturn: '토성',
    Uranus: '천왕성',
    Neptune: '해왕성',
    Pluto: '명왕성'
};
exports.ASPECT_ORBS = {
    conjunction: 8,
    sextile: 6,
    square: 8,
    trine: 8,
    opposition: 8
};
exports.ASPECT_ANGLES = {
    conjunction: 0,
    sextile: 60,
    square: 90,
    trine: 120,
    opposition: 180
};
exports.HARMONIOUS_ASPECTS = ['sextile', 'trine'];
exports.CHALLENGING_ASPECTS = ['square', 'opposition'];
exports.NEUTRAL_ASPECTS = ['conjunction'];
//# sourceMappingURL=types.js.map