import { z } from 'zod';
declare const RectificationAnchorSchema: z.ZodObject<{
    event: z.ZodString;
    date: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date: string;
    event: string;
    description?: string | undefined;
}, {
    date: string;
    event: string;
    description?: string | undefined;
}>;
export declare const BasicSignUpSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    displayName: z.ZodString;
    termsAccepted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
    privacyAccepted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
    consentProcessingBirthData: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    displayName: string;
    termsAccepted: boolean;
    privacyAccepted: boolean;
    consentProcessingBirthData: boolean;
}, {
    email: string;
    password: string;
    displayName: string;
    termsAccepted: boolean;
    privacyAccepted: boolean;
    consentProcessingBirthData: boolean;
}>;
export declare const BirthDataSchema: z.ZodObject<{
    birthDate: z.ZodString;
    birthTime: z.ZodString;
    birthPlace: z.ZodString;
    birthCountry: z.ZodString;
    birthTimezone: z.ZodString;
    sexAtBirth: z.ZodEnum<["male", "female"]>;
    timeAccuracy: z.ZodEnum<["exact", "about", "unknown"]>;
    timeSource: z.ZodOptional<z.ZodEnum<["hospital_record", "family_memory", "other"]>>;
    rectificationAnchors: z.ZodOptional<z.ZodArray<z.ZodObject<{
        event: z.ZodString;
        date: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        date: string;
        event: string;
        description?: string | undefined;
    }, {
        date: string;
        event: string;
        description?: string | undefined;
    }>, "many">>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sexAtBirth: "male" | "female";
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    birthCountry: string;
    birthTimezone: string;
    timeAccuracy: "exact" | "unknown" | "about";
    timeSource?: "hospital_record" | "family_memory" | "other" | undefined;
    rectificationAnchors?: {
        date: string;
        event: string;
        description?: string | undefined;
    }[] | undefined;
    notes?: string | undefined;
}, {
    sexAtBirth: "male" | "female";
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    birthCountry: string;
    birthTimezone: string;
    timeAccuracy: "exact" | "unknown" | "about";
    timeSource?: "hospital_record" | "family_memory" | "other" | undefined;
    rectificationAnchors?: {
        date: string;
        event: string;
        description?: string | undefined;
    }[] | undefined;
    notes?: string | undefined;
}>;
export declare const UserPrefsSchema: z.ZodObject<{
    language: z.ZodDefault<z.ZodEnum<["ko", "en", "km"]>>;
    reportTimezone: z.ZodDefault<z.ZodString>;
    notificationEmailOptIn: z.ZodDefault<z.ZodBoolean>;
    currentResidenceCity: z.ZodOptional<z.ZodString>;
    occupation: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodString>;
    goals: z.ZodOptional<z.ZodString>;
    constraints: z.ZodOptional<z.ZodString>;
    interpretationExperience: z.ZodOptional<z.ZodEnum<["business", "emotional"]>>;
    interpretationTone: z.ZodOptional<z.ZodEnum<["business", "emotional"]>>;
    interests: z.ZodOptional<z.ZodArray<z.ZodEnum<["재물/투자", "직업/사업", "관계/배우자", "건강", "타이밍"]>, "many">>;
    decisionTimeline: z.ZodOptional<z.ZodEnum<["thisMonth", "3m", "6m", "12m"]>>;
}, "strip", z.ZodTypeAny, {
    language: "ko" | "en" | "km";
    reportTimezone: string;
    notificationEmailOptIn: boolean;
    currentResidenceCity?: string | undefined;
    occupation?: string | undefined;
    role?: string | undefined;
    goals?: string | undefined;
    constraints?: string | undefined;
    interpretationExperience?: "business" | "emotional" | undefined;
    interpretationTone?: "business" | "emotional" | undefined;
    interests?: ("직업/사업" | "관계/배우자" | "건강" | "타이밍" | "재물/투자")[] | undefined;
    decisionTimeline?: "thisMonth" | "3m" | "6m" | "12m" | undefined;
}, {
    language?: "ko" | "en" | "km" | undefined;
    reportTimezone?: string | undefined;
    notificationEmailOptIn?: boolean | undefined;
    currentResidenceCity?: string | undefined;
    occupation?: string | undefined;
    role?: string | undefined;
    goals?: string | undefined;
    constraints?: string | undefined;
    interpretationExperience?: "business" | "emotional" | undefined;
    interpretationTone?: "business" | "emotional" | undefined;
    interests?: ("직업/사업" | "관계/배우자" | "건강" | "타이밍" | "재물/투자")[] | undefined;
    decisionTimeline?: "thisMonth" | "3m" | "6m" | "12m" | undefined;
}>;
export declare const CompleteSignUpSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    displayName: z.ZodString;
    termsAccepted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
    privacyAccepted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
    consentProcessingBirthData: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
} & {
    birthDate: z.ZodString;
    birthTime: z.ZodString;
    birthPlace: z.ZodString;
    birthCountry: z.ZodString;
    birthTimezone: z.ZodString;
    sexAtBirth: z.ZodEnum<["male", "female"]>;
    timeAccuracy: z.ZodEnum<["exact", "about", "unknown"]>;
    timeSource: z.ZodOptional<z.ZodEnum<["hospital_record", "family_memory", "other"]>>;
    rectificationAnchors: z.ZodOptional<z.ZodArray<z.ZodObject<{
        event: z.ZodString;
        date: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        date: string;
        event: string;
        description?: string | undefined;
    }, {
        date: string;
        event: string;
        description?: string | undefined;
    }>, "many">>;
    notes: z.ZodOptional<z.ZodString>;
} & {
    language: z.ZodDefault<z.ZodEnum<["ko", "en", "km"]>>;
    reportTimezone: z.ZodDefault<z.ZodString>;
    notificationEmailOptIn: z.ZodDefault<z.ZodBoolean>;
    currentResidenceCity: z.ZodOptional<z.ZodString>;
    occupation: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodString>;
    goals: z.ZodOptional<z.ZodString>;
    constraints: z.ZodOptional<z.ZodString>;
    interpretationExperience: z.ZodOptional<z.ZodEnum<["business", "emotional"]>>;
    interpretationTone: z.ZodOptional<z.ZodEnum<["business", "emotional"]>>;
    interests: z.ZodOptional<z.ZodArray<z.ZodEnum<["재물/투자", "직업/사업", "관계/배우자", "건강", "타이밍"]>, "many">>;
    decisionTimeline: z.ZodOptional<z.ZodEnum<["thisMonth", "3m", "6m", "12m"]>>;
}, "strip", z.ZodTypeAny, {
    sexAtBirth: "male" | "female";
    email: string;
    password: string;
    displayName: string;
    termsAccepted: boolean;
    privacyAccepted: boolean;
    consentProcessingBirthData: boolean;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    birthCountry: string;
    birthTimezone: string;
    timeAccuracy: "exact" | "unknown" | "about";
    language: "ko" | "en" | "km";
    reportTimezone: string;
    notificationEmailOptIn: boolean;
    timeSource?: "hospital_record" | "family_memory" | "other" | undefined;
    rectificationAnchors?: {
        date: string;
        event: string;
        description?: string | undefined;
    }[] | undefined;
    notes?: string | undefined;
    currentResidenceCity?: string | undefined;
    occupation?: string | undefined;
    role?: string | undefined;
    goals?: string | undefined;
    constraints?: string | undefined;
    interpretationExperience?: "business" | "emotional" | undefined;
    interpretationTone?: "business" | "emotional" | undefined;
    interests?: ("직업/사업" | "관계/배우자" | "건강" | "타이밍" | "재물/투자")[] | undefined;
    decisionTimeline?: "thisMonth" | "3m" | "6m" | "12m" | undefined;
}, {
    sexAtBirth: "male" | "female";
    email: string;
    password: string;
    displayName: string;
    termsAccepted: boolean;
    privacyAccepted: boolean;
    consentProcessingBirthData: boolean;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    birthCountry: string;
    birthTimezone: string;
    timeAccuracy: "exact" | "unknown" | "about";
    timeSource?: "hospital_record" | "family_memory" | "other" | undefined;
    rectificationAnchors?: {
        date: string;
        event: string;
        description?: string | undefined;
    }[] | undefined;
    notes?: string | undefined;
    language?: "ko" | "en" | "km" | undefined;
    reportTimezone?: string | undefined;
    notificationEmailOptIn?: boolean | undefined;
    currentResidenceCity?: string | undefined;
    occupation?: string | undefined;
    role?: string | undefined;
    goals?: string | undefined;
    constraints?: string | undefined;
    interpretationExperience?: "business" | "emotional" | undefined;
    interpretationTone?: "business" | "emotional" | undefined;
    interests?: ("직업/사업" | "관계/배우자" | "건강" | "타이밍" | "재물/투자")[] | undefined;
    decisionTimeline?: "thisMonth" | "3m" | "6m" | "12m" | undefined;
}>;
export declare const Step1SignUpSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    displayName: z.ZodString;
    termsAccepted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
    privacyAccepted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
    consentProcessingBirthData: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    displayName: string;
    termsAccepted: boolean;
    privacyAccepted: boolean;
    consentProcessingBirthData: boolean;
}, {
    email: string;
    password: string;
    displayName: string;
    termsAccepted: boolean;
    privacyAccepted: boolean;
    consentProcessingBirthData: boolean;
}>;
export declare const Step2SignUpSchema: z.ZodObject<{
    birthDate: z.ZodString;
    birthTime: z.ZodString;
    birthPlace: z.ZodString;
    birthCountry: z.ZodString;
    birthTimezone: z.ZodString;
    sexAtBirth: z.ZodEnum<["male", "female"]>;
    timeAccuracy: z.ZodEnum<["exact", "about", "unknown"]>;
    timeSource: z.ZodOptional<z.ZodEnum<["hospital_record", "family_memory", "other"]>>;
    rectificationAnchors: z.ZodOptional<z.ZodArray<z.ZodObject<{
        event: z.ZodString;
        date: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        date: string;
        event: string;
        description?: string | undefined;
    }, {
        date: string;
        event: string;
        description?: string | undefined;
    }>, "many">>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sexAtBirth: "male" | "female";
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    birthCountry: string;
    birthTimezone: string;
    timeAccuracy: "exact" | "unknown" | "about";
    timeSource?: "hospital_record" | "family_memory" | "other" | undefined;
    rectificationAnchors?: {
        date: string;
        event: string;
        description?: string | undefined;
    }[] | undefined;
    notes?: string | undefined;
}, {
    sexAtBirth: "male" | "female";
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    birthCountry: string;
    birthTimezone: string;
    timeAccuracy: "exact" | "unknown" | "about";
    timeSource?: "hospital_record" | "family_memory" | "other" | undefined;
    rectificationAnchors?: {
        date: string;
        event: string;
        description?: string | undefined;
    }[] | undefined;
    notes?: string | undefined;
}>;
export declare const Step3SignUpSchema: z.ZodObject<{
    language: z.ZodDefault<z.ZodEnum<["ko", "en", "km"]>>;
    reportTimezone: z.ZodDefault<z.ZodString>;
    notificationEmailOptIn: z.ZodDefault<z.ZodBoolean>;
    currentResidenceCity: z.ZodOptional<z.ZodString>;
    occupation: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodString>;
    goals: z.ZodOptional<z.ZodString>;
    constraints: z.ZodOptional<z.ZodString>;
    interpretationExperience: z.ZodOptional<z.ZodEnum<["business", "emotional"]>>;
    interpretationTone: z.ZodOptional<z.ZodEnum<["business", "emotional"]>>;
    interests: z.ZodOptional<z.ZodArray<z.ZodEnum<["재물/투자", "직업/사업", "관계/배우자", "건강", "타이밍"]>, "many">>;
    decisionTimeline: z.ZodOptional<z.ZodEnum<["thisMonth", "3m", "6m", "12m"]>>;
}, "strip", z.ZodTypeAny, {
    language: "ko" | "en" | "km";
    reportTimezone: string;
    notificationEmailOptIn: boolean;
    currentResidenceCity?: string | undefined;
    occupation?: string | undefined;
    role?: string | undefined;
    goals?: string | undefined;
    constraints?: string | undefined;
    interpretationExperience?: "business" | "emotional" | undefined;
    interpretationTone?: "business" | "emotional" | undefined;
    interests?: ("직업/사업" | "관계/배우자" | "건강" | "타이밍" | "재물/투자")[] | undefined;
    decisionTimeline?: "thisMonth" | "3m" | "6m" | "12m" | undefined;
}, {
    language?: "ko" | "en" | "km" | undefined;
    reportTimezone?: string | undefined;
    notificationEmailOptIn?: boolean | undefined;
    currentResidenceCity?: string | undefined;
    occupation?: string | undefined;
    role?: string | undefined;
    goals?: string | undefined;
    constraints?: string | undefined;
    interpretationExperience?: "business" | "emotional" | undefined;
    interpretationTone?: "business" | "emotional" | undefined;
    interests?: ("직업/사업" | "관계/배우자" | "건강" | "타이밍" | "재물/투자")[] | undefined;
    decisionTimeline?: "thisMonth" | "3m" | "6m" | "12m" | undefined;
}>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const AuthResponseSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        displayName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        displayName: string;
        id: string;
    }, {
        email: string;
        displayName: string;
        id: string;
    }>;
    prefs: z.ZodObject<{
        id: z.ZodString;
        language: z.ZodEnum<["ko", "en", "km"]>;
        reportTimezone: z.ZodString;
        notificationEmailOptIn: z.ZodBoolean;
        termsAcceptedAt: z.ZodNullable<z.ZodString>;
        privacyAcceptedAt: z.ZodNullable<z.ZodString>;
        consentProcessingBirthData: z.ZodBoolean;
        currentResidenceCity: z.ZodNullable<z.ZodString>;
        occupation: z.ZodNullable<z.ZodString>;
        role: z.ZodNullable<z.ZodString>;
        goals: z.ZodNullable<z.ZodString>;
        constraints: z.ZodNullable<z.ZodString>;
        interpretationExperience: z.ZodNullable<z.ZodEnum<["business", "emotional"]>>;
        interpretationTone: z.ZodNullable<z.ZodEnum<["business", "emotional"]>>;
        interests: z.ZodNullable<z.ZodString>;
        decisionTimeline: z.ZodNullable<z.ZodEnum<["thisMonth", "3m", "6m", "12m"]>>;
    }, "strip", z.ZodTypeAny, {
        consentProcessingBirthData: boolean;
        language: "ko" | "en" | "km";
        reportTimezone: string;
        notificationEmailOptIn: boolean;
        currentResidenceCity: string | null;
        occupation: string | null;
        role: string | null;
        goals: string | null;
        constraints: string | null;
        interpretationExperience: "business" | "emotional" | null;
        interpretationTone: "business" | "emotional" | null;
        interests: string | null;
        decisionTimeline: "thisMonth" | "3m" | "6m" | "12m" | null;
        id: string;
        termsAcceptedAt: string | null;
        privacyAcceptedAt: string | null;
    }, {
        consentProcessingBirthData: boolean;
        language: "ko" | "en" | "km";
        reportTimezone: string;
        notificationEmailOptIn: boolean;
        currentResidenceCity: string | null;
        occupation: string | null;
        role: string | null;
        goals: string | null;
        constraints: string | null;
        interpretationExperience: "business" | "emotional" | null;
        interpretationTone: "business" | "emotional" | null;
        interests: string | null;
        decisionTimeline: "thisMonth" | "3m" | "6m" | "12m" | null;
        id: string;
        termsAcceptedAt: string | null;
        privacyAcceptedAt: string | null;
    }>;
    birthData: z.ZodObject<{
        id: z.ZodString;
        birthDate: z.ZodString;
        birthTime: z.ZodString;
        birthPlace: z.ZodString;
        birthCountry: z.ZodString;
        birthTimezone: z.ZodString;
        sexAtBirth: z.ZodEnum<["male", "female"]>;
        timeAccuracy: z.ZodEnum<["exact", "about", "unknown"]>;
        timeSource: z.ZodNullable<z.ZodEnum<["hospital_record", "family_memory", "other"]>>;
        rectificationAnchors: z.ZodNullable<z.ZodString>;
        notes: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        sexAtBirth: "male" | "female";
        birthDate: string;
        birthTime: string;
        birthPlace: string;
        birthCountry: string;
        birthTimezone: string;
        timeAccuracy: "exact" | "unknown" | "about";
        timeSource: "hospital_record" | "family_memory" | "other" | null;
        rectificationAnchors: string | null;
        notes: string | null;
        id: string;
    }, {
        sexAtBirth: "male" | "female";
        birthDate: string;
        birthTime: string;
        birthPlace: string;
        birthCountry: string;
        birthTimezone: string;
        timeAccuracy: "exact" | "unknown" | "about";
        timeSource: "hospital_record" | "family_memory" | "other" | null;
        rectificationAnchors: string | null;
        notes: string | null;
        id: string;
    }>;
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user: {
        email: string;
        displayName: string;
        id: string;
    };
    prefs: {
        consentProcessingBirthData: boolean;
        language: "ko" | "en" | "km";
        reportTimezone: string;
        notificationEmailOptIn: boolean;
        currentResidenceCity: string | null;
        occupation: string | null;
        role: string | null;
        goals: string | null;
        constraints: string | null;
        interpretationExperience: "business" | "emotional" | null;
        interpretationTone: "business" | "emotional" | null;
        interests: string | null;
        decisionTimeline: "thisMonth" | "3m" | "6m" | "12m" | null;
        id: string;
        termsAcceptedAt: string | null;
        privacyAcceptedAt: string | null;
    };
    birthData: {
        sexAtBirth: "male" | "female";
        birthDate: string;
        birthTime: string;
        birthPlace: string;
        birthCountry: string;
        birthTimezone: string;
        timeAccuracy: "exact" | "unknown" | "about";
        timeSource: "hospital_record" | "family_memory" | "other" | null;
        rectificationAnchors: string | null;
        notes: string | null;
        id: string;
    };
    token: string;
}, {
    user: {
        email: string;
        displayName: string;
        id: string;
    };
    prefs: {
        consentProcessingBirthData: boolean;
        language: "ko" | "en" | "km";
        reportTimezone: string;
        notificationEmailOptIn: boolean;
        currentResidenceCity: string | null;
        occupation: string | null;
        role: string | null;
        goals: string | null;
        constraints: string | null;
        interpretationExperience: "business" | "emotional" | null;
        interpretationTone: "business" | "emotional" | null;
        interests: string | null;
        decisionTimeline: "thisMonth" | "3m" | "6m" | "12m" | null;
        id: string;
        termsAcceptedAt: string | null;
        privacyAcceptedAt: string | null;
    };
    birthData: {
        sexAtBirth: "male" | "female";
        birthDate: string;
        birthTime: string;
        birthPlace: string;
        birthCountry: string;
        birthTimezone: string;
        timeAccuracy: "exact" | "unknown" | "about";
        timeSource: "hospital_record" | "family_memory" | "other" | null;
        rectificationAnchors: string | null;
        notes: string | null;
        id: string;
    };
    token: string;
}>;
export declare const ErrorResponseSchema: z.ZodObject<{
    error: z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
    }, {
        code: string;
        message: string;
    }>;
}, "strip", z.ZodTypeAny, {
    error: {
        code: string;
        message: string;
    };
}, {
    error: {
        code: string;
        message: string;
    };
}>;
export type BasicSignUpInput = z.infer<typeof BasicSignUpSchema>;
export type BirthDataInput = z.infer<typeof BirthDataSchema>;
export type UserPrefsInput = z.infer<typeof UserPrefsSchema>;
export type CompleteSignUpInput = z.infer<typeof CompleteSignUpSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type RectificationAnchor = z.infer<typeof RectificationAnchorSchema>;
export {};
//# sourceMappingURL=schemas-extended.d.ts.map