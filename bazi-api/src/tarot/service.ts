import { TarotCard, TarotSpread, TarotReading } from './types';

export class TarotService {
  private cards: TarotCard[] = [];
  private spreads: TarotSpread[] = [];

  constructor() {
    this.initializeCards();
    this.initializeSpreads();
  }

  private initializeCards() {
    // 메이저 아르카나 22장
    const majorArcana = [
      { id: 0, name: '바보', nameEn: 'The Fool', suit: 'major', keywords: ['새로운 시작', '순수함', '모험'] },
      { id: 1, name: '마법사', nameEn: 'The Magician', suit: 'major', keywords: ['창의력', '의지력', '기술'] },
      { id: 2, name: '여사제', nameEn: 'The High Priestess', suit: 'major', keywords: ['직감', '지혜', '신비'] },
      { id: 3, name: '여황제', nameEn: 'The Empress', suit: 'major', keywords: ['풍요', '창조', '모성'] },
      { id: 4, name: '황제', nameEn: 'The Emperor', suit: 'major', keywords: ['권력', '안정', '구조'] },
      { id: 5, name: '교황', nameEn: 'The Hierophant', suit: 'major', keywords: ['전통', '교육', '종교'] },
      { id: 6, name: '연인', nameEn: 'The Lovers', suit: 'major', keywords: ['사랑', '선택', '조화'] },
      { id: 7, name: '전차', nameEn: 'The Chariot', suit: 'major', keywords: ['승리', '의지', '통제'] },
      { id: 8, name: '힘', nameEn: 'Strength', suit: 'major', keywords: ['내면의 힘', '용기', '인내'] },
      { id: 9, name: '은둔자', nameEn: 'The Hermit', suit: 'major', keywords: ['고독', '내면 탐구', '지혜'] },
      { id: 10, name: '운명의 수레바퀴', nameEn: 'Wheel of Fortune', suit: 'major', keywords: ['변화', '운명', '기회'] },
      { id: 11, name: '정의', nameEn: 'Justice', suit: 'major', keywords: ['균형', '공정', '진실'] },
      { id: 12, name: '매달린 사람', nameEn: 'The Hanged Man', suit: 'major', keywords: ['희생', '새로운 관점', '정지'] },
      { id: 13, name: '죽음', nameEn: 'Death', suit: 'major', keywords: ['변화', '끝', '새로운 시작'] },
      { id: 14, name: '절제', nameEn: 'Temperance', suit: 'major', keywords: ['균형', '조화', '인내'] },
      { id: 15, name: '악마', nameEn: 'The Devil', suit: 'major', keywords: ['속박', '유혹', '물질주의'] },
      { id: 16, name: '탑', nameEn: 'The Tower', suit: 'major', keywords: ['파괴', '갑작스러운 변화', '계시'] },
      { id: 17, name: '별', nameEn: 'The Star', suit: 'major', keywords: ['희망', '치유', '영감'] },
      { id: 18, name: '달', nameEn: 'The Moon', suit: 'major', keywords: ['직감', '환상', '두려움'] },
      { id: 19, name: '태양', nameEn: 'The Sun', suit: 'major', keywords: ['성공', '행복', '활력'] },
      { id: 20, name: '심판', nameEn: 'Judgement', suit: 'major', keywords: ['부활', '각성', '변화'] },
      { id: 21, name: '세계', nameEn: 'The World', suit: 'major', keywords: ['완성', '성취', '통합'] }
    ];

    // 마이너 아르카나 (각 슈트별 대표 카드들)
    const minorArcana = [
      // 지팡이 (Wands) - 불의 에너지
      { id: 22, name: '지팡이의 에이스', nameEn: 'Ace of Wands', suit: 'wands', keywords: ['새로운 시작', '창의력', '영감'] },
      { id: 23, name: '지팡이의 2', nameEn: 'Two of Wands', suit: 'wands', keywords: ['계획', '결정', '발견'] },
      { id: 24, name: '지팡이의 3', nameEn: 'Three of Wands', suit: 'wands', keywords: ['확장', '모험', '기회'] },
      { id: 25, name: '지팡이의 4', nameEn: 'Four of Wands', suit: 'wands', keywords: ['축하', '조화', '가정'] },
      { id: 26, name: '지팡이의 5', nameEn: 'Five of Wands', suit: 'wands', keywords: ['경쟁', '갈등', '도전'] },
      { id: 27, name: '지팡이의 6', nameEn: 'Six of Wands', suit: 'wands', keywords: ['승리', '성공', '자부심'] },
      { id: 28, name: '지팡이의 7', nameEn: 'Seven of Wands', suit: 'wands', keywords: ['방어', '도전', '경쟁'] },
      { id: 29, name: '지팡이의 8', nameEn: 'Eight of Wands', suit: 'wands', keywords: ['빠른 변화', '행동', '진보'] },
      { id: 30, name: '지팡이의 9', nameEn: 'Nine of Wands', suit: 'wands', keywords: ['인내', '방어', '회복'] },
      { id: 31, name: '지팡이의 10', nameEn: 'Ten of Wands', suit: 'wands', keywords: ['부담', '책임', '스트레스'] },
      { id: 32, name: '지팡이의 시종', nameEn: 'Page of Wands', suit: 'wands', keywords: ['새로운 소식', '열정', '모험'] },
      { id: 33, name: '지팡이의 기사', nameEn: 'Knight of Wands', suit: 'wands', keywords: ['행동', '열정', '모험'] },
      { id: 34, name: '지팡이의 여왕', nameEn: 'Queen of Wands', suit: 'wands', keywords: ['열정', '독립', '창의력'] },
      { id: 35, name: '지팡이의 왕', nameEn: 'King of Wands', suit: 'wands', keywords: ['리더십', '열정', '창의력'] },

      // 컵 (Cups) - 물의 에너지
      { id: 36, name: '컵의 에이스', nameEn: 'Ace of Cups', suit: 'cups', keywords: ['새로운 사랑', '감정', '영감'] },
      { id: 37, name: '컵의 2', nameEn: 'Two of Cups', suit: 'cups', keywords: ['연합', '사랑', '조화'] },
      { id: 38, name: '컵의 3', nameEn: 'Three of Cups', suit: 'cups', keywords: ['축하', '우정', '즐거움'] },
      { id: 39, name: '컵의 4', nameEn: 'Four of Cups', suit: 'cups', keywords: ['불만', '무관심', '후회'] },
      { id: 40, name: '컵의 5', nameEn: 'Five of Cups', suit: 'cups', keywords: ['실망', '상실', '슬픔'] },
      { id: 41, name: '컵의 6', nameEn: 'Six of Cups', suit: 'cups', keywords: ['추억', '순수함', '재회'] },
      { id: 42, name: '컵의 7', nameEn: 'Seven of Cups', suit: 'cups', keywords: ['선택', '환상', '혼란'] },
      { id: 43, name: '컵의 8', nameEn: 'Eight of Cups', suit: 'cups', keywords: ['떠남', '탐색', '변화'] },
      { id: 44, name: '컵의 9', nameEn: 'Nine of Cups', suit: 'cups', keywords: ['만족', '성취', '행복'] },
      { id: 45, name: '컵의 10', nameEn: 'Ten of Cups', suit: 'cups', keywords: ['완전한 행복', '가족', '조화'] },
      { id: 46, name: '컵의 시종', nameEn: 'Page of Cups', suit: 'cups', keywords: ['새로운 감정', '창의력', '직감'] },
      { id: 47, name: '컵의 기사', nameEn: 'Knight of Cups', suit: 'cups', keywords: ['로맨스', '제안', '감정'] },
      { id: 48, name: '컵의 여왕', nameEn: 'Queen of Cups', suit: 'cups', keywords: ['직감', '감정', '보호'] },
      { id: 49, name: '컵의 왕', nameEn: 'King of Cups', suit: 'cups', keywords: ['감정적 균형', '지혜', '자비'] },

      // 검 (Swords) - 공기의 에너지
      { id: 50, name: '검의 에이스', nameEn: 'Ace of Swords', suit: 'swords', keywords: ['새로운 아이디어', '진실', '승리'] },
      { id: 51, name: '검의 2', nameEn: 'Two of Swords', suit: 'swords', keywords: ['균형', '결정', '평화'] },
      { id: 52, name: '검의 3', nameEn: 'Three of Swords', suit: 'swords', keywords: ['상처', '배신', '슬픔'] },
      { id: 53, name: '검의 4', nameEn: 'Four of Swords', suit: 'swords', keywords: ['휴식', '회복', '평화'] },
      { id: 54, name: '검의 5', nameEn: 'Five of Swords', suit: 'swords', keywords: ['패배', '갈등', '상처'] },
      { id: 55, name: '검의 6', nameEn: 'Six of Swords', suit: 'swords', keywords: ['이동', '변화', '회복'] },
      { id: 56, name: '검의 7', nameEn: 'Seven of Swords', suit: 'swords', keywords: ['기만', '도망', '전략'] },
      { id: 57, name: '검의 8', nameEn: 'Eight of Swords', suit: 'swords', keywords: ['속박', '절망', '두려움'] },
      { id: 58, name: '검의 9', nameEn: 'Nine of Swords', suit: 'swords', keywords: ['불안', '걱정', '악몽'] },
      { id: 59, name: '검의 10', nameEn: 'Ten of Swords', suit: 'swords', keywords: ['배신', '끝', '고통'] },
      { id: 60, name: '검의 시종', nameEn: 'Page of Swords', suit: 'swords', keywords: ['새로운 아이디어', '호기심', '학습'] },
      { id: 61, name: '검의 기사', nameEn: 'Knight of Swords', suit: 'swords', keywords: ['행동', '진실', '정의'] },
      { id: 62, name: '검의 여왕', nameEn: 'Queen of Swords', suit: 'swords', keywords: ['독립', '지혜', '진실'] },
      { id: 63, name: '검의 왕', nameEn: 'King of Swords', suit: 'swords', keywords: ['지혜', '진실', '정의'] },

      // 동전 (Pentacles) - 땅의 에너지
      { id: 64, name: '동전의 에이스', nameEn: 'Ace of Pentacles', suit: 'pentacles', keywords: ['새로운 기회', '물질적 성공', '풍요'] },
      { id: 65, name: '동전의 2', nameEn: 'Two of Pentacles', suit: 'pentacles', keywords: ['균형', '적응', '변화'] },
      { id: 66, name: '동전의 3', nameEn: 'Three of Pentacles', suit: 'pentacles', keywords: ['협력', '기술', '성장'] },
      { id: 67, name: '동전의 4', nameEn: 'Four of Pentacles', suit: 'pentacles', keywords: ['보존', '안전', '소유'] },
      { id: 68, name: '동전의 5', nameEn: 'Five of Pentacles', suit: 'pentacles', keywords: ['빈곤', '고립', '어려움'] },
      { id: 69, name: '동전의 6', nameEn: 'Six of Pentacles', suit: 'pentacles', keywords: ['자선', '공유', '균형'] },
      { id: 70, name: '동전의 7', nameEn: 'Seven of Pentacles', suit: 'pentacles', keywords: ['인내', '성장', '투자'] },
      { id: 71, name: '동전의 8', nameEn: 'Eight of Pentacles', suit: 'pentacles', keywords: ['기술', '학습', '전문성'] },
      { id: 72, name: '동전의 9', nameEn: 'Nine of Pentacles', suit: 'pentacles', keywords: ['독립', '풍요', '자족'] },
      { id: 73, name: '동전의 10', nameEn: 'Ten of Pentacles', suit: 'pentacles', keywords: ['가족', '부', '전통'] },
      { id: 74, name: '동전의 시종', nameEn: 'Page of Pentacles', suit: 'pentacles', keywords: ['새로운 기회', '학습', '실용성'] },
      { id: 75, name: '동전의 기사', nameEn: 'Knight of Pentacles', suit: 'pentacles', keywords: ['근면', '신뢰성', '안정'] },
      { id: 76, name: '동전의 여왕', nameEn: 'Queen of Pentacles', suit: 'pentacles', keywords: ['풍요', '실용성', '보호'] },
      { id: 77, name: '동전의 왕', nameEn: 'King of Pentacles', suit: 'pentacles', keywords: ['성공', '부', '안정'] }
    ];

    this.cards = [...majorArcana, ...minorArcana];
  }

