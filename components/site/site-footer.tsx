import Link from 'next/link';

import { SocialLinks } from '@/components/site/social-links';
import { Container } from '@/components/ui/section';
import { Separator } from '@/components/ui/separator';
import { footerNav, siteLinks } from '@/lib/site';

const linkClass =
  'text-sm font-bold tracking-widest text-foreground uppercase transition-colors hover:text-primary';

export function SiteFooter() {
  return (
    <footer className="bg-background">
      <Container className="flex flex-col items-center justify-between gap-6 pt-10 pb-6 md:flex-row">
        <a href={siteLinks.donate} target="_blank" rel="noopener noreferrer" className={linkClass}>
          Donate
        </a>
        <nav className="flex items-center gap-6 md:gap-8">
          {footerNav.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </Link>
          ))}
        </nav>
        <SocialLinks variant="icon" />
      </Container>
      <Container>
        <Separator />
        <div className="flex flex-col items-center justify-between gap-2 py-5 text-sm text-muted-foreground/70 sm:flex-row">
          <span>© {new Date().getFullYear()} START Munich. All rights reserved.</span>
          <span>
            Hosted by{' '}
            <a
              href={siteLinks.hetzner}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary focus-visible:text-primary"
            >
              Hetzner
            </a>
          </span>
        </div>
      </Container>
    </footer>
  );
}
