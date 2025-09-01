"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicSignUp = basicSignUp;
exports.saveBirthData = saveBirthData;
exports.saveUserPrefs = saveUserPrefs;
exports.completeSignUp = completeSignUp;
exports.loginExtended = loginExtended;
exports.getUserByIdExtended = getUserByIdExtended;
const client_1 = require("@prisma/client");
const argon2 = __importStar(require("argon2"));
const time_1 = require("./time");
const jwt_1 = require("./jwt");
const prisma = new client_1.PrismaClient();
/**
 * 1단계: 기본 회원가입 (계정 생성)
 */
async function basicSignUp(input) {
    // 이메일 중복 검사
    const existingUser = await prisma.user.findUnique({
        where: { email: input.email }
    });
    if (existingUser) {
        throw new Error('이미 사용 중인 이메일입니다');
    }
    // 비밀번호 해시화
    const passwordHash = await argon2.hash(input.password);
    // 현재 시간 (Asia/Phnom_Penh 기준)
    const currentTime = (0, time_1.nowISO)();
    // 트랜잭션으로 사용자와 기본 설정 생성
    const result = await prisma.$transaction(async (tx) => {
        // 사용자 생성
        const user = await tx.user.create({
            data: {
                email: input.email,
                passwordHash,
                displayName: input.displayName
            }
        });
        // 기본 사용자 설정 생성
        const prefs = await tx.userPrefs.create({
            data: {
                userId: user.id,
                termsAcceptedAt: currentTime,
                privacyAcceptedAt: currentTime,
                consentProcessingBirthData: input.consentProcessingBirthData
            }
        });
        return { user, prefs };
    });
    // JWT 토큰 생성
    const token = (0, jwt_1.generateToken)({
        userId: result.user.id,
        email: result.user.email,
        displayName: result.user.displayName
    });
    return {
        userId: result.user.id,
        token
    };
}
/**
 * 2단계: 출생 정보 저장
 */
async function saveBirthData(userId, input) {
    // 기존 출생 정보가 있는지 확인
    const existingBirthData = await prisma.birthData.findUnique({
        where: { userId }
    });
    if (existingBirthData) {
        // 기존 데이터 업데이트
        await prisma.birthData.update({
            where: { userId },
            data: {
                birthDate: input.birthDate,
                birthTime: input.birthTime,
                birthPlace: input.birthPlace,
                birthCountry: input.birthCountry,
                birthTimezone: input.birthTimezone,
                sexAtBirth: input.sexAtBirth,
                timeAccuracy: input.timeAccuracy,
                timeSource: input.timeSource,
                rectificationAnchors: input.rectificationAnchors ? JSON.stringify(input.rectificationAnchors) : null,
                notes: input.notes
            }
        });
    }
    else {
        // 새 데이터 생성
        await prisma.birthData.create({
            data: {
                userId,
                birthDate: input.birthDate,
                birthTime: input.birthTime,
                birthPlace: input.birthPlace,
                birthCountry: input.birthCountry,
                birthTimezone: input.birthTimezone,
                sexAtBirth: input.sexAtBirth,
                timeAccuracy: input.timeAccuracy,
                timeSource: input.timeSource,
                rectificationAnchors: input.rectificationAnchors ? JSON.stringify(input.rectificationAnchors) : null,
                notes: input.notes
            }
        });
    }
}
/**
 * 3단계: 사용자 설정 저장
 */
async function saveUserPrefs(userId, input) {
    await prisma.userPrefs.update({
        where: { userId },
        data: {
            language: input.language,
            reportTimezone: input.reportTimezone,
            notificationEmailOptIn: input.notificationEmailOptIn,
            currentResidenceCity: input.currentResidenceCity,
            occupation: input.occupation,
            role: input.role,
            goals: input.goals,
            constraints: input.constraints,
            interpretationExperience: input.interpretationExperience,
            interpretationTone: input.interpretationTone,
            interests: input.interests ? JSON.stringify(input.interests) : null,
            decisionTimeline: input.decisionTimeline
        }
    });
}
/**
 * 완전한 회원가입 (모든 단계 한번에)
 */
