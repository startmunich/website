import { ArrowRightIcon, MailIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { BrandPanel } from '@/components/site/cta-banner';
import { EmbedHeightReporter } from '@/components/site/embed-height-reporter';
import { Faq } from '@/components/site/faq';
import { FeatureCard } from '@/components/site/feature-card';
import { LogoImage, LogoTile } from '@/components/site/logo-image';
import { PageHero } from '@/components/site/page-hero';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Marquee } from '@/components/ui/marquee';
import { Container, Section, SectionHeader } from '@/components/ui/section';
import { Eyebrow, Heading, Text } from '@/components/ui/typography';
import { OG_IMAGES } from '@/lib/metadata';
import { getAllPartners } from '@/lib/sanityContent';

import PartnerCTAButton from './PartnerCTAButton';
import PhotoGallery from './PhotoGallery';

const CONTACT_URL = 'https://tally.so/r/3xpGQG';

export const metadata: Metadata = {
  title: 'Partner With Us',
  description:
    "Partner with START Munich to reach top talent from TUM, LMU, and HM. Sponsor events, host workshops, and recruit Munich's most ambitious student entrepreneurs.",
  alternates: { canonical: 'https://www.startmunich.de/for-partners' },
  openGraph: {
    url: 'https://www.startmunich.de/for-partners',
    title: 'Partner With Us | START Munich',
    description:
      "Partner with START Munich to reach top talent from TUM, LMU, and HM. Sponsor events, host workshops, and recruit Munich's most ambitious student entrepreneurs.",
    images: OG_IMAGES,
  },
};

export const revalidate = 3600;

const faqs = [
  {
    id: 'faq1',
    question: 'How long is the timeline to collaboration?',
    answer: (
      <>
        We can move fast and sometimes launch within days. Please check our event{' '}
        <Link href="/events">calendar</Link> first. If you want to join a specific event, contact us
        as early as possible so we can plan it with you.
      </>
    ),
  },
  {
    id: 'faq2',
    question: 'How can we recruit START members?',
    answer:
      'Partners get exclusive access to our talent pool through dedicated recruiting events, curated CV database access of consenting community members and event attendees, and priority placement on our job board. You can also host office tours and info sessions.',
  },
  {
    id: 'faq3',
    question: 'What events can partners sponsor?',
    answer:
      "Partners can sponsor flagship formats like Road to START Summit, START Sprint, workshops, networking nights, and more. Reach out and we'll find or build the right format together.",
  },
  {
    id: 'faq4',
    question: 'What is the partnership duration?',
    answer:
      'Depending on your goals, partnerships can be event-specific or long-term, for example for one semester or a full year.',
  },
  {
    id: 'faq5',
    question: 'How do we get started?',
    answer:
      "Send us a message anytime. We'll quickly set up a short intro call to understand your goals and propose the best next steps.",
  },
];

const partnershipOpportunities = [
  {
    icon: '🎤',
    title: 'Event Sponsorship',
    description:
      'Sponsor flagship events like our Annual Pitch Competition, Hackathons, and domain specific networking events to gain visibility among thousands of participants.',
  },
  {
    icon: '🎯',
    title: 'Recruit Top Talent',
    description:
      'Get direct access to our highly motivated member base through personal engagement, CV databases, and exclusive hiring opportunities.',
  },
  {
    icon: '🧑‍🏫',
    title: 'Host Workshops',
    description:
      'Share your expertise by hosting workshops, masterclasses, or talks on topics relevant to your industry and our founders.',
  },
  {
    icon: '💼',
    title: 'Company Visits',
    description:
      'Invite our members to your offices for tours, info sessions, and networking to build relationships with potential future employees and partners.',
  },
  {
    icon: '🏆',
    title: 'Pitch Competitions',
    description:
      'Judge our competitions, offer prizes, and be a thought leader to access to innovative startups seeking funding and partnerships.',
  },
  {
    icon: '🤝',
    title: 'Co-Innovation Projects',
    description:
      'Collaborate on innovation challenges, hackathons, or research projects that benefit both your organization and our members.',
  },
];

