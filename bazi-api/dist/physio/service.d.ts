import { PhysioInput, PhysioAnalysis, QualityMetrics, FaceRatios } from './types';
export declare function assessImageQuality(imageBase64: string): QualityMetrics;
export declare function extractFaceRatios(frontalImage: string, profileImage: string): FaceRatios;
export declare function performPhysioAnalysis(ratios: FaceRatios): {
    forehead: {
        upper: {
            balanced: boolean;
            ratio: number;
            coaching: string;
        };
        middle: {
            balanced: boolean;
            ratio: number;
            coaching: string;
        };
        lower: {
            balanced: boolean;
            ratio: number;
            coaching: string;
        };
    };
    eyes: {
        spacing: {
            type: string;
            ratio: number;
            coaching: string;
        };
        angle: {
            type: string;
            angle: number;
            coaching: string;
        };
    };
    nose: {
        straightness: {
            type: string;
            score: number;
            coaching: string;
        };
        projection: {
            type: string;
            score: number;
            coaching: string;
        };
    };
    mouth: {
        philtrum: {
            ratio: number;
            type: string;
            coaching: string;
        };
        lipCorner: {
            slope: number;
            type: string;
            coaching: string;
        };
    };
    jaw: {
        chin: {
            projection: number;
            type: string;
            coaching: string;
        };
        angle: {
            degree: number;
            type: string;
            coaching: string;
        };
        width: {
            ratio: number;
            type: string;
            coaching: string;
        };
    };
    asymmetry: {
        level: number;
        type: string;
        coaching: string;
    };
};
export declare function generateLLMPrompt(analysis: ReturnType<typeof performPhysioAnalysis>, goal: string, lang: string): string;
export declare function analyzePhysiognomy(input: PhysioInput): Promise<PhysioAnalysis>;
export declare function getCacheKey(input: PhysioInput): string;
//# sourceMappingURL=service.d.ts.map