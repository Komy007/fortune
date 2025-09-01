import { z } from 'zod';
export declare const PhysioInputSchema: z.ZodObject<{
    frontalImageBase64: z.ZodEffects<z.ZodString, string, string>;
    profileImageBase64: z.ZodEffects<z.ZodString, string, string>;
    goal: z.ZodOptional<z.ZodEnum<["career", "finance", "relationship", "health"]>>;
    lang: z.ZodDefault<z.ZodOptional<z.ZodEnum<["ko", "en", "km"]>>>;
}, "strip", z.ZodTypeAny, {
    lang: "ko" | "en" | "km";
    frontalImageBase64: string;
    profileImageBase64: string;
    goal?: "career" | "finance" | "relationship" | "health" | undefined;
}, {
    frontalImageBase64: string;
    profileImageBase64: string;
    lang?: "ko" | "en" | "km" | undefined;
    goal?: "career" | "finance" | "relationship" | "health" | undefined;
}>;
export declare const QualityMetricsSchema: z.ZodObject<{
    frontalScore: z.ZodNumber;
    profileScore: z.ZodNumber;
    issues: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    issues: string[];
    frontalScore: number;
    profileScore: number;
}, {
    issues: string[];
    frontalScore: number;
    profileScore: number;
}>;
export declare const FaceRatiosSchema: z.ZodObject<{
    faceThirds: z.ZodObject<{
        upper: z.ZodNumber;
        middle: z.ZodNumber;
        lower: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        upper: number;
        middle: number;
        lower: number;
    }, {
        upper: number;
        middle: number;
        lower: number;
    }>;
    eyeSpacing: z.ZodNumber;
    eyeCornerAngle: z.ZodNumber;
    nasalStraightness: z.ZodNumber;
    nasalProjection: z.ZodNumber;
    philtrumToUpperLip: z.ZodNumber;
    lipCornerSlope: z.ZodNumber;
    chinProjection: z.ZodNumber;
    jawAngle: z.ZodNumber;
    jawWidthToCheek: z.ZodNumber;
    asymmetry: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    faceThirds: {
        upper: number;
        middle: number;
        lower: number;
    };
    eyeSpacing: number;
    eyeCornerAngle: number;
    nasalStraightness: number;
    nasalProjection: number;
    philtrumToUpperLip: number;
    lipCornerSlope: number;
    chinProjection: number;
    jawAngle: number;
    jawWidthToCheek: number;
    asymmetry: number;
}, {
    faceThirds: {
        upper: number;
        middle: number;
        lower: number;
    };
    eyeSpacing: number;
    eyeCornerAngle: number;
    nasalStraightness: number;
    nasalProjection: number;
    philtrumToUpperLip: number;
    lipCornerSlope: number;
    chinProjection: number;
    jawAngle: number;
    jawWidthToCheek: number;
    asymmetry: number;
}>;
export declare const PhysioAnalysisSchema: z.ZodObject<{
    quality: z.ZodObject<{
        frontalScore: z.ZodNumber;
        profileScore: z.ZodNumber;
        issues: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        issues: string[];
        frontalScore: number;
        profileScore: number;
    }, {
        issues: string[];
        frontalScore: number;
        profileScore: number;
    }>;
    ratios: z.ZodObject<{
        faceThirds: z.ZodObject<{
            upper: z.ZodNumber;
            middle: z.ZodNumber;
            lower: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            upper: number;
            middle: number;
            lower: number;
        }, {
            upper: number;
            middle: number;
            lower: number;
        }>;
        eyeSpacing: z.ZodNumber;
        eyeCornerAngle: z.ZodNumber;
        nasalStraightness: z.ZodNumber;
        nasalProjection: z.ZodNumber;
        philtrumToUpperLip: z.ZodNumber;
        lipCornerSlope: z.ZodNumber;
        chinProjection: z.ZodNumber;
        jawAngle: z.ZodNumber;
        jawWidthToCheek: z.ZodNumber;
        asymmetry: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        faceThirds: {
            upper: number;
            middle: number;
            lower: number;
        };
        eyeSpacing: number;
        eyeCornerAngle: number;
        nasalStraightness: number;
        nasalProjection: number;
        philtrumToUpperLip: number;
        lipCornerSlope: number;
        chinProjection: number;
        jawAngle: number;
        jawWidthToCheek: number;
        asymmetry: number;
    }, {
        faceThirds: {
            upper: number;
            middle: number;
            lower: number;
        };
        eyeSpacing: number;
        eyeCornerAngle: number;
        nasalStraightness: number;
        nasalProjection: number;
        philtrumToUpperLip: number;
        lipCornerSlope: number;
        chinProjection: number;
        jawAngle: number;
        jawWidthToCheek: number;
        asymmetry: number;
    }>;
    summary: z.ZodString;
    reportMarkdown: z.ZodString;
}, "strip", z.ZodTypeAny, {
    summary: string;
    quality: {
        issues: string[];
        frontalScore: number;
        profileScore: number;
    };
    ratios: {
        faceThirds: {
            upper: number;
            middle: number;
            lower: number;
        };
        eyeSpacing: number;
        eyeCornerAngle: number;
        nasalStraightness: number;
        nasalProjection: number;
        philtrumToUpperLip: number;
        lipCornerSlope: number;
        chinProjection: number;
        jawAngle: number;
        jawWidthToCheek: number;
        asymmetry: number;
    };
    reportMarkdown: string;
}, {
    summary: string;
    quality: {
        issues: string[];
        frontalScore: number;
        profileScore: number;
    };
    ratios: {
        faceThirds: {
            upper: number;
            middle: number;
            lower: number;
        };
        eyeSpacing: number;
        eyeCornerAngle: number;
        nasalStraightness: number;
        nasalProjection: number;
        philtrumToUpperLip: number;
        lipCornerSlope: number;
        chinProjection: number;
        jawAngle: number;
        jawWidthToCheek: number;
        asymmetry: number;
    };
    reportMarkdown: string;
}>;
export declare const PhysioResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    result: z.ZodOptional<z.ZodObject<{
        quality: z.ZodObject<{
            frontalScore: z.ZodNumber;
            profileScore: z.ZodNumber;
            issues: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            issues: string[];
            frontalScore: number;
            profileScore: number;
        }, {
            issues: string[];
            frontalScore: number;
            profileScore: number;
        }>;
        ratios: z.ZodObject<{
            faceThirds: z.ZodObject<{
                upper: z.ZodNumber;
                middle: z.ZodNumber;
                lower: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                upper: number;
                middle: number;
                lower: number;
            }, {
                upper: number;
                middle: number;
                lower: number;
            }>;
            eyeSpacing: z.ZodNumber;
            eyeCornerAngle: z.ZodNumber;
            nasalStraightness: z.ZodNumber;
            nasalProjection: z.ZodNumber;
            philtrumToUpperLip: z.ZodNumber;
            lipCornerSlope: z.ZodNumber;
            chinProjection: z.ZodNumber;
            jawAngle: z.ZodNumber;
            jawWidthToCheek: z.ZodNumber;
            asymmetry: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            faceThirds: {
                upper: number;
                middle: number;
                lower: number;
            };
            eyeSpacing: number;
            eyeCornerAngle: number;
            nasalStraightness: number;
            nasalProjection: number;
            philtrumToUpperLip: number;
            lipCornerSlope: number;
            chinProjection: number;
            jawAngle: number;
            jawWidthToCheek: number;
            asymmetry: number;
        }, {
            faceThirds: {
                upper: number;
                middle: number;
                lower: number;
            };
            eyeSpacing: number;
            eyeCornerAngle: number;
            nasalStraightness: number;
            nasalProjection: number;
            philtrumToUpperLip: number;
            lipCornerSlope: number;
            chinProjection: number;
            jawAngle: number;
            jawWidthToCheek: number;
            asymmetry: number;
        }>;
        summary: z.ZodString;
        reportMarkdown: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        summary: string;
        quality: {
            issues: string[];
            frontalScore: number;
            profileScore: number;
        };
        ratios: {
            faceThirds: {
                upper: number;
                middle: number;
                lower: number;
            };
            eyeSpacing: number;
            eyeCornerAngle: number;
            nasalStraightness: number;
            nasalProjection: number;
            philtrumToUpperLip: number;
            lipCornerSlope: number;
            chinProjection: number;
            jawAngle: number;
            jawWidthToCheek: number;
            asymmetry: number;
        };
        reportMarkdown: string;
    }, {
        summary: string;
        quality: {
            issues: string[];
            frontalScore: number;
            profileScore: number;
        };
        ratios: {
            faceThirds: {
                upper: number;
                middle: number;
                lower: number;
            };
            eyeSpacing: number;
            eyeCornerAngle: number;
            nasalStraightness: number;
            nasalProjection: number;
            philtrumToUpperLip: number;
            lipCornerSlope: number;
            chinProjection: number;
            jawAngle: number;
            jawWidthToCheek: number;
            asymmetry: number;
        };
        reportMarkdown: string;
    }>>;
    error: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    message?: string | undefined;
    error?: string | undefined;
    result?: {
        summary: string;
        quality: {
            issues: string[];
            frontalScore: number;
            profileScore: number;
        };
        ratios: {
            faceThirds: {
                upper: number;
                middle: number;
                lower: number;
            };
            eyeSpacing: number;
            eyeCornerAngle: number;
            nasalStraightness: number;
            nasalProjection: number;
            philtrumToUpperLip: number;
            lipCornerSlope: number;
            chinProjection: number;
            jawAngle: number;
            jawWidthToCheek: number;
            asymmetry: number;
        };
        reportMarkdown: string;
    } | undefined;
}, {
    success: boolean;
    message?: string | undefined;
    error?: string | undefined;
    result?: {
        summary: string;
        quality: {
            issues: string[];
            frontalScore: number;
            profileScore: number;
        };
        ratios: {
            faceThirds: {
                upper: number;
                middle: number;
                lower: number;
            };
            eyeSpacing: number;
            eyeCornerAngle: number;
            nasalStraightness: number;
            nasalProjection: number;
            philtrumToUpperLip: number;
            lipCornerSlope: number;
            chinProjection: number;
            jawAngle: number;
            jawWidthToCheek: number;
            asymmetry: number;
        };
        reportMarkdown: string;
    } | undefined;
}>;
export declare const ImageQualitySchema: z.ZodObject<{
    width: z.ZodNumber;
    height: z.ZodNumber;
    faceDetected: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
    tiltAngle: z.ZodNumber;
    brightness: z.ZodNumber;
    contrast: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    width: number;
    height: number;
    faceDetected: boolean;
    tiltAngle: number;
    brightness: number;
    contrast: number;
}, {
    width: number;
    height: number;
    faceDetected: boolean;
    tiltAngle: number;
    brightness: number;
    contrast: number;
}>;
export declare function generateCacheKey(input: z.infer<typeof PhysioInputSchema>): string;
//# sourceMappingURL=schemas.d.ts.map