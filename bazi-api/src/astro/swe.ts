/**
 * Swiss Ephemeris 래퍼
 * 
 * 정확도: Swiss Ephemeris 2.10.03 기준, geocentric ecliptic coordinates
 * 한계: 주요 행성만 계산 (Chiron, Ceres 등 소행성 제외)
 * 참고: https://www.astro.com/swisseph/swephinfo_e.htm
 */

import * as swisseph from 'swisseph';
import { DateTime } from 'luxon';
import path from 'path';
import { 
  Planet, 
  PlanetPosition, 
  ChartInput, 
  HouseSystem, 
  PLANET_IDS, 
  SEFLG_SWIEPH, 
  SEFLG_SPEED,
  SE_HSYS_PLACIDUS 
} from './types';

let isInitialized = false;

/**
 * Swiss Ephemeris 초기화
 */
export function initSwissEphemeris(ephePath?: string): void {
  if (isInitialized) return;
  
  const defaultPath = path.resolve(__dirname, '../../../ephe');
  const finalPath = ephePath || defaultPath;
  
  try {
    swisseph.swe_set_ephe_path(finalPath);
    console.log(`✅ Swiss Ephemeris initialized with path: ${finalPath}`);
    isInitialized = true;
  } catch (error) {
    console.error(`❌ Failed to initialize Swiss Ephemeris:`, error);
    throw new Error(`Swiss Ephemeris initialization failed. Please check ephemeris data at: ${finalPath}`);
  }
}

/**
 * 날짜를 율리우스 일로 변환
 */
export function toJulian(dateTime: Date): number {
  const year = dateTime.getUTCFullYear();
  const month = dateTime.getUTCMonth() + 1;
  const day = dateTime.getUTCDate();
  const hour = dateTime.getUTCHours() + dateTime.getUTCMinutes() / 60;
  
  return swisseph.swe_julday(year, month, day, hour, swisseph.SE_GREG_CAL);
}

/**
 * UTC 시간에서 행성 위치 계산
 */
export function calcPlanetsUTC(input: ChartInput): Record<Planet, PlanetPosition> {
  if (!isInitialized) {
    throw new Error('Swiss Ephemeris not initialized. Call initSwissEphemeris() first.');
  }
  
  // 입력 시간을 UTC로 변환
  const localDateTime = DateTime.fromISO(`${input.date}T${input.time}`, { zone: input.tz });
  const utcDateTime = localDateTime.toUTC().toJSDate();
  const julianDay = toJulian(utcDateTime);
  
  const planets: Record<Planet, PlanetPosition> = {} as Record<Planet, PlanetPosition>;
  const flags = SEFLG_SWIEPH | SEFLG_SPEED;
  
  // 각 행성 계산
  for (const [planetName, planetId] of Object.entries(PLANET_IDS)) {
    try {
      const result = swisseph.swe_calc_ut(julianDay, planetId, flags);
      
      planets[planetName as Planet] = {
        lon: result.longitude,
        lat: result.latitude,
        dist: result.distance,
        speed: result.speedLong
      };
    } catch (error) {
      console.error(`Failed to calculate ${planetName}:`, error);
      // 기본값 설정
      planets[planetName as Planet] = {
        lon: 0,
        lat: 0,
        dist: 0,
        speed: 0
      };
    }
  }
  
  return planets;
}

/**
 * 하우스 계산
 */
export function calcHouses(input: ChartInput, system: HouseSystem): {
  asc: number;
  mc: number;
  houses: Array<{ house: number; longitude: number }>;
} {
  if (!isInitialized) {
    throw new Error('Swiss Ephemeris not initialized. Call initSwissEphemeris() first.');
  }
  
  // 입력 시간을 UTC로 변환
  const localDateTime = DateTime.fromISO(`${input.date}T${input.time}`, { zone: input.tz });
  const utcDateTime = localDateTime.toUTC().toJSDate();
  const julianDay = toJulian(utcDateTime);
  
  if (system === 'placidus') {
    // Placidus 하우스 시스템
    const result = swisseph.swe_houses_ex2(
      julianDay,
      SEFLG_SWIEPH,
      input.lat,
      input.lon,
      SE_HSYS_PLACIDUS
    );
    
    const houses = result.cusps.map((cusp, index) => ({
      house: index + 1,
      longitude: cusp
    }));
    
    return {
      asc: result.ascendant,
      mc: result.mc,
      houses
    };
  } else {
    // Whole Sign 하우스 시스템
    const result = swisseph.swe_houses_ex2(
      julianDay,
      SEFLG_SWIEPH,
      input.lat,
      input.lon,
      SE_HSYS_PLACIDUS // ASC 계산용
    );
    
    const asc = result.ascendant;
    const mc = result.mc;
    
    // Whole Sign: ASC가 속한 별자리의 0°를 1하우스 시작으로
    const ascSign = Math.floor(asc / 30);
    const houses = [];
    
    for (let i = 0; i < 12; i++) {
      const houseLongitude = (ascSign + i) * 30;
      houses.push({
        house: i + 1,
        longitude: houseLongitude
      });
    }
    
    return { asc, mc, houses };
  }
}

/**
 * 특정 날짜의 행성 위치 계산 (트랜짓용)
 */
export function calcPlanetsForDate(date: string, time: string, tz: string): Record<Planet, PlanetPosition> {
  const input: ChartInput = {
    date,
    time,
    tz,
    lat: 0, // 트랜짓 계산에서는 위치가 중요하지 않음
    lon: 0
  };
  
  return calcPlanetsUTC(input);
}

/**
 * Swiss Ephemeris 버전 정보
 */
export function getSwissEphemerisInfo(): { version: string; path: string } {
  try {
    const version = swisseph.swe_version();
    const path = swisseph.swe_get_library_path();
    return { version, path };
  } catch (error) {
    return { version: 'unknown', path: 'unknown' };
  }
}