  private initializeSpreads() {
    this.spreads = [
      {
        id: 'single-card',
        name: '일일 타로',
        description: '오늘 하루를 위한 한 장의 카드',
        cardCount: 1,
        positions: [
          { id: 1, name: '오늘의 메시지', description: '오늘 하루를 위한 조언' }
        ]
      },
      {
        id: 'three-card',
        name: '3장 카드 점',
        description: '과거-현재-미래를 보는 기본적인 스프레드',
        cardCount: 3,
        positions: [
          { id: 1, name: '과거', description: '과거의 영향과 배경' },
          { id: 2, name: '현재', description: '현재 상황과 도전' },
          { id: 3, name: '미래', description: '앞으로의 가능성과 조언' }
        ]
      },
      {
        id: 'celtic-cross',
        name: '켈틱 크로스',
        description: '가장 상세한 10장 카드 스프레드',
        cardCount: 10,
        positions: [
          { id: 1, name: '현재 상황', description: '현재의 핵심 문제' },
          { id: 2, name: '도전', description: '직면한 도전과 장애' },
          { id: 3, name: '근본 원인', description: '문제의 근본 원인' },
          { id: 4, name: '과거', description: '과거의 영향' },
          { id: 5, name: '가능한 결과', description: '앞으로의 가능성' },
          { id: 6, name: '근처 미래', description: '곧 다가올 상황' },
          { id: 7, name: '자신', description: '자신의 태도와 감정' },
          { id: 8, name: '환경', description: '주변 환경과 영향' },
          { id: 9, name: '희망과 두려움', description: '희망과 두려움' },
          { id: 10, name: '결론', description: '최종 결과와 조언' }
        ]
      }
    ];
  }

