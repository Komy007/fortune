/**
 * Swiss Ephemeris 래퍼
 *
 * 정확도: Swiss Ephemeris 2.10.03 기준, geocentric ecliptic coordinates
 * 한계: 주요 행성만 계산 (Chiron, Ceres 등 소행성 제외)
 * 참고: https://www.astro.com/swisseph/swephinfo_e.htm
 */
import { Planet, PlanetPosition, ChartInput, HouseSystem } from './types';
/**
 * Swiss Ephemeris 초기화
 */
export declare function initSwissEphemeris(ephePath?: string): void;
/**
 * 날짜를 율리우스 일로 변환
 */
export declare function toJulian(dateTime: Date): number;
/**
 * UTC 시간에서 행성 위치 계산
 */
export declare function calcPlanetsUTC(input: ChartInput): Record<Planet, PlanetPosition>;
/**
 * 하우스 계산
 */
export declare function calcHouses(input: ChartInput, system: HouseSystem): {
    asc: number;
    mc: number;
    houses: Array<{
        house: number;
        longitude: number;
    }>;
};
/**
 * 특정 날짜의 행성 위치 계산 (트랜짓용)
 */
export declare function calcPlanetsForDate(date: string, time: string, tz: string): Record<Planet, PlanetPosition>;
/**
 * Swiss Ephemeris 버전 정보
 */
export declare function getSwissEphemerisInfo(): {
    version: string;
    path: string;
};
//# sourceMappingURL=swe.d.ts.map