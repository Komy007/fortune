"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaziEngine = void 0;
const luxon_1 = require("luxon");
const jieqi_1 = require("./jieqi");
const ganzhi_1 = require("../utils/ganzhi");
class BaziEngine {
    constructor() {
        this.ganzhi = new ganzhi_1.GanzhiCalculator();
    }
    /**
     * 메인 사주 계산 함수
     */
    calculateBazi(birthData, sexAtBirth) {
        // 1. 시간 변환 및 파싱
        const birthDateTime = this.parseBirthDateTime(birthData);
        // 2. 경계 감도 검사
        const boundaryCheck = this.checkBoundarySensitivity(birthDateTime, birthData.unknownTime);
        // 3. 사주 기둥 계산
        const pillars = this.calculatePillars(birthDateTime);
        // 4. 오행 분석
        const fiveElements = this.analyzeFiveElements(pillars);
        // 5. 십신 강도 분석
        const tenGodsStrength = this.analyzeTenGods(pillars);
        // 6. 용신 후보 선정
        const usefulGods = this.selectUsefulGods(fiveElements, tenGodsStrength);
        // 7. 타임라인 생성
        const timeline = this.generateTimeline(birthDateTime, sexAtBirth);
        // 8. 답변 카드 생성
        const answers = this.generateAnswerCards(pillars, fiveElements, tenGodsStrength, usefulGods);
        return {
            pillars,
            five_elements: fiveElements,
            ten_gods_strength: tenGodsStrength,
            useful_god: usefulGods,
            boundaryAlert: boundaryCheck.boundaryAlert,
            candidates: boundaryCheck.candidates,
            timeline,
            answers
        };
    }
    /**
     * 출생 시간 파싱
     */
    parseBirthDateTime(birthData) {
        const [year, month, day] = birthData.date.split('-').map(Number);
        const [hour, minute] = birthData.time.split(':').map(Number);
        // 기본 타임존은 Asia/Phnom_Penh (UTC+7)
        let timezone = 'Asia/Phnom_Penh';
        // 도시별 타임존 매핑 (실제로는 더 정확한 매핑 필요)
        const cityTimezoneMap = {
            '서울': 'Asia/Seoul',
            '부산': 'Asia/Seoul',
            '대구': 'Asia/Seoul',
            '인천': 'Asia/Seoul',
            '광주': 'Asia/Seoul',
            '대전': 'Asia/Seoul',
            '울산': 'Asia/Seoul',
            '제주': 'Asia/Seoul',
            '프놈펜': 'Asia/Phnom_Penh',
            '시엠립': 'Asia/Phnom_Penh',
            '뉴욕': 'America/New_York',
            '로스앤젤레스': 'America/Los_Angeles',
            '런던': 'Europe/London',
            '파리': 'Europe/Paris',
            '도쿄': 'Asia/Tokyo',
            '베이징': 'Asia/Shanghai',
            '홍콩': 'Asia/Hong_Kong',
            '싱가포르': 'Asia/Singapore'
        };
        if (cityTimezoneMap[birthData.place]) {
            timezone = cityTimezoneMap[birthData.place];
        }
        return luxon_1.DateTime.fromObject({
            year, month, day, hour, minute, second: 0
        }, { zone: timezone });
    }
    /**
     * 경계 감도 검사
     */
    checkBoundarySensitivity(birthDateTime, unknownTime) {
        const jieqiCheck = jieqi_1.jieqiCalculator.checkBoundarySensitivity(birthDateTime);
        // 시주 경계 검사 (2시간 단위)
        const hour = birthDateTime.hour;
        const minute = birthDateTime.minute;
        const hasHourBoundary = minute <= 5 || minute >= 55;
        const boundaryAlert = jieqiCheck.hasMonthBoundary ||
            jieqiCheck.hasYearBoundary ||
            hasHourBoundary;
        let confidence = Math.min(jieqiCheck.confidence, hasHourBoundary ? 0.8 : 1.0, unknownTime ? 0.6 : 1.0);
        let candidates = [];
        // 경계 근처인 경우 대안 계산
        if (boundaryAlert) {
            candidates = this.generateAlternativePillars(birthDateTime);
        }
        return {
            boundaryAlert,
            candidates,
            hourConfidence: confidence
        };
    }
    /**
     * 사주 기둥 계산
     */
    calculatePillars(birthDateTime) {
        const year = birthDateTime.year;
        const month = birthDateTime.month;
        const day = birthDateTime.day;
        const hour = birthDateTime.hour;
        // 연주 계산
        const yearPillar = this.ganzhi.calculateYearPillar(year);
        // 월주 계산 (중기 기준)
        const monthInfo = jieqi_1.jieqiCalculator.getMonthPillarByJieQi(birthDateTime);
        const monthPillar = this.ganzhi.calculateMonthPillar(year, monthInfo.month);
        // 일주 계산
        const dayPillar = this.ganzhi.calculateDayPillar(year, month, day);
        // 시주 계산
        const hourPillar = this.ganzhi.calculateHourPillar(dayPillar.stem, hour);
        return {
            year: yearPillar,
            month: monthPillar,
            day: dayPillar,
            hour: { ...hourPillar, confidence: monthInfo.confidence }
        };
    }
    /**
     * 대안 기둥 생성
     */
    generateAlternativePillars(birthDateTime) {
        const alternatives = [];
        // ±30분 범위에서 1분 간격으로 샘플링
        for (let offset = -30; offset <= 30; offset += 1) {
            const adjustedTime = birthDateTime.plus({ minutes: offset });
            const pillars = this.calculatePillars(adjustedTime);
            alternatives.push(pillars);
        }
        // 중복 제거 및 상위 3개 선택
        const uniquePillars = this.removeDuplicatePillars(alternatives);
        return uniquePillars.slice(0, 3);
    }
    /**
     * 중복 기둥 제거
     */
    removeDuplicatePillars(pillars) {
        const seen = new Set();
        const unique = [];
        for (const pillar of pillars) {
            const key = `${pillar.year.stem}${pillar.year.branch}-${pillar.month.stem}${pillar.month.branch}-${pillar.day.stem}${pillar.day.branch}-${pillar.hour.stem}${pillar.hour.branch}`;
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(pillar);
            }
        }
        return unique;
    }
    /**
     * 오행 분석
     */
    analyzeFiveElements(pillars) {
        const elements = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
        // 천간 오행
        [pillars.year.stem, pillars.month.stem, pillars.day.stem, pillars.hour.stem].forEach(stem => {
            const element = this.ganzhi.getStemElement(stem);
            elements[element]++;
        });
        // 지지 오행 (숨겨진 천간 포함)
        [pillars.year.branch, pillars.month.branch, pillars.day.branch, pillars.hour.branch].forEach(branch => {
            const element = this.ganzhi.getBranchElement(branch);
            elements[element]++;
            // 숨겨진 천간의 오행도 추가
            const hiddenStems = this.ganzhi.getHiddenElements(branch);
            hiddenStems.forEach(stem => {
                const hiddenElement = this.ganzhi.getStemElement(stem);
                elements[hiddenElement]++;
            });
        });
        // 비율로 정규화 (0~1)
        const total = Object.values(elements).reduce((sum, count) => sum + count, 0);
        Object.keys(elements).forEach(key => {
            elements[key] = Math.round((elements[key] / total) * 100) / 100;
        });
        return elements;
    }
    /**
     * 십신 강도 분석
     */
    analyzeTenGods(pillars) {
        const dayMaster = pillars.day.stem;
        const tenGods = {
            wealth: 0, // 재성
            officer: 0, // 관성
            output: 0, // 식상
            resource: 0, // 인성
            peer: 0 // 비겁
        };
        // 모든 천간에 대해 십신 계산
        const allStems = [
            pillars.year.stem, pillars.month.stem, pillars.day.stem, pillars.hour.stem
        ];
        allStems.forEach(stem => {
            const tenGod = this.ganzhi.getTenGod(dayMaster, stem);
            tenGods[tenGod]++;
        });
        // 숨겨진 천간도 포함
        [pillars.year.branch, pillars.month.branch, pillars.day.branch, pillars.hour.branch].forEach(branch => {
            const hiddenStems = this.ganzhi.getHiddenElements(branch);
            hiddenStems.forEach(stem => {
                const tenGod = this.ganzhi.getTenGod(dayMaster, stem);
                tenGods[tenGod]++;
            });
        });
        // 정규화 (0~1)
        const total = Object.values(tenGods).reduce((sum, count) => sum + count, 0);
        Object.keys(tenGods).forEach(key => {
            tenGods[key] = Math.round((tenGods[key] / total) * 100) / 100;
        });
        return tenGods;
    }
    /**
     * 용신 후보 선정
     */
    selectUsefulGods(fiveElements, tenGods) {
        const elements = Object.entries(fiveElements);
        const weakestElements = elements
            .sort(([, a], [, b]) => a - b)
            .slice(0, 2)
            .map(([element]) => element);
        return weakestElements;
    }
    /**
     * 타임라인 생성
     */
    generateTimeline(birthDateTime, sexAtBirth) {
        const currentYear = luxon_1.DateTime.now().year;
        const birthYear = birthDateTime.year;
        // 대운 계산 (10년 단위)
        const luckPillars = [];
        const startAge = 1;
        for (let i = 0; i < 8; i++) {
            const startYear = birthYear + startAge + (i * 10);
            const endYear = startYear + 9;
            const period = `${startYear}-${endYear}`;
            const pillar = this.ganzhi.calculateYearPillar(startYear);
            const theme = this.getLuckPillarTheme(pillar);
            luckPillars.push({ period, pillar: `${pillar.stem}${pillar.branch}`, theme });
        }
        // 세운 계산 (연간)
        const annual = [];
        for (let year = currentYear - 2; year <= currentYear + 2; year++) {
            const pillar = this.ganzhi.calculateYearPillar(year);
            const focus = this.getAnnualFocus(pillar);
            annual.push({ year, pillar: `${pillar.stem}${pillar.branch}`, focus });
        }
        // 월운 계산 (중기 기준)
        const monthly = [];
        const currentMonth = luxon_1.DateTime.now();
        for (let i = -1; i <= 1; i++) {
            const targetMonth = currentMonth.plus({ months: i });
            const monthInfo = jieqi_1.jieqiCalculator.getMonthPillarByJieQi(targetMonth);
            const pillar = this.ganzhi.calculateMonthPillar(targetMonth.year, monthInfo.month);
            const window = this.getMonthlyWindow(targetMonth);
            const actions = this.getMonthlyActions(pillar);
            monthly.push({
                month: `${targetMonth.year}-${targetMonth.month.toString().padStart(2, '0')}`,
                window,
                pillar: `${pillar.stem}${pillar.branch}`,
                actions
            });
        }
        return { luck_pillars: luckPillars, annual, monthly };
    }
    /**
     * 답변 카드 생성
     */
    generateAnswerCards(pillars, fiveElements, tenGods, usefulGods) {
        return [
            this.generateWealthCard(fiveElements, tenGods),
            this.generateCareerCard(fiveElements, tenGods),
            this.generateRelationshipCard(fiveElements, tenGods),
            this.generateHealthCard(fiveElements, usefulGods),
            this.generateTimingCard(fiveElements, tenGods)
        ];
    }
    // 헬퍼 메서드들
    getLuckPillarTheme(pillar) {
        const themes = {
            '갑': '성장과 확장',
            '을': '유연한 발전',
            '병': '열정과 변화',
            '정': '안정과 조화',
            '무': '책임과 권위',
            '기': '중재와 균형',
            '경': '정의와 원칙',
            '신': '혁신과 개혁',
            '임': '지혜와 깊이',
            '계': '완성과 마무리'
        };
        return themes[pillar.stem] || '균형과 조화';
    }
    getAnnualFocus(pillar) {
        const focuses = {
            '갑': '새로운 시작과 도전',
            '을': '협력과 성장',
            '병': '열정과 창의성',
            '정': '안정과 발전',
            '무': '책임과 리더십',
            '기': '균형과 조화',
            '경': '정의와 원칙',
            '신': '혁신과 변화',
            '임': '지혜와 깊이',
            '계': '완성과 성취'
        };
        return focuses[pillar.stem] || '균형잡힌 발전';
    }
    getMonthlyWindow(month) {
        const start = month.startOf('month');
        const end = month.endOf('month');
        return `${start.toFormat('yyyy-MM-dd')}~${end.toFormat('yyyy-MM-dd')}(중기 기준)`;
    }
    getMonthlyActions(pillar) {
        return [
            '새로운 계획 수립',
            '기존 프로젝트 정리',
            '관계 개선 노력'
        ];
    }
    // 카드별 생성 메서드들
    generateWealthCard(fiveElements, tenGods) {
        const wealth = tenGods.wealth;
        let oneLiner = '';
        let why = '';
        let detail = [];
        let todo = [];
        if (wealth > 0.3) {
            oneLiner = '재물운이 강한 시기입니다. 수익 창출에 집중하세요.';
            why = '재성 과다로 인한 수익 기회 증가';
            detail = [
                '재성(財星)이 강하게 작용하여 수익 창출 능력이 향상됩니다.',
                '관성과의 조화로 안정적인 재정 관리가 가능합니다.',
                '투자와 사업 확장에 유리한 기운이 감지됩니다.'
            ];
            todo = [
                '신규 수익원 개발 계획 수립 (1개월 내)',
                '투자 포트폴리오 재검토 (2주 내)',
                '재정 계획 수립 및 실행 (3개월 내)'
            ];
        }
        else {
            oneLiner = '안정적인 재정 관리가 필요한 시기입니다.';
            why = '오행 균형 상태로 안정적 재정 관리 권장';
            detail = [
                '오행이 균형잡혀 있어 안정적인 재정 관리가 가능합니다.',
                '점진적인 수입 증가와 적절한 지출 관리가 중요합니다.',
                '장기적인 재정 계획 수립에 좋은 시기입니다.'
            ];
            todo = [
                '정기적인 수입 관리 시스템 구축 (1개월 내)',
                '적절한 저축 계획 수립 (2주 내)',
                '리스크 분산 투자 검토 (3개월 내)'
            ];
        }
        return { topic: '재물', one_liner: oneLiner, why, detail, todo };
    }
    generateCareerCard(fiveElements, tenGods) {
        const output = tenGods.output;
        let oneLiner = '';
        let why = '';
        let detail = [];
        let todo = [];
        if (output > 0.3) {
            oneLiner = '창의적이고 혁신적인 업무에 집중하세요.';
            why = '식상 과다로 인한 창의성과 혁신 기회 증가';
            detail = [
                '식상(食傷)이 강하여 창의적 사고와 혁신 능력이 향상됩니다.',
                '새로운 아이디어와 프로젝트 제안에 유리한 시기입니다.',
                '기술 개발과 창작 활동에 집중할 수 있습니다.'
            ];
            todo = [
                '새로운 프로젝트 제안서 작성 (2주 내)',
                '기술 개발 투자 계획 수립 (1개월 내)',
                '팀워크 강화 활동 참여 (3개월 내)'
            ];
        }
        else {
            oneLiner = '균형 잡힌 업무 접근이 필요한 시기입니다.';
            why = '오행 균형 상태로 다양한 업무 영역 개발 가능';
            detail = [
                '오행이 균형잡혀 있어 다양한 업무 영역에서 성과를 낼 수 있습니다.',
                '지속적인 학습과 새로운 기술 습득에 좋은 시기입니다.',
                '네트워킹과 협력 관계 구축이 중요합니다.'
            ];
            todo = [
                '다양한 업무 경험 쌓기 (3개월 내)',
                '지속적 학습 계획 수립 (1개월 내)',
                '네트워킹 확대 활동 (2개월 내)'
            ];
        }
        return { topic: '직업/사업', one_liner: oneLiner, why, detail, todo };
    }
    generateRelationshipCard(fiveElements, tenGods) {
        const peer = tenGods.peer;
        let oneLiner = '';
        let why = '';
        let detail = [];
        let todo = [];
        if (peer > 0.3) {
            oneLiner = '감정적 교류가 활발한 시기입니다. 소통에 집중하세요.';
            why = '비겁 과다로 인한 감정적 교류 증가';
            detail = [
                '비겁(比劫)이 강하여 감정적 교류와 소통이 활발합니다.',
                '친구나 동료와의 관계가 중요한 시기입니다.',
                '협력과 공감 능력이 향상됩니다.'
            ];
            todo = [
                '대화 시간 확대 및 질적 향상 (1주 내)',
                '감정 표현 연습 및 개선 (2주 내)',
                '상대방 이해를 위한 노력 (1개월 내)'
            ];
        }
        else {
            oneLiner = '안정적이고 균형 잡힌 관계가 중요한 시기입니다.';
            why = '오행 균형 상태로 안정적 관계 유지 권장';
            detail = [
                '오행이 균형잡혀 있어 안정적이고 건강한 관계를 유지할 수 있습니다.',
                '신뢰 관계 구축과 상호 이해가 중요합니다.',
                '지속적이고 깊이 있는 관계 발전이 가능합니다.'
            ];
            todo = [
                '신뢰 관계 구축 활동 (1개월 내)',
                '상호 이해를 위한 대화 시간 확대 (2주 내)',
                '지속적 소통 시스템 구축 (3개월 내)'
            ];
        }
        return { topic: '관계/배우자', one_liner: oneLiner, why, detail, todo };
    }
    generateHealthCard(fiveElements, usefulGods) {
        const weakestElement = usefulGods[0];
        let oneLiner = '';
        let why = '';
        let detail = [];
        let todo = [];
        switch (weakestElement) {
            case '목':
                oneLiner = '간과 담낭 건강에 주의가 필요합니다.';
                why = '목(간/담낭) 기운 부족';
                detail = [
                    '목(木) 기운이 부족하여 간과 담낭 기능에 주의가 필요합니다.',
                    '스트레스 관리와 정서적 안정이 중요합니다.',
                    '규칙적인 운동과 충분한 휴식이 필요합니다.'
                ];
                todo = [
                    '녹차 섭취 및 간 건강 식품 추가 (1주 내)',
                    '규칙적 운동 습관 형성 (2주 내)',
                    '스트레스 관리 프로그램 참여 (1개월 내)'
                ];
                break;
            default:
                oneLiner = '전반적인 건강 관리가 중요한 시기입니다.';
                why = '오행 균형 상태';
                detail = [
                    '오행이 균형잡혀 있어 전반적으로 건강한 상태입니다.',
                    '규칙적인 생활 습관 유지가 중요합니다.',
                    '예방적 건강 관리에 집중하세요.'
                ];
                todo = [
                    '규칙적 운동 습관 형성 (2주 내)',
                    '균형 잡힌 식사 계획 수립 (1주 내)',
                    '충분한 휴식 시간 확보 (1개월 내)'
                ];
        }
        return { topic: '건강', one_liner: oneLiner, why, detail, todo };
    }
    generateTimingCard(fiveElements, tenGods) {
        const currentMonth = luxon_1.DateTime.now().month;
        const season = this.getSeason(currentMonth);
        let oneLiner = '';
        let why = '';
        let detail = [];
        let todo = [];
        switch (season) {
            case 'spring':
                oneLiner = '봄철 목(木) 기운으로 새로운 시작에 집중하세요.';
                why = '봄철 목(木) 기운 강화';
                detail = [
                    '봄철 목(木) 기운이 강하여 새로운 시작과 성장에 유리합니다.',
                    '창의적 사고와 새로운 계획 수립에 좋은 시기입니다.',
                    '활동적이고 적극적인 접근이 성공의 열쇠입니다.'
                ];
                todo = [
                    '새로운 계획 수립 및 실행 (1개월 내)',
                    '성장 투자 및 개발 활동 (2개월 내)',
                    '활동적 생활 습관 형성 (3개월 내)'
                ];
                break;
            default:
                oneLiner = '현재 시기에 맞는 적절한 접근이 필요합니다.';
                why = '계절적 특성에 따른 접근';
                detail = [
                    '현재 계절의 특성을 고려한 적절한 접근이 중요합니다.',
                    '계획적이고 체계적인 활동이 성공의 열쇠입니다.',
                    '지속적인 노력과 인내가 필요한 시기입니다.'
                ];
                todo = [
                    '계절별 활동 계획 수립 (1개월 내)',
                    '체계적 접근 방법 개발 (2개월 내)',
                    '지속적 노력 시스템 구축 (3개월 내)'
                ];
        }
        return { topic: '타이밍', one_liner: oneLiner, why, detail, todo };
    }
    getSeason(month) {
        if (month >= 3 && month <= 5)
            return 'spring';
        if (month >= 6 && month <= 8)
            return 'summer';
        if (month >= 9 && month <= 11)
            return 'autumn';
        return 'winter';
    }
}
exports.BaziEngine = BaziEngine;
//# sourceMappingURL=bazi.js.map