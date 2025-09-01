"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawCards = drawCards;
const spreads_1 = require("./spreads");
const i18n_1 = require("./i18n");
const rng_1 = require("./rng");
const donate_1 = require("./donate");
// 금지어 목록 (중복 방지)
const FORBIDDEN_WORDS = ['균형', '유지', '발전', '성공적', '조화', 'balance', 'maintain', 'develop', 'successful', 'harmony'];
// 행동 카테고리
const ACTION_CATEGORIES = [
    '연애/관계', '일/직업', '재정/돈', '건강/운동', '학습/성장', '창작/예술', '여행/모험', '정신/영성'
];
// 행동 풀 (동사로 시작하는 구체적 행동들)
const ACTION_POOL = [
    '새로운 사람과 대화를 시작하세요',
    '오늘 한 가지 새로운 것을 배우세요',
    '30분 이상 걷기로 에너지를 충전하세요',
    '창의적인 아이디어를 메모해보세요',
    '감사한 일 3가지를 적어보세요',
    '오래된 습관 하나를 바꿔보세요',
    '자연 속에서 시간을 보내보세요',
    '진심으로 웃을 수 있는 일을 찾아보세요',
    '도전적인 목표를 세워보세요',
    '마음의 평화를 위한 명상을 해보세요',
    '새로운 취미를 시작해보세요',
    '소중한 사람에게 감사 인사를 전하세요',
    '창의적인 프로젝트를 시작해보세요',
    '건강한 음식을 한 끼 더 먹어보세요',
    '오래된 꿈을 다시 생각해보세요'
];
// 주의사항 풀
const CAUTIONS = [
    '결과는 참고용이며, 최종 판단은 본인의 판단에 맡기세요',
    '카드의 의미는 상황에 따라 다르게 해석될 수 있습니다',
    '긍정적인 마음가짐으로 결과를 받아들이세요',
    '카드는 방향을 제시할 뿐, 선택은 본인의 몫입니다',
    '변화를 두려워하지 말고 새로운 기회를 포착하세요'
];
// 아키타입 생성
function generateArchetype(cards) {
    const keywords = cards.flatMap(card => card.meaning.split(' '));
    const positiveWords = keywords.filter(word => ['새로운', '창조', '희망', '성공', '행복', '자유', '지혜', '용기'].includes(word));
    if (positiveWords.length > 2) {
        return '개척자 🚀';
    }
    else if (cards.some(card => card.meaning.includes('지혜'))) {
        return '현자 📚';
    }
    else if (cards.some(card => card.meaning.includes('사랑'))) {
        return '연인 💕';
    }
    else {
        return '탐험가 🔍';
    }
}
// 요약 생성
function generateSummary(cards, question) {
    const archetype = generateArchetype(cards);
    const cardMeanings = cards.map(card => card.meaning);
    const summary = [
        `${archetype}의 에너지가 당신을 이끌고 있습니다.`,
        question ? `"${question}"에 대한 답은 ${cardMeanings.join(' ')}입니다.` : `카드들이 ${cardMeanings.join(' ')}를 보여줍니다.`,
        '오늘 하루를 의미 있게 만들어보세요.'
    ];
    return summary;
}
// 행동 3가지 생성
function generateActions(seedStr) {
    const shuffledActions = (0, rng_1.seededShuffle)(ACTION_POOL, seedStr + 'actions');
    const selectedActions = [];
    for (const action of shuffledActions) {
        if (selectedActions.length >= 3)
            break;
        // 중복 방지
        const isDuplicate = selectedActions.some(selected => selected.split(' ').slice(0, 3).join(' ') === action.split(' ').slice(0, 3).join(' '));
        if (!isDuplicate) {
            selectedActions.push(action);
        }
    }
    return selectedActions;
}
// 주의사항 생성
function generateCaution(seedStr) {
    const cautions = (0, rng_1.seededShuffle)(CAUTIONS, seedStr + 'caution');
    return cautions[0] || CAUTIONS[0];
}
// 카드 의미 조합
function combineCardMeaning(card, orientation, position) {
    const meaning = orientation === 'upright' ? card.upright.short : card.reversed.short;
    const positionText = position ? `(${position}) ` : '';
    return `${positionText}${meaning}`;
}
// 메인 서비스 함수
async function drawCards(request) {
    try {
        const { spread, question, lang = 'ko', userId = 'anonymous', seed } = request;
        // 시드 생성
        const today = new Date().toISOString().split('T')[0];
        const seedStr = seed || `${userId}|${lang}|${question || 'daily'}|${today}`;
        // 덱 로딩
        const deck = (0, i18n_1.loadDeck)(lang);
        if (deck.length === 0) {
            throw new Error('Failed to load tarot deck');
        }
        // 스프레드 정보 가져오기
        const spreadInfo = spreads_1.SPREADS[spread];
        if (!spreadInfo) {
            throw new Error('Invalid spread type');
        }
        // 카드 셔플 및 선택
        const shuffledDeck = (0, rng_1.seededShuffle)(deck, seedStr + 'deck');
        const selectedCards = shuffledDeck.slice(0, spreadInfo.length);
        // 카드 정보 구성
        const cards = selectedCards.map((card, index) => {
            const orientation = (0, rng_1.pickOrientation)(seedStr + 'orientation', index);
            const position = spreadInfo[index]?.name;
            return {
                id: card.id,
                name: card.name,
                orientation,
                position,
                meaning: combineCardMeaning(card, orientation, position)
            };
        });
        // 요약 생성
        const summary = {
            archetype: generateArchetype(cards),
            summary: generateSummary(cards, question),
            actions: generateActions(seedStr),
            caution: generateCaution(seedStr)
        };
        // 도네이션 정보
        const donation = (0, donate_1.getDonationInfo)();
        return {
            success: true,
            result: {
                spread,
                question,
                lang,
                cards,
                summary,
                donation
            }
        };
    }
    catch (error) {
        console.error('Error in drawCards:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}
//# sourceMappingURL=service.js.map