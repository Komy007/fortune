import { HeavenlyStem, EarthlyBranch, Element } from '../types';
export declare class GanzhiCalculator {
    private readonly HEAVENLY_STEMS;
    private readonly EARTHLY_BRANCHES;
    private readonly STEM_ELEMENTS;
    private readonly BRANCH_ELEMENTS;
    private readonly HIDDEN_STEMS;
    /**
     * 연주 계산
     */
    calculateYearPillar(year: number): {
        stem: HeavenlyStem;
        branch: EarthlyBranch;
        element: Element;
    };
    /**
     * 월주 계산
     */
    calculateMonthPillar(year: number, month: number): {
        stem: HeavenlyStem;
        branch: EarthlyBranch;
        element: Element;
    };
    /**
     * 일주 계산 (간단한 근사 계산)
     */
    calculateDayPillar(year: number, month: number, day: number): {
        stem: HeavenlyStem;
        branch: EarthlyBranch;
        element: Element;
    };
    /**
     * 시주 계산
     */
    calculateHourPillar(dayStem: HeavenlyStem, hour: number): {
        stem: HeavenlyStem;
        branch: EarthlyBranch;
        element: Element;
    };
    /**
     * 천간 오행 반환
     */
    getStemElement(stem: HeavenlyStem): Element;
    /**
     * 지지 오행 반환
     */
    getBranchElement(branch: EarthlyBranch): Element;
    /**
     * 지지 숨겨진 천간 반환
     */
    getHiddenElements(branch: EarthlyBranch): HeavenlyStem[];
    /**
     * 십신 계산
     */
    getTenGod(dayMaster: HeavenlyStem, targetStem: HeavenlyStem): string;
}
//# sourceMappingURL=ganzhi.d.ts.map