async function completeSignUp(input) {
    // 이메일 중복 검사
    const existingUser = await prisma.user.findUnique({
        where: { email: input.email }
    });
    if (existingUser) {
        throw new Error('이미 사용 중인 이메일입니다');
    }
    // 비밀번호 해시화
    const passwordHash = await argon2.hash(input.password);
    // 현재 시간 (Asia/Phnom_Penh 기준)
    const currentTime = (0, time_1.nowISO)();
    // 트랜잭션으로 모든 데이터 생성
    const result = await prisma.$transaction(async (tx) => {
        // 사용자 생성
        const user = await tx.user.create({
            data: {
                email: input.email,
                passwordHash,
                displayName: input.displayName
            }
        });
        // 사용자 설정 생성
        const prefs = await tx.userPrefs.create({
            data: {
                userId: user.id,
                language: input.language,
                reportTimezone: input.reportTimezone,
                notificationEmailOptIn: input.notificationEmailOptIn,
                termsAcceptedAt: currentTime,
                privacyAcceptedAt: currentTime,
                consentProcessingBirthData: input.consentProcessingBirthData,
                currentResidenceCity: input.currentResidenceCity,
                occupation: input.occupation,
                role: input.role,
                goals: input.goals,
                constraints: input.constraints,
                interpretationExperience: input.interpretationExperience,
                interpretationTone: input.interpretationTone,
                interests: input.interests ? JSON.stringify(input.interests) : null,
                decisionTimeline: input.decisionTimeline
            }
        });
        // 출생 정보 생성
        const birthData = await tx.birthData.create({
            data: {
                userId: user.id,
                birthDate: input.birthDate,
                birthTime: input.birthTime,
                birthPlace: input.birthPlace,
                birthCountry: input.birthCountry,
                birthTimezone: input.birthTimezone,
                sexAtBirth: input.sexAtBirth,
                timeAccuracy: input.timeAccuracy,
                timeSource: input.timeSource,
                rectificationAnchors: input.rectificationAnchors ? JSON.stringify(input.rectificationAnchors) : null,
                notes: input.notes
            }
        });
        return { user, prefs, birthData };
    });
    // JWT 토큰 생성
    const token = (0, jwt_1.generateToken)({
        userId: result.user.id,
        email: result.user.email,
        displayName: result.user.displayName
    });
    return {
        user: {
            id: result.user.id,
            email: result.user.email,
            displayName: result.user.displayName
        },
        prefs: {
            id: result.prefs.id,
            language: result.prefs.language,
            reportTimezone: result.prefs.reportTimezone,
            notificationEmailOptIn: result.prefs.notificationEmailOptIn,
            termsAcceptedAt: result.prefs.termsAcceptedAt,
            privacyAcceptedAt: result.prefs.privacyAcceptedAt,
            consentProcessingBirthData: result.prefs.consentProcessingBirthData,
            currentResidenceCity: result.prefs.currentResidenceCity,
            occupation: result.prefs.occupation,
            role: result.prefs.role,
            goals: result.prefs.goals,
            constraints: result.prefs.constraints,
            interpretationExperience: result.prefs.interpretationExperience,
            interpretationTone: result.prefs.interpretationTone,
            interests: result.prefs.interests,
            decisionTimeline: result.prefs.decisionTimeline
        },
        birthData: {
            id: result.birthData.id,
            birthDate: result.birthData.birthDate,
            birthTime: result.birthData.birthTime,
            birthPlace: result.birthData.birthPlace,
            birthCountry: result.birthData.birthCountry,
            birthTimezone: result.birthData.birthTimezone,
            sexAtBirth: result.birthData.sexAtBirth,
            timeAccuracy: result.birthData.timeAccuracy,
            timeSource: result.birthData.timeSource,
            rectificationAnchors: result.birthData.rectificationAnchors,
            notes: result.birthData.notes
        },
        token
    };
}
/**
 * 로그인 서비스 (확장된 정보 포함)
 */
