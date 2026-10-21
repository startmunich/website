export interface BayAreaHeroStat {
  label: string;
  value: string;
}

export type BayAreaYearId = '2025' | '2026' | '2027';

export interface BayAreaHost {
  name: string;
  logoPath?: string;
  websiteUrl?: string;
  logoTheme?: 'light' | 'dark';
}

export interface BayAreaTeamMember {
  name: string;
  role: string;
  photoPath?: string;
  linkedinUrl?: string;
}

export interface BayAreaHighlightVisit {
  name: string;
  context: string;
  logoPath?: string;
  websiteUrl?: string;
  logoTheme?: 'light' | 'dark';
}

export interface BayAreaCompanyLogo {
  name: string;
  logoPath: string;
  websiteUrl?: string;
  logoTheme?: 'light' | 'dark';
}

export interface BayAreaYearContent {
  id: BayAreaYearId;
  label: string;
  isPreview?: boolean;
  groupPictureUrl: string;
  highlightVisits: BayAreaHighlightVisit[];
  heroStats: BayAreaHeroStat[];
  hosts: BayAreaHost[];
  teamMembers: BayAreaTeamMember[];
}
