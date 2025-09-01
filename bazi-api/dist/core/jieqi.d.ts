import { DateTime } from 'luxon';
import { JieQiData } from '../types';
export declare const JIEQI_DEFINITIONS: ({
    name: string;
    longitude: number;
    type: "major";
} | {
    name: string;
    longitude: number;
    type: "minor";
})[];
export declare const MAJOR_JIEQI: {
    name: string;
    longitude: number;
    type: "major";
}[];
export declare class JieQiCalculator {
    private cache;
    /**
     * 특정 연도의 24절기 계산
     */
    calculateJieQiForYear(year: number): JieQiData[];
    /**
     * 태양 황경을 기반으로 절기 날짜 계산
     * 실제로는 Swiss Ephemeris를 사용해야 하지만, 여기서는 근사값 사용
     */
    private calculateJieQiDate;
    /**
     * 주어진 날짜의 월주를 중기 기준으로 판정
     */
    getMonthPillarByJieQi(birthDate: DateTime): {
        month: number;
        confidence: number;
    };
    /**
     * 경계 감도 검사
     */
    checkBoundarySensitivity(birthDate: DateTime): {
        hasMonthBoundary: boolean;
        hasYearBoundary: boolean;
        confidence: number;
    };
    /**
     * 캐시 초기화
     */
    clearCache(): void;
}
export declare const jieqiCalculator: JieQiCalculator;
//# sourceMappingURL=jieqi.d.ts.map