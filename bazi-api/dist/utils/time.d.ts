import { DateTime } from 'luxon';
/**
 * 시간 관련 유틸리티
 */
export declare class TimeUtils {
    /**
     * 시간대 변환
     */
    convertTimezone(dateTime: DateTime, fromZone: string, toZone: string): DateTime;
    /**
     * 태양시 계산 (실제 태양의 위치 기반)
     */
    calculateSolarTime(dateTime: DateTime, longitude: number): DateTime;
    /**
     * 절기 기준 월 계산
     */
    getJieQiMonth(dateTime: DateTime): number;
    /**
     * 시간대별 지지 반환
     */
    getHourBranch(hour: number): string;
    /**
     * 윤달 확인
     */
    isLeapMonth(year: number, month: number): boolean;
    /**
     * 음력 날짜 변환 (간략화)
     */
    convertToLunar(dateTime: DateTime): {
        year: number;
        month: number;
        day: number;
        isLeap: boolean;
    };
    /**
     * 시간 정확도 검증
     */
    validateTimeAccuracy(birthData: {
        year: number;
        month: number;
        day: number;
        hour?: number;
        minute?: number;
    }): {
        isValid: boolean;
        issues: string[];
        recommendations: string[];
    };
    /**
     * 시간대별 운세 강도 계산
     */
    calculateHourLuck(hour: number): {
        strength: number;
        description: string;
    };
}
//# sourceMappingURL=time.d.ts.map