import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

export function getRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isToday(dateObj)) {
    return `Today ${format(dateObj, 'h:mm a')}`;
  }
  
  if (isYesterday(dateObj)) {
    return `Yesterday ${format(dateObj, 'h:mm a')}`;
  }
  
  // Within last 7 days, show relative
  const daysAgo = Math.floor((Date.now() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
  if (daysAgo < 7) {
    return formatDistanceToNow(dateObj, { addSuffix: true });
  }
  
  // Older dates, show formatted date
  return format(dateObj, 'MMM d, h:mm a');
}
