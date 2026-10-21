'use client';

import { useEffect, useRef, useState } from 'react';

import { NewsCard } from '@/components/site/news-card';
import { SocialLinks } from '@/components/site/social-links';
import { Button } from '@/components/ui/button';
import { Container, Section, SectionHeader } from '@/components/ui/section';
import type { NewsItem } from '@/lib/types';

const HEADER_HEIGHT = 80;

function NewsHeader() {
  return (
    <SectionHeader
      eyebrow="Stay Updated"
      title="Latest News"
      className="md:flex-row md:items-end md:justify-start md:gap-6"
      actions={<SocialLinks />}
    />
  );
}

/**
 * Desktop: vertical page scroll drives the horizontal card strip (the section is
 * made exactly as tall as the overflow, and the strip is sticky inside it). This
 * keeps the interaction while avoiding Safari's page-locking wheel behaviour.
 * Mobile: a plain stack with "Show more".
 */
export function NewsSection({ news }: { news: NewsItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!section || !sticky || !track || !viewport) return;

    let frame = 0;
    const getOverflow = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

    const updatePosition = () => {
      const overflow = getOverflow();
      if (window.innerWidth < 768 || overflow <= 0) {
        setScrollX(0);
        return;
      }
      const start = section.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
      setScrollX(Math.min(overflow, Math.max(0, window.scrollY - start)));
    };

    const updateMeasurements = () => {
      setSectionHeight(sticky.offsetHeight + getOverflow());
      updatePosition();
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updatePosition();
      });
    };

    const observer = new ResizeObserver(updateMeasurements);
    [sticky, track, viewport].forEach((el) => observer.observe(el));
    updateMeasurements();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateMeasurements);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateMeasurements);
    };
  }, [news.length]);

  if (news.length === 0) return null;

  return (
    <>
      <section
        ref={sectionRef}
        className="relative hidden md:block"
        style={sectionHeight > 0 ? { height: sectionHeight } : undefined}
      >
        <Container ref={stickyRef} className="sticky top-20 py-20 md:py-28">
          <NewsHeader />
          <div ref={viewportRef} className="overflow-hidden">
            <div
              ref={trackRef}
              className="flex w-max gap-6 will-change-transform"
              style={{ transform: `translateX(-${scrollX}px)` }}
            >
              {news.map((item) => (
                <NewsCard key={item.id} item={item} className="w-[380px] shrink-0" />
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Section spacing="lg" className="md:hidden">
        <NewsHeader />
        <div className="flex flex-col gap-6">
          {(showAll ? news : news.slice(0, 3)).map((item) => (
            <NewsCard key={item.id} item={item} sizes="(max-width: 768px) 86vw, 380px" />
          ))}
          {!showAll && news.length > 3 && (
            <Button variant="outline" size="lg" className="w-full" onClick={() => setShowAll(true)}>
              Show more
            </Button>
          )}
        </div>
      </Section>
    </>
  );
}
