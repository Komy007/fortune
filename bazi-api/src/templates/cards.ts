import { BaziResult, ExpertInterpretation, Element } from '../types/bazi';

/**
 * 전문가급 명리학 해석 템플릿
 */
export class InterpretationTemplates {
  
  /**
   * Top 7 질문에 대한 전문 해석 생성
   */
  public generateExpertInterpretation(baziResult: BaziResult): ExpertInterpretation {
    const dayElement = baziResult.dayElement;
    const elementCounts = baziResult.elementCounts;
    const strongestElement = this.getStrongestElement(elementCounts);
    const weakestElement = this.getWeakestElement(elementCounts);
    
    return {
      answers: [
        this.generateWealthAnswer(baziResult),
        this.generateCareerAnswer(baziResult),
        this.generateInvestmentAnswer(baziResult),
        this.generateRelationshipAnswer(baziResult),
        this.generateHealthAnswer(baziResult),
        this.generateMovingAnswer(baziResult),
        this.generateYearlyAnswer(baziResult)
      ],
      summary: {
        day_master: baziResult.dayMaster,
        strongest_element: strongestElement,
        weakest_element: weakestElement,
        balance_score: this.calculateBalanceScore(elementCounts)
      },
      recommendations: this.generateRecommendations(baziResult)
    };
  }

  /**
   * 재물운 해석
   */
  private generateWealthAnswer(baziResult: BaziResult): {
    topic: string;
    one_liner: string;
    why: string;
    todo: string[];
  } {
    const dayElement = baziResult.dayElement;
    const elementCounts = baziResult.elementCounts;
    
    const wealthElements = {
      '목': '화', // 목이 화를 생하므로 화가 재물
      '화': '토', // 화가 토를 생하므로 토가 재물
      '토': '금', // 토가 금을 생하므로 금이 재물
      '금': '수', // 금이 수를 생하므로 수가 재물
      '수': '목'  // 수가 목을 생하므로 목이 재물
    };
    
    const wealthElement = wealthElements[dayElement as keyof typeof wealthElements];
    const wealthStrength = elementCounts[wealthElement as Element] || 0;
    
    let oneLiner = '';
    let why = '';
    let todo: string[] = [];
    
    if (wealthStrength >= 3) {
      oneLiner = '재물운이 매우 강합니다. 투자와 사업에 유리한 시기입니다.';
      why = `${dayElement}일간이 ${wealthElement}재를 많이 가지고 있어 재물을 끌어들이는 힘이 강합니다.`;
      todo = [
        '투자나 사업 확장을 적극적으로 고려하세요',
        '재물과 관련된 새로운 기회를 놓치지 마세요',
        '재정 관리에 더욱 신중하세요'
      ];
    } else if (wealthStrength >= 1) {
      oneLiner = '재물운이 보통입니다. 꾸준한 노력으로 재물을 쌓을 수 있습니다.';
      why = `${dayElement}일간이 ${wealthElement}재를 적당히 가지고 있어 안정적인 재물 운을 보입니다.`;
      todo = [
        '꾸준한 저축과 투자를 병행하세요',
        '재물과 관련된 새로운 기술을 배우세요',
        '재정 계획을 세워 체계적으로 관리하세요'
      ];
    } else {
      oneLiner = '재물운이 약합니다. 재물을 끌어들이는 데 더 많은 노력이 필요합니다.';
      why = `${dayElement}일간이 ${wealthElement}재가 부족하여 재물을 끌어들이는 힘이 약합니다.`;
      todo = [
        '재물을 끌어들이는 방법을 배우세요',
        '재정 관리에 더욱 신중하세요',
        '재물과 관련된 새로운 기회를 찾아보세요'
      ];
    }
    
    return {
      topic: '재물운',
      one_liner: oneLiner,
      why,
      todo
    };
  }

