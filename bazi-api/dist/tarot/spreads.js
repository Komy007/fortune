"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpreadName = exports.SPREADS = void 0;
exports.SPREADS = {
    one: [
        {
            pos: 1,
            name: "오늘의 카드",
            meaning: "핵심 메시지와 오늘의 에너지를 나타냅니다."
        }
    ],
    three: [
        {
            pos: 1,
            name: "과거",
            meaning: "지나간 경험과 배경을 보여줍니다."
        },
        {
            pos: 2,
            name: "현재",
            meaning: "현재 상황과 당신의 상태를 나타냅니다."
        },
        {
            pos: 3,
            name: "미래",
            meaning: "앞으로의 가능성과 방향을 제시합니다."
        }
    ]
};
const getSpreadName = (spreadId, lang = 'ko') => {
    const names = {
        one: { ko: '오늘의 카드', en: 'Daily Card', km: 'កាតប្រចាំថ្ងៃ' },
        three: { ko: '과거-현재-미래', en: 'Past-Present-Future', km: 'អតីត-បច្ចុប្បន្ន-អនាគត' }
    };
    return names[spreadId]?.[lang] || names[spreadId]?.en || spreadId;
};
exports.getSpreadName = getSpreadName;
//# sourceMappingURL=spreads.js.map