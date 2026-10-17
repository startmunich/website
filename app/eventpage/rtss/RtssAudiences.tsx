'use client';

import type { ReactNode } from 'react';

import { attendeeCopy, rtssConfig, startupCopy } from './rtss-data';
import { Reveal } from './rtss-motion';
import { Pill, RtssPhoto } from './rtss-ui';

type AudienceColumnProps = {
  id: string;
  label: string;
  heading: ReactNode;
  file: string;
  alt: string;
  body: string[];
  cta: { href: string; label: string };
  delay?: number;
  imageClassName?: string;
};

function AudienceColumn({
  id,
  label,
  heading,
  file,
  alt,
  body,
  cta,
  delay = 0,
  imageClassName,
}: AudienceColumnProps) {
  return (
    <Reveal id={id} className="flex scroll-mt-8 flex-col items-start" delay={delay}>
      <Pill>{label}</Pill>
      <h2 className="my-7 min-h-[2.16em] text-[clamp(40px,4.1vw,64px)] leading-[1.08] tracking-[-0.045em] max-[900px]:text-[40px] max-sm:min-h-0">
        {heading}
      </h2>
      <RtssPhoto
        file={file}
        alt={alt}
        sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 40vw"
        frameClassName="mb-8 h-[360px] w-full max-[900px]:h-[280px] max-sm:h-[300px]"
        className={imageClassName}
      />
      {body.map((paragraph) => (
        <p
          key={paragraph}
          className="mb-5 text-[20px] leading-[1.6] text-muted-foreground max-sm:text-[16px]"
        >
          {paragraph}
        </p>
      ))}
      <a
        href={cta.href}
        className="mt-auto flex items-center gap-10 border-b border-accent py-3.5 text-[19px] transition-colors hover:text-accent"
      >
        {cta.label} <span aria-hidden="true">↗</span>
      </a>
    </Reveal>
  );
}

/** The two ways to take part: come along, or bring a startup to pitch. */
export default function RtssAudiences() {
  return (
    <section
      aria-label="Join as an attendee or a startup"
      className="px-5 pt-[160px] pb-[140px] max-sm:pt-[90px] max-sm:pb-20 sm:px-8 lg:px-10"
    >
      <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-16 max-[900px]:gap-8 max-sm:grid-cols-1 max-sm:gap-20">
        <AudienceColumn
          id="for-attendees"
          label="For attendees"
          heading={
            <>
              Meet what&rsquo;s
              <br />
              next.
            </>
          }
          file="rtss-attendees.jpg"
          alt="Attendees applauding at START Munich RTSS 2025"
          body={attendeeCopy}
          cta={{ href: rtssConfig.waitlistUrl, label: 'Join the waitlist' }}
        />
        <AudienceColumn
          id="for-startups"
          label="For startups"
          heading={
            <>
              Your idea.
              <br />
              Your stage.
            </>
          }
          file="rtss-pitch-2025.jpg"
          alt="Founder presenting on stage at START Munich RTSS 2025"
          imageClassName="object-[center_63%]"
          body={startupCopy}
          cta={{ href: rtssConfig.applicationUrl, label: 'Apply as a start-up' }}
          delay={0.08}
        />
      </div>
    </section>
  );
}