  /**
   * 직업운 해석
   */
  private generateCareerAnswer(baziResult: BaziResult): {
    topic: string;
    one_liner: string;
    why: string;
    todo: string[];
  } {
    const dayElement = baziResult.dayElement;
    const elementCounts = baziResult.elementCounts;
    
    const careerElements = {
      '목': '금', // 관성
      '화': '수', // 관성
      '토': '목', // 관성
      '금': '화', // 관성
      '수': '토'  // 관성
    };
    
    const careerElement = careerElements[dayElement as keyof typeof careerElements];
    const careerStrength = elementCounts[careerElement as Element] || 0;
    
    let oneLiner = '';
    let why = '';
    let todo: string[] = [];
    
    if (careerStrength >= 2) {
      oneLiner = '직업운이 좋습니다. 리더십과 관리 능력이 뛰어납니다.';
      why = `${dayElement}일간이 ${careerElement}관을 적절히 가지고 있어 리더십과 관리 능력이 뛰어납니다.`;
      todo = [
        '관리직이나 리더십이 필요한 직업을 고려하세요',
        '팀워크와 협력 능력을 키우세요',
        '전문성을 더욱 발전시키세요'
      ];
    } else {
      oneLiner = '직업운이 보통입니다. 전문성을 통해 성공할 수 있습니다.';
      why = `${dayElement}일간이 ${careerElement}관이 부족하여 전문성을 통한 성공이 유리합니다.`;
      todo = [
        '전문 기술이나 지식을 습득하세요',
        '창의적이고 독창적인 접근을 시도하세요',
        '지속적인 자기계발에 투자하세요'
      ];
    }
    
    return {
      topic: '직업운',
      one_liner: oneLiner,
      why,
      todo
    };
  }

  /**
   * 투자 타이밍 해석
   */
  private generateInvestmentAnswer(baziResult: BaziResult): {
    topic: string;
    one_liner: string;
    why: string;
    todo: string[];
  } {
    const dayElement = baziResult.dayElement;
    const currentYear = new Date().getFullYear();
    const yearPillar = baziResult.pillars.year;
    
    let oneLiner = '';
    let why = '';
    let todo: string[] = [];
    
    // 간단한 투자 타이밍 분석
    if (currentYear % 2 === 0) {
      oneLiner = '투자에 유리한 시기입니다. 새로운 기회를 찾아보세요.';
      why = '현재 양의 기운이 강한 시기로 투자와 확장에 유리합니다.';
      todo = [
        '새로운 투자 기회를 탐색하세요',
        '리스크를 고려한 분산 투자를 하세요',
        '장기적 관점에서 투자 계획을 세우세요'
      ];
    } else {
      oneLiner = '투자에 신중해야 할 시기입니다. 안정적인 투자를 고려하세요.';
      why = '현재 음의 기운이 강한 시기로 안정적인 투자가 유리합니다.';
      todo = [
        '안정적인 투자 상품을 고려하세요',
        '기존 투자를 점검하고 정리하세요',
        '투자 지식을 쌓는 시간으로 활용하세요'
      ];
    }
    
    return {
      topic: '투자 타이밍',
      one_liner: oneLiner,
      why,
      todo
    };
  }

  /**
   * 인연운 해석
   */
  private generateRelationshipAnswer(baziResult: BaziResult): {
    topic: string;
    one_liner: string;
    why: string;
    todo: string[];
  } {
    const dayElement = baziResult.dayElement;
    const elementCounts = baziResult.elementCounts;
    
    const relationshipElements = {
      '목': '토', // 재성
      '화': '금', // 재성
      '토': '수', // 재성
      '금': '목', // 재성
      '수': '화'  // 재성
    };
    
    const relationshipElement = relationshipElements[dayElement as keyof typeof relationshipElements];
    const relationshipStrength = elementCounts[relationshipElement as Element] || 0;
    
    let oneLiner = '';
    let why = '';
    let todo: string[] = [];
    
    if (relationshipStrength >= 2) {
      oneLiner = '인연운이 좋습니다. 좋은 만남과 관계가 기다리고 있습니다.';
      why = `${dayElement}일간이 ${relationshipElement}재를 적절히 가지고 있어 인연을 끌어들이는 힘이 강합니다.`;
      todo = [
        '새로운 만남의 기회를 놓치지 마세요',
        '기존 관계를 더욱 소중히 하세요',
        '소통과 이해를 통해 관계를 발전시키세요'
      ];
    } else {
      oneLiner = '인연운이 보통입니다. 진정성 있는 소통이 중요합니다.';
      why = `${dayElement}일간이 ${relationshipElement}재가 부족하여 인연을 끌어들이는 데 노력이 필요합니다.`;
      todo = [
        '진정성 있는 소통을 통해 관계를 발전시키세요',
        '새로운 만남의 기회를 적극적으로 찾아보세요',
        '자신의 매력을 개발하는 데 투자하세요'
      ];
    }
    
    return {
      topic: '인연운',
      one_liner: oneLiner,
      why,
      todo
    };
  }

