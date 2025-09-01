import { z } from 'zod';
export declare const CardSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    orientation: z.ZodEnum<["upright", "reversed"]>;
    position: z.ZodOptional<z.ZodString>;
    meaning: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    orientation: "upright" | "reversed";
    meaning: string;
    position?: string | undefined;
}, {
    id: string;
    name: string;
    orientation: "upright" | "reversed";
    meaning: string;
    position?: string | undefined;
}>;
export declare const SummarySchema: z.ZodObject<{
    archetype: z.ZodString;
    summary: z.ZodArray<z.ZodString, "many">;
    actions: z.ZodArray<z.ZodString, "many">;
    caution: z.ZodString;
}, "strip", z.ZodTypeAny, {
    archetype: string;
    summary: string[];
    actions: string[];
    caution: string;
}, {
    archetype: string;
    summary: string[];
    actions: string[];
    caution: string;
}>;
export declare const DonationSchema: z.ZodObject<{
    paypal: z.ZodObject<{
        address: z.ZodString;
        qr: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        address: string;
        qr: string;
    }, {
        address: string;
        qr: string;
    }>;
    usdt: z.ZodObject<{
        address: z.ZodString;
        qr: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        address: string;
        qr: string;
    }, {
        address: string;
        qr: string;
    }>;
}, "strip", z.ZodTypeAny, {
    paypal: {
        address: string;
        qr: string;
    };
    usdt: {
        address: string;
        qr: string;
    };
}, {
    paypal: {
        address: string;
        qr: string;
    };
    usdt: {
        address: string;
        qr: string;
    };
}>;
export declare const DrawRequestSchema: z.ZodObject<{
    spread: z.ZodEnum<["one", "three"]>;
    question: z.ZodOptional<z.ZodString>;
    lang: z.ZodDefault<z.ZodEnum<["ko", "en", "km"]>>;
    userId: z.ZodOptional<z.ZodString>;
    seed: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    lang: "ko" | "en" | "km";
    spread: "one" | "three";
    userId?: string | undefined;
    question?: string | undefined;
    seed?: string | undefined;
}, {
    spread: "one" | "three";
    userId?: string | undefined;
    lang?: "ko" | "en" | "km" | undefined;
    question?: string | undefined;
    seed?: string | undefined;
}>;
export declare const DrawResultSchema: z.ZodObject<{
    success: z.ZodBoolean;
    result: z.ZodOptional<z.ZodObject<{
        spread: z.ZodString;
        question: z.ZodOptional<z.ZodString>;
        lang: z.ZodString;
        cards: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            orientation: z.ZodEnum<["upright", "reversed"]>;
            position: z.ZodOptional<z.ZodString>;
            meaning: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            name: string;
            orientation: "upright" | "reversed";
            meaning: string;
            position?: string | undefined;
        }, {
            id: string;
            name: string;
            orientation: "upright" | "reversed";
            meaning: string;
            position?: string | undefined;
        }>, "many">;
        summary: z.ZodObject<{
            archetype: z.ZodString;
            summary: z.ZodArray<z.ZodString, "many">;
            actions: z.ZodArray<z.ZodString, "many">;
            caution: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            archetype: string;
            summary: string[];
            actions: string[];
            caution: string;
        }, {
            archetype: string;
            summary: string[];
            actions: string[];
            caution: string;
        }>;
        donation: z.ZodObject<{
            paypal: z.ZodObject<{
                address: z.ZodString;
                qr: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                address: string;
                qr: string;
            }, {
                address: string;
                qr: string;
            }>;
            usdt: z.ZodObject<{
                address: z.ZodString;
                qr: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                address: string;
                qr: string;
            }, {
                address: string;
                qr: string;
            }>;
        }, "strip", z.ZodTypeAny, {
            paypal: {
                address: string;
                qr: string;
            };
            usdt: {
                address: string;
                qr: string;
            };
        }, {
            paypal: {
                address: string;
                qr: string;
            };
            usdt: {
                address: string;
                qr: string;
            };
        }>;
    }, "strip", z.ZodTypeAny, {
        lang: string;
        summary: {
            archetype: string;
            summary: string[];
            actions: string[];
            caution: string;
        };
        spread: string;
        cards: {
            id: string;
            name: string;
            orientation: "upright" | "reversed";
            meaning: string;
            position?: string | undefined;
        }[];
        donation: {
            paypal: {
                address: string;
                qr: string;
            };
            usdt: {
                address: string;
                qr: string;
            };
        };
        question?: string | undefined;
    }, {
        lang: string;
        summary: {
            archetype: string;
            summary: string[];
            actions: string[];
            caution: string;
        };
        spread: string;
        cards: {
            id: string;
            name: string;
            orientation: "upright" | "reversed";
            meaning: string;
            position?: string | undefined;
        }[];
        donation: {
            paypal: {
                address: string;
                qr: string;
            };
            usdt: {
                address: string;
                qr: string;
            };
        };
        question?: string | undefined;
    }>>;
    error: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    error?: string | undefined;
    result?: {
        lang: string;
        summary: {
            archetype: string;
            summary: string[];
            actions: string[];
            caution: string;
        };
        spread: string;
        cards: {
            id: string;
            name: string;
            orientation: "upright" | "reversed";
            meaning: string;
            position?: string | undefined;
        }[];
        donation: {
            paypal: {
                address: string;
                qr: string;
            };
            usdt: {
                address: string;
                qr: string;
            };
        };
        question?: string | undefined;
    } | undefined;
}, {
    success: boolean;
    error?: string | undefined;
    result?: {
        lang: string;
        summary: {
            archetype: string;
            summary: string[];
            actions: string[];
            caution: string;
        };
        spread: string;
        cards: {
            id: string;
            name: string;
            orientation: "upright" | "reversed";
            meaning: string;
            position?: string | undefined;
        }[];
        donation: {
            paypal: {
                address: string;
                qr: string;
            };
            usdt: {
                address: string;
                qr: string;
            };
        };
        question?: string | undefined;
    } | undefined;
}>;
export type DrawRequest = z.infer<typeof DrawRequestSchema>;
export type DrawResult = z.infer<typeof DrawResultSchema>;
export type Card = z.infer<typeof CardSchema>;
export type Summary = z.infer<typeof SummarySchema>;
export type Donation = z.infer<typeof DonationSchema>;
//# sourceMappingURL=schemas.d.ts.map