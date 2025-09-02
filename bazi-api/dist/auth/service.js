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
exports.signUp = signUp;
exports.login = login;
exports.getUserById = getUserById;
const client_1 = require("@prisma/client");
const argon2 = __importStar(require("argon2"));
const time_1 = require("./time");
const jwt_1 = require("./jwt");
const prisma = new client_1.PrismaClient();
/**
 * 회원가입 서비스
 * @param input 회원가입 입력 데이터
 * @returns 인증 응답
 */
async function signUp(input) {
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
    // 트랜잭션으로 사용자와 설정 생성
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
            consentProcessingBirthData: result.prefs.consentProcessingBirthData
        },
        token
    };
}
/**
 * 로그인 서비스
 * @param input 로그인 입력 데이터
 * @returns 인증 응답
 */
async function login(input) {
    // 사용자 조회
    const user = await prisma.user.findUnique({
        where: { email: input.email },
        include: { prefs: true }
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
            consentProcessingBirthData: user.prefs.consentProcessingBirthData
        },
        token
    };
}
/**
 * 사용자 정보 조회 서비스
 * @param userId 사용자 ID
 * @returns 사용자 정보 (토큰 제외)
 */
async function getUserById(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { prefs: true }
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
            consentProcessingBirthData: user.prefs.consentProcessingBirthData
        }
    };
}
