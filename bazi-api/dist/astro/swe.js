"use strict";
/**
 * Swiss Ephemeris 래퍼
 *
 * 정확도: Swiss Ephemeris 2.10.03 기준, geocentric ecliptic coordinates
 * 한계: 주요 행성만 계산 (Chiron, Ceres 등 소행성 제외)
 * 참고: https://www.astro.com/swisseph/swephinfo_e.htm
 */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSwissEphemeris = initSwissEphemeris;
exports.toJulian = toJulian;
exports.calcPlanetsUTC = calcPlanetsUTC;
exports.calcHouses = calcHouses;
exports.calcPlanetsForDate = calcPlanetsForDate;
exports.getSwissEphemerisInfo = getSwissEphemerisInfo;
const swisseph = __importStar(require("swisseph"));
const luxon_1 = require("luxon");
const path_1 = __importDefault(require("path"));
const types_1 = require("./types");
let isInitialized = false;
/**
 * Swiss Ephemeris 초기화
 */
function initSwissEphemeris(ephePath) {
    if (isInitialized)
        return;
    const defaultPath = path_1.default.resolve(__dirname, '../../../ephe');
    const finalPath = ephePath || defaultPath;
    try {
        swisseph.swe_set_ephe_path(finalPath);
        console.log(`✅ Swiss Ephemeris initialized with path: ${finalPath}`);
        isInitialized = true;
    }
    catch (error) {
        console.error(`❌ Failed to initialize Swiss Ephemeris:`, error);
        throw new Error(`Swiss Ephemeris initialization failed. Please check ephemeris data at: ${finalPath}`);
    }
}
/**
 * 날짜를 율리우스 일로 변환
 */
function toJulian(dateTime) {
    const year = dateTime.getUTCFullYear();
    const month = dateTime.getUTCMonth() + 1;
    const day = dateTime.getUTCDate();
    const hour = dateTime.getUTCHours() + dateTime.getUTCMinutes() / 60;
    return swisseph.swe_julday(year, month, day, hour, swisseph.SE_GREG_CAL);
}
/**
 * UTC 시간에서 행성 위치 계산
 */
function calcPlanetsUTC(input) {
    if (!isInitialized) {
        throw new Error('Swiss Ephemeris not initialized. Call initSwissEphemeris() first.');
    }
    // 입력 시간을 UTC로 변환
    const localDateTime = luxon_1.DateTime.fromISO(`${input.date}T${input.time}`, { zone: input.tz });
    const utcDateTime = localDateTime.toUTC().toJSDate();
    const julianDay = toJulian(utcDateTime);
    const planets = {};
    const flags = types_1.SEFLG_SWIEPH | types_1.SEFLG_SPEED;
    // 각 행성 계산
    for (const [planetName, planetId] of Object.entries(types_1.PLANET_IDS)) {
        try {
            const result = swisseph.swe_calc_ut(julianDay, planetId, flags);
            planets[planetName] = {
                lon: result.longitude,
                lat: result.latitude,
                dist: result.distance,
                speed: result.speedLong
            };
        }
        catch (error) {
            console.error(`Failed to calculate ${planetName}:`, error);
            // 기본값 설정
            planets[planetName] = {
                lon: 0,
                lat: 0,
                dist: 0,
                speed: 0
            };
        }
    }
    return planets;
}
/**
 * 하우스 계산
 */
function calcHouses(input, system) {
    if (!isInitialized) {
        throw new Error('Swiss Ephemeris not initialized. Call initSwissEphemeris() first.');
    }
    // 입력 시간을 UTC로 변환
    const localDateTime = luxon_1.DateTime.fromISO(`${input.date}T${input.time}`, { zone: input.tz });
    const utcDateTime = localDateTime.toUTC().toJSDate();
    const julianDay = toJulian(utcDateTime);
    if (system === 'placidus') {
        // Placidus 하우스 시스템
        const result = swisseph.swe_houses_ex2(julianDay, types_1.SEFLG_SWIEPH, input.lat, input.lon, types_1.SE_HSYS_PLACIDUS);
        const houses = result.cusps.map((cusp, index) => ({
            house: index + 1,
            longitude: cusp
        }));
        return {
            asc: result.ascendant,
            mc: result.mc,
            houses
        };
    }
    else {
        // Whole Sign 하우스 시스템
        const result = swisseph.swe_houses_ex2(julianDay, types_1.SEFLG_SWIEPH, input.lat, input.lon, types_1.SE_HSYS_PLACIDUS // ASC 계산용
        );
        const asc = result.ascendant;
        const mc = result.mc;
        // Whole Sign: ASC가 속한 별자리의 0°를 1하우스 시작으로
        const ascSign = Math.floor(asc / 30);
        const houses = [];
        for (let i = 0; i < 12; i++) {
            const houseLongitude = (ascSign + i) * 30;
            houses.push({
                house: i + 1,
                longitude: houseLongitude
            });
        }
        return { asc, mc, houses };
    }
}
/**
 * 특정 날짜의 행성 위치 계산 (트랜짓용)
 */
function calcPlanetsForDate(date, time, tz) {
    const input = {
        date,
        time,
        tz,
        lat: 0, // 트랜짓 계산에서는 위치가 중요하지 않음
        lon: 0
    };
    return calcPlanetsUTC(input);
}
/**
 * Swiss Ephemeris 버전 정보
 */
function getSwissEphemerisInfo() {
    try {
        const version = swisseph.swe_version();
        const path = swisseph.swe_get_library_path();
        return { version, path };
    }
    catch (error) {
        return { version: 'unknown', path: 'unknown' };
    }
}