  /**
   * 건강운 해석
   */
  private generateHealthAnswer(baziResult: BaziResult): {
    topic: string;
    one_liner: string;
    why: string;
    todo: string[];
  } {
    const dayElement = baziResult.dayElement;
    const elementCounts = baziResult.elementCounts;
    
    let oneLiner = '';
    let why = '';
    let todo: string[] = [];
    
    // 건강 관련 오행 분석
    const healthElements = {
      '목': '간, 담',
      '화': '심장, 소장',
      '토': '비, 위',
      '금': '폐, 대장',
      '수': '신장, 방광'
    };
    
    const healthOrgans = healthElements[dayElement as keyof typeof healthElements];
    const dayElementStrength = elementCounts[dayElement] || 0;
    
    if (dayElementStrength >= 3) {
      oneLiner = '건강운이 좋습니다. 활력이 넘치고 에너지가 충만합니다.';
      why = `${dayElement}일간이 강하여 ${healthOrgans}이 건강하고 활력이 넘칩니다.`;
      todo = [
        '규칙적인 운동을 통해 건강을 유지하세요',
        '건강한 식습관을 유지하세요',
        '충분한 휴식을 취하세요'
      ];
    } else {
      oneLiner = '건강에 주의가 필요합니다. 규칙적인 관리가 중요합니다.';
      why = `${dayElement}일간이 약하여 ${healthOrgans}에 주의가 필요합니다.`;
      todo = [
        '정기적인 건강검진을 받으세요',
        '스트레스 관리를 위해 휴식을 취하세요',
        '건강한 생활습관을 유지하세요'
      ];
    }
    
    return {
      topic: '건강운',
      one_liner: oneLiner,
      why,
      todo
    };
  }

  /**
   * 이사/이동운 해석
   */
  private generateMovingAnswer(baziResult: BaziResult): {
    topic: string;
    one_liner: string;
    why: string;
    todo: string[];
  } {
    const dayElement = baziResult.dayElement;
    const currentMonth = new Date().getMonth() + 1;
    
    let oneLiner = '';
    let why = '';
    let todo: string[] = [];
    
    // 계절과 오행의 관계를 고려한 이동운 분석
    const seasonalElements = {
      1: '수', 2: '수', 3: '목', 4: '목', 5: '화', 6: '화',
      7: '토', 8: '토', 9: '금', 10: '금', 11: '수', 12: '수'
    };
    
    const currentSeasonElement = seasonalElements[currentMonth as keyof typeof seasonalElements];
    
    if (currentSeasonElement === dayElement) {
      oneLiner = '이동에 유리한 시기입니다. 새로운 환경으로의 변화를 고려해보세요.';
      why = `현재 계절의 기운(${currentSeasonElement})이 일간(${dayElement})과 일치하여 이동에 유리합니다.`;
      todo = [
        '새로운 환경으로의 이동을 고려해보세요',
        '여행이나 출장을 통해 새로운 경험을 쌓으세요',
        '새로운 기회를 찾아 적극적으로 움직이세요'
      ];
    } else {
      oneLiner = '이동에 신중해야 할 시기입니다. 현재 위치에서 안정을 추구하세요.';
      why = `현재 계절의 기운(${currentSeasonElement})과 일간(${dayElement})이 다르므로 안정적인 위치가 유리합니다.`;
      todo = [
        '현재 위치에서 안정을 추구하세요',
        '기존 환경을 개선하는 데 집중하세요',
        '이동이 필요한 경우 신중하게 계획을 세우세요'
      ];
    }
    
    return {
      topic: '이동운',
      one_liner: oneLiner,
      why,
      todo
    };
  }

  /**
   * 올해/이번달 운세 해석
   */
  private generateYearlyAnswer(baziResult: BaziResult): {
    topic: string;
    one_liner: string;
    why: string;
    todo: string[];
  } {
    const currentYear = new Date().getFullYear();
    const yearPillar = baziResult.pillars.year;
    const dayElement = baziResult.dayElement;
    
    let oneLiner = '';
    let why = '';
    let todo: string[] = [];
    
    // 년주와 일간의 관계 분석
    const yearElement = this.getStemElement(yearPillar.stem);
    
    if (yearElement === dayElement) {
      oneLiner = '올해는 본명운이 강한 해입니다. 자신의 본질을 살린 활동이 유리합니다.';
      why = `년주(${yearElement})와 일간(${dayElement})이 같아 본명운이 강합니다.`;
      todo = [
        '자신의 본질과 강점을 살린 활동을 하세요',
        '자신만의 독특한 접근 방식을 개발하세요',
        '자신의 가치관에 맞는 선택을 하세요'
      ];
    } else if (this.isGenerating(dayElement, yearElement)) {
      oneLiner = '올해는 발전과 성장의 해입니다. 새로운 도전을 통해 성장할 수 있습니다.';
      why = `일간(${dayElement})이 년주(${yearElement})를 생하므로 발전과 성장에 유리합니다.`;
      todo = [
        '새로운 도전과 학습에 적극적으로 참여하세요',
        '창의적이고 혁신적인 아이디어를 개발하세요',
        '성장을 위한 투자와 노력을 아끼지 마세요'
      ];
    } else {
      oneLiner = '올해는 안정과 조화의 해입니다. 균형 잡힌 접근이 중요합니다.';
      why = `일간(${dayElement})과 년주(${yearElement})의 관계가 안정적입니다.`;
      todo = [
        '균형 잡힌 접근으로 안정을 추구하세요',
        '기존 관계와 환경을 소중히 하세요',
        '점진적인 발전을 통해 목표를 달성하세요'
      ];
    }
    
    return {
      topic: '올해 운세',
      one_liner: oneLiner,
      why,
      todo
    };
  }

