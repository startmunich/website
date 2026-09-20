import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import type { Metadata } from 'next';

import type { TestimonialItem } from '@/components/TestimonialsSection';
import { OG_IMAGES } from '@/lib/metadata';
import { client } from '@/sanity/client';

import MemberJourneyContent from './MemberJourneyContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Member Journey',
  description:
    "Discover the START Munich member journey — how you grow from applicant to founder within Europe's most vibrant student entrepreneurship community.",
  alternates: { canonical: 'https://www.startmunich.de/member-journey' },
  openGraph: {
    url: 'https://www.startmunich.de/member-journey',
    title: 'Member Journey | START Munich',
    description:
      "Discover the START Munich member journey — how you grow from applicant to founder within Europe's most vibrant student entrepreneurship community.",
    images: OG_IMAGES,
  },
};

const MEMBER_STORIES_QUERY = `*[_type == "memberStory"] | order(order asc){
  _id,
  name,
  role,
  company,
  quote,
  "slug": slug.current,
  image,
  logos[]{
    src,
    url
  }
}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset ? createImageUrlBuilder({ projectId, dataset }).image(source) : null;

const options = { next: { revalidate: 30 } };

export default async function MemberJourneyPage() {
  const stories = await client.fetch<Array<Record<string, unknown>>>(
    MEMBER_STORIES_QUERY,
    {},
    options,
  );

  const memberStories: TestimonialItem[] = (stories ?? []).map((story) => {
    const image = story.image as SanityImageSource | undefined;
    const logos = Array.isArray(story.logos)
      ? (story.logos as { src: string; url?: string }[])
      : [];
    return {
      id: String(story._id ?? ''),
      name: String(story.name ?? ''),
      role: String(story.role ?? ''),
      company: String(story.company ?? ''),
      image: image
        ? (urlFor(image)?.width(900).height(600).fit('crop').crop('focalpoint').url() ??
          '/internalevents-opt.png')
        : '/internalevents-opt.png',
      story: String(story.quote ?? ''),
      href: `/member-journey/${String(story.slug ?? '')}`,
      logos: logos.map((logo) => ({ src: logo.src, url: logo.url })),
    };
  });

  return <MemberJourneyContent memberStories={memberStories} />;
}
