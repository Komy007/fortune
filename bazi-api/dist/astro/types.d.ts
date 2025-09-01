export type Planet = 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto';
export type HouseSystem = 'whole-sign' | 'placidus';
export type AspectType = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';
export type Language = 'ko' | 'en';
export interface ChartInput {
    date: string;
    time: string;
    tz: string;
    lat: number;
    lon: number;
    houseSystem?: HouseSystem;
    lang?: Language;
}
export interface SynastryInput {
    personA: ChartInput;
    personB: ChartInput;
}
export interface TransitInput {
    natal: ChartInput;
    date?: string;
    rangeDays?: number;
}
export interface PlanetPosition {
    lon: number;
    lat: number;
    distance?: number;
    speed?: number;
}
export interface HouseCusp {
    house: number;
    lon: number;
}
export interface Aspect {
    planet1: Planet;
    planet2: Planet;
    type: AspectType;
    angle: number;
    orb: number;
    strength: 'exact' | 'strong' | 'medium' | 'weak';
}
export interface NatalChart {
    input: ChartInput;
    planets: Record<Planet, PlanetPosition>;
    houses: HouseCusp[];
    aspects: Aspect[];
    ascendant: number;
    midheaven: number;
    metadata: {
        julianDay: number;
        calculationTime: string;
        accuracy: string;
    };
}
export interface TransitChart {
    natal: NatalChart;
    transitDate: string;
    transits: Aspect[];
    metadata: {
        rangeDays: number;
        calculationTime: string;
    };
}
export interface SynastryChart {
    personA: NatalChart;
    personB: NatalChart;
    synastryAspects: Aspect[];
    compositeScore: number;
    metadata: {
        calculationTime: string;
    };
}
export declare const PLANET_NAMES: Record<Planet, string>;
export declare const ASPECT_ORBS: Record<AspectType, number>;
export declare const ASPECT_ANGLES: Record<AspectType, number>;
export declare const HARMONIOUS_ASPECTS: AspectType[];
export declare const CHALLENGING_ASPECTS: AspectType[];
export declare const NEUTRAL_ASPECTS: AspectType[];
//# sourceMappingURL=types.d.ts.map