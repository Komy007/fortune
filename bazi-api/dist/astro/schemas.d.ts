import { z } from 'zod';
export declare const ChartInputSchema: z.ZodObject<{
    date: z.ZodString;
    time: z.ZodString;
    tz: z.ZodEffects<z.ZodString, string, string>;
    lat: z.ZodNumber;
    lon: z.ZodNumber;
    houseSystem: z.ZodDefault<z.ZodOptional<z.ZodEnum<["whole-sign", "placidus"]>>>;
    lang: z.ZodDefault<z.ZodOptional<z.ZodEnum<["ko", "en"]>>>;
}, "strip", z.ZodTypeAny, {
    date: string;
    time: string;
    lat: number;
    lon: number;
    tz: string;
    houseSystem: "whole-sign" | "placidus";
    lang: "ko" | "en";
}, {
    date: string;
    time: string;
    lat: number;
    lon: number;
    tz: string;
    houseSystem?: "whole-sign" | "placidus" | undefined;
    lang?: "ko" | "en" | undefined;
}>;
export declare const SynastryInputSchema: z.ZodObject<{
    personA: z.ZodObject<{
        date: z.ZodString;
        time: z.ZodString;
        tz: z.ZodEffects<z.ZodString, string, string>;
        lat: z.ZodNumber;
        lon: z.ZodNumber;
        houseSystem: z.ZodDefault<z.ZodOptional<z.ZodEnum<["whole-sign", "placidus"]>>>;
        lang: z.ZodDefault<z.ZodOptional<z.ZodEnum<["ko", "en"]>>>;
    }, "strip", z.ZodTypeAny, {
        date: string;
        time: string;
        lat: number;
        lon: number;
        tz: string;
        houseSystem: "whole-sign" | "placidus";
        lang: "ko" | "en";
    }, {
        date: string;
        time: string;
        lat: number;
        lon: number;
        tz: string;
        houseSystem?: "whole-sign" | "placidus" | undefined;
        lang?: "ko" | "en" | undefined;
    }>;
    personB: z.ZodObject<{
        date: z.ZodString;
        time: z.ZodString;
        tz: z.ZodEffects<z.ZodString, string, string>;
        lat: z.ZodNumber;
        lon: z.ZodNumber;
        houseSystem: z.ZodDefault<z.ZodOptional<z.ZodEnum<["whole-sign", "placidus"]>>>;
        lang: z.ZodDefault<z.ZodOptional<z.ZodEnum<["ko", "en"]>>>;
    }, "strip", z.ZodTypeAny, {
        date: string;
        time: string;
        lat: number;
        lon: number;
        tz: string;
        houseSystem: "whole-sign" | "placidus";
        lang: "ko" | "en";
    }, {
        date: string;
        time: string;
        lat: number;
        lon: number;
        tz: string;
        houseSystem?: "whole-sign" | "placidus" | undefined;
        lang?: "ko" | "en" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    personA: {
        date: string;
        time: string;
        lat: number;
        lon: number;
        tz: string;
        houseSystem: "whole-sign" | "placidus";
        lang: "ko" | "en";
    };
    personB: {
        date: string;
        time: string;
        lat: number;
        lon: number;
        tz: string;
        houseSystem: "whole-sign" | "placidus";
        lang: "ko" | "en";
    };
}, {
    personA: {
        date: string;
        time: string;
        lat: number;
        lon: number;
        tz: string;
        houseSystem?: "whole-sign" | "placidus" | undefined;
        lang?: "ko" | "en" | undefined;
    };
    personB: {
        date: string;
        time: string;
        lat: number;
        lon: number;
        tz: string;
        houseSystem?: "whole-sign" | "placidus" | undefined;
        lang?: "ko" | "en" | undefined;
    };
}>;
export declare const TransitInputSchema: z.ZodObject<{
    natal: z.ZodObject<{
        date: z.ZodString;
        time: z.ZodString;
        tz: z.ZodEffects<z.ZodString, string, string>;
        lat: z.ZodNumber;
        lon: z.ZodNumber;
        houseSystem: z.ZodDefault<z.ZodOptional<z.ZodEnum<["whole-sign", "placidus"]>>>;
        lang: z.ZodDefault<z.ZodOptional<z.ZodEnum<["ko", "en"]>>>;
    }, "strip", z.ZodTypeAny, {
        date: string;
        time: string;
        lat: number;
        lon: number;
        tz: string;
        houseSystem: "whole-sign" | "placidus";
        lang: "ko" | "en";
    }, {
        date: string;
        time: string;
        lat: number;
        lon: number;
        tz: string;
        houseSystem?: "whole-sign" | "placidus" | undefined;
        lang?: "ko" | "en" | undefined;
    }>;
    date: z.ZodOptional<z.ZodString>;
    rangeDays: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    natal: {
        date: string;
        time: string;
        lat: number;
        lon: number;
        tz: string;
        houseSystem: "whole-sign" | "placidus";
        lang: "ko" | "en";
    };
    rangeDays: number;
    date?: string | undefined;
}, {
    natal: {
        date: string;
        time: string;
        lat: number;
        lon: number;
        tz: string;
        houseSystem?: "whole-sign" | "placidus" | undefined;
        lang?: "ko" | "en" | undefined;
    };
    date?: string | undefined;
    rangeDays?: number | undefined;
}>;
export declare function validateChartInput(input: unknown): {
    date: string;
    time: string;
    lat: number;
    lon: number;
    tz: string;
    houseSystem: "whole-sign" | "placidus";
    lang: "ko" | "en";
};
export declare function validateSynastryInput(input: unknown): {
    personA: {
        date: string;
        time: string;
        lat: number;
        lon: number;
        tz: string;
        houseSystem: "whole-sign" | "placidus";
        lang: "ko" | "en";
    };
    personB: {
        date: string;
        time: string;
        lat: number;
        lon: number;
        tz: string;
        houseSystem: "whole-sign" | "placidus";
        lang: "ko" | "en";
    };
};
export declare function validateTransitInput(input: unknown): {
    natal: {
        date: string;
        time: string;
        lat: number;
        lon: number;
        tz: string;
        houseSystem: "whole-sign" | "placidus";
        lang: "ko" | "en";
    };
    rangeDays: number;
    date?: string | undefined;
};
export declare const ERROR_MESSAGES: {
    readonly INVALID_DATE: "날짜 형식이 올바르지 않습니다 (YYYY-MM-DD)";
    readonly INVALID_TIME: "시간 형식이 올바르지 않습니다 (HH:mm)";
    readonly INVALID_TIMEZONE: "유효한 타임존이어야 합니다 (예: Asia/Seoul, America/New_York)";
    readonly INVALID_LATITUDE: "위도는 -90에서 90 사이여야 합니다";
    readonly INVALID_LONGITUDE: "경도는 -180에서 180 사이여야 합니다";
    readonly INVALID_HOUSE_SYSTEM: "하우스 시스템은 whole-sign 또는 placidus여야 합니다";
    readonly INVALID_LANGUAGE: "언어는 ko 또는 en이어야 합니다";
    readonly INVALID_RANGE_DAYS: "기간은 1에서 30일 사이여야 합니다";
};
//# sourceMappingURL=schemas.d.ts.map