  async drawCards(spreadId: string, question: string): Promise<TarotReading> {
    const spread = this.spreads.find(s => s.id === spreadId) || this.spreads[1]; // 기본값: 3장 카드
    const drawnCards: TarotCard[] = [];
    const usedIds = new Set<number>();

    // 카드 뽑기
    for (let i = 0; i < spread.cardCount; i++) {
      let card: TarotCard;
      do {
        card = this.cards[Math.floor(Math.random() * this.cards.length)];
      } while (usedIds.has(card.id));
      
      usedIds.add(card.id);
      card.orientation = Math.random() > 0.5 ? 'upright' : 'reversed';
      card.position = spread.positions[i];
      drawnCards.push(card);
    }

    // 해석 생성
    const interpretation = this.generateInterpretation(drawnCards, question, spread);

    return {
      id: Date.now().toString(),
      spread,
      cards: drawnCards,
      question,
      interpretation,
      timestamp: new Date().toISOString()
    };
  }

  private generateInterpretation(cards: TarotCard[], question: string, spread: TarotSpread): string {
    let interpretation = `# 🃏 타로 점 결과\n\n`;
    
    if (question) {
      interpretation += `**질문**: ${question}\n\n`;
    }
    
    interpretation += `**스프레드**: ${spread.name}\n`;
    interpretation += `**카드 수**: ${spread.cardCount}장\n\n`;
    
    interpretation += `## 📋 카드 해석\n\n`;
    
    cards.forEach((card, index) => {
      const position = card.position;
      const orientation = card.orientation === 'upright' ? '정방향' : '역방향';
      
      interpretation += `### ${position?.name || `${index + 1}번째 카드`}\n`;
      interpretation += `**${card.name}** (${orientation})\n\n`;
      
      // 간단한 해석
      const keywords = card.keywords.join(', ');
      interpretation += `**키워드**: ${keywords}\n\n`;
      
      // 방향성에 따른 해석
      if (card.orientation === 'upright') {
        interpretation += `**의미**: ${this.getUprightMeaning(card)}\n\n`;
      } else {
        interpretation += `**의미**: ${this.getReversedMeaning(card)}\n\n`;
      }
    });
    
    interpretation += `## 💫 전체 해석\n\n`;
    interpretation += this.getOverallInterpretation(cards, question);
    
    return interpretation;
  }

