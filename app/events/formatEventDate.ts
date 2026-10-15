/** "Mar 4, 2026", or an empty string for an unparseable date. */
export function formatEventDate(startAt: string): string {
  const date = new Date(startAt);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
