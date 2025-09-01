import { ChartInput, NatalChart, TransitChart, SynastryChart } from './types';
export declare function buildNatal(input: ChartInput): NatalChart;
export declare function buildTransits(natal: NatalChart, transitDate?: string, rangeDays?: number): TransitChart;
export declare function buildSynastry(personA: ChartInput, personB: ChartInput): SynastryChart;
export declare function generateChartSummary(natal: NatalChart, lang?: string): string;
export declare const PLANET_MEANINGS: {
    readonly Sun: "자아, 핵심 정체성, 의지, 아버지";
    readonly Moon: "감정, 직감, 어머니, 내면의 세계";
    readonly Mercury: "의사소통, 사고, 학습, 형제자매";
    readonly Venus: "사랑, 미, 조화, 파트너십";
    readonly Mars: "행동, 에너지, 성욕, 경쟁";
    readonly Jupiter: "확장, 지혜, 행운, 철학";
    readonly Saturn: "제한, 책임, 시간, 권위";
    readonly Uranus: "혁신, 독창성, 반란, 변화";
    readonly Neptune: "꿈, 환상, 영성, 직감";
    readonly Pluto: "변화, 재생, 권력, 심층 심리";
};
//# sourceMappingURL=service.d.ts.map