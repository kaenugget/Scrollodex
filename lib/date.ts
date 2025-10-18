export const inDays = (n: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + n);
  return date.toISOString();
};

export const addWeeks = (date: Date, n: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + n * 7);
  return newDate;
};

export const formatDate = (isoString: string | undefined | null, options: Intl.DateTimeFormatOptions = {}): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  };
  return date.toLocaleDateString('en-US', defaultOptions);
};

export const formatRelativeDate = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const diffDays = Math.round(diffSeconds / (60 * 60 * 24));

    if (diffSeconds < 60) return 'just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return formatDate(isoString);
};