const whyStartSpecial = [
  {
    icon: '🎓',
    title: 'Academic Excellence',
    description:
      "Direct access to Munich's top universities. Our network spans TUM, LMU, HM and many more, connecting your organization with outstanding talent across engineering, business, research, and applied sciences.",
  },
  {
    icon: '🧠',
    title: 'Thought Leadership',
    description:
      'Share your expertise through workshops, talks, panels, and hands-on formats. START gives your team a credible stage in front of ambitious students, builders, and future founders.',
  },
  {
    icon: '📣',
    title: 'Branding',
    description:
      'Build sustained visibility across our flagship events, communication channels, and partner activations. We help your brand show up in a context that feels relevant and high-signal.',
  },
  {
    icon: '🤝',
    title: 'Partner Network',
    description:
      'Become part of a strong Munich ecosystem of partners, founders, and student operators. The value goes beyond single events and creates long-term relationships across the network.',
  },
];

const universityLogos = [
  {
    src: '/forPartners/Logo_of_the_Technical_University_of_Munich.svg',
    alt: 'TUM Logo',
    unoptimized: true,
  },
  { src: '/forPartners/LMU_Muenchen_Logo.svg.png', alt: 'LMU Logo' },
  { src: '/forPartners/HM_Logo.png', alt: 'HM Logo' },
];

function ContactCard() {
  return (
    <Card variant="glass" size="lg" className="items-center text-center lg:w-80">
      <div className="flex w-full flex-col items-center gap-1 px-(--card-spacing)">
        <div className="relative mb-3 size-40 overflow-hidden rounded-full border-2 border-foreground/20">
          <Image
            src="/forPartners/md-partnerships-younus.jpg"
            alt="MD Partnerships"
            fill
            sizes="160px"
            className="object-cover"
          />
        </div>
        <h3 className="text-lg font-bold">Younus M&uuml;hlenweg</h3>
        <p className="mb-4 text-sm font-semibold text-primary">Head of Partnerships</p>
        <PartnerCTAButton href={CONTACT_URL} size="lg" shape="pill" className="group/btn w-full">
          <MailIcon className="size-5 transition-transform group-hover/btn:scale-110" />
          Get in Touch
        </PartnerCTAButton>
      </div>
    </Card>
  );
}

