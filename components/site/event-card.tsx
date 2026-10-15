import Image from 'next/image';

import { ButtonLink } from '@/components/ui/button';
import { Card, CardMedia } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EventCardProps {
  title: string;
  date?: string;
  imageUrl?: string;
  description?: string;
  /** Makes the whole card a link (usually the registration page). */
  href?: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaDisabledLabel?: string;
  onCtaClick?: () => void;
  className?: string;
}

/** An event: square cover, title, date, optional description and register button. */
export function EventCard({
  title,
  date,
  imageUrl,
  description,
  href,
  ctaLabel,
  ctaHref,
  ctaDisabledLabel = 'Registration opens soon',
  onCtaClick,
  className,
}: EventCardProps) {
  const body = (
    <>
      <CardMedia className="p-3 pb-0">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 86vw, 320px"
              className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
            />
          )}
        </div>
      </CardMedia>
      <div className="flex flex-1 flex-col gap-1 px-4 pb-1">
        <h3 className="line-clamp-2 text-sm leading-snug font-bold text-foreground">{title}</h3>
        {date && (
          <p className="text-xs font-medium whitespace-pre-line text-muted-foreground">{date}</p>
        )}
        {description && (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}
        {ctaLabel && (
          <div className="mt-auto pt-4">
            {ctaHref ? (
              <ButtonLink
                href={ctaHref}
                external
                className="w-full text-xs tracking-wide uppercase"
                onClick={(e) => {
                  e.stopPropagation();
                  onCtaClick?.();
                }}
              >
                {ctaLabel}
              </ButtonLink>
            ) : (
              <span className="flex h-11 w-full cursor-not-allowed items-center justify-center rounded-lg bg-muted text-xs font-bold tracking-wide text-muted-foreground uppercase">
                {ctaDisabledLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );

  const classes = cn(
    'gap-4 border-transparent pb-4 shadow-card transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/40',
    className,
  );

  if (href) {
    return (
      <Card
        render={<a href={href} target="_blank" rel="noopener noreferrer" />}
        className={classes}
      >
        {body}
      </Card>
    );
  }
  return <Card className={classes}>{body}</Card>;
}
