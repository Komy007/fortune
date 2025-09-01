export declare function createCacheKey(prefix: string, data: any): string;
export declare function getFromCache<T>(key: string): T | undefined;
export declare function setCache<T>(key: string, value: T): void;
export declare function deleteFromCache(key: string): boolean;
export declare function getCacheStats(): {
    size: number;
    max: number;
    ttl: number;
};
export declare function clearCache(): void;
export declare function withCache<T, R>(prefix: string, fn: (input: T) => R, input: T): R;
export declare function logCacheStatus(): void;
export declare const CACHE_PREFIXES: {
    readonly NATAL_CHART: "natal";
    readonly TRANSIT: "transit";
    readonly SYNASTRY: "synastry";
    readonly PLANET_POSITIONS: "planets";
    readonly HOUSES: "houses";
    readonly ASPECTS: "aspects";
};
//# sourceMappingURL=cache.d.ts.map