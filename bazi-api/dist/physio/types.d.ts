export interface PhysioInput {
    frontalImageBase64: string;
    profileImageBase64: string;
    goal?: 'career' | 'finance' | 'relationship' | 'health';
    lang?: 'ko' | 'en' | 'km';
}
export interface QualityMetrics {
    frontalScore: number;
    profileScore: number;
    issues: string[];
}
export interface FaceRatios {
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
}
export interface PhysioAnalysis {
    quality: QualityMetrics;
    ratios: FaceRatios;
    summary: string;
    reportMarkdown: string;
}
export interface PhysioResponse {
    success: boolean;
    result?: PhysioAnalysis;
    error?: string;
    message?: string;
}
export declare const QUALITY_THRESHOLDS: {
    readonly MIN_RESOLUTION: 720;
    readonly MAX_TILT_ANGLE: 15;
    readonly MIN_FACE_SCORE: 0.7;
    readonly MIN_QUALITY_SCORE: 0.6;
};
export declare const PHYSIO_RULES: {
    readonly FOREHEAD_RATIOS: {
        readonly IDEAL_UPPER: 0.33;
        readonly IDEAL_MIDDLE: 0.33;
        readonly IDEAL_LOWER: 0.34;
    };
    readonly EYE_SPACING: {
        readonly NARROW: 0.8;
        readonly WIDE: 1.2;
    };
    readonly NASAL_STRAIGHTNESS: {
        readonly STRAIGHT: 0.9;
        readonly CURVED: 0.6;
    };
    readonly LIP_CORNER_SLOPE: {
        readonly UPWARD: 0.1;
        readonly DOWNWARD: -0.1;
    };
    readonly CHIN_PROJECTION: {
        readonly STRONG: 0.8;
        readonly WEAK: 0.4;
    };
};
export interface PhysioTemplates {
    ko: {
        title: string;
        summary: string;
        sections: {
            keyFeatures: string;
            interpretation: string;
            coaching: string;
            routine: string;
            quality: string;
        };
    };
    en: {
        title: string;
        summary: string;
        sections: {
            keyFeatures: string;
            interpretation: string;
            coaching: string;
            routine: string;
            quality: string;
        };
    };
    km: {
        title: string;
        summary: string;
        sections: {
            keyFeatures: string;
            interpretation: string;
            coaching: string;
            routine: string;
            quality: string;
        };
    };
}
//# sourceMappingURL=types.d.ts.map