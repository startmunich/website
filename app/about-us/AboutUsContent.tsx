import { EyeIcon, ZapIcon } from 'lucide-react';
import Image from 'next/image';

import { CtaBanner } from '@/components/site/cta-banner';
import { PageHero } from '@/components/site/page-hero';
import { ProfileCard } from '@/components/site/profile-card';
import { HeroStat, HeroStats } from '@/components/site/stat';
import { Card } from '@/components/ui/card';
import { IconTile } from '@/components/ui/icon-tile';
import { Reveal } from '@/components/ui/reveal';
import { Container, Section, SectionHeader } from '@/components/ui/section';
import { Separator } from '@/components/ui/separator';
import { Eyebrow, Heading, Text } from '@/components/ui/typography';
import { siteLinks } from '@/lib/site';
import { cn } from '@/lib/utils';

import { AdvisoryBoard } from './AdvisoryBoard';

const executiveBoard = [
  {
    name: 'Niklas Drössler',
    role: 'President',
    photo: '/aboutUs/Board/Niklas-opt.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/niklasdroessler/',
  },
  {
    name: 'Eva Feische',
    role: 'Vice President',
    photo: '/aboutUs/Board/Eva-opt.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/eva-feische-040038251/',
  },
  {
    name: 'Moritz Gubitzer',
    role: 'CFO',
    photo: '/aboutUs/Board/Moritz-opt.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/moritz-gubitzer/',
  },
];

const departmentBoard = [
  {
    name: 'Carolin Gerber',
    role: 'MD Events',
    photo: '/aboutUs/Board/Carolin-opt.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/carolin-gerber-798608252/',
  },
  {
    name: 'Valentin Ahrend',
    role: 'MD Marketing',
    photo: '/aboutUs/Board/Valentin-opt.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/valentin-ahrend-583983311/',
  },
  {
    name: 'Rafael Edmaier',
    role: 'MD People',
    photo: '/aboutUs/Board/Rafael-opt.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/rafael-edmaier/',
  },
  {
    name: 'Mete Reis Kizildag',
    role: 'MD Technology & Operations',
    photo: '/aboutUs/Board/Mete-opt.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/mrkizildag/',
  },
  {
    name: 'Younus Mühlenweg',
    role: 'MD Partnerships',
    photo: '/aboutUs/Board/Younus-opt.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/younus-wm/',
  },
];

const missionPartners = [
  {
    name: 'MTZ',
    description:
      'The Münchner Technologiezentrum provides office space, business coaching, and networking for young tech companies near Olympic Park — helping startups grow from first idea to market.',
    logo: 'https://mtz.de/wp-content/uploads/2021/10/White-1.svg',
    image: '/aboutUs/missionPartner/mtz-opt.jpg',
  },
  {
    name: 'Munich Startup',
    description:
      "Munich's official startup portal connecting founders with resources, investors, and the local ecosystem — mapping the city's innovation landscape and amplifying its startup scene.",
    // Vendored locally: the previous `munich-startup.de/wp-content/.../logo-w.svg`
    // hotlink 404s. It is an opaque white-background raster, so it needs a light tile.
    logo: '/aboutUs/missionPartner/munich-startup-logo.png',
    logoOnLightTile: true,
    image: '/aboutUs/missionPartner/MunichStartup.png',
  },
  {
    name: 'CDTM and Manage & More',
    descriptionParts: [
      {
        text: 'CDTM and Manage & More share our mission in empowering the next generation of founders in Munich. ',
      },
      {
        text: 'However START Munich and CDTM / M&M differ. We are a community that encourages learning by doing, while they are educational programs that provide structured curriculum. ',
        pink: true,
      },
      {
        text: 'Some of our members also join CDTM or M&M, but handling the intensive time commitment for both is challenging.',
      },
    ],
    image: '/aboutUs/missionPartner/CDTM.png',
    image2: '/aboutUs/missionPartner/mandm.jpeg',
  },
];

function LogoBadge({ src, alt, light = false }: { src?: string; alt: string; light?: boolean }) {
  return (
    <div
      className={cn(
        'flex size-12 shrink-0 items-center justify-center rounded-xl border border-border',
        light ? 'bg-white' : 'bg-card',
      )}
    >
      {src ? (
        <Image src={src} alt={alt} width={28} height={28} className="object-contain" />
      ) : (
        <span className="text-xs font-bold text-muted-foreground uppercase">{alt.charAt(0)}</span>
      )}
    </div>
  );
}

