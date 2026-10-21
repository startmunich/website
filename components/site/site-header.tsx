'use client';

import { ArrowUpRightIcon, ChevronRightIcon, MenuIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import posthog from 'posthog-js';
import * as React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button, ButtonLink } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Container } from '@/components/ui/section';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { isNavGroup, mainNav, type NavLink, siteLinks } from '@/lib/site';
import { cn } from '@/lib/utils';

function isActive(pathname: string, href: string) {
  if (href.startsWith('http')) return false;
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

const topLevelClass =
  'h-10 rounded-lg bg-transparent px-3 text-sm font-bold tracking-wide text-foreground uppercase hover:bg-transparent hover:text-primary focus:bg-transparent data-active:bg-transparent data-active:text-primary data-popup-open:bg-transparent data-popup-open:text-primary data-popup-open:hover:bg-transparent data-open:bg-transparent data-open:hover:bg-transparent';

function LinkTarget({ link, ...props }: { link: NavLink } & React.ComponentProps<'a'>) {
  return link.external ? (
    <a href={link.href} target="_blank" rel="noopener noreferrer" {...props} />
  ) : (
    <Link href={link.href} {...props} />
  );
}

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex shrink-0 items-center transition-opacity hover:opacity-80"
    >
      <Image
        src="/startlogo.svg"
        alt="START Munich"
        width={120}
        height={54}
        className="h-12 w-auto"
        priority
      />
    </Link>
  );
}

function HeaderActions({
  location,
  onNavigate,
}: {
  location: 'desktop' | 'mobile';
  onNavigate?: () => void;
}) {
  return (
    <>
      <ButtonLink
        href="/apply"
        variant="inverse"
        size={location === 'desktop' ? 'sm' : 'lg'}
        className="uppercase max-lg:flex-1"
        onClick={() => {
          onNavigate?.();
          posthog.capture('nav_apply_clicked', { location });
        }}
      >
        Apply now
      </ButtonLink>
      <ButtonLink
        href={siteLinks.jobs}
        variant="inverse"
        size={location === 'desktop' ? 'sm' : 'lg'}
        className="uppercase max-lg:flex-1"
        onClick={() => {
          onNavigate?.();
          posthog.capture('nav_jobs_clicked', { location });
        }}
      >
        Jobs
      </ButtonLink>
    </>
  );
}

function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList className="gap-2">
        {mainNav.map((entry) =>
          isNavGroup(entry) ? (
            <NavigationMenuItem key={entry.label}>
              <NavigationMenuTrigger
                className={topLevelClass}
                data-active={entry.items.some((i) => isActive(pathname, i.href)) || undefined}
              >
                {entry.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex w-64 flex-col gap-0.5 p-1.5">
                  {entry.items.map((link, i) => (
                    <React.Fragment key={link.href}>
                      {link.secondary && !entry.items[i - 1]?.secondary && (
                        <Separator className="my-1.5" />
                      )}
                      <li>
                        <NavigationMenuLink
                          active={isActive(pathname, link.href)}
                          render={<LinkTarget link={link} />}
                          className={cn(
                            'group/link justify-between rounded-md px-3 hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground data-active:text-primary data-active:hover:text-primary-foreground',
                            link.secondary
                              ? 'py-2 text-sm font-semibold text-muted-foreground'
                              : 'py-2.5 text-base font-bold',
                          )}
                        >
                          {link.label}
                          {link.external ? (
                            <ArrowUpRightIcon className="size-3.5 opacity-60" />
                          ) : (
                            <ChevronRightIcon className="size-4 opacity-0 transition group-hover/link:translate-x-0.5 group-hover/link:opacity-100" />
                          )}
                        </NavigationMenuLink>
                      </li>
                    </React.Fragment>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={entry.href}>
              <NavigationMenuLink
                active={isActive(pathname, entry.href)}
                render={<LinkTarget link={entry} />}
                className={cn(topLevelClass, 'inline-flex items-center')}
              >
                {entry.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ),
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);
  const openGroup = mainNav.find(
    (e) => isNavGroup(e) && e.items.some((i) => isActive(pathname, i.href)),
  )?.label;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
        <MenuIcon className="size-6" />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full gap-0 border-none bg-background data-[side=right]:w-full data-[side=right]:sm:max-w-full [&>[data-slot=sheet-close]]:top-5 [&>[data-slot=sheet-close]]:right-4 [&>[data-slot=sheet-close]]:size-11 [&>[data-slot=sheet-close]_svg]:size-6"
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="flex h-20 shrink-0 items-center border-b px-4 sm:px-6">
          <Logo onClick={close} />
        </div>
        <nav className="flex grow flex-col overflow-y-auto px-4 py-6 sm:px-6">
          <Accordion defaultValue={openGroup ? [openGroup] : []}>
            {mainNav.map((entry) =>
              isNavGroup(entry) ? (
                <AccordionItem key={entry.label} value={entry.label} className="border-b">
                  <AccordionTrigger className="py-4 text-lg font-bold tracking-wide uppercase hover:text-primary hover:no-underline **:data-[slot=accordion-trigger-icon]:size-5">
                    {entry.label}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col pb-3 [&_a]:no-underline">
                    {entry.items.map((link) => (
                      <LinkTarget
                        key={link.href}
                        link={link}
                        onClick={close}
                        className={cn(
                          'py-2.5 pl-4 transition-colors hover:text-primary',
                          link.secondary
                            ? 'text-sm font-medium text-muted-foreground'
                            : 'text-base font-semibold text-foreground/85',
                          isActive(pathname, link.href) && 'text-primary',
                        )}
                      >
                        {link.label}
                      </LinkTarget>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <LinkTarget
                  key={entry.href}
                  link={entry}
                  onClick={close}
                  className={cn(
                    'block border-b py-4 text-lg font-bold tracking-wide uppercase transition-colors hover:text-primary',
                    isActive(pathname, entry.href) && 'text-primary',
                  )}
                >
                  {entry.label}
                </LinkTarget>
              ),
            )}
          </Accordion>
          <div className="mt-10 flex gap-2">
            <HeaderActions location="mobile" onNavigate={close} />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between gap-6">
        <Logo />
        <DesktopNav pathname={pathname} />
        <div className="hidden items-center gap-1 lg:flex">
          <HeaderActions location="desktop" />
        </div>
        <MobileNav pathname={pathname} />
      </Container>
    </header>
  );
}
