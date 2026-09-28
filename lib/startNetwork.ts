/**
 * START Network — single source of truth for chapter data.
 *
 * All chapter-related stats (chapter count, countries, member count) and the
 * chapter city list are derived from `START_CHAPTERS`. Whenever a chapter is
 * added or removed, update it here — everything else stays in sync.
 *
 * Used by:
 *  - Home page "START NETWORK" section (`app/home/HomeClient.tsx`)
 *  - Home page chapter marquee (`components/home/ChapterMarquee.tsx`)
 *  - Member journey page (`app/member-journey/MemberJourneyContent.tsx`)
 */

export interface StartChapter {
  city: string;
  country: string;
}

// Order mirrors the home page marquee (current display order) followed by the
// newest chapters. City casing is chosen so that `toUpperCase()` yields the
// exact display strings used on the home page (e.g. MILANO, SÃO PAULO, BOGOTÁ).
export const START_CHAPTERS: StartChapter[] = [
  { city: 'Berlin', country: 'Germany' },
  { city: 'Barcelona', country: 'Spain' },
  { city: 'Hamburg', country: 'Germany' },
  { city: 'Helsinki', country: 'Finland' },
  { city: 'Lausanne', country: 'Switzerland' },
  { city: 'London', country: 'United Kingdom' },
  { city: 'Lima', country: 'Peru' },
  { city: 'Lisbon', country: 'Portugal' },
  { city: 'Maastricht', country: 'Netherlands' },
  { city: 'Mexico City', country: 'Mexico' },
  { city: 'Milano', country: 'Italy' },
  { city: 'Munich', country: 'Germany' },
  { city: 'Paris', country: 'France' },
  { city: 'Nuremberg', country: 'Germany' },
  { city: 'Quito', country: 'Ecuador' },
  { city: 'São Paulo', country: 'Brazil' },
  { city: 'Stuttgart', country: 'Germany' },
  { city: 'Vaduz', country: 'Liechtenstein' },
  { city: 'Vienna', country: 'Austria' },
  { city: 'Warsaw', country: 'Poland' },
  { city: 'St. Gallen', country: 'Switzerland' },
  { city: 'Bogotá', country: 'Colombia' },
  { city: 'Innsbruck', country: 'Austria' },
] as const;

/** Total number of START chapters worldwide. */
export const START_CHAPTER_COUNT = START_CHAPTERS.length;

/** Number of unique countries with at least one START chapter. */
export const START_COUNTRY_COUNT = new Set(START_CHAPTERS.map((chapter) => chapter.country)).size;

/**
 * Total network members across all chapters.
 *
 * Figure per START Innsbruck's site (2026) — the network's current publicly
 * cited member count ("Network members: 4,000+").
 */
export const START_NETWORK_MEMBERS = 4000;

/** Uppercase city names for display (e.g. the home page rolling marquee). */
export const START_CHAPTER_CITIES = START_CHAPTERS.map((chapter) => chapter.city.toUpperCase());

/**
 * The chapter this site belongs to.
 *
 * Munich is the home chapter, so it earns a different treatment in the home
 * page marquee than the 22 cities that merely host a START chapter.
 */
export const HOME_CHAPTER = 'Munich';

/** Uppercase label of the home chapter, matching `START_CHAPTER_CITIES`. */
export const HOME_CHAPTER_LABEL = HOME_CHAPTER.toUpperCase();
