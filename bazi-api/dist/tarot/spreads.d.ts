export interface SpreadPosition {
    pos: number;
    name: string;
    meaning: string;
}
export declare const SPREADS: {
    one: {
        pos: number;
        name: string;
        meaning: string;
    }[];
    three: {
        pos: number;
        name: string;
        meaning: string;
    }[];
};
export declare const getSpreadName: (spreadId: string, lang?: string) => string;
//# sourceMappingURL=spreads.d.ts.map