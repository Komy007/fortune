import { z } from 'zod';
export declare const SignUpSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    displayName: z.ZodString;
    language: z.ZodDefault<z.ZodEnum<["ko", "en", "km"]>>;
    reportTimezone: z.ZodDefault<z.ZodString>;
    notificationEmailOptIn: z.ZodDefault<z.ZodBoolean>;
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
    language: "ko" | "en" | "km";
    reportTimezone: string;
    notificationEmailOptIn: boolean;
}, {
    email: string;
    password: string;
    displayName: string;
    termsAccepted: boolean;
    privacyAccepted: boolean;
    consentProcessingBirthData: boolean;
    language?: "ko" | "en" | "km" | undefined;
    reportTimezone?: string | undefined;
    notificationEmailOptIn?: boolean | undefined;
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
    }, "strip", z.ZodTypeAny, {
        consentProcessingBirthData: boolean;
        language: "ko" | "en" | "km";
        reportTimezone: string;
        notificationEmailOptIn: boolean;
        id: string;
        termsAcceptedAt: string | null;
        privacyAcceptedAt: string | null;
    }, {
        consentProcessingBirthData: boolean;
        language: "ko" | "en" | "km";
        reportTimezone: string;
        notificationEmailOptIn: boolean;
        id: string;
        termsAcceptedAt: string | null;
        privacyAcceptedAt: string | null;
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
        id: string;
        termsAcceptedAt: string | null;
        privacyAcceptedAt: string | null;
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
        id: string;
        termsAcceptedAt: string | null;
        privacyAcceptedAt: string | null;
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
export type SignUpInput = z.infer<typeof SignUpSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
//# sourceMappingURL=schemas.d.ts.map