  /**
   * 가장 강한 오행 찾기
   */
  private getStrongestElement(elementCounts: Record<Element, number>): Element {
    return Object.entries(elementCounts).reduce((a, b) => 
      elementCounts[a[0] as Element] > elementCounts[b[0] as Element] ? a : b
    )[0] as Element;
  }

  /**
   * 가장 약한 오행 찾기
   */
  private getWeakestElement(elementCounts: Record<Element, number>): Element {
    return Object.entries(elementCounts).reduce((a, b) => 
      elementCounts[a[0] as Element] < elementCounts[b[0] as Element] ? a : b
    )[0] as Element;
  }

  /**
   * 오행 균형 점수 계산
   */
  private calculateBalanceScore(elementCounts: Record<Element, number>): number {
    const values = Object.values(elementCounts);
    const max = Math.max(...values);
    const min = Math.min(...values);
    return Math.round((1 - (max - min) / max) * 100);
  }

  /**
   * 오행 상생 관계 확인
   */
  private isGenerating(producer: Element, produced: Element): boolean {
    const generationMap: Record<Element, Element> = {
      '목': '화', '화': '토', '토': '금', '금': '수', '수': '목'
    };
    return generationMap[producer] === produced;
  }

  /**
   * 천간의 오행 반환
   */
  private getStemElement(stem: string): Element {
    const stemElements: Record<string, Element> = {
      '갑': '목', '을': '목', '병': '화', '정': '화', '무': '토', '기': '토',
      '경': '금', '신': '금', '임': '수', '계': '수'
    };
    return stemElements[stem] || '토';
  }

  /**
   * 개인화된 추천사항 생성
   */
  private generateRecommendations(baziResult: BaziResult): Array<{
    element: Element;
    activities: string[];
    foods: string[];
    colors: string[];
  }> {
    const dayElement = baziResult.dayElement;
    const elementCounts = baziResult.elementCounts;
    
    const recommendations: Record<Element, {
      activities: string[];
      foods: string[];
      colors: string[];
    }> = {
      '목': {
        activities: ['산책', '요가', '독서', '창작활동'],
        foods: ['녹차', '채소', '과일', '견과류'],
        colors: ['초록색', '파란색', '청록색']
      },
      '화': {
        activities: ['운동', '댄스', '요리', '예술활동'],
        foods: ['매운음식', '고기', '붉은색 과일'],
        colors: ['빨간색', '주황색', '분홍색']
      },
      '토': {
        activities: ['정원가꾸기', '요리', '수집', '정리정돈'],
        foods: ['곡물', '감자', '당근', '노란색 음식'],
        colors: ['노란색', '갈색', '베이지색']
      },
      '금': {
        activities: ['명상', '요가', '음악감상', '정리정돈'],
        foods: ['흰쌀', '흰색 음식', '매운음식'],
        colors: ['흰색', '은색', '회색']
      },
      '수': {
        activities: ['수영', '명상', '음악감상', '독서'],
        foods: ['해산물', '검은색 음식', '소금'],
        colors: ['검은색', '파란색', '남색']
      }
    };
    
    // 일간과 관련된 추천
    const dayRecommendations = recommendations[dayElement];
    
    // 부족한 오행에 대한 보강 추천
    const weakElement = this.getWeakestElement(elementCounts);
    const weakRecommendations = recommendations[weakElement];
    
    return [
      {
        element: dayElement,
        activities: dayRecommendations.activities,
        foods: dayRecommendations.foods,
        colors: dayRecommendations.colors
      },
      {
        element: weakElement,
        activities: weakRecommendations.activities,
        foods: weakRecommendations.foods,
        colors: weakRecommendations.colors
      }
    ];
  }
}