  private getUprightMeaning(card: TarotCard): string {
    const meanings: { [key: string]: string } = {
      '바보': '새로운 시작과 모험을 의미합니다. 순수한 마음으로 새로운 경험을 받아들이세요.',
      '마법사': '강한 의지력과 창의력을 나타냅니다. 원하는 것을 이룰 수 있는 능력이 있습니다.',
      '여사제': '직감과 내면의 지혜를 상징합니다. 내면의 소리에 귀 기울이세요.',
      '여황제': '풍요와 창조의 에너지를 나타냅니다. 자연스러운 성장과 발전이 기대됩니다.',
      '황제': '권력과 안정을 상징합니다. 강한 리더십과 구조화된 접근이 필요합니다.',
      '연인': '사랑과 중요한 선택을 의미합니다. 진정한 가치에 따라 결정하세요.',
      '전차': '강한 의지로 승리할 수 있습니다. 목표를 향해 전진하세요.',
      '힘': '내면의 강함과 부드러운 힘을 나타냅니다. 용기와 인내로 어려움을 극복하세요.',
      '은둔자': '고독을 통한 내면 탐구가 필요합니다. 지혜를 찾기 위해 자신을 돌아보세요.',
      '운명의 수레바퀴': '변화와 새로운 기회가 다가옵니다. 변화를 받아들이세요.',
      '정의': '균형과 공정한 판단이 필요합니다. 진실을 찾아 공정하게 행동하세요.',
      '매달린 사람': '새로운 관점이 필요합니다. 다른 시각으로 상황을 바라보세요.',
      '죽음': '큰 변화와 새로운 시작을 의미합니다. 과거를 버리고 새로운 것을 받아들이세요.',
      '절제': '균형과 조화가 중요합니다. 인내와 치유를 통해 완전함을 이루세요.',
      '악마': '물질적 속박과 유혹을 주의하세요. 진정한 자유를 찾아야 합니다.',
      '탑': '갑작스러운 변화와 계시가 있을 수 있습니다. 기존 구조의 파괴를 받아들이세요.',
      '별': '희망과 치유의 에너지를 받습니다. 긍정적인 미래를 믿으세요.',
      '달': "직감과 신비로운 통찰력을 활용하세요. 잠재의식의 메시지를 받아들이세요.",
      '태양': '성공과 행복이 기다리고 있습니다. 활력과 진실을 찾으세요.',
      '심판': '부활과 각성의 시기가 왔습니다. 새로운 삶과 소명을 받아들이세요.',
      '세계': '완성과 성취를 의미합니다. 여행의 완성과 새로운 시작을 축하하세요.'
    };
    
    return meanings[card.name] || `${card.name}은(는) ${card.keywords.join(', ')}을(를) 상징합니다.`;
  }

