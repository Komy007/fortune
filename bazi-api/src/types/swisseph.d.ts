declare module 'swisseph' {
  export interface PlanetResult {
    longitude: number;
    latitude: number;
    distance: number;
    longitudeSpeed: number;
    latitudeSpeed: number;
    distanceSpeed: number;
    rflag: number;
  }

  export interface HouseResult {
    house: number[];
    ascendant: number;
    mc: number;
    armc: number;
    vertex: number;
    equatorialAscendant: number;
    kochCoAscendant: number;
    munkaseyCoAscendant: number;
    munkaseyPolarAscendant: number;
    munkaseyPolarAscendantSpeed: number;
  }

  // 상수들
  export const SE_GREG_CAL: number;
  export const SE_SWIEPH: number;
  export const SE_SPEED: number;
  export const SE_HSYS_PLACIDUS: string;

  // 함수들
  export function swe_calc_ut(julianDay: number, planetId: number, flags: number): PlanetResult;
  export function swe_houses_ex2(julianDay: number, flags: number, lat: number, lon: number, system: string): HouseResult;
  export function swe_get_library_path(): string;
  export function swe_set_ephe_path(path: string): void;
  export function swe_julday(year: number, month: number, day: number, hour: number, gregflag: number): number;
  export function swe_version(): string;
}
