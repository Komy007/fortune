import { BaziResult, ExpertInterpretation } from '../types/bazi';
/**
 * 전문가급 명리학 해석 템플릿
 */
export declare class InterpretationTemplates {
    /**
     * Top 7 질문에 대한 전문 해석 생성
     */
    generateExpertInterpretation(baziResult: BaziResult): ExpertInterpretation;
    /**
     * 재물운 해석
     */
    private generateWealthAnswer;
    /**
     * 직업운 해석
     */
    private generateCareerAnswer;
    /**
     * 투자 타이밍 해석
     */
    private generateInvestmentAnswer;
    /**
     * 인연운 해석
     */
    private generateRelationshipAnswer;
    /**
     * 건강운 해석
     */
    private generateHealthAnswer;
    /**
     * 이사/이동운 해석
     */
    private generateMovingAnswer;
    /**
     * 올해/이번달 운세 해석
     */
    private generateYearlyAnswer;
    /**
     * 가장 강한 오행 찾기
     */
    private getStrongestElement;
    /**
     * 가장 약한 오행 찾기
     */
    private getWeakestElement;
    /**
     * 오행 균형 점수 계산
     */
    private calculateBalanceScore;
    /**
     * 오행 상생 관계 확인
     */
    private isGenerating;
    /**
     * 천간의 오행 반환
     */
    private getStemElement;
    /**
     * 개인화된 추천사항 생성
     */
    private generateRecommendations;
}
//# sourceMappingURL=cards.d.ts.map