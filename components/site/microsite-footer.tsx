import { Container } from '@/components/ui/section';
import { cn } from '@/lib/utils';

const links = [
  { label: 'Legal Notice', href: 'https://www.startmunich.de/legal-notice' },
  { label: 'Privacy Policy', href: 'https://www.startmunich.de/privacy-policy' },
  { label: 'START Munich', href: 'https://www.startmunich.de' },
];

/**
 * Minimal footer for standalone event microsites, which render without the site
 * chrome. Inherits colours from the surrounding `.theme-*` scope.
 */
export function MicrositeFooter({ label, className }: { label: string; className?: string }) {
  return (
    <footer className={cn('border-t border-border bg-background py-10', className)}>
      <Container size="narrow" className="flex flex-wrap items-center justify-between gap-6">
        <p className="text-sm font-bold text-muted-foreground/80">
          &copy; {new Date().getFullYear()} START Munich &middot; {label}
        </p>
        <nav className="flex flex-wrap gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
