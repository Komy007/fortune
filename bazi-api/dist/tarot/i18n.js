"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDeck = loadDeck;
exports.t = t;
exports.getSpreadName = getSpreadName;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// 덱 데이터 로딩
function loadDeck(lang) {
    const langOrder = [lang, 'en', 'ko'];
    for (const l of langOrder) {
        try {
            const deckPath = path_1.default.join(__dirname, 'data', `deck.${l}.json`);
            if (fs_1.default.existsSync(deckPath)) {
                const deckData = fs_1.default.readFileSync(deckPath, 'utf8');
                return JSON.parse(deckData);
            }
        }
        catch (error) {
            console.warn(`Failed to load deck for language: ${l}`, error);
        }
    }
    // 기본값 반환
    return [];
}
// UI 텍스트 번역
function t(key, lang = 'ko') {
    const translations = {
        'draw_cards': {
            ko: '카드 뽑기',
            en: 'Draw Cards',
            km: 'ទាញកាត'
        },
        'select_spread': {
            ko: '스프레드 선택',
            en: 'Select Spread',
            km: 'ជ្រើសរើសការចែកចាយ'
        },
        'enter_question': {
            ko: '질문을 입력하세요 (선택사항)',
            en: 'Enter your question (optional)',
            km: 'បញ្ចូលសំណួររបស់អ្នក (ជម្រើស)'
        },
        'daily_card': {
            ko: '오늘의 카드',
            en: 'Daily Card',
            km: 'កាតប្រចាំថ្ងៃ'
        },
        'past_present_future': {
            ko: '과거-현재-미래',
            en: 'Past-Present-Future',
            km: 'អតីត-បច្ចុប្បន្ន-អនាគត'
        },
        'drawing_cards': {
            ko: '카드를 뽑는 중...',
            en: 'Drawing cards...',
            km: 'កំពុងទាញកាត...'
        },
        'today_actions': {
            ko: '오늘의 행동 3가지',
            en: 'Today\'s 3 Actions',
            km: 'សកម្មភាព 3 របស់ថ្ងៃនេះ'
        },
        'caution': {
            ko: '주의사항',
            en: 'Caution',
            km: 'ការប្រុងប្រយ័ត្ន'
        },
        'donation': {
            ko: '도네이션',
            en: 'Donation',
            km: 'ការបរិច្ចាគ'
        },
        'copy_address': {
            ko: '주소 복사',
            en: 'Copy Address',
            km: 'ចម្លងអាសយដ្ឋាន'
        },
        'address_copied': {
            ko: '주소가 복사되었습니다',
            en: 'Address copied',
            km: 'អាសយដ្ឋានត្រូវបានចម្លង'
        }
    };
    return translations[key]?.[lang] || translations[key]?.['en'] || key;
}
// 스프레드 이름 가져오기
function getSpreadName(spreadId, lang = 'ko') {
    const names = {
        one: { ko: '오늘의 카드', en: 'Daily Card', km: 'កាតប្រចាំថ្ងៃ' },
        three: { ko: '과거-현재-미래', en: 'Past-Present-Future', km: 'អតីត-បច្ចុប្បន្ន-អនាគត' }
    };
    return names[spreadId]?.[lang] ||
        names[spreadId]?.en ||
        spreadId;
}
//# sourceMappingURL=i18n.js.map