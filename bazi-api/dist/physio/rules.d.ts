import { FaceRatios, PhysioTemplates } from './types';
export declare function analyzeForehead(ratios: FaceRatios): {
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
export declare function analyzeEyes(ratios: FaceRatios): {
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
export declare function analyzeNose(ratios: FaceRatios): {
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
export declare function analyzeMouth(ratios: FaceRatios): {
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
export declare function analyzeJaw(ratios: FaceRatios): {
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
export declare function analyzeAsymmetry(ratios: FaceRatios): {
    level: number;
    type: string;
    coaching: string;
};
export declare const PHYSIO_TEMPLATES: PhysioTemplates;
export declare const GOAL_COACHING_TEMPLATES: {
    career: {
        ko: {
            title: string;
            focus: string[];
            tips: string[];
        };
        en: {
            title: string;
            focus: string[];
            tips: string[];
        };
        km: {
            title: string;
            focus: string[];
            tips: string[];
        };
    };
    finance: {
        ko: {
            title: string;
            focus: string[];
            tips: string[];
        };
        en: {
            title: string;
            focus: string[];
            tips: string[];
        };
        km: {
            title: string;
            focus: string[];
            tips: string[];
        };
    };
    relationship: {
        ko: {
            title: string;
            focus: string[];
            tips: string[];
        };
        en: {
            title: string;
            focus: string[];
            tips: string[];
        };
        km: {
            title: string;
            focus: string[];
            tips: string[];
        };
    };
    health: {
        ko: {
            title: string;
            focus: string[];
            tips: string[];
        };
        en: {
            title: string;
            focus: string[];
            tips: string[];
        };
        km: {
            title: string;
            focus: string[];
            tips: string[];
        };
    };
};
//# sourceMappingURL=rules.d.ts.map