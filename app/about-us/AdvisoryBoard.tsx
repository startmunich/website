'use client';

import { XIcon } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

import { ProfileCard } from '@/components/site/profile-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Reveal } from '@/components/ui/reveal';
import { Section, SectionHeader } from '@/components/ui/section';
import { Heading, Text } from '@/components/ui/typography';

const advisoryBoard = [
  {
    name: 'Dr. Jennifer Kaiser-Steiner',
    role: 'Learning & Exchange Center, UnternehmerTUM',
    bio: "Dr. Jennifer Kaiser-Steiner leads the Learning & Exchange Center at UnternehmerTUM, Europe's largest entrepreneurship hub. She supports startup factories and innovation ecosystems in strengthening their professionalism by sharing best practices and establishing KPI-driven performance frameworks. Previously, she worked as a personal advisor to a member of the German Bundestag, where she contributed to legislative initiatives. Jennifer earned her doctorate in economics from the University of the Federal Armed Forces, with a research focus on corporate innovation.",
    photo: '/aboutUs/AdvBoard/Jennifer.jpg',
  },
  {
    name: 'Prof. Dr. Bettina Maisch',
    role: 'Head of Entrepreneurship Education, SCE',
    bio: 'Prof. Dr. Bettina Maisch is Head of Entrepreneurship Education and Qualification at the Strascheg Center for Entrepreneurship (SCE). Her work focuses on Entrepreneurial Life Design, Design Thinking, and Innovation Management to empower individuals and organizations to develop and implement innovative ideas. She combines academic research with hands-on, iterative approaches to (Corporate) Entrepreneurship and venture creation.',
    photo: '/aboutUs/AdvBoard/Maisch.jpg',
  },
  {
    name: 'Felix Haas',
    role: 'Co-founder, 10x Founders VC',
    bio: "Felix Haas is a German entrepreneur, investor, and serial founder, having co-founded START Munich in 2003, the ticketing platform amiando, the identity verification company IDnow, and the startup venture firm 10x Founders VC. He has invested in over 50 tech startups, co-hosts Germany's leading founders' conference Bits & Pretzels, and is a founding partner of FLEX Capital, recognized for mentoring founders and driving innovation in the startup ecosystem.",
    photo: '/aboutUs/AdvBoard/Felix.png',
    objectPosition: 'center',
  },
  {
    name: 'Jean Paul Buján',
    role: 'Former Vice President',
    bio: null,
    photo: '/aboutUs/AdvBoard/JP-opt.png',
  },
  {
    name: 'Fabian Rieht',
    role: 'Former President',
    bio: null,
    photo: '/aboutUs/AdvBoard/Fabian-opt.png',
  },
];

type AdvisoryMember = (typeof advisoryBoard)[number];

function AdvisorDetail({ member, onClose }: { member: AdvisoryMember; onClose: () => void }) {
  return (
    <Card size="lg" className="flex-row items-start motion-safe:animate-fade-in-up">
      <div className="relative ml-(--card-spacing) hidden h-24 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-primary sm:block">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          sizes="80px"
          className="object-cover object-top"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 px-(--card-spacing) sm:pl-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Heading
              as="h3"
              size="h4"
              className="text-xl font-black tracking-tight uppercase lg:text-2xl"
            >
              {member.name}
            </Heading>
            <p className="text-sm font-semibold text-primary">{member.role}</p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
            <XIcon />
          </Button>
        </div>
        <Text variant="small" className="lg:text-base">
          {member.bio}
        </Text>
      </div>
    </Card>
  );
}

/** Thumbnail grid of advisors; selecting one with a bio expands it below. */
export function AdvisoryBoard() {
  const [selected, setSelected] = useState<number | null>(0);
  const detailRef = useRef<HTMLDivElement>(null);
  const member = selected !== null ? advisoryBoard[selected] : null;

  const select = (i: number) => {
    const next = selected === i ? null : i;
    setSelected(next);
    if (next !== null) {
      setTimeout(
        () => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }),
        100,
      );
    }
  };

  return (
    <Section spacing="none" className="pt-4 pb-20 md:pb-28">
      <Reveal>
        <SectionHeader
          align="end"
          eyebrow="Meet our Experts"
          title="The Advisory Board"
          size="h3"
          description="Our advisory board supports our long-term vision, connects us with key ecosystem players, and advises us on strategic decisions."
        />
      </Reveal>
      <div className="grid grid-cols-2 items-start justify-items-center gap-3 sm:grid-cols-5 lg:gap-4">
        {advisoryBoard.map((advisor, i) => (
          <Reveal key={advisor.name} delay={i * 75} className="w-full max-w-36 sm:max-w-none">
            <ProfileCard
              name={advisor.name}
              role={advisor.role}
              imageUrl={advisor.photo}
              imagePosition={'objectPosition' in advisor ? advisor.objectPosition : 'top'}
              size="sm"
              sizes="(max-width: 640px) 33vw, 15vw"
              selected={selected === i}
              onSelect={advisor.bio ? () => select(i) : undefined}
              className="items-start text-left"
            />
          </Reveal>
        ))}
      </div>
      <div ref={detailRef} className="mt-6 empty:mt-0">
        {member?.bio && (
          <AdvisorDetail key={selected} member={member} onClose={() => setSelected(null)} />
        )}
      </div>
    </Section>
  );
}
