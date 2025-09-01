import { Planet, Aspect, AspectType, PlanetPosition } from './types';
export declare function calculateAngleDifference(angle1: number, angle2: number): number;
export declare function getAspectType(angle: number): AspectType | null;
export declare function calculateAspectStrength(orb: number, aspectType: AspectType): 'exact' | 'strong' | 'medium' | 'weak';
export declare function calculateAspect(planet1: Planet, position1: PlanetPosition, planet2: Planet, position2: PlanetPosition): Aspect | null;
export declare function calculateAllAspects(planets: Record<Planet, PlanetPosition>): Aspect[];
export declare function filterAspectsByType(aspects: Aspect[], type: AspectType): Aspect[];
export declare function filterStrongAspects(aspects: Aspect[]): Aspect[];
export declare function filterHarmoniousAspects(aspects: Aspect[]): Aspect[];
export declare function filterChallengingAspects(aspects: Aspect[]): Aspect[];
export declare function calculateTransitAspects(natalPlanets: Record<Planet, PlanetPosition>, transitPlanets: Record<Planet, PlanetPosition>): Aspect[];
export declare function calculateSynastryAspects(personAPlanets: Record<Planet, PlanetPosition>, personBPlanets: Record<Planet, PlanetPosition>): Aspect[];
export declare function calculateAspectStrengthScore(aspect: Aspect): number;
export declare const ASPECT_MEANINGS: {
    readonly conjunction: {
        readonly name: "합";
        readonly description: "두 행성이 같은 위치에 있을 때, 에너지가 집중되고 강화됨";
        readonly nature: "중성";
        readonly orb: "±8°";
    };
    readonly sextile: {
        readonly name: "육합";
        readonly description: "60도 각도로 조화로운 관계, 기회와 협력";
        readonly nature: "조화";
        readonly orb: "±6°";
    };
    readonly square: {
        readonly name: "사각";
        readonly description: "90도 각도로 긴장과 도전, 성장의 기회";
        readonly nature: "도전";
        readonly orb: "±8°";
    };
    readonly trine: {
        readonly name: "삼합";
        readonly description: "120도 각도로 자연스러운 조화와 편안함";
        readonly nature: "조화";
        readonly orb: "±8°";
    };
    readonly opposition: {
        readonly name: "충";
        readonly description: "180도 각도로 극단적인 대립과 균형";
        readonly nature: "도전";
        readonly orb: "±8°";
    };
};
//# sourceMappingURL=aspects.d.ts.map