  private getReversedMeaning(card: TarotCard): string {
    const meanings: { [key: string]: string } = {
      '바보': '성급한 판단과 무모한 행동을 주의하세요. 기회를 놓치지 마세요.',
      '마법사': '의지력 부족과 기회 놓침을 의미합니다. 부정적 사고를 버리세요.',
      '여사제': '직감을 무시하고 표면적 사고를 하고 있습니다. 내면의 소리를 들어보세요.',
      '여황제': '창조력 부족과 자연과의 단절을 의미합니다. 창조적 에너지를 되찾으세요.',
      '연인': '불화와 잘못된 선택을 주의하세요. 갈등을 해결해야 합니다.',
      '전차': '의지 부족과 패배를 의미합니다. 목표를 향한 의지를 강화하세요.',
      '힘': '내면의 약함과 두려움을 나타냅니다. 용기를 내어 어려움에 맞서세요.',
      '은둔자': '과도한 고독과 방향 상실을 의미합니다. 외로움을 극복하세요.',
      '운명의 수레바퀴': '부정적인 변화와 기회 놓침을 주의하세요.',
      '정의': '부정한 판단과 불균형을 의미합니다. 공정함을 찾아야 합니다.',
      '매달린 사람': '무의미한 희생과 시간 낭비를 주의하세요.',
      '죽음': '변화 거부와 과거에 매달림을 의미합니다. 변화를 받아들이세요.',
      '절제': '불균형과 조화 부족을 나타냅니다. 균형을 찾아야 합니다.',
      '악마': '속박에서 해방과 깨달음을 의미합니다. 자유를 찾으세요.',
      '탑': '파괴 회피와 점진적 변화를 의미합니다.',
      '별': '희망 상실과 절망을 주의하세요. 희망을 되찾으세요.',
      '달': '환상과 두려움, 혼란을 의미합니다. 현실을 직시하세요.',
      '태양': '일시적 어려움과 과신을 주의하세요.',
      '심판': '각성 거부와 변화 거부를 의미합니다. 깨달음을 받아들이세요.',
      '세계': '미완성과 불완전함을 의미합니다. 완성을 위해 노력하세요.'
    };
    
    return meanings[card.name] || `${card.name}의 역방향은 ${card.keywords.join(', ')}의 부족을 의미합니다.`;
  }

