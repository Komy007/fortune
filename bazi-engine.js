// 명리학 계산 엔진
// 24절기 기반 정확한 사주 계산

class BaziEngine {
  constructor() {
    this.heavenlyStems = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
    this.earthlyBranches = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
    this.elements = ['목', '화', '토', '금', '수'];
    this.tenGods = ['비견', '겁재', '식신', '상관', '편재', '정재', '편관', '정관', '편인', '정인'];
    
    // 24절기 데이터 (2024-2025년 기준)
    this.solarTerms = {
      2024: {
        '입춘': '2024-02-04T10:27:00Z',
        '우수': '2024-02-19T06:13:00Z',
        '경칩': '2024-03-05T10:23:00Z',
        '춘분': '2024-03-20T11:06:00Z',
        '청명': '2024-04-04T15:02:00Z',
        '곡우': '2024-04-20T22:07:00Z',
        '입하': '2024-05-05T08:10:00Z',
        '소만': '2024-05-21T01:09:00Z',
        '망종': '2024-06-05T12:10:00Z',
        '하지': '2024-06-21T04:51:00Z',
        '소서': '2024-07-06T22:20:00Z',
        '대서': '2024-07-22T15:44:00Z',
        '입추': '2024-08-07T08:09:00Z',
        '처서': '2024-08-23T00:46:00Z',
        '백로': '2024-09-07T11:32:00Z',
        '추분': '2024-09-22T20:44:00Z',
        '한로': '2024-10-08T03:55:00Z',
        '상강': '2024-10-23T07:14:00Z',
        '입동': '2024-11-07T07:20:00Z',
        '소설': '2024-11-22T04:47:00Z',
        '대설': '2024-12-07T00:05:00Z',
        '동지': '2024-12-21T18:03:00Z',
        '소한': '2024-12-21T18:03:00Z',
        '대한': '2025-01-20T11:07:00Z'
      }
    };
  }

  // 24절기 기반 월주 판정
  getMonthPillar(birthDate) {
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    // 해당 연도의 절기 데이터 가져오기
    const yearTerms = this.solarTerms[year] || this.solarTerms[2024];
    
    // 중기(節氣) 기준으로 월주 판정
    const zhongqi = [
      '입춘', '경칩', '청명', '입하', '망종', '소서',
      '입추', '백로', '한로', '입동', '대설', '소한'
    ];
    
    let monthIndex = 0;
    const birthTime = birthDate.getTime();
    
    for (let i = 0; i < zhongqi.length; i++) {
      const termDate = new Date(yearTerms[zhongqi[i]]);
      if (birthTime >= termDate.getTime()) {
        monthIndex = i;
      } else {
        break;
      }
    }
    
    return monthIndex;
  }

  // 간지 계산
  calculateGanZhi(year, month, day, hour) {
    // 년주 계산 (간단한 버전)
    const yearGan = this.heavenlyStems[(year - 4) % 10];
    const yearZhi = this.earthlyBranches[(year - 4) % 12];
    
    // 월주 계산 (24절기 기반)
    const monthIndex = this.getMonthPillar(new Date(year, month - 1, day));
    const monthGan = this.heavenlyStems[((year - 4) * 2 + monthIndex + 1) % 10];
    const monthZhi = this.earthlyBranches[monthIndex];
    
    // 일주 계산 (간단한 버전)
    const baseDate = new Date(1900, 0, 1);
    const targetDate = new Date(year, month - 1, day);
    const daysDiff = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
    const dayGan = this.heavenlyStems[daysDiff % 10];
    const dayZhi = this.earthlyBranches[daysDiff % 12];
    
    // 시주 계산
    const hourIndex = Math.floor(hour / 2) % 12;
    const hourZhi = this.earthlyBranches[hourIndex];
    const hourGan = this.heavenlyStems[(daysDiff * 12 + hourIndex) % 10];
    
    return {
      year: { stem: yearGan, branch: yearZhi },
      month: { stem: monthGan, branch: monthZhi },
      day: { stem: dayGan, branch: dayZhi },
      hour: { stem: hourGan, branch: hourZhi }
    };
  }

  // 오행 분석
  analyzeElements(pillars) {
    const elementCounts = {};
    
    // 각 기둥의 오행 계산
    Object.values(pillars).forEach(pillar => {
      const stemElement = this.getStemElement(pillar.stem);
      const branchElement = this.getBranchElement(pillar.branch);
      
      elementCounts[stemElement] = (elementCounts[stemElement] || 0) + 1;
      elementCounts[branchElement] = (elementCounts[branchElement] || 0) + 1;
    });
    
    return elementCounts;
  }

  // 천간 오행
  getStemElement(stem) {
    const stemElements = {
      '갑': '목', '을': '목',
      '병': '화', '정': '화',
      '무': '토', '기': '토',
      '경': '금', '신': '금',
      '임': '수', '계': '수'
    };
    return stemElements[stem] || '토';
  }

