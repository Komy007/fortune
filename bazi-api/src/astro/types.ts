// 점성술 모듈 타입 정의
// 정확도: Meeus 천문학 알고리즘 기반, 정밀도 ±0.1°

export type Planet = 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto';
export type HouseSystem = 'whole-sign' | 'placidus';
export type AspectType = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';
export type Language = 'ko' | 'en';

// 입력 DTO
export interface ChartInput {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  tz: string; // IANA timezone (e.g., "Asia/Seoul")
  lat: number; // 위도
  lon: number; // 경도
  houseSystem?: HouseSystem; // 기본값: 'whole-sign'
  lang?: Language; // 기본값: 'ko'
}

export interface SynastryInput {
  personA: ChartInput;
  personB: ChartInput;
}

export interface TransitInput {
  natal: ChartInput;
  date?: string; // 기본값: 오늘
  rangeDays?: number; // 기본값: 7
}

// 행성 위치
export interface PlanetPosition {
  lon: number; // 황경 (도)
  lat: number; // 황위 (도)
  distance?: number; // 거리 (AU)
  speed?: number; // 속도 (도/일)
}

// 하우스 경계
export interface HouseCusp {
  house: number; // 1-12
  lon: number; // 황경 (도)
}

// 어스펙트
export interface Aspect {
  planet1: Planet;
  planet2: Planet;
  type: AspectType;
  angle: number; // 실제 각도
  orb: number; // 오브 (도)
  strength: 'exact' | 'strong' | 'medium' | 'weak';
}

// 천궁도 결과
export interface NatalChart {
  input: ChartInput;
  planets: Record<Planet, PlanetPosition>;
  houses: HouseCusp[];
  aspects: Aspect[];
  ascendant: number; // ASC 황경
  midheaven: number; // MC 황경
  metadata: {
    julianDay: number;
    calculationTime: string;
    accuracy: string;
  };
}

// 트랜짓 결과
export interface TransitChart {
  natal: NatalChart;
  transitDate: string;
  transits: Aspect[];
  metadata: {
    rangeDays: number;
    calculationTime: string;
  };
}

// 시너스트리 결과
export interface SynastryChart {
  personA: NatalChart;
  personB: NatalChart;
  synastryAspects: Aspect[];
  compositeScore: number; // 0-100
  metadata: {
    calculationTime: string;
  };
}

// 상수 정의
export const PLANET_NAMES: Record<Planet, string> = {
  Sun: '태양',
  Moon: '달',
  Mercury: '수성',
  Venus: '금성',
  Mars: '화성',
  Jupiter: '목성',
  Saturn: '토성',
  Uranus: '천왕성',
  Neptune: '해왕성',
  Pluto: '명왕성'
};

export const ASPECT_ORBS: Record<AspectType, number> = {
  conjunction: 8,
  sextile: 6,
  square: 8,
  trine: 8,
  opposition: 8
};

export const ASPECT_ANGLES: Record<AspectType, number> = {
  conjunction: 0,
  sextile: 60,
  square: 90,
  trine: 120,
  opposition: 180
};

export const HARMONIOUS_ASPECTS: AspectType[] = ['sextile', 'trine'];
export const CHALLENGING_ASPECTS: AspectType[] = ['square', 'opposition'];
export const NEUTRAL_ASPECTS: AspectType[] = ['conjunction'];
