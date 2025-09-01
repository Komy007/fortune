export declare function seedToNumber(seedStr: string): number;
export declare function seededShuffle<T>(arr: T[], seedStr: string): T[];
export declare function pickOrientation(seedStr: string, index: number): 'upright' | 'reversed';
export declare function seededRandom(seedStr: string, min?: number, max?: number): number;
export declare function seededChoice<T>(arr: T[], seedStr: string): T;
//# sourceMappingURL=rng.d.ts.map