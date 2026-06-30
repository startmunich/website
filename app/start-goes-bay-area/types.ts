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

export const getLogoChipClassName = (theme?: 'light' | 'dark') =>
  theme === 'dark'
    ? 'border-white/15 bg-slate-900/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_20px_rgba(2,6,23,0.35)]'
    : 'border-black/5 bg-white/[0.92] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_8px_18px_rgba(15,23,42,0.12)]';

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
