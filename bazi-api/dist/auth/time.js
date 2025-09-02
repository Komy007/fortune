"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nowISO = nowISO;
exports.toPhnomPenhISO = toPhnomPenhISO;
exports.getPhnomPenhTimeInfo = getPhnomPenhTimeInfo;
const luxon_1 = require("luxon");
/**
 * Asia/Phnom_Penh 기준 현재 시간을 ISO 문자열로 반환
 * @returns ISO 문자열 (예: "2024-01-15T10:30:00.000+07:00")
 */
function nowISO() {
    return luxon_1.DateTime.now()
        .setZone('Asia/Phnom_Penh')
        .toISO();
}
/**
 * 주어진 시간을 Asia/Phnom_Penh 기준으로 변환
 * @param dateTime 변환할 DateTime 객체
 * @returns Asia/Phnom_Penh 기준 ISO 문자열
 */
function toPhnomPenhISO(dateTime) {
    return dateTime.setZone('Asia/Phnom_Penh').toISO();
}
/**
 * 현재 Asia/Phnom_Penh 시간대 정보 반환
 * @returns 시간대 정보 객체
 */
function getPhnomPenhTimeInfo() {
    const now = luxon_1.DateTime.now().setZone('Asia/Phnom_Penh');
    return {
        iso: now.toISO(),
        offset: now.toFormat('ZZ'),
        zone: now.zoneName,
        timestamp: now.toMillis()
    };
}
