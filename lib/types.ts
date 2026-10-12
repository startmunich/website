// Shared type definitions for the application

export interface Partner {
  id: string;
  name: string;
  category: string;
  logoUrl: string;
  featured?: boolean;
}

export interface Startup {
  id: string;
  name: string;
  logoUrl: string;
  isSpotlight?: boolean;
  isYCombinator?: boolean;
  isEWOR?: boolean;
}

export interface Founder {
  name: string;
  role: string;
  batch: string;
  imageUrl: string;
  linkedinUrl?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
}

export interface Company {
  /**
   * The Sanity document's `legacyId` — the original NocoDB row ID. Kept as the
   * public `/startup-details/[id]` route param so existing URLs keep resolving.
   * Typed as a string because it arrives from GROQ as one.
   */
  id: string;
  name: string;
  website: string;
  summary: string;
  description: string;
  logoUrl: string;
  foundingYear: number | string;
  category: string[];
  founders: Founder[];
  totalRaised?: string;
  isSpotlight?: boolean;
  isYCombinator?: boolean;
  companyLinkedin?: string;
  investmentRound?: string;
  milestones?: string;
  supportingPrograms?: string;
  lastUpdated?: string;
  isMTZ?: boolean;
  isEWOR?: boolean;
}
