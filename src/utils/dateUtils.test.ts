import { 
  getStartOfDay, 
  getEndOfDay, 
  getStartOfWeek, 
  getEndOfWeek, 
  getStartOfMonth, 
  getEndOfMonth,
  isDateInPeriod,
  getPeriodLabel
} from './dateUtils';

describe('Date Utilities', () => {
  const testDate = new Date('2024-01-15T14:30:00.000Z'); // Monday, January 15, 2024

  describe('getStartOfDay', () => {
    it('should return start of day (00:00:00.000)', () => {
      const result = getStartOfDay(testDate);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  });

  describe('getEndOfDay', () => {
    it('should return end of day (23:59:59.999)', () => {
      const result = getEndOfDay(testDate);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });
  });

  describe('getStartOfWeek', () => {
    it('should return Monday of the current week', () => {
      const result = getStartOfWeek(testDate);
      expect(result.getDay()).toBe(1); // Monday
      expect(result.getDate()).toBe(15); // January 15
    });

    it('should handle Sunday correctly', () => {
      const sunday = new Date('2024-01-14T14:30:00.000Z'); // Sunday
      const result = getStartOfWeek(sunday);
      expect(result.getDay()).toBe(1); // Monday
      expect(result.getDate()).toBe(8); // January 8 (previous Monday)
    });
  });

  describe('getEndOfWeek', () => {
    it('should return Sunday of the current week', () => {
      const result = getEndOfWeek(testDate);
      expect(result.getDay()).toBe(0); // Sunday
      expect(result.getDate()).toBe(21); // January 21
    });
  });

  describe('getStartOfMonth', () => {
    it('should return first day of the month', () => {
      const result = getStartOfMonth(testDate);
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(0); // January
    });
  });

  describe('getEndOfMonth', () => {
    it('should return last day of the month', () => {
      const result = getEndOfMonth(testDate);
      expect(result.getDate()).toBe(31); // January has 31 days
      expect(result.getMonth()).toBe(0); // January
    });
  });

  describe('isDateInPeriod', () => {
    it('should return true for date within period', () => {
      const startDate = new Date('2024-01-01T00:00:00.000Z');
      const endDate = new Date('2024-01-31T23:59:59.999Z');
      const testDate = new Date('2024-01-15T12:00:00.000Z');
      
      expect(isDateInPeriod(testDate, startDate, endDate)).toBe(true);
    });

    it('should return false for date outside period', () => {
      const startDate = new Date('2024-01-01T00:00:00.000Z');
      const endDate = new Date('2024-01-31T23:59:59.999Z');
      const testDate = new Date('2024-02-01T00:00:00.000Z');
      
      expect(isDateInPeriod(testDate, startDate, endDate)).toBe(false);
    });
  });

  describe('getPeriodLabel', () => {
    it('should format daily period correctly', () => {
      const result = getPeriodLabel('daily', testDate);
      expect(result).toContain('Monday');
      expect(result).toContain('January 15');
      expect(result).toContain('2024');
    });

    it('should format weekly period correctly', () => {
      const result = getPeriodLabel('weekly', testDate);
      expect(result).toContain('Jan 15');
      expect(result).toContain('Jan 21');
      expect(result).toContain('2024');
    });

    it('should format monthly period correctly', () => {
      const result = getPeriodLabel('monthly', testDate);
      expect(result).toContain('January');
      expect(result).toContain('2024');
    });
  });
});