  private getOverallInterpretation(cards: TarotCard[], question: string): string {
    const uprightCount = cards.filter(c => c.orientation === 'upright').length;
    const reversedCount = cards.filter(c => c.orientation === 'reversed').length;
    
    let overall = '';
    
    if (uprightCount > reversedCount) {
      overall += '**전체적으로 긍정적인 에너지**가 흐르고 있습니다. ';
      overall += '현재 상황에서 희망과 가능성을 찾을 수 있으며, ';
      overall += '적극적인 행동과 긍정적인 마음가짐이 도움이 될 것입니다.\n\n';
    } else if (reversedCount > uprightCount) {
      overall += '**도전과 어려움**이 있는 시기입니다. ';
      overall += '현재 상황을 재검토하고 새로운 접근법을 고려해보세요. ';
      overall += '인내와 지혜로 어려움을 극복할 수 있습니다.\n\n';
    } else {
      overall += '**균형과 조화**가 필요한 시기입니다. ';
      overall += '상황을 객관적으로 바라보고 균형잡힌 접근이 필요합니다.\n\n';
    }
    
    // 주요 카드들의 조합 해석
    const majorCards = cards.filter(c => c.suit === 'major');
    if (majorCards.length > 0) {
      overall += '**주요 카드들의 메시지**:\n';
      majorCards.forEach(card => {
        overall += `- ${card.name}: ${card.orientation === 'upright' ? '긍정적' : '주의가 필요한'} 에너지\n`;
      });
      overall += '\n';
    }
    
    overall += '**조언**: 카드의 메시지를 참고하여 현재 상황에서 최선의 선택을 하시기 바랍니다. ';
    overall += '타로는 미래를 예측하는 것이 아니라 현재 상황에 대한 통찰을 제공합니다. ';
    overall += '자신의 직감과 판단력을 믿고 행동하세요.\n\n';
    
    overall += '*이 해석은 참고용이며, 최종 결정은 본인의 판단에 따라 하시기 바랍니다.*';
    
    return overall;
  }

  getAvailableSpreads(): TarotSpread[] {
    return this.spreads;
  }

  getCardById(id: string): TarotCard | undefined {
    return this.cards.find(card => card.id.toString() === id);
  }
}



