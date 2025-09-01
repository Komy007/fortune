/**
 * 어스펙트 계산 테스트
 */

import { describe, it, expect } from 'vitest';
import { 
  calculateAngleDifference, 
  getAspectType, 
  calculateAspect, 
  calculateAllAspects,
  filterAspectsByType,
  filterStrongAspects
} from '../../src/astro/aspects';
import { Planet } from '../../src/astro/types';

describe('Aspect Calculations', () => {
  describe('calculateAngleDifference', () => {
    it('should calculate correct angle difference', () => {
      expect(calculateAngleDifference(0, 60)).toBe(60);
      expect(calculateAngleDifference(60, 0)).toBe(60);
      expect(calculateAngleDifference(350, 10)).toBe(20);
      expect(calculateAngleDifference(10, 350)).toBe(20);
    });

    it('should handle 180+ degree differences', () => {
      expect(calculateAngleDifference(0, 200)).toBe(160);
      expect(calculateAngleDifference(200, 0)).toBe(160);
    });
  });

  describe('getAspectType', () => {
    it('should identify conjunction', () => {
      expect(getAspectType(0, 8)).toBe('conjunction');
      expect(getAspectType(5, 8)).toBe('conjunction');
    });

    it('should identify sextile', () => {
      expect(getAspectType(60, 6)).toBe('sextile');
      expect(getAspectType(65, 6)).toBe('sextile');
    });

    it('should identify square', () => {
      expect(getAspectType(90, 8)).toBe('square');
      expect(getAspectType(95, 8)).toBe('square');
    });

    it('should identify trine', () => {
      expect(getAspectType(120, 8)).toBe('trine');
      expect(getAspectType(125, 8)).toBe('trine');
    });

    it('should identify opposition', () => {
      expect(getAspectType(180, 8)).toBe('opposition');
      expect(getAspectType(185, 8)).toBe('opposition');
    });

    it('should return null for no aspect', () => {
      expect(getAspectType(45, 6)).toBeNull();
      expect(getAspectType(100, 6)).toBeNull();
    });
  });

  describe('calculateAspect', () => {
    it('should calculate aspect between two planets', () => {
      const aspect = calculateAspect('Sun', 0, 'Moon', 60);
      
      expect(aspect).toBeDefined();
      expect(aspect?.planet1).toBe('Sun');
      expect(aspect?.planet2).toBe('Moon');
      expect(aspect?.type).toBe('sextile');
      expect(aspect?.orb).toBe(0);
      expect(aspect?.exact).toBe(true);
    });

    it('should handle planets with different orbs', () => {
      const aspect = calculateAspect('Sun', 0, 'Mercury', 8);
      
      expect(aspect).toBeDefined();
      expect(aspect?.type).toBe('conjunction');
      expect(aspect?.orb).toBe(8);
      expect(aspect?.exact).toBe(false);
    });
  });

  describe('calculateAllAspects', () => {
    it('should calculate aspects for all planet pairs', () => {
      const planets = {
        Sun: { lon: 0 },
        Moon: { lon: 60 },
        Mercury: { lon: 90 }
      };

      const aspects = calculateAllAspects(planets);
      
      expect(aspects).toHaveLength(3); // Sun-Moon, Sun-Mercury, Moon-Mercury
      expect(aspects[0].orb).toBeLessThanOrEqual(aspects[1].orb);
      expect(aspects[1].orb).toBeLessThanOrEqual(aspects[2].orb);
    });
  });

  describe('filterAspectsByType', () => {
    it('should filter aspects by type', () => {
      const aspects = [
        { planet1: 'Sun', planet2: 'Moon', type: 'conjunction', orb: 5, exact: false },
        { planet1: 'Sun', planet2: 'Venus', type: 'trine', orb: 2, exact: true },
        { planet1: 'Moon', planet2: 'Venus', type: 'square', orb: 3, exact: false }
      ];

      const harmonious = filterAspectsByType(aspects, ['trine']);
      expect(harmonious).toHaveLength(1);
      expect(harmonious[0].type).toBe('trine');
    });
  });

  describe('filterStrongAspects', () => {
    it('should filter aspects by orb strength', () => {
      const aspects = [
        { planet1: 'Sun', planet2: 'Moon', type: 'conjunction', orb: 1, exact: true },
        { planet1: 'Sun', planet2: 'Venus', type: 'trine', orb: 5, exact: false },
        { planet1: 'Moon', planet2: 'Venus', type: 'square', orb: 2, exact: false }
      ];

      const strong = filterStrongAspects(aspects, 3);
      expect(strong).toHaveLength(2);
      expect(strong.every(a => a.orb <= 3)).toBe(true);
    });
  });
});



