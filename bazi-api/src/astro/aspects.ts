// 어스펙트 계산
// 주요 어스펙트: 0°, 60°, 90°, 120°, 180°
// 정확도: ±0.1° (각도 계산)

import { Planet, Aspect, AspectType, PlanetPosition } from './types';
import { ASPECT_ANGLES, ASPECT_ORBS, HARMONIOUS_ASPECTS, CHALLENGING_ASPECTS, NEUTRAL_ASPECTS } from './types';

// 두 각도 간의 최소 차이 계산
export function calculateAngleDifference(angle1: number, angle2: number): number {
  let diff = Math.abs(angle1 - angle2);
  
  // 360도를 넘는 경우 보정
  if (diff > 180) {
    diff = 360 - diff;
  }
  
  return diff;
}

// 어스펙트 타입 판정
export function getAspectType(angle: number): AspectType | null {
  const tolerance = 1; // 1도 허용 오차
  
  for (const [type, targetAngle] of Object.entries(ASPECT_ANGLES)) {
    if (Math.abs(angle - targetAngle) <= tolerance) {
      return type as AspectType;
    }
  }
  
  return null;
}

// 어스펙트 강도 계산
export function calculateAspectStrength(orb: number, aspectType: AspectType): 'exact' | 'strong' | 'medium' | 'weak' {
  const maxOrb = ASPECT_ORBS[aspectType];
  
  if (orb <= 1) return 'exact';
  if (orb <= maxOrb * 0.5) return 'strong';
  if (orb <= maxOrb * 0.8) return 'medium';
  if (orb <= maxOrb) return 'weak';
  
  return 'weak';
}

// 두 행성 간의 어스펙트 계산
export function calculateAspect(
  planet1: Planet, 
  position1: PlanetPosition, 
  planet2: Planet, 
  position2: PlanetPosition
): Aspect | null {
  const angleDiff = calculateAngleDifference(position1.lon, position2.lon);
  const aspectType = getAspectType(angleDiff);
  
  if (!aspectType) {
    return null;
  }
  
  const orb = angleDiff - ASPECT_ANGLES[aspectType];
  const strength = calculateAspectStrength(Math.abs(orb), aspectType);
  
  return {
    planet1,
    planet2,
    type: aspectType,
    angle: angleDiff,
    orb: Math.abs(orb),
    strength
  };
}

// 모든 행성 간의 어스펙트 계산
export function calculateAllAspects(planets: Record<Planet, PlanetPosition>): Aspect[] {
  const aspects: Aspect[] = [];
  const planetList = Object.keys(planets) as Planet[];
  
  for (let i = 0; i < planetList.length; i++) {
    for (let j = i + 1; j < planetList.length; j++) {
      const planet1 = planetList[i];
      const planet2 = planetList[j];
      
      const aspect = calculateAspect(
        planet1, 
        planets[planet1], 
        planet2, 
        planets[planet2]
      );
      
      if (aspect) {
        aspects.push(aspect);
      }
    }
  }
  
  return aspects;
}

// 어스펙트 타입별 필터링
export function filterAspectsByType(aspects: Aspect[], type: AspectType): Aspect[] {
  return aspects.filter(aspect => aspect.type === type);
}

// 강한 어스펙트만 필터링
export function filterStrongAspects(aspects: Aspect[]): Aspect[] {
  return aspects.filter(aspect => 
    aspect.strength === 'exact' || aspect.strength === 'strong'
  );
}

// 조화로운 어스펙트 필터링
export function filterHarmoniousAspects(aspects: Aspect[]): Aspect[] {
  return aspects.filter(aspect => HARMONIOUS_ASPECTS.includes(aspect.type));
}

// 도전적인 어스펙트 필터링
export function filterChallengingAspects(aspects: Aspect[]): Aspect[] {
  return aspects.filter(aspect => CHALLENGING_ASPECTS.includes(aspect.type));
}

// 트랜짓 어스펙트 계산
export function calculateTransitAspects(
  natalPlanets: Record<Planet, PlanetPosition>,
  transitPlanets: Record<Planet, PlanetPosition>
): Aspect[] {
  const aspects: Aspect[] = [];
  
  // 외행성 트랜짓만 계산 (태양계 내부 행성은 제외)
  const outerPlanets: Planet[] = ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
  
  for (const transitPlanet of outerPlanets) {
    if (!transitPlanets[transitPlanet]) continue;
    
    for (const natalPlanet of Object.keys(natalPlanets) as Planet[]) {
      const aspect = calculateAspect(
        transitPlanet,
        transitPlanets[transitPlanet],
        natalPlanet,
        natalPlanets[natalPlanet]
      );
      
      if (aspect) {
        aspects.push(aspect);
      }
    }
  }
  
  return aspects;
}

// 시너스트리 어스펙트 계산
export function calculateSynastryAspects(
  personAPlanets: Record<Planet, PlanetPosition>,
  personBPlanets: Record<Planet, PlanetPosition>
): Aspect[] {
  const aspects: Aspect[] = [];
  
  for (const planetA of Object.keys(personAPlanets) as Planet[]) {
    for (const planetB of Object.keys(personBPlanets) as Planet[]) {
      const aspect = calculateAspect(
        planetA,
        personAPlanets[planetA],
        planetB,
        personBPlanets[planetB]
      );
      
      if (aspect) {
        aspects.push(aspect);
      }
    }
  }
  
  return aspects;
}

// 어스펙트 강도 점수 계산
export function calculateAspectStrengthScore(aspect: Aspect): number {
  const baseScores = {
    exact: 10,
    strong: 8,
    medium: 5,
    weak: 2
  };
  
  const typeMultipliers = {
    conjunction: 1.0,
    sextile: 0.8,
    square: 1.2,
    trine: 0.9,
    opposition: 1.1
  };
  
  return baseScores[aspect.strength] * typeMultipliers[aspect.type];
}

// 어스펙트별 의미 (한국어)
export const ASPECT_MEANINGS = {
  conjunction: {
    name: '합',
    description: '두 행성이 같은 위치에 있을 때, 에너지가 집중되고 강화됨',
    nature: '중성',
    orb: '±8°'
  },
  sextile: {
    name: '육합',
    description: '60도 각도로 조화로운 관계, 기회와 협력',
    nature: '조화',
    orb: '±6°'
  },
  square: {
    name: '사각',
    description: '90도 각도로 긴장과 도전, 성장의 기회',
    nature: '도전',
    orb: '±8°'
  },
  trine: {
    name: '삼합',
    description: '120도 각도로 자연스러운 조화와 편안함',
    nature: '조화',
    orb: '±8°'
  },
  opposition: {
    name: '충',
    description: '180도 각도로 극단적인 대립과 균형',
    nature: '도전',
    orb: '±8°'
  }
} as const;
