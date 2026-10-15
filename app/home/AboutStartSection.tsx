import Image from 'next/image';

import { StatCard } from '@/components/site/stat';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { Heading, Text } from '@/components/ui/typography';

const stats = [
  { label: 'Active Members', value: 70, suffix: '+' },
  { label: 'Founding Year', value: 2003 },
  { label: 'Alumni', value: 600, suffix: '+' },
  { label: 'STEM', value: 65, suffix: '%' },
];

/** "What is START Munich" — group photo, intro copy and the headline numbers. */
export function AboutStartSection() {
  return (
    <Section spacing="lg">
      <div className="relative mb-16 h-[300px] overflow-hidden rounded-3xl sm:h-[400px] lg:h-[500px]">
        <Image
          src="/home/Landing_Team_1-opt.jpeg"
          alt="START Munich Community"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1280px"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />
      </div>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col gap-4">
          <Heading size="h2" className="mb-2">
            What is <span className="text-outline">START Munich</span>
          </Heading>
          <Text>
            With over 70 active members and 600+ alumni, START Munich is one of Germany’s leading
            student-run entrepreneurship initiatives. Founded in 2003, our mission is to build{' '}
            <strong className="font-semibold text-foreground">
              a community of students who dare to build, innovate, and lead.
            </strong>
          </Text>
          <Text>
            At START Munich,{' '}
            <strong className="font-semibold text-foreground">
              aspiring and active entrepreneurs come together
            </strong>{' '}
            to connect, collaborate, and grow. Together with our talented members, we host events
            such as pitch nights and founder talks, connect with industry partners and investors, or
            run hands-on programs that bridge academia with entrepreneurship.
          </Text>
          <div className="mt-6 flex flex-wrap gap-4">
            <ButtonLink href="/about-us" size="lg">
              About Us
            </ButtonLink>
            <ButtonLink href="/events" size="lg">
              See our Events
            </ButtonLink>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Card interactive className="items-center gap-3">
            <div className="flex items-center justify-center gap-8">
              <Image
                src="/forPartners/Logo_of_the_Technical_University_of_Munich.svg"
                alt="TUM"
                width={120}
                height={40}
                className="h-10 w-auto opacity-80"
                unoptimized
              />
              <span className="text-2xl font-normal text-foreground/30">×</span>
              <Image
                src="/home/LMU_Muenchen_Logo.svg"
                alt="LMU"
                width={120}
                height={40}
                className="h-10 w-auto opacity-80"
                unoptimized
              />
            </div>
            <Text variant="label">Academic Excellence</Text>
          </Card>
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