export default function AboutUsContent() {
  return (
    <>
      <PageHero
        image="/aboutUs/hero-opt.jpg"
        title="Who we"
        outlineTitle="are"
        description="A student-led community at the heart of Munich's startup scene — turning bold ideas into real ventures since 2003."
        aside={
          <HeroStats>
            <HeroStat label="Years Active" value={20} animate suffix="+" />
            <HeroStat label="Members" value={600} animate suffix="+" />
          </HeroStats>
        }
      />

      {/* Vision & mission */}
      <Section spacing="lg" className="pb-16 md:pb-16">
        <Reveal>
          <SectionHeader
            eyebrow="Our Purpose"
            title={
              <>
                Vision
                <br />
                &amp; Mission
              </>
            }
          />
        </Reveal>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal delay={150}>
            <Card variant="highlight" size="lg" className="h-full">
              <div className="flex flex-col gap-10 px-(--card-spacing)">
                <div className="flex items-center gap-3">
                  <IconTile>
                    <ZapIcon />
                  </IconTile>
                  <Eyebrow render={<span />}>Mission</Eyebrow>
                </div>
                <Heading as="h3" size="h3" className="leading-[1.05] xl:text-5xl">
                  Empowering
                  <br />
                  founders of
                  <br />
                  <span className="text-primary">tomorrow.</span>
                </Heading>
                <Text className="max-w-md">
                  A self-driven community where learning happens by doing — and every member gets
                  what is needed to build things that truly matters.
                </Text>
              </div>
            </Card>
          </Reveal>
          <Reveal delay={300}>
            <Card size="lg" className="h-full">
              <div className="flex flex-col gap-10 px-(--card-spacing)">
                <div className="flex items-center gap-3">
                  <IconTile variant="neutral">
                    <EyeIcon />
                  </IconTile>
                  <Eyebrow render={<span />} className="text-muted-foreground">
                    Vision
                  </Eyebrow>
                </div>
                <Heading as="h3" size="h3" className="leading-[1.05] xl:text-5xl">
                  Being the launchpad for <span className="text-foreground/30">innovation</span>
                </Heading>
                <Text className="max-w-md">
                  We envision START as <i>the</i> place for ambitious students in Munich, where
                  ideas are turned into real innovations.
                </Text>
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* Mission partners */}
      <Section spacing="none" className="pb-16">
        <Reveal className="mb-10 flex flex-col gap-2">
          <Eyebrow>Mission Partners</Eyebrow>
          <Text>
            Organisations who share our mission and support us in building Munich&apos;s next
            generation of founders.
          </Text>
        </Reveal>
        <Reveal delay={200} className="flex flex-col gap-6">
          {missionPartners.map((partner) => (
            <Card key={partner.name} className="flex-col py-0 md:flex-row">
              <div
                className={cn(
                  'relative h-48 shrink-0 overflow-hidden md:w-72 lg:w-80',
                  partner.image2 && 'md:h-auto',
                )}
              >
                {partner.image2 ? (
                  <div className="flex h-full gap-1 bg-background">
                    {[partner.image, partner.image2].map((src) => (
                      <Image
                        key={src}
                        src={src}
                        alt={partner.name}
                        width={200}
                        height={150}
                        className="h-full w-1/2 bg-white object-contain p-3"
                      />
                    ))}
                  </div>
                ) : (
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col justify-center gap-4 p-8 lg:p-10">
                <div className="flex items-center gap-4">
                  {partner.image2 ? (
                    <>
                      <LogoBadge src={partner.image} alt="CDTM" />
                      <LogoBadge src={partner.image2} alt="Manage and More" />
                    </>
                  ) : (
                    <LogoBadge
                      src={partner.logo}
                      alt={partner.name}
                      light={partner.logoOnLightTile}
                    />
                  )}
                  <Heading as="h3" size="h4" className="font-black tracking-wide uppercase">
                    {partner.name}
                  </Heading>
                </div>
                <Text variant="small">
                  {'descriptionParts' in partner
                    ? partner.descriptionParts?.map((part, i) => (
                        <span key={i} className={part.pink ? 'text-primary' : undefined}>
                          {part.text}
                        </span>
                      ))
                    : partner.description}
                </Text>
              </div>
            </Card>
          ))}
        </Reveal>
      </Section>

      <Container>
        <Separator className="bg-linear-to-r from-transparent via-border to-transparent" />
      </Container>

      {/* Executive board */}
      <Section spacing="lg" className="pb-4 md:pb-4">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 size-[500px] rounded-full bg-primary/5 blur-[160px]"
        />
        <Reveal className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          <SectionHeader
            eyebrow="Meet the Team"
            className="mb-0 md:mb-0"
            title={
              <>
                The
                <br />
                Executive
                <br />
                Board
              </>
            }
          />
          <div className="grid grid-cols-2 justify-items-center gap-8 sm:grid-cols-3">
            {executiveBoard.map((member, i) => (
              <Reveal key={member.name} delay={200 + i * 100}>
                <ProfileCard
                  name={member.name}
                  role={member.role}
                  imageUrl={member.photo}
                  linkedinUrl={member.linkedinUrl}
                  size="lg"
                />
              </Reveal>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Department board */}
      <Section spacing="none" className="pt-4 pb-20 md:pb-28">
        <Reveal>
          <Card size="lg">
            <div className="px-(--card-spacing)">
              <div className="mb-8 flex items-center gap-3">
                <span className="h-px w-6 bg-primary" />
                <Eyebrow render={<span />}>The Department Board</Eyebrow>
              </div>
              <div className="grid grid-cols-2 justify-items-center gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
                {departmentBoard.map((member, i) => (
                  <Reveal key={member.name} delay={200 + i * 100}>
                    <ProfileCard
                      name={member.name}
                      role={member.role}
                      imageUrl={member.photo}
                      linkedinUrl={member.linkedinUrl}
                      sizes="(max-width: 640px) 144px, 176px"
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          </Card>
        </Reveal>
      </Section>

      <AdvisoryBoard />

      <Section spacing="none" className="pb-20 md:pb-28">
        <CtaBanner
          title="Want to Learn More About Us?"
          description="Discover how you can grow with START Munich — whether as a member shaping your entrepreneurial journey or as a partner connecting with Munich's most ambitious talents."
          actions={[
            { label: 'Our Member Journey', href: '/member-journey', variant: 'soft' },
            { label: 'Contact Us', href: siteLinks.contact, variant: 'soft' },
            { label: 'Become a Partner', href: '/for-partners', variant: 'soft' },
          ]}
        />
      </Section>
    </>
  );
}
