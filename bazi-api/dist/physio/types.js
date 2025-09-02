"use strict";
// 관상학 모듈 타입 정의
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHYSIO_RULES = exports.QUALITY_THRESHOLDS = void 0;
// 품질 기준 상수
exports.QUALITY_THRESHOLDS = {
    MIN_RESOLUTION: 720,
    MAX_TILT_ANGLE: 15,
    MIN_FACE_SCORE: 0.7,
    MIN_QUALITY_SCORE: 0.6
};
// 관상학 규칙 상수
exports.PHYSIO_RULES = {
    // 이마 관련
    FOREHEAD_RATIOS: {
        IDEAL_UPPER: 0.33,
        IDEAL_MIDDLE: 0.33,
        IDEAL_LOWER: 0.34
    },
    // 눈 관련
    EYE_SPACING: {
        NARROW: 0.8,
        WIDE: 1.2
    },
    // 코 관련
    NASAL_STRAIGHTNESS: {
        STRAIGHT: 0.9,
        CURVED: 0.6
    },
    // 입 관련
    LIP_CORNER_SLOPE: {
        UPWARD: 0.1,
        DOWNWARD: -0.1
    },
    // 턱 관련
    CHIN_PROJECTION: {
        STRONG: 0.8,
        WEAK: 0.4
    }
};
