import { format, parseISO, isToday, startOfDay } from 'date-fns';

export function getTodayDateString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatDateForDisplay(dateStr: string): string {
  return format(parseISO(dateStr), 'EEEE, MMMM d, yyyy');
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d');
}

export function isDateToday(dateStr: string): boolean {
  return isToday(parseISO(dateStr));
}

export function getDateFromString(dateStr: string): Date {
  return startOfDay(parseISO(dateStr));
}

export function isSameDay(date1: string, date2: string): boolean {
  return date1 === date2;
}