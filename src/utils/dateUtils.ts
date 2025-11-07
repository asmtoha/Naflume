/**
 * Date utility functions for goal tracking
 */

export const getStartOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

export const getEndOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

export const getStartOfWeek = (date: Date): Date => {
  const newDate = new Date(date);
  const dayOfWeek = newDate.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  newDate.setDate(newDate.getDate() - daysToMonday);
  return getStartOfDay(newDate);
};

export const getEndOfWeek = (date: Date): Date => {
  const startOfWeek = getStartOfWeek(date);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return getEndOfDay(endOfWeek);
};

export const getStartOfMonth = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setDate(1);
  return getStartOfDay(newDate);
};

export const getEndOfMonth = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1, 0);
  return getEndOfDay(newDate);
};

export const getStartOfYear = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setMonth(0, 1);
  return getStartOfDay(newDate);
};

export const getEndOfYear = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setMonth(11, 31);
  return getEndOfDay(newDate);
};

export const isDateInPeriod = (date: Date, startDate: Date, endDate: Date): boolean => {
  return date >= startDate && date < endDate;
};

export const getPeriodLabel = (frequency: 'daily' | 'weekly' | 'monthly', date: Date): string => {
  switch (frequency) {
    case 'daily':
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'weekly':
      const startOfWeek = getStartOfWeek(date);
      const endOfWeek = getEndOfWeek(date);
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    case 'monthly':
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    default:
      return date.toLocaleDateString();
  }
};

export const getDaysUntilNextPeriod = (frequency: 'daily' | 'weekly' | 'monthly'): number => {
  const now = new Date();
  
  switch (frequency) {
    case 'daily':
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return Math.ceil((tomorrow.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    case 'weekly':
      const nextMonday = getStartOfWeek(now);
      nextMonday.setDate(nextMonday.getDate() + 7);
      return Math.ceil((nextMonday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    case 'monthly':
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1, 1);
      return Math.ceil((nextMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    default:
      return 0;
  }
};


