import { format, formatDistance, formatRelative, isValid } from 'date-fns';

export const formatDate = (date: Date | string | number, pattern = 'PP'): string => {
  const dateObj = new Date(date);
  if (!isValid(dateObj)) return 'Invalid date';

  try {
    return format(dateObj, pattern);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const formatRelativeTime = (date: Date): string => {
  const dateObj = new Date(date);
  if (!isValid(dateObj)) return 'Invalid date';

  try {
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid date';
  }
};

export const formatRelativeDate = (
  date: Date | string | number,
  baseDate = new Date()
): string => {
  const dateObj = new Date(date);
  if (!isValid(dateObj)) return 'Invalid date';

  try {
    return formatRelative(dateObj, baseDate);
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return 'Invalid date';
  }
};

export const formatTimeAgo = (date: Date | string | number): string => {
  const dateObj = new Date(date);
  if (!isValid(dateObj)) return 'Invalid date';

  const seconds = Math.floor((new Date().getTime() - dateObj.getTime()) / 1000);

  if (seconds < 60) {
    return 'just now';
  }

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }

  return formatDate(date);
};

export const formatDuration = (milliseconds: number): string => {
  if (milliseconds < 0) return '0s';

  const time = {
    d: Math.floor(milliseconds / 86400000),
    h: Math.floor((milliseconds % 86400000) / 3600000),
    m: Math.floor((milliseconds % 3600000) / 60000),
    s: Math.floor((milliseconds % 60000) / 1000),
  };

  return Object.entries(time)
    .filter(([, value]) => value > 0)
    .map(([unit, value]) => `${value}${unit}`)
    .join(' ');
};

export const getLocalTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const convertToLocalTime = (
  date: Date | string | number,
  timezone = getLocalTimezone()
): Date => {
  const dateObj = new Date(date);
  if (!isValid(dateObj)) throw new Error('Invalid date');

  return new Date(
    dateObj.toLocaleString('en-US', {
      timeZone: timezone,
    })
  );
};

export const isToday = (date: Date | string | number): boolean => {
  const dateObj = new Date(date);
  if (!isValid(dateObj)) return false;

  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

export const isYesterday = (date: Date | string | number): boolean => {
  const dateObj = new Date(date);
  if (!isValid(dateObj)) return false;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    dateObj.getDate() === yesterday.getDate() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getFullYear() === yesterday.getFullYear()
  );
}; 