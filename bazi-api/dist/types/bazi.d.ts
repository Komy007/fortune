/**
 * 명리학 관련 타입 정의
 */
export type Element = '목' | '화' | '토' | '금' | '수';
export type TenGod = '비견' | '겁재' | '식신' | '상관' | '편재' | '정재' | '편관' | '정관' | '편인' | '정인';
export type HeavenlyStem = '갑' | '을' | '병' | '정' | '무' | '기' | '경' | '신' | '임' | '계';
export type EarthlyBranch = '자' | '축' | '인' | '묘' | '진' | '사' | '오' | '미' | '신' | '유' | '술' | '해';
export interface Pillar {
    stem: HeavenlyStem;
    branch: EarthlyBranch;
    element?: Element;
}
export interface BirthData {
    year: number;
    month: number;
    day: number;
    hour?: number;
    timezone?: string;
    place?: string;
    unknownTime?: boolean;
}
export interface BaziResult {
    pillars: {
        year: Pillar;
        month: Pillar;
        day: Pillar;
        hour: Pillar;
    };
    elementCounts: Record<Element, number>;
    tenGods: Record<string, TenGod>;
    usefulGods: Element[];
    luckPillars: Array<{
        period: string;
        pillar: string;
        age: number;
        theme: string;
    }>;
    dayMaster: HeavenlyStem;
    dayElement: Element;
    birthDateTime: string;
    calculationTime: string;
}
export interface JieQiInfo {
    name: string;
    date: string;
    monthIndex: number;
    isZhongQi: boolean;
}
export interface ExpertInterpretation {
    answers: Array<{
        topic: string;
        one_liner: string;
        why: string;
        todo: string[];
    }>;
    summary: {
        day_master: string;
        strongest_element: Element;
        weakest_element: Element;
        balance_score: number;
    };
    recommendations: Array<{
        element: Element;
        activities: string[];
        foods: string[];
        colors: string[];
    }>;
}
export interface BaziAnalysisRequest {
    birthData: BirthData;
    includeInterpretation?: boolean;
    language?: 'ko' | 'en' | 'zh';
}
export interface BaziAnalysisResponse {
    success: boolean;
    result: BaziResult;
    interpretation?: ExpertInterpretation;
    error?: string;
}
//# sourceMappingURL=bazi.d.ts.map