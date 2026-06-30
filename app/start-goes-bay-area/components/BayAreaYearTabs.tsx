'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import { useInView } from '@/lib/hooks';
import { bayAreaYearContent } from '@/lib/startGoesBayAreaData';

import type { BayAreaYearId } from '../types';
import { getLogoChipClassName } from '../types';

interface Member {
  id: number;
  name: string;
  imageUrl: string;
  linkedinUrl?: string;
}

const KEY_VISITS_COPY = 'A few of the most memorable stops from the year.';
const HOSTS_COPY =
  'A curated look at the startups, teams, and organizations we visited across the Bay Area.';
const TEAM_COPY = 'The organizing team behind this Bay Area year.';
const TEAM_PLACEHOLDER_IMAGE = '/ourMembers/hero-opt.png';
const PAST_YEAR_CONTENT = bayAreaYearContent.filter((item) => !item.isPreview);

function TeamPortraitCard({
  name,
  imageUrl,
  linkedinUrl,
}: {
  name: string;
  imageUrl: string;
  linkedinUrl?: string;
}) {
  const [src, setSrc] = useState(imageUrl);
  // `imageUrl` resolves later (after the members API returns), so the initial
  // placeholder must be replaced when the real URL arrives via props.
  useEffect(() => {
    setSrc(imageUrl);
  }, [imageUrl]);
  const content = (
    <div className="group relative h-[18rem] w-[14rem] flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <Image
        src={src}
        alt={name}
        fill
        sizes="14rem"
        className="object-cover object-bottom transition-transform duration-500 group-hover:scale-105"
        onError={() => {
          if (!src.endsWith(TEAM_PLACEHOLDER_IMAGE)) {
            setSrc(TEAM_PLACEHOLDER_IMAGE);
          }
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue via-brand-dark-blue/45 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-xs font-black leading-tight text-white sm:text-sm">{name}</p>
      </div>

      {linkedinUrl ? (
        <div className="absolute bottom-6 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/15 backdrop-blur-md transition-colors group-hover:bg-brand-pink">
          <span className="text-base font-black text-white">in</span>
        </div>
      ) : null}
    </div>
  );

  if (!linkedinUrl) {
    return content;
  }

  return (
    <a
      href={linkedinUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name} LinkedIn profile`}
    >
      {content}
    </a>
  );
}

export default function BayAreaYearTabs() {
  const [activeYear, setActiveYear] = useState<BayAreaYearId>(
    (PAST_YEAR_CONTENT[PAST_YEAR_CONTENT.length - 1]?.id ?? '2026') as BayAreaYearId,
  );
  const [members, setMembers] = useState<Member[]>([]);
  const factsView = useInView(0.05);

  const activeContent = useMemo(
    () => PAST_YEAR_CONTENT.find((item) => item.id === activeYear) ?? PAST_YEAR_CONTENT[0],
    [activeYear],
  );

  // Fetch members on mount
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await fetch('/api/members');
        if (!response.ok) throw new Error('Failed to fetch members');
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
        setMembers([]);
      }
    };
    loadMembers();
  }, []);

  // Get team member data from API by matching names
  const getTeamMemberData = (name: string) => {
    return members.find((m) => m.name.toLowerCase() === name.toLowerCase());
  };

  return (
    <section ref={factsView.ref} className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div
        className={`transition-all duration-700 ${factsView.visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        <div className="flex flex-col gap-6 pt-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.35em] text-brand-pink">
              Past Programs
            </span>
            <h3 className="mt-3 text-4xl font-black leading-none text-white sm:text-5xl lg:text-6xl">
              Past Timetables
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">
              Browse previous editions of START Goes Bay Area. The content below belongs to the
              selected year.
            </p>
          </div>

          <div className="flex w-full rounded-2xl border border-white/10 bg-black/20 p-1 sm:w-auto">
            {PAST_YEAR_CONTENT.map((year) => {
              const isActive = year.id === activeYear;

              return (
                <button
                  key={year.id}
                  type="button"
                  onClick={() => setActiveYear(year.id)}
                  className={`flex-1 rounded-xl px-5 py-2.5 text-sm font-bold uppercase tracking-[0.18em] transition-colors sm:flex-none ${
                    isActive
                      ? 'bg-brand-pink text-white'
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                  aria-pressed={isActive}
                >
                  {year.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative mt-10 border-l-2 border-brand-pink/60 pl-5 sm:pl-8">
          <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-brand-pink bg-brand-dark-blue" />

          <div className="relative min-h-[22rem] overflow-hidden rounded-[1.25rem] border border-white/10">
            <Image
              src={activeContent.groupPictureUrl}
              alt={`START Goes Bay Area ${activeContent.label}`}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-brand-dark-blue/20" />
          </div>

          <section className="mt-12 pt-8">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-pink">
                  {activeContent.label}
                </p>
                <h4 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">
                  Key Visits
                </h4>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400">
                  {KEY_VISITS_COPY}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {activeContent.highlightVisits.map((highlight) => {
                const content = (
                  <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-brand-pink/35 hover:bg-white/[0.07]">
                    <div className="flex h-16 items-center justify-start rounded-xl bg-white/[0.04] px-3">
                      {/* Variable-aspect partner logos; fixed height with auto width. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={highlight.logoPath ?? '/startlogo.svg'}
                        alt={`${highlight.name} logo`}
                        className="h-10 w-auto max-w-[140px] object-contain"
                      />
                    </div>
                    <h5 className="mt-5 text-lg font-black text-white">{highlight.name}</h5>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                      {highlight.context}
                    </p>
                  </div>
                );

                return highlight.websiteUrl ? (
                  <a
                    key={`${activeContent.id}-${highlight.name}`}
                    href={highlight.websiteUrl}
                    target="_blank"
                    rel="noopener"
                    aria-label={`${highlight.name} website`}
                  >
                    {content}
                  </a>
                ) : (
                  <div key={`${activeContent.id}-${highlight.name}`}>{content}</div>
                );
              })}
            </div>
          </section>

          <section className="mt-12 pt-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-pink">
                {activeContent.label}
              </p>
              <h4 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">
                Hosts & Ecosystem
              </h4>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400">{HOSTS_COPY}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {activeContent.hosts.map((host) => {
                const content = (
                  <>
                    {host.logoPath ? (
                      <span
                        className={`flex h-10 min-w-20 items-center justify-center rounded-lg border px-3 ${getLogoChipClassName(host.logoTheme)}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={host.logoPath}
                          alt={`${host.name} logo`}
                          className="h-7 w-auto max-w-[96px] object-contain"
                        />
                      </span>
                    ) : null}
                    <span className="text-sm font-medium text-gray-100">{host.name}</span>
                  </>
                );

                return host.websiteUrl ? (
                  <a
                    key={`${activeContent.id}-${host.name}`}
                    href={host.websiteUrl}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex min-h-14 items-center gap-3 rounded-xl border border-white/10 bg-black/15 px-3 py-2 transition-colors hover:border-brand-pink/40 hover:bg-white/[0.07]"
                    aria-label={`${host.name} website`}
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    key={`${activeContent.id}-${host.name}`}
                    className="inline-flex min-h-14 items-center gap-3 rounded-xl border border-white/10 bg-black/15 px-3 py-2"
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-12 pt-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-pink">
              {activeContent.label}
            </p>
            <h4 className="mt-2 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
              Meet The Team:
            </h4>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-sm leading-relaxed text-gray-400">{TEAM_COPY}</p>
              {activeContent.teamMembers.length > 0 ? (
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-pink">
                  <span>Scroll</span>
                  <span aria-hidden="true" className="text-lg leading-none">
                    →
                  </span>
                </div>
              ) : null}
            </div>

            {activeContent.teamMembers.length > 0 ? (
              <div className="relative -mx-5 mt-8 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8">
                <div className="pointer-events-none absolute bottom-2 right-0 top-0 z-10 w-16 bg-gradient-to-l from-brand-dark-blue to-transparent" />
                <div className="flex gap-7">
                  {activeContent.teamMembers.map((member) => {
                    const memberData = getTeamMemberData(member.name);

                    return (
                      <TeamPortraitCard
                        key={`${activeContent.id}-${member.name}`}
                        name={member.name}
                        imageUrl={
                          member.photoPath || memberData?.imageUrl || TEAM_PLACEHOLDER_IMAGE
                        }
                        linkedinUrl={member.linkedinUrl ?? memberData?.linkedinUrl}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-gray-200">Team announcement coming soon.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
