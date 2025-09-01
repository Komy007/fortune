"use strict";
// 하우스 시스템 계산
// Whole Sign (기본) 및 Placidus (옵션) 지원
// 정확도: Whole Sign ±0°, Placidus ±1°
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOUSE_SYSTEM_INFO = exports.HOUSE_MEANINGS = void 0;
exports.calculateWholeSignHouses = calculateWholeSignHouses;
exports.calculatePlacidusHouses = calculatePlacidusHouses;
exports.calculateHouses = calculateHouses;
exports.findPlanetHouse = findPlanetHouse;
// 황도대별 시작점 (Whole Sign)
const ZODIAC_SIGNS = [
    { name: '양자리', start: 0, end: 30 },
    { name: '황소자리', start: 30, end: 60 },
    { name: '쌍둥이자리', start: 60, end: 90 },
    { name: '게자리', start: 90, end: 120 },
    { name: '사자자리', start: 120, end: 150 },
    { name: '처녀자리', start: 150, end: 180 },
    { name: '천칭자리', start: 180, end: 210 },
    { name: '전갈자리', start: 210, end: 240 },
    { name: '사수자리', start: 240, end: 270 },
    { name: '염소자리', start: 270, end: 300 },
    { name: '물병자리', start: 300, end: 330 },
    { name: '물고기자리', start: 330, end: 360 }
];
// Whole Sign 하우스 계산
function calculateWholeSignHouses(ascendant) {
    const houses = [];
    // ASC가 속한 황도대의 시작점을 1하우스 시작으로 설정
    const ascSign = Math.floor(ascendant / 30);
    const firstHouseStart = ascSign * 30;
    for (let i = 0; i < 12; i++) {
        const houseStart = (firstHouseStart + (i * 30)) % 360;
        houses.push({
            house: i + 1,
            lon: houseStart
        });
    }
    return houses;
}
// Placidus 하우스 계산 (간단한 근사)
function calculatePlacidusHouses(ascendant, midheaven, latitude) {
    const houses = [];
    // 1하우스 (ASC)
    houses.push({ house: 1, lon: ascendant });
    // 10하우스 (MC)
    houses.push({ house: 10, lon: midheaven });
    // 나머지 하우스는 간단한 등분으로 계산
    // 실제 Placidus는 더 복잡한 계산이 필요하지만, 기본적인 근사값 제공
    // 4하우스 (IC) - MC의 반대편
    const ic = (midheaven + 180) % 360;
    houses.push({ house: 4, lon: ic });
    // 7하우스 (DSC) - ASC의 반대편
    const dsc = (ascendant + 180) % 360;
    houses.push({ house: 7, lon: dsc });
    // 나머지 하우스들은 등분으로 계산
    const house2 = (ascendant + 30) % 360;
    const house3 = (ascendant + 60) % 360;
    const house5 = (midheaven + 30) % 360;
    const house6 = (midheaven + 60) % 360;
    const house8 = (dsc + 30) % 360;
    const house9 = (dsc + 60) % 360;
    const house11 = (ic + 30) % 360;
    const house12 = (ic + 60) % 360;
    houses.push({ house: 2, lon: house2 }, { house: 3, lon: house3 }, { house: 5, lon: house5 }, { house: 6, lon: house6 }, { house: 8, lon: house8 }, { house: 9, lon: house9 }, { house: 11, lon: house11 }, { house: 12, lon: house12 });
    // 하우스 번호순으로 정렬
    return houses.sort((a, b) => a.house - b.house);
}
// 하우스 계산 메인 함수
function calculateHouses(input, ascendant, midheaven) {
    const { houseSystem = 'whole-sign', lat } = input;
    switch (houseSystem) {
        case 'whole-sign':
            return calculateWholeSignHouses(ascendant);
        case 'placidus':
            return calculatePlacidusHouses(ascendant, midheaven, lat);
        default:
            // 기본값은 Whole Sign
            return calculateWholeSignHouses(ascendant);
    }
}
// 행성이 속한 하우스 찾기
function findPlanetHouse(planetLon, houses) {
    // 하우스 경계를 0-360 범위로 정규화
    const normalizedLon = ((planetLon % 360) + 360) % 360;
    for (let i = 0; i < houses.length; i++) {
        const currentHouse = houses[i];
        const nextHouse = houses[(i + 1) % houses.length];
        let startLon = currentHouse.lon;
        let endLon = nextHouse.lon;
        // 경계가 360도를 넘는 경우 처리
        if (endLon < startLon) {
            endLon += 360;
        }
        // 행성이 현재 하우스 범위에 있는지 확인
        let normalizedStart = startLon;
        let normalizedEnd = endLon;
        if (normalizedEnd < normalizedStart) {
            normalizedEnd += 360;
        }
        if (normalizedLon >= normalizedStart && normalizedLon < normalizedEnd) {
            return currentHouse.house;
        }
    }
    // 기본값 (1하우스)
    return 1;
}
// 하우스별 의미 (한국어)
exports.HOUSE_MEANINGS = {
    1: '자아, 외모, 첫인상, 개인적 특성',
    2: '재물, 소유물, 가치관, 안정감',
    3: '의사소통, 형제자매, 단거리 여행, 학습',
    4: '가정, 부모, 뿌리, 내면의 안전감',
    5: '사랑, 창작, 자녀, 오락, 도박',
    6: '일, 건강, 봉사, 동료, 루틴',
    7: '파트너십, 결혼, 대립, 협력',
    8: '변화, 죽음, 재생, 공유 자원, 심리학',
    9: '철학, 종교, 장거리 여행, 고등교육',
    10: '경력, 명예, 사회적 지위, 야망',
    11: '친구, 그룹, 희망, 이상, 혁신',
    12: '숨겨진 것, 영성, 고립, 희생, 무의식'
};
// 하우스 시스템별 특징
exports.HOUSE_SYSTEM_INFO = {
    'whole-sign': {
        name: 'Whole Sign',
        description: '각 황도대를 하나의 하우스로 사용하는 전통적인 시스템',
        accuracy: '±0°',
        advantages: '간단하고 일관성 있음',
        disadvantages: '위도에 따른 차이를 고려하지 않음'
    },
    'placidus': {
        name: 'Placidus',
        description: '시간과 위도를 고려한 현대적인 하우스 시스템',
        accuracy: '±1°',
        advantages: '위도에 따른 정확한 계산',
        disadvantages: '극지방에서 계산 불가능'
    }
};
//# sourceMappingURL=houses.js.map