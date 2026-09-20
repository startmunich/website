import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableText } from 'next-sanity';

import { client } from '@/sanity/client';

const STORY_QUERY = `*[_type == "memberStory" && slug.current == $slug][0]{
  _id,
  name,
  role,
  company,
  quote,
  "slug": slug.current,
  image,
  portrait,
  logos[]{
    src,
    url
  },
  linkedin,
  body,
  publishedAt,
  "more": *[_type == "memberStory" && slug.current != $slug] | order(order asc)[0..2]{
    _id,
    name,
    role,
    company,
    quote,
    "slug": slug.current,
    image
  }
}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset ? createImageUrlBuilder({ projectId, dataset }).image(source) : null;

const options = { next: { revalidate: 30 } };

interface Story {
  _id: string;
  name?: string;
  role?: string;
  company?: string;
  quote?: string;
  slug?: string;
  image?: SanityImageSource;
  portrait?: SanityImageSource;
  logos?: { src: string; url?: string }[];
  linkedin?: string;
  body?: unknown;
  publishedAt?: string;
  more?: Array<{
    _id: string;
    name?: string;
    role?: string;
    company?: string;
    quote?: string;
    slug?: string;
    image?: SanityImageSource;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await client.fetch<Story>(STORY_QUERY, { slug }, options);

  if (!story) {
    return {
      title: 'Member Story',
      description: 'A member story by START Munich.',
    };
  }

  const url = `https://www.startmunich.de/member-journey/${story.slug ?? slug}`;
  const storyImage = story.image ? urlFor(story.image)?.width(1200).height(630).url() : undefined;
  const description =
    story.quote || `Read ${story.name}'s story on the START Munich member journey.`;

  return {
    title: story.name ?? 'Member Story',
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: `${story.name} | Member Journey | START Munich`,
      description,
      images: storyImage ? [{ url: storyImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: story.name ?? 'Member Story',
      description,
      images: storyImage ? [storyImage] : undefined,
    },
  };
}

export default async function MemberStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await client.fetch<Story>(STORY_QUERY, { slug }, options);

  if (!story) {
    notFound();
  }

  const coverImage = story.image
    ? urlFor(story.image)?.width(1200).height(675).fit('crop').crop('focalpoint')
    : null;
  const portraitImage = story.portrait
    ? urlFor(story.portrait)?.width(480).height(480).fit('crop').crop('focalpoint')
    : null;

  return (
    <main className="min-h-screen bg-brand-dark-blue text-white">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/member-journey"
          className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-brand-pink"
        >
          <span aria-hidden>←</span>
          All member stories
        </Link>

        {/* Header */}
        <header className="mt-10 flex flex-col items-start gap-8 md:flex-row md:items-center">
          {portraitImage && (
            <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-3xl border-2 border-brand-pink/50 md:h-48 md:w-48">
              <Image
                src={portraitImage.url()}
                alt={story.name ?? 'Member'}
                className="object-cover"
                fill
                sizes="192px"
                priority
              />
            </div>
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-pink">
              Member Story
            </p>
            <h1 className="mt-3 text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">
              {story.name}
            </h1>
            <p className="mt-3 text-lg font-bold text-brand-pink">{story.role}</p>
            {story.company && <p className="mt-1 text-sm text-gray-400">{story.company}</p>}
            {story.linkedin && (
              <a
                href={story.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/80 transition-colors hover:border-brand-pink/40 hover:text-brand-pink"
              >
                LinkedIn
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>
        </header>

        {/* Cover image */}
        {coverImage && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={coverImage.url()}
              alt={story.name ?? 'Member story'}
              className="aspect-video w-full object-cover"
              width="1200"
              height="675"
            />
          </div>
        )}

        {/* Quote */}
        {story.quote && (
          <blockquote className="mt-10 border-l-2 border-brand-pink py-2 pl-6">
            <p className="text-2xl font-bold leading-snug text-white sm:text-3xl">
              &ldquo;{story.quote}&rdquo;
            </p>
          </blockquote>
        )}

        {/* Body */}
        <div className="prose prose-invert mt-10 max-w-none">
          {Array.isArray(story.body) && <PortableText value={story.body} />}
        </div>

        {/* More stories */}
        {Array.isArray(story.more) && story.more.length > 0 && (
          <section className="mt-20 border-t border-white/10 pt-12">
            <span className="mb-1 block text-sm font-bold uppercase tracking-[0.2em] text-brand-pink">
              Keep Reading
            </span>
            <h2 className="text-2xl font-black text-white md:text-3xl">
              MORE <span className="outline-text">STORIES</span>
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {story.more.map((item) => {
                const itemImage = item.image
                  ? urlFor(item.image)?.width(600).height(400).fit('crop').crop('focalpoint')
                  : null;
                return (
                  <Link
                    key={item._id}
                    href={`/member-journey/${item.slug ?? ''}`}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] transition-all duration-300 hover:-translate-y-1 hover:border-brand-pink/30"
                  >
                    {itemImage && (
                      <div className="relative h-36 w-full overflow-hidden">
                        <Image
                          src={itemImage.url()}
                          alt={item.name ?? 'Member'}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-base font-bold text-white transition-colors group-hover:text-brand-pink">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-brand-pink">{item.role}</p>
                      <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-brand-pink">
                        Read their story
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
