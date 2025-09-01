"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedToNumber = seedToNumber;
exports.seededShuffle = seededShuffle;
exports.pickOrientation = pickOrientation;
exports.seededRandom = seededRandom;
exports.seededChoice = seededChoice;
const murmurhash_js_1 = require("murmurhash-js");
// Mulberry32 PRNG
function mulberry32(a) {
    return function () {
        let t = a += 0x6D2B79F5 | 0;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
// 시드 문자열을 숫자로 변환
function seedToNumber(seedStr) {
    return (0, murmurhash_js_1.murmur3)(seedStr);
}
// 시드 기반 셔플
function seededShuffle(arr, seedStr) {
    const seed = seedToNumber(seedStr);
    const random = mulberry32(seed);
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
// 시드 기반 방향 선택 (50/50)
function pickOrientation(seedStr, index) {
    const seed = seedToNumber(seedStr + index);
    const random = mulberry32(seed);
    return random() < 0.5 ? 'upright' : 'reversed';
}
// 시드 기반 랜덤 숫자
function seededRandom(seedStr, min = 0, max = 1) {
    const seed = seedToNumber(seedStr);
    const random = mulberry32(seed);
    return min + random() * (max - min);
}
// 시드 기반 선택
function seededChoice(arr, seedStr) {
    const seed = seedToNumber(seedStr);
    const random = mulberry32(seed);
    return arr[Math.floor(random() * arr.length)];
}
//# sourceMappingURL=rng.js.map