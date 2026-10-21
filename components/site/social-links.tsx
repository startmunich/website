import { InstagramIcon, LinkedInIcon } from '@/components/site/brand-icons';
import { Button, ButtonLink } from '@/components/ui/button';
import { siteLinks } from '@/lib/site';
import { cn } from '@/lib/utils';

const socials = [
  { label: 'LinkedIn', href: siteLinks.linkedin, Icon: LinkedInIcon },
  { label: 'Instagram', href: siteLinks.instagram, Icon: InstagramIcon },
] as const;

/**
 * START Munich's social profiles. `icon` renders bare icon buttons (footer);
 * `pill` renders labelled outline pills (section headers).
 */
export function SocialLinks({
  variant = 'pill',
  className,
}: {
  variant?: 'icon' | 'pill';
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {socials.map(({ label, href, Icon }) =>
        variant === 'pill' ? (
          <ButtonLink key={label} href={href} variant="outline" size="sm" shape="pill">
            <Icon className="size-4" />
            {label}
          </ButtonLink>
        ) : (
          <Button
            key={label}
            variant="ghost"
            size="icon-sm"
            className="hover:bg-transparent hover:text-primary"
            nativeButton={false}
            render={<a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} />}
          >
            <Icon className="size-6" />
          </Button>
        ),
      )}
    </div>
  );
}
