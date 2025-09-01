import { z } from 'zod';
export declare const BirthDataSchema: z.ZodObject<{
    date: z.ZodString;
    time: z.ZodString;
    place: z.ZodString;
    unknownTime: z.ZodOptional<z.ZodBoolean>;
    placeGeo: z.ZodOptional<z.ZodObject<{
        lat: z.ZodNumber;
        lon: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        lat: number;
        lon: number;
    }, {
        lat: number;
        lon: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    date: string;
    time: string;
    place: string;
    unknownTime?: boolean | undefined;
    placeGeo?: {
        lat: number;
        lon: number;
    } | undefined;
}, {
    date: string;
    time: string;
    place: string;
    unknownTime?: boolean | undefined;
    placeGeo?: {
        lat: number;
        lon: number;
    } | undefined;
}>;
export declare const BaziRequestSchema: z.ZodObject<{
    fullName: z.ZodString;
    sexAtBirth: z.ZodEnum<["male", "female"]>;
    birth: z.ZodObject<{
        date: z.ZodString;
        time: z.ZodString;
        place: z.ZodString;
        unknownTime: z.ZodOptional<z.ZodBoolean>;
        placeGeo: z.ZodOptional<z.ZodObject<{
            lat: z.ZodNumber;
            lon: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            lat: number;
            lon: number;
        }, {
            lat: number;
            lon: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        date: string;
        time: string;
        place: string;
        unknownTime?: boolean | undefined;
        placeGeo?: {
            lat: number;
            lon: number;
        } | undefined;
    }, {
        date: string;
        time: string;
        place: string;
        unknownTime?: boolean | undefined;
        placeGeo?: {
            lat: number;
            lon: number;
        } | undefined;
    }>;
    calendarNote: z.ZodOptional<z.ZodLiteral<"solar">>;
    contact: z.ZodOptional<z.ZodString>;
    locale: z.ZodDefault<z.ZodEnum<["ko", "en", "km"]>>;
}, "strip", z.ZodTypeAny, {
    fullName: string;
    sexAtBirth: "male" | "female";
    birth: {
        date: string;
        time: string;
        place: string;
        unknownTime?: boolean | undefined;
        placeGeo?: {
            lat: number;
            lon: number;
        } | undefined;
    };
    locale: "ko" | "en" | "km";
    calendarNote?: "solar" | undefined;
    contact?: string | undefined;
}, {
    fullName: string;
    sexAtBirth: "male" | "female";
    birth: {
        date: string;
        time: string;
        place: string;
        unknownTime?: boolean | undefined;
        placeGeo?: {
            lat: number;
            lon: number;
        } | undefined;
    };
    calendarNote?: "solar" | undefined;
    contact?: string | undefined;
    locale?: "ko" | "en" | "km" | undefined;
}>;
export type BirthData = z.infer<typeof BirthDataSchema>;
export type BaziRequest = z.infer<typeof BaziRequestSchema>;
export interface Pillar {
    stem: string;
    branch: string;
    element: string;
    confidence?: number;
}
export interface Pillars {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar & {
        confidence: number;
    };
}
export interface FiveElements {
    목: number;
    화: number;
    토: number;
    금: number;
    수: number;
}
export interface TenGodsStrength {
    wealth: number;
    officer: number;
    output: number;
    resource: number;
    peer: number;
}
export interface LuckPillar {
    period: string;
    pillar: string;
    theme: string;
}
export interface AnnualPillar {
    year: number;
    pillar: string;
    focus: string;
}
export interface MonthlyPillar {
    month: string;
    window: string;
    pillar: string;
    actions: string[];
}
export interface Timeline {
    luck_pillars: LuckPillar[];
    annual: AnnualPillar[];
    monthly: MonthlyPillar[];
}
export interface AnswerCard {
    topic: string;
    one_liner: string;
    why: string;
    detail: string[];
    todo: string[];
}
export interface BoundarySensitivity {
    boundaryAlert: boolean;
    candidates: Pillars[];
    hourConfidence: number;
}
export declare const RectificationRequestSchema: z.ZodObject<{
    candidateIndex: z.ZodNumber;
    userResponse: z.ZodString;
}, "strip", z.ZodTypeAny, {
    candidateIndex: number;
    userResponse: string;
}, {
    candidateIndex: number;
    userResponse: string;
}>;
export type RectificationRequest = z.infer<typeof RectificationRequestSchema>;
export interface BaziResponse {
    pillars: Pillars;
    five_elements: FiveElements;
    ten_gods_strength: TenGodsStrength;
    useful_god: string[];
    boundaryAlert: boolean;
    candidates?: Pillars[];
    timeline: Timeline;
    answers: AnswerCard[];
}
export interface ApiResponse<T> {
    success: boolean;
    result?: T;
    error?: string;
    message?: string;
}
export interface JieQiData {
    name: string;
    date: string;
    solarLongitude: number;
    type: 'major' | 'minor';
}
export interface CityInfo {
    name: string;
    timezone: string;
    lat?: number;
    lon?: number;
}
export interface BoundaryCheck {
    hasHourBoundary: boolean;
    hasMonthBoundary: boolean;
    hasYearBoundary: boolean;
    confidence: number;
    alternativePillars: Pillars[];
}
export type HeavenlyStem = '갑' | '을' | '병' | '정' | '무' | '기' | '경' | '신' | '임' | '계';
export type EarthlyBranch = '자' | '축' | '인' | '묘' | '진' | '사' | '오' | '미' | '신' | '유' | '술' | '해';
export type Element = '목' | '화' | '토' | '금' | '수';
//# sourceMappingURL=index.d.ts.map