export default async function ForPartnersPage() {
  const partners = await getAllPartners();

  // Plain-text FAQ answers for JSON-LD (faq1 has JSX, so we provide a text fallback)
  const faqPlainText: Record<string, string> = {
    faq1: 'We can move fast and sometimes launch within days. Please check our event calendar first. If you want to join a specific event, contact us as early as possible so we can plan it with you.',
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: typeof faq.answer === 'string' ? faq.answer : (faqPlainText[faq.id] ?? ''),
      },
    })),
  };

  const featuredPartners = partners.filter((p) => p.featured);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <EmbedHeightReporter />

      <PageHero
        image="/forPartners/hero-opt.jpg"
        title="For"
        outlineTitle="Partners"
        description="Partner with Europe's leading student entrepreneurship community and shape the future of innovation"
        aside={<ContactCard />}
      />

      <Section spacing="sm" container={false} className="pt-16 pb-6 lg:py-20">
        <Container>
          <SectionHeader
            eyebrow="Partners & Collaborators"
            title={
              <>
                Who we <span className="text-outline">work</span> with
              </>
            }
            description="Trusted by leading companies and organizations"
            actions={
              <ButtonLink
                href="/partners"
                variant="soft"
                shape="pill"
                className="hidden md:inline-flex"
              >
                View All Partners <ArrowRightIcon />
              </ButtonLink>
            }
          />
          {featuredPartners.length > 0 && (
            <Marquee>
              {featuredPartners.map((partner) => (
                <LogoTile key={partner.id} className="mx-6 hover:scale-100">
                  <LogoImage
                    src={partner.logoUrl}
                    name={partner.name}
                    sizes="144px"
                    className="size-full"
                  />
                </LogoTile>
              ))}
            </Marquee>
          )}
          <div className="mt-10 text-center md:hidden">
            <Link
              href="/partners"
              className="group inline-flex items-center gap-2 font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              View all our partners
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Container>
      </Section>

      <Section
        spacing="sm"
        className="lg:py-20"
        containerClassName="flex flex-col gap-24 md:gap-32"
      >
        <section>
          <SectionHeader
            eyebrow="Why START"
            title={
              <>
                Why partner <span className="text-outline">with START</span>
              </>
            }
            description="A practical partnership model built around academic excellence, thought leadership, branding, and strong network effects in Munich."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FeatureCard
              variant="highlight"
              className="motion-safe:animate-fade-in-up md:row-span-2"
              title={whyStartSpecial[0].title}
              description={whyStartSpecial[0].description}
            >
              <div className="mb-2 flex flex-wrap gap-3">
                {universityLogos.map((logo) => (
                  <div
                    key={logo.src}
                    className="flex h-16 w-full max-w-40 items-center justify-center rounded-2xl bg-white p-3 shadow-md"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={134}
                      height={40}
                      className="max-h-full max-w-full object-contain"
                      unoptimized={logo.unoptimized}
                    />
                  </div>
                ))}
              </div>
            </FeatureCard>
            {whyStartSpecial.slice(1, 3).map((reason) => (
              <FeatureCard
                key={reason.title}
                icon={reason.icon}
                title={reason.title}
                description={reason.description}
              />
            ))}
            <FeatureCard
              className="md:col-span-2"
              layout="row"
              icon={whyStartSpecial[3].icon}
              title={whyStartSpecial[3].title}
              description={whyStartSpecial[3].description}
            />
          </div>
        </section>

        <section>
          <SectionHeader
            eyebrow="Collaborate"
            title={
              <>
                What <span className="text-outline">partners can do</span> with us
              </>
            }
            description="Multiple ways to engage with our entrepreneurial community"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <FeatureCard
              variant="highlight"
              size="lg"
              className="min-h-[400px] md:row-span-2"
              icon={partnershipOpportunities[0].icon}
              title={partnershipOpportunities[0].title}
              description={partnershipOpportunities[0].description}
            />
            <FeatureCard
              className="md:col-span-2"
              layout="row"
              icon={partnershipOpportunities[1].icon}
              title={partnershipOpportunities[1].title}
              description={partnershipOpportunities[1].description}
            />
            {partnershipOpportunities.slice(2, 4).map((opportunity) => (
              <FeatureCard
                key={opportunity.title}
                className="min-h-[200px]"
                icon={opportunity.icon}
                title={opportunity.title}
                description={opportunity.description}
              />
            ))}
          </div>
        </section>

        <PhotoGallery />

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-16">
          <SectionHeader
            className="lg:col-span-2"
            eyebrow="Have Questions?"
            title={
              <>
                Frequently asked <span className="text-outline">questions</span>
              </>
            }
            description="Everything you need to know about partnering with START"
          />
          <Faq items={faqs} className="lg:col-span-3" />
        </section>

        <BrandPanel id="get-in-touch" className="rounded-4xl md:p-10">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
            <Eyebrow>Let&apos;s Connect</Eyebrow>
            <Heading as="h3" size="h2" className="md:text-5xl">
              Ready to <span className="text-outline">partner?</span>
            </Heading>
            <Text variant="lead">
              Join our network of leading companies and get in touch with ambitious students from
              TUM, LMU, and other Munich universities.
            </Text>
            <PartnerCTAButton href={CONTACT_URL} size="lg" shape="pill" className="mt-3">
              Get in Touch
            </PartnerCTAButton>
          </div>
        </BrandPanel>
      </Section>
    </>
  );
}