  // 지지 오행
  getBranchElement(branch) {
    const branchElements = {
      '자': '수', '축': '토', '인': '목', '묘': '목',
      '진': '토', '사': '화', '오': '화', '미': '토',
      '신': '금', '유': '금', '술': '토', '해': '수'
    };
    return branchElements[branch] || '토';
  }

  // 십신 분석
  analyzeTenGods(pillars) {
    const dayMaster = pillars.day.stem;
    const dayElement = this.getStemElement(dayMaster);
    
    const tenGods = {};
    
    Object.entries(pillars).forEach(([position, pillar]) => {
      const stemGod = this.getTenGod(dayMaster, pillar.stem);
      const branchGod = this.getTenGod(dayMaster, pillar.branch);
      
      tenGods[`${position}_stem`] = stemGod;
      tenGods[`${position}_branch`] = branchGod;
    });
    
    return tenGods;
  }

  // 십신 판정
  getTenGod(dayMaster, target) {
    const dayIndex = this.heavenlyStems.indexOf(dayMaster);
    const targetIndex = this.heavenlyStems.indexOf(target);
    
    if (targetIndex === -1) {
      // 지지인 경우 간단한 변환
      const branchToStem = {
        '자': '임', '축': '기', '인': '갑', '묘': '을',
        '진': '무', '사': '병', '오': '정', '미': '기',
        '신': '경', '유': '신', '술': '무', '해': '계'
      };
      target = branchToStem[target] || '무';
      const branchIndex = this.heavenlyStems.indexOf(target);
      return this.calculateTenGod(dayIndex, branchIndex);
    }
    
    return this.calculateTenGod(dayIndex, targetIndex);
  }

  // 십신 계산
  calculateTenGod(dayIndex, targetIndex) {
    const diff = (targetIndex - dayIndex + 10) % 10;
    return this.tenGods[diff];
  }

  // 용신 추천
  recommendUsefulGod(elementCounts, dayElement) {
    const elementStrengths = {};
    
    // 각 오행의 강도 계산
    this.elements.forEach(element => {
      elementStrengths[element] = elementCounts[element] || 0;
    });
    
    // 일간 오행 기준으로 용신 판정
    const dayStrength = elementStrengths[dayElement] || 0;
    const recommendations = [];
    
    // 약한 오행 보강
    this.elements.forEach(element => {
      if ((elementStrengths[element] || 0) < 2) {
        recommendations.push(element);
      }
    });
    
    return recommendations.slice(0, 2); // 상위 2개 추천
  }

  // 대운 계산
  calculateLuckPillars(birthYear, birthMonth, gender) {
    const luckPillars = [];
    const startAge = this.getStartAge(birthYear, birthMonth, gender);
    
    for (let i = 0; i < 8; i++) {
      const age = startAge + (i * 10);
      const year = birthYear + age;
      const pillar = this.calculateGanZhi(year, birthMonth, 1, 12);
      
      luckPillars.push({
        period: `${year}-${year + 9}`,
        pillar: `${pillar.year.stem}${pillar.year.branch}`,
        age: age,
        theme: this.getLuckTheme(pillar.year)
      });
    }
    
    return luckPillars;
  }

  // 대운 시작 나이
  getStartAge(birthYear, birthMonth, gender) {
    // 간단한 계산 (실제로는 더 복잡)
    return gender === 'male' ? 1 : 2;
  }

  // 대운 테마
  getLuckTheme(pillar) {
    const element = this.getStemElement(pillar.stem);
    const themes = {
      '목': '성장/확장',
      '화': '열정/변화',
      '토': '안정/기반',
      '금': '정리/수확',
      '수': '지혜/유연'
    };
    return themes[element] || '변화';
  }

  // 메인 계산 함수
  calculateBazi(birthData) {
    const { year, month, day, hour, timezone = 'Asia/Seoul' } = birthData;
    
    // 간지 계산
    const pillars = this.calculateGanZhi(year, month, day, hour);
    
    // 오행 분석
    const elementCounts = this.analyzeElements(pillars);
    
    // 십신 분석
    const tenGods = this.analyzeTenGods(pillars);
    
    // 용신 추천
    const usefulGods = this.recommendUsefulGod(elementCounts, this.getStemElement(pillars.day.stem));
    
    // 대운 계산
    const luckPillars = this.calculateLuckPillars(year, month, 'male'); // 기본값
    
    return {
      pillars,
      elementCounts,
      tenGods,
      usefulGods,
      luckPillars,
      dayMaster: pillars.day.stem,
      dayElement: this.getStemElement(pillars.day.stem)
    };
  }
}

module.exports = BaziEngine;
