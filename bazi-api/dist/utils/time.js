"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeUtils = void 0;
/**
 * 시간 관련 유틸리티
 */
class TimeUtils {
    /**
     * 시간대 변환
     */
    convertTimezone(dateTime, fromZone, toZone) {
        return dateTime.setZone(fromZone).setZone(toZone);
    }
    /**
     * 태양시 계산 (실제 태양의 위치 기반)
     */
    calculateSolarTime(dateTime, longitude) {
        // 경도에 따른 시간 보정 (1도 = 4분)
        const timeOffset = longitude * 4; // 분 단위
        return dateTime.plus({ minutes: timeOffset });
    }
    /**
     * 절기 기준 월 계산
     */
    getJieQiMonth(dateTime) {
        const month = dateTime.month;
        const day = dateTime.day;
        // 절기 기준 월 계산 (간략화)
        if (month === 1 && day < 5)
            return 11; // 소한 이전
        if (month === 2 && day < 4)
            return 0; // 입춘 이전
        if (month === 3 && day < 5)
            return 1; // 경칩 이전
        if (month === 4 && day < 4)
            return 2; // 청명 이전
        if (month === 5 && day < 5)
            return 3; // 입하 이전
        if (month === 6 && day < 5)
            return 4; // 망종 이전
        if (month === 7 && day < 6)
            return 5; // 소서 이전
        if (month === 8 && day < 7)
            return 6; // 입추 이전
        if (month === 9 && day < 7)
            return 7; // 백로 이전
        if (month === 10 && day < 8)
            return 8; // 한로 이전
        if (month === 11 && day < 7)
            return 9; // 입동 이전
        if (month === 12 && day < 7)
            return 10; // 대설 이전
        return month - 1;
    }
    /**
     * 시간대별 지지 반환
     */
    getHourBranch(hour) {
        const hourBranchMap = {
            23: '자', 0: '자', 1: '축', 2: '축', 3: '인', 4: '인', 5: '묘', 6: '묘',
            7: '진', 8: '진', 9: '사', 10: '사', 11: '오', 12: '오', 13: '미', 14: '미',
            15: '신', 16: '신', 17: '유', 18: '유', 19: '술', 20: '술', 21: '해', 22: '해'
        };
        return hourBranchMap[hour] || '자';
    }
    /**
     * 윤달 확인
     */
    isLeapMonth(year, month) {
        // 간단한 윤달 계산 (실제로는 더 복잡)
        const leapYears = [2020, 2024, 2028, 2032, 2036, 2040];
        return leapYears.includes(year) && month === 2;
    }
    /**
     * 음력 날짜 변환 (간략화)
     */
    convertToLunar(dateTime) {
        // 실제로는 복잡한 음력 변환 알고리즘이 필요
        // 여기서는 간단한 근사값 반환
        const year = dateTime.year;
        const month = dateTime.month;
        const day = dateTime.day;
        return {
            year,
            month,
            day,
            isLeap: this.isLeapMonth(year, month)
        };
    }
    /**
     * 시간 정확도 검증
     */
    validateTimeAccuracy(birthData) {
        const issues = [];
        const recommendations = [];
        // 기본 검증
        if (birthData.year < 1900 || birthData.year > 2100) {
            issues.push('출생년도가 범위를 벗어났습니다 (1900-2100)');
        }
        if (birthData.month < 1 || birthData.month > 12) {
            issues.push('출생월이 유효하지 않습니다');
        }
        if (birthData.day < 1 || birthData.day > 31) {
            issues.push('출생일이 유효하지 않습니다');
        }
        if (birthData.hour !== undefined && (birthData.hour < 0 || birthData.hour > 23)) {
            issues.push('출생시간이 유효하지 않습니다');
        }
        // 시간 정확도 관련
        if (birthData.hour === undefined) {
            issues.push('출생시간이 불분명합니다');
            recommendations.push('시간 정확도를 높이기 위해 출생시간을 확인해주세요');
        }
        if (birthData.minute === undefined) {
            recommendations.push('더 정확한 분석을 위해 출생분을 입력해주세요');
        }
        return {
            isValid: issues.length === 0,
            issues,
            recommendations
        };
    }
    /**
     * 시간대별 운세 강도 계산
     */
    calculateHourLuck(hour) {
        // 시간대별 운세 강도 (간단한 예시)
        const hourLuckMap = {
            0: { strength: 0.8, description: '자시 - 밤의 시작, 조용한 에너지' },
            1: { strength: 0.6, description: '축시 - 깊은 밤, 내면의 시간' },
            2: { strength: 0.4, description: '인시 - 새벽의 시작, 새로운 기운' },
            3: { strength: 0.5, description: '묘시 - 새벽, 잠에서 깨어나는 시간' },
            4: { strength: 0.7, description: '진시 - 이른 새벽, 활기찬 시작' },
            5: { strength: 0.9, description: '사시 - 아침, 에너지가 넘치는 시간' },
            6: { strength: 1.0, description: '오시 - 정오, 가장 강한 양의 기운' },
            7: { strength: 0.9, description: '미시 - 오후, 안정적인 에너지' },
            8: { strength: 0.8, description: '신시 - 늦은 오후, 지혜의 시간' },
            9: { strength: 0.7, description: '유시 - 저녁, 수확의 시간' },
            10: { strength: 0.6, description: '술시 - 밤, 휴식의 시간' },
            11: { strength: 0.5, description: '해시 - 깊은 밤, 내면의 시간' }
        };
        return hourLuckMap[hour] || { strength: 0.5, description: '중간 강도의 시간' };
    }
}
exports.TimeUtils = TimeUtils;
//# sourceMappingURL=time.js.map