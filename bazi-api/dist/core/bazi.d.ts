import { BirthData, Pillars, FiveElements, TenGodsStrength, Timeline, AnswerCard } from '../types';
export declare class BaziEngine {
    private ganzhi;
    constructor();
    /**
     * 메인 사주 계산 함수
     */
    calculateBazi(birthData: BirthData, sexAtBirth: 'male' | 'female'): {
        pillars: Pillars;
        five_elements: FiveElements;
        ten_gods_strength: TenGodsStrength;
        useful_god: string[];
        boundaryAlert: boolean;
        candidates?: Pillars[];
        timeline: Timeline;
        answers: AnswerCard[];
    };
    /**
     * 출생 시간 파싱
     */
    private parseBirthDateTime;
    /**
     * 경계 감도 검사
     */
    private checkBoundarySensitivity;
    /**
     * 사주 기둥 계산
     */
    private calculatePillars;
    /**
     * 대안 기둥 생성
     */
    private generateAlternativePillars;
    /**
     * 중복 기둥 제거
     */
    private removeDuplicatePillars;
    /**
     * 오행 분석
     */
    private analyzeFiveElements;
    /**
     * 십신 강도 분석
     */
    private analyzeTenGods;
    /**
     * 용신 후보 선정
     */
    private selectUsefulGods;
    /**
     * 타임라인 생성
     */
    private generateTimeline;
    /**
     * 답변 카드 생성
     */
    private generateAnswerCards;
    private getLuckPillarTheme;
    private getAnnualFocus;
    private getMonthlyWindow;
    private getMonthlyActions;
    private generateWealthCard;
    private generateCareerCard;
    private generateRelationshipCard;
    private generateHealthCard;
    private generateTimingCard;
    private getSeason;
}
//# sourceMappingURL=bazi.d.ts.map