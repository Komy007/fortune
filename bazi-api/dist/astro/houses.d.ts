import { HouseCusp, ChartInput } from './types';
export declare function calculateWholeSignHouses(ascendant: number): HouseCusp[];
export declare function calculatePlacidusHouses(ascendant: number, midheaven: number, latitude: number): HouseCusp[];
export declare function calculateHouses(input: ChartInput, ascendant: number, midheaven: number): HouseCusp[];
export declare function findPlanetHouse(planetLon: number, houses: HouseCusp[]): number;
export declare const HOUSE_MEANINGS: {
    readonly 1: "자아, 외모, 첫인상, 개인적 특성";
    readonly 2: "재물, 소유물, 가치관, 안정감";
    readonly 3: "의사소통, 형제자매, 단거리 여행, 학습";
    readonly 4: "가정, 부모, 뿌리, 내면의 안전감";
    readonly 5: "사랑, 창작, 자녀, 오락, 도박";
    readonly 6: "일, 건강, 봉사, 동료, 루틴";
    readonly 7: "파트너십, 결혼, 대립, 협력";
    readonly 8: "변화, 죽음, 재생, 공유 자원, 심리학";
    readonly 9: "철학, 종교, 장거리 여행, 고등교육";
    readonly 10: "경력, 명예, 사회적 지위, 야망";
    readonly 11: "친구, 그룹, 희망, 이상, 혁신";
    readonly 12: "숨겨진 것, 영성, 고립, 희생, 무의식";
};
export declare const HOUSE_SYSTEM_INFO: {
    readonly 'whole-sign': {
        readonly name: "Whole Sign";
        readonly description: "각 황도대를 하나의 하우스로 사용하는 전통적인 시스템";
        readonly accuracy: "±0°";
        readonly advantages: "간단하고 일관성 있음";
        readonly disadvantages: "위도에 따른 차이를 고려하지 않음";
    };
    readonly placidus: {
        readonly name: "Placidus";
        readonly description: "시간과 위도를 고려한 현대적인 하우스 시스템";
        readonly accuracy: "±1°";
        readonly advantages: "위도에 따른 정확한 계산";
        readonly disadvantages: "극지방에서 계산 불가능";
    };
};
//# sourceMappingURL=houses.d.ts.map