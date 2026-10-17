'use client';

import Link from 'next/link';
import posthog from 'posthog-js';

import { LogoImage } from '@/components/site/logo-image';
import { initials } from '@/components/site/profile-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardMedia } from '@/components/ui/card';
import { Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface Founder {
  name: string;
  imageUrl: string;
  linkedinUrl?: string;
}

function FounderChip({ founder }: { founder: Founder }) {
  const content = (
    <>
      <Avatar className="size-10 border border-border">
        <AvatarImage src={founder.imageUrl} alt={founder.name} />
        <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">
          {initials(founder.name)}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm text-foreground/80">{founder.name}</span>
    </>
  );
  return founder.linkedinUrl ? (
    // `relative z-10` lifts the founder link above the card's stretched link.
    <a
      href={founder.linkedinUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="relative z-10 flex items-center gap-2 transition-opacity hover:opacity-80"
    >
      {content}
    </a>
  ) : (
    <div className="flex items-center gap-2">{content}</div>
  );
}

interface StartupCardProps {
  id: string | number;
  name: string;
  logoUrl: string;
  summary: string;
  category?: string[];
  foundingYear?: string | number;
  founders?: Founder[];
  isMTZ?: boolean;
  /** Programme label in the corner: "★ Featured", "YC", "EWOR". */
  badge?: string;
  showDetails?: boolean;
}

/**
 * A portfolio company. The name is a stretched link to the detail page, so the
 * whole card is clickable while founder links inside it stay independent (no
 * nested anchors).
 */
export default function StartupCard({
  id,
  name,
  logoUrl,
  summary,
  category,
  foundingYear,
  founders = [],
  isMTZ,
  badge,
  showDetails = false,
}: StartupCardProps) {
  const onNavigate = () => {
    posthog.capture('startup_card_clicked', { startup_id: id, startup_name: name, category });
    try {
      sessionStorage.setItem('startups-scroll', String(window.scrollY));
    } catch {
      // Storage unavailable (private mode) — scroll restoration is a nicety.
    }
  };

  return (
    <Card interactive className={cn('group/card h-full', showDetails ? 'gap-4' : 'gap-3')}>
      <CardMedia className="flex h-48 items-center justify-center bg-white p-8">
        {/* Logos have arbitrary aspect ratios, which next/image would distort. */}
        <LogoImage
          src={logoUrl}
          name={name}
          alt={`${name} logo`}
          className="h-auto max-h-full w-auto max-w-full object-contain transition-transform duration-300 group-hover/card:scale-105"
        />
      </CardMedia>

      <div className={cn('flex grow flex-col gap-3', showDetails ? 'px-6' : 'px-5')}>
        <div className="flex items-center gap-2">
          <h3
            className={cn(
              'leading-tight font-bold text-foreground',
              showDetails ? 'text-2xl' : 'text-lg',
            )}
          >
            <Link
              href={`/startup-details/${id}`}
              onClick={onNavigate}
              className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
            >
              {name}
            </Link>
          </h3>
          {isMTZ && (
            <Badge size="sm" className="rounded-md">
              MTZ
            </Badge>
          )}
          {badge && (
            <Badge variant="glass" size="sm" className="ml-auto">
              {badge}
            </Badge>
          )}
        </div>

        {showDetails && ((category && category.length > 0) || foundingYear) && (
          <div className="flex flex-wrap gap-2">
            {category?.slice(0, 2).map((cat) => (
              <Badge key={cat} variant="glass" size="sm" className="rounded-md font-medium">
                {cat}
              </Badge>
            ))}
            {foundingYear && (
              <Badge variant="glass" size="sm" className="rounded-md font-medium">
                Founded {foundingYear}
              </Badge>
            )}
          </div>
        )}

        <Text variant="small" className={cn(showDetails && 'line-clamp-3')}>
          {summary}
        </Text>

        {showDetails && founders.length > 0 && (
          <div className="mt-auto flex flex-col gap-3 border-t border-border pt-4">
            <Text variant="label">{founders.length > 1 ? 'Founders' : 'Founder'}</Text>
            <div className="flex flex-wrap gap-3">
              {founders.map((founder) => (
                <FounderChip key={founder.name} founder={founder} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