async function loginExtended(input) {
    // 사용자 조회
    const user = await prisma.user.findUnique({
        where: { email: input.email },
        include: {
            prefs: true,
            birthData: true
        }
    });
    if (!user) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다');
    }
    // 비밀번호 검증
    const isValidPassword = await argon2.verify(user.passwordHash, input.password);
    if (!isValidPassword) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다');
    }
    // JWT 토큰 생성
    const token = (0, jwt_1.generateToken)({
        userId: user.id,
        email: user.email,
        displayName: user.displayName
    });
    return {
        user: {
            id: user.id,
            email: user.email,
            displayName: user.displayName
        },
        prefs: {
            id: user.prefs.id,
            language: user.prefs.language,
            reportTimezone: user.prefs.reportTimezone,
            notificationEmailOptIn: user.prefs.notificationEmailOptIn,
            termsAcceptedAt: user.prefs.termsAcceptedAt,
            privacyAcceptedAt: user.prefs.privacyAcceptedAt,
            consentProcessingBirthData: user.prefs.consentProcessingBirthData,
            currentResidenceCity: user.prefs.currentResidenceCity,
            occupation: user.prefs.occupation,
            role: user.prefs.role,
            goals: user.prefs.goals,
            constraints: user.prefs.constraints,
            interpretationExperience: user.prefs.interpretationExperience,
            interpretationTone: user.prefs.interpretationTone,
            interests: user.prefs.interests,
            decisionTimeline: user.prefs.decisionTimeline
        },
        birthData: user.birthData ? {
            id: user.birthData.id,
            birthDate: user.birthData.birthDate,
            birthTime: user.birthData.birthTime,
            birthPlace: user.birthData.birthPlace,
            birthCountry: user.birthData.birthCountry,
            birthTimezone: user.birthData.birthTimezone,
            sexAtBirth: user.birthData.sexAtBirth,
            timeAccuracy: user.birthData.timeAccuracy,
            timeSource: user.birthData.timeSource,
            rectificationAnchors: user.birthData.rectificationAnchors,
            notes: user.birthData.notes
        } : null,
        token
    };
}
/**
 * 사용자 정보 조회 서비스 (확장된 정보 포함)
 */
async function getUserByIdExtended(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            prefs: true,
            birthData: true
        }
    });
    if (!user) {
        throw new Error('사용자를 찾을 수 없습니다');
    }
    return {
        user: {
            id: user.id,
            email: user.email,
            displayName: user.displayName
        },
        prefs: {
            id: user.prefs.id,
            language: user.prefs.language,
            reportTimezone: user.prefs.reportTimezone,
            notificationEmailOptIn: user.prefs.notificationEmailOptIn,
            termsAcceptedAt: user.prefs.termsAcceptedAt,
            privacyAcceptedAt: user.prefs.privacyAcceptedAt,
            consentProcessingBirthData: user.prefs.consentProcessingBirthData,
            currentResidenceCity: user.prefs.currentResidenceCity,
            occupation: user.prefs.occupation,
            role: user.prefs.role,
            goals: user.prefs.goals,
            constraints: user.prefs.constraints,
            interpretationExperience: user.prefs.interpretationExperience,
            interpretationTone: user.prefs.interpretationTone,
            interests: user.prefs.interests,
            decisionTimeline: user.prefs.decisionTimeline
        },
        birthData: user.birthData ? {
            id: user.birthData.id,
            birthDate: user.birthData.birthDate,
            birthTime: user.birthData.birthTime,
            birthPlace: user.birthData.birthPlace,
            birthCountry: user.birthData.birthCountry,
            birthTimezone: user.birthData.birthTimezone,
            sexAtBirth: user.birthData.sexAtBirth,
            timeAccuracy: user.birthData.timeAccuracy,
            timeSource: user.birthData.timeSource,
            rectificationAnchors: user.birthData.rectificationAnchors,
            notes: user.birthData.notes
        } : null
    };
}
//# sourceMappingURL=service-extended.js.map