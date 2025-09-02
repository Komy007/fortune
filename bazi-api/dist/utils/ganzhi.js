"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GanzhiCalculator = void 0;
class GanzhiCalculator {
    constructor() {
        // 천간 정의
        this.HEAVENLY_STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
        // 지지 정의
        this.EARTHLY_BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
        // 천간 오행 매핑
        this.STEM_ELEMENTS = {
            '갑': '목', '을': '목',
            '병': '화', '정': '화',
            '무': '토', '기': '토',
            '경': '금', '신': '금',
            '임': '수', '계': '수'
        };
        // 지지 오행 매핑
        this.BRANCH_ELEMENTS = {
            '자': '수', '축': '토', '인': '목', '묘': '목',
            '진': '토', '사': '화', '오': '화', '미': '토',
            '신': '금', '유': '금', '술': '토', '해': '수'
        };
        // 지지 숨겨진 천간
        this.HIDDEN_STEMS = {
            '자': ['계'],
            '축': ['기', '신', '계'],
            '인': ['병', '무'],
            '묘': ['을'],
            '진': ['무', '을', '계'],
            '사': ['병', '무', '경'],
            '오': ['정', '기'],
            '미': ['기', '정', '신'],
            '신': ['경', '무', '임'],
            '유': ['신'],
            '술': ['무', '신', '정'],
            '해': ['임', '갑']
        };
    }
    /**
     * 연주 계산
     */
    calculateYearPillar(year) {
        const stemIndex = (year - 4) % 10;
        const branchIndex = (year - 4) % 12;
        const stem = this.HEAVENLY_STEMS[stemIndex];
        const branch = this.EARTHLY_BRANCHES[branchIndex];
        const element = this.STEM_ELEMENTS[stem];
        return { stem, branch, element };
    }
    /**
     * 월주 계산
     */
    calculateMonthPillar(year, month) {
        const yearStem = this.calculateYearPillar(year).stem;
        const yearStemIndex = this.HEAVENLY_STEMS.indexOf(yearStem);
        // 월간 천간 계산 (연간 천간에 따른 월간 천간 규칙)
        const monthStemIndex = (yearStemIndex * 2 + month - 1) % 10;
        const stem = this.HEAVENLY_STEMS[monthStemIndex];
        // 월간 지지 (월-1을 12로 나눈 나머지)
        const branchIndex = (month - 1) % 12;
        const branch = this.EARTHLY_BRANCHES[branchIndex];
        const element = this.STEM_ELEMENTS[stem];
        return { stem, branch, element };
    }
    /**
     * 일주 계산 (간단한 근사 계산)
     */
    calculateDayPillar(year, month, day) {
        // 간단한 근사 계산 (실제로는 더 정확한 계산 필요)
        const baseDate = new Date(1900, 0, 1); // 1900년 1월 1일을 기준
        const targetDate = new Date(year, month - 1, day);
        const daysDiff = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
        const stemIndex = daysDiff % 10;
        const branchIndex = daysDiff % 12;
        const stem = this.HEAVENLY_STEMS[stemIndex];
        const branch = this.EARTHLY_BRANCHES[branchIndex];
        const element = this.STEM_ELEMENTS[stem];
        return { stem, branch, element };
    }
    /**
     * 시주 계산
     */
    calculateHourPillar(dayStem, hour) {
        const dayStemIndex = this.HEAVENLY_STEMS.indexOf(dayStem);
        // 시간을 12지로 변환
        const branchIndex = Math.floor((hour + 1) / 2) % 12;
        const branch = this.EARTHLY_BRANCHES[branchIndex];
        // 시간 천간 계산 (일간 천간에 따른 시간 천간 규칙)
        const hourStemIndex = (dayStemIndex * 2 + Math.floor((hour + 1) / 2)) % 10;
        const stem = this.HEAVENLY_STEMS[hourStemIndex];
        const element = this.STEM_ELEMENTS[stem];
        return { stem, branch, element };
    }
    /**
     * 천간 오행 반환
     */
    getStemElement(stem) {
        return this.STEM_ELEMENTS[stem];
    }
    /**
     * 지지 오행 반환
     */
    getBranchElement(branch) {
        return this.BRANCH_ELEMENTS[branch];
    }
    /**
     * 지지 숨겨진 천간 반환
     */
    getHiddenElements(branch) {
        return this.HIDDEN_STEMS[branch] || [];
    }
    /**
     * 십신 계산
     */
    getTenGod(dayMaster, targetStem) {
        const dayElement = this.STEM_ELEMENTS[dayMaster];
        const targetElement = this.STEM_ELEMENTS[targetStem];
        // 십신 관계 정의
        const tenGodRelations = {
            '목': {
                '목': 'peer', // 비겁
                '화': 'output', // 식상
                '토': 'wealth', // 재성
                '금': 'officer', // 관성
                '수': 'resource' // 인성
            },
            '화': {
                '목': 'resource', // 인성
                '화': 'peer', // 비겁
                '토': 'output', // 식상
                '금': 'wealth', // 재성
                '수': 'officer' // 관성
            },
            '토': {
                '목': 'officer', // 관성
                '화': 'resource', // 인성
                '토': 'peer', // 비겁
                '금': 'output', // 식상
                '수': 'wealth' // 재성
            },
            '금': {
                '목': 'wealth', // 재성
                '화': 'officer', // 관성
                '토': 'resource', // 인성
                '금': 'peer', // 비겁
                '수': 'output' // 식상
            },
            '수': {
                '목': 'output', // 식상
                '화': 'wealth', // 재성
                '토': 'officer', // 관성
                '금': 'resource', // 인성
                '수': 'peer' // 비겁
            }
        };
        return tenGodRelations[dayElement]?.[targetElement] || 'peer';
    }
}
exports.GanzhiCalculator = GanzhiCalculator;
