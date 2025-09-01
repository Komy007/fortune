import { DateTime } from 'luxon';
import { Planet, PlanetPosition, ChartInput } from './types';
export declare function toUTC(input: ChartInput): DateTime;
export declare function toJulianDay(input: ChartInput): number;
export declare function calculatePlanetPosition(planet: Planet, jd: number): PlanetPosition;
export declare function calculateAllPlanetPositions(input: ChartInput): Record<Planet, PlanetPosition>;
export declare function calculateAscendant(input: ChartInput, siderealTime: number): number;
export declare function calculateMidheaven(siderealTime: number): number;
export declare function calculateSiderealTime(input: ChartInput): number;
export declare const ACCURACY_INFO: {
    readonly Sun: "±0.01°";
    readonly Moon: "±0.1°";
    readonly Mercury: "±0.5°";
    readonly Venus: "±0.3°";
    readonly Mars: "±0.5°";
    readonly Jupiter: "±0.5°";
    readonly Saturn: "±0.5°";
    readonly Uranus: "±1.0°";
    readonly Neptune: "±1.0°";
    readonly Pluto: "±2.0°";
};
//# sourceMappingURL=ephemeris.d.ts.map