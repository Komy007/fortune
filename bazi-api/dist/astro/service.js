"use strict";
// 점성술 서비스 계층
// 천궁도, 트랜짓, 시너스트리 계산의 핵심 로직
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLANET_MEANINGS = void 0;
exports.buildNatal = buildNatal;
exports.buildTransits = buildTransits;
exports.buildSynastry = buildSynastry;
exports.generateChartSummary = generateChartSummary;
const ephemeris_1 = require("./ephemeris");
const houses_1 = require("./houses");
const aspects_1 = require("./aspects");
const cache_1 = require("./cache");
// 출생 천궁도 계산
function buildNatal(input) {
    return (0, cache_1.withCache)(cache_1.CACHE_PREFIXES.NATAL_CHART, (chartInput) => {
        const startTime = Date.now();
        // 행성 위치 계산
        const planets = (0, ephemeris_1.calculateAllPlanetPositions)(chartInput);
        // ASC/MC 계산
        const siderealTime = (0, ephemeris_1.calculateSiderealTime)(chartInput);
        const ascendant = (0, ephemeris_1.calculateAscendant)(chartInput, siderealTime);
        const midheaven = (0, ephemeris_1.calculateMidheaven)(siderealTime);
        // 하우스 계산
        const houses = (0, houses_1.calculateHouses)(chartInput, ascendant, midheaven);
        // 어스펙트 계산
        const aspects = (0, aspects_1.calculateAllAspects)(planets);
        const calculationTime = Date.now() - startTime;
        return {
            input: chartInput,
            planets,
            houses,
            aspects,
            ascendant,
            midheaven,
            metadata: {
                julianDay: (0, ephemeris_1.toJulianDay)(chartInput),
                calculationTime: `${calculationTime}ms`,
                accuracy: 'Meeus 천문학 알고리즘 기반'
            }
        };
    }, input);
}
// 트랜짓 계산
function buildTransits(natal, transitDate, rangeDays = 7) {
    const transitInput = {
        ...natal.input,
        date: transitDate || new Date().toISOString().split('T')[0]
    };
    return (0, cache_1.withCache)(cache_1.CACHE_PREFIXES.TRANSIT, (input) => {
        const startTime = Date.now();
        // 트랜짓 행성 위치 계산
        const transitPlanets = (0, ephemeris_1.calculateAllPlanetPositions)(input.transitInput);
        // 트랜짓 어스펙트 계산 (외행성 위주)
        const transits = (0, aspects_1.calculateTransitAspects)(input.natal.planets, transitPlanets);
        // 강한 트랜짓만 필터링
        const strongTransits = (0, aspects_1.filterStrongAspects)(transits);
        const calculationTime = Date.now() - startTime;
        return {
            natal: input.natal,
            transitDate: input.transitInput.date,
            transits: strongTransits,
            metadata: {
                rangeDays: input.rangeDays,
                calculationTime: `${calculationTime}ms`
            }
        };
    }, { natal, transitInput, rangeDays });
}
// 시너스트리 계산
function buildSynastry(personA, personB) {
    return (0, cache_1.withCache)(cache_1.CACHE_PREFIXES.SYNASTRY, (input) => {
        const startTime = Date.now();
        // 두 사람의 천궁도 계산
        const natalA = buildNatal(input.personA);
        const natalB = buildNatal(input.personB);
        // 시너스트리 어스펙트 계산
        const synastryAspects = (0, aspects_1.calculateSynastryAspects)(natalA.planets, natalB.planets);
        // 호환성 점수 계산
        const compositeScore = calculateCompatibilityScore(synastryAspects);
        const calculationTime = Date.now() - startTime;
        return {
            personA: natalA,
            personB: natalB,
            synastryAspects,
            compositeScore,
            metadata: {
                calculationTime: `${calculationTime}ms`
            }
        };
    }, { personA, personB });
}
// 호환성 점수 계산 (0-100)
function calculateCompatibilityScore(aspects) {
    if (aspects.length === 0)
        return 50; // 중간값
    let totalScore = 0;
    let totalWeight = 0;
    for (const aspect of aspects) {
        const baseScore = getAspectBaseScore(aspect.type);
        const strengthMultiplier = getStrengthMultiplier(aspect.strength);
        const weight = 1; // 모든 어스펙트에 동일한 가중치
        totalScore += baseScore * strengthMultiplier * weight;
        totalWeight += weight;
    }
    const averageScore = totalScore / totalWeight;
    // 0-100 범위로 정규화
    return Math.max(0, Math.min(100, Math.round(averageScore * 10)));
}
// 어스펙트별 기본 점수
function getAspectBaseScore(aspectType) {
    const scores = {
        conjunction: 7, // 중성
        sextile: 8, // 조화
        square: 4, // 도전
        trine: 9, // 조화
        opposition: 5 // 도전
    };
    return scores[aspectType] || 5;
}
// 강도별 승수
function getStrengthMultiplier(strength) {
    const multipliers = {
        exact: 1.2,
        strong: 1.0,
        medium: 0.8,
        weak: 0.5
    };
    return multipliers[strength] || 0.5;
}
// 차트 요약 생성
function generateChartSummary(natal, lang = 'ko') {
    const { planets, aspects, houses } = natal;
    // 태양 위치
    const sun = planets.Sun;
    const sunSign = getZodiacSign(sun.lon);
    // 달 위치
    const moon = planets.Moon;
    const moonSign = getZodiacSign(moon.lon);
    // ASC 위치
    const ascSign = getZodiacSign(natal.ascendant);
    // 주요 어스펙트 수
    const strongAspects = (0, aspects_1.filterStrongAspects)(aspects);
    if (lang === 'ko') {
        return `${sunSign} 태양, ${moonSign} 달, ${ascSign} 상승점의 천궁도입니다. 주요 어스펙트 ${strongAspects.length}개가 있습니다.`;
    }
    else {
        return `Natal chart with Sun in ${sunSign}, Moon in ${moonSign}, and Ascendant in ${ascSign}. ${strongAspects.length} major aspects found.`;
    }
}
// 황도대 계산
function getZodiacSign(longitude) {
    const signs = [
        '양자리', '황소자리', '쌍둥이자리', '게자리', '사자자리', '처녀자리',
        '천칭자리', '전갈자리', '사수자리', '염소자리', '물병자리', '물고기자리'
    ];
    const signIndex = Math.floor(longitude / 30);
    return signs[signIndex] || '양자리';
}
// 행성별 의미 (한국어)
exports.PLANET_MEANINGS = {
    Sun: '자아, 핵심 정체성, 의지, 아버지',
    Moon: '감정, 직감, 어머니, 내면의 세계',
    Mercury: '의사소통, 사고, 학습, 형제자매',
    Venus: '사랑, 미, 조화, 파트너십',
    Mars: '행동, 에너지, 성욕, 경쟁',
    Jupiter: '확장, 지혜, 행운, 철학',
    Saturn: '제한, 책임, 시간, 권위',
    Uranus: '혁신, 독창성, 반란, 변화',
    Neptune: '꿈, 환상, 영성, 직감',
    Pluto: '변화, 재생, 권력, 심층 심리'
};
//# sourceMappingURL=service.js.map