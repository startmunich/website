/** The member batches shown on /members, newest first, with their group photos. */

const defaultBatches = [
  'Summer 2026',
  'Winter 2025',
  'Summer 2025',
  'Winter 2024',
  'Summer 2024',
  'Winter 2023',
  'Summer 2023',
  'Winter 2022',
  'Summer 2022',
  'Winter 2021',
];
const allBatches = Array.from(new Set(defaultBatches)).filter(Boolean).sort().reverse();

export const batchImageMap: Record<string, string> = {
  ws21: 'WS21-opt.jpg',
  ws22: 'WS22-opt.jpg',
  ws23: 'WS23-opt.jpg',
  ws24: 'WS24-opt.jpg',
  ws25: 'WS25-opt.jpg',
  ss22: 'SS22-opt.jpg',
  ss23: 'SS23-opt.jpg',
  ss24: 'SS24-opt.jpg',
  ss25: 'SS25-opt.jpg',
  ss26: 'SS26-opt.jpg',
};

function getBatchImageKey(batchName: string): string | null {
  const normalized = batchName.toLowerCase().trim();
  const fullMatch = normalized.match(/^(winter|summer)\s+(\d{4})$/);
  if (fullMatch) return `${fullMatch[1] === 'winter' ? 'ws' : 'ss'}${fullMatch[2].slice(-2)}`;
  const fourDigitMatch = normalized.match(/^(ws|ss)\s*(\d{4})$/);
  if (fourDigitMatch) return `${fourDigitMatch[1]}${fourDigitMatch[2].slice(-2)}`;
  const shortMatch = normalized.match(/^(ws|ss)\s*(\d{2})$/);
  if (shortMatch) return `${shortMatch[1]}${shortMatch[2]}`;
  return null;
}

export function getBatchSlug(batchName: string): string {
  const key = getBatchImageKey(batchName);
  if (key) return key;
  return batchName.toLowerCase().replace(/\s+/g, '-');
}

function isAfterWS21(batchName: string): boolean {
  const normalized = batchName.toLowerCase().trim();
  let year: number | null = null;
  let isWinter = false;
  const fullMatch = normalized.match(/^(winter|summer)\s+(\d{4})$/);
  if (fullMatch) {
    year = parseInt(fullMatch[2].slice(-2));
    isWinter = fullMatch[1] === 'winter';
  }
  const shortMatch = normalized.match(/^(ws|ss)\s*(\d{2})$/);
  if (shortMatch) {
    year = parseInt(shortMatch[2]);
    isWinter = shortMatch[1] === 'ws';
  }
  if (year === null) return false;
  if (year > 21) return true;
  if (year === 21 && isWinter) return true;
  return false;
}

export const sortedBatches: BatchSummary[] = allBatches
  .map((batchName) => {
    const batchKey = getBatchImageKey(batchName);
    const shouldShowImage = isAfterWS21(batchName);
    let groupImageUrl = '/ourMembers/hero-opt.png';
    if (shouldShowImage && batchKey && batchImageMap[batchKey]) {
      groupImageUrl = `/ourMembers/batches_group_pictures/${batchImageMap[batchKey]}`;
    }
    return {
      name: batchName,
      semester: batchName.split(' ')[0] || 'Batch',
      year: batchName.split(' ')[1] || '',
      groupImageUrl,
    };
  })
  .sort((a, b) => {
    const yearDiff = parseInt(b.year) - parseInt(a.year);
    if (yearDiff !== 0) return yearDiff;
    if (a.semester.toLowerCase().includes('winter') || a.semester.toLowerCase().startsWith('w'))
      return -1;
    if (b.semester.toLowerCase().includes('winter') || b.semester.toLowerCase().startsWith('w'))
      return 1;
    return 0;
  });

export interface BatchSummary {
  name: string;
  semester: string;
  year: string;
  groupImageUrl: string;
}
