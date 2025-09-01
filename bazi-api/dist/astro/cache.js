"use strict";
// LRU 캐시 시스템
// 동일 입력에 대한 중복 계산 방지
// TTL: 10분
Object.defineProperty(exports, "__esModule", { value: true });
exports.CACHE_PREFIXES = void 0;
exports.createCacheKey = createCacheKey;
exports.getFromCache = getFromCache;
exports.setCache = setCache;
exports.deleteFromCache = deleteFromCache;
exports.getCacheStats = getCacheStats;
exports.clearCache = clearCache;
exports.withCache = withCache;
exports.logCacheStatus = logCacheStatus;
const lru_cache_1 = require("lru-cache");
// 캐시 설정
const CACHE_OPTIONS = {
    max: 100, // 최대 100개 항목
    ttl: 1000 * 60 * 10, // 10분 TTL
    updateAgeOnGet: true, // 접근 시 나이 갱신
    allowStale: false, // 만료된 항목 반환 금지
    noDisposeOnSet: true, // 설정 시 삭제 콜백 호출 금지
    dispose: (key, value) => {
        console.log(`Cache entry expired: ${key}`);
    }
};
// 캐시 인스턴스
const cache = new lru_cache_1.LRUCache(CACHE_OPTIONS);
// 캐시 키 생성 (입력 데이터의 해시)
function createCacheKey(prefix, data) {
    const dataStr = JSON.stringify(data);
    const hash = simpleHash(dataStr);
    return `${prefix}:${hash}`;
}
// 간단한 해시 함수
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 32비트 정수로 변환
    }
    return Math.abs(hash).toString(36);
}
// 캐시에서 데이터 가져오기
function getFromCache(key) {
    const value = cache.get(key);
    if (value !== undefined) {
        console.log(`Cache hit: ${key}`);
    }
    return value;
}
// 캐시에 데이터 저장
function setCache(key, value) {
    cache.set(key, value);
    console.log(`Cache set: ${key}`);
}
// 캐시에서 데이터 삭제
function deleteFromCache(key) {
    return cache.delete(key);
}
// 캐시 통계 가져오기
function getCacheStats() {
    return {
        size: cache.size,
        max: cache.max,
        ttl: cache.ttl
    };
}
// 캐시 전체 삭제
function clearCache() {
    cache.clear();
    console.log('Cache cleared');
}
// 캐시 래퍼 함수 (고차 함수)
function withCache(prefix, fn, input) {
    const key = createCacheKey(prefix, input);
    const cached = getFromCache(key);
    if (cached !== undefined) {
        return cached;
    }
    const result = fn(input);
    setCache(key, result);
    return result;
}
// 캐시 상태 로깅
function logCacheStatus() {
    const stats = getCacheStats();
    console.log('Cache Status:', {
        currentSize: stats.size,
        maxSize: stats.max,
        ttl: stats.ttl
    });
}
// 캐시 키 패턴
exports.CACHE_PREFIXES = {
    NATAL_CHART: 'natal',
    TRANSIT: 'transit',
    SYNASTRY: 'synastry',
    PLANET_POSITIONS: 'planets',
    HOUSES: 'houses',
    ASPECTS: 'aspects'
};
//# sourceMappingURL=cache.js.map