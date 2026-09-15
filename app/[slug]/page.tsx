import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableText } from 'next-sanity';

import { client } from '@/sanity/client';

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  category,
  description,
  publishedAt,
  "slug": slug.current,
  image,
  body,
  "author": author->{ name, linkedin, image }
}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset ? createImageUrlBuilder({ projectId, dataset }).image(source) : null;

const options = { next: { revalidate: 30 } };

const CATEGORY_LABELS: Record<string, string> = {
  news: 'News',
  memberStory: 'Member Story',
  blogPost: 'Blog Post',
  other: 'Other',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch<{
    title?: string;
    description?: string;
    slug?: string;
    image?: SanityImageSource;
  }>(POST_QUERY, { slug }, options);

  if (!post) {
    return {
      title: 'Post',
      description: 'A blog post by START Munich.',
    };
  }

  const url = `https://www.startmunich.de/${post.slug ?? slug}`;
  const postImage = post.image ? urlFor(post.image)?.width(1200).height(630).url() : undefined;
  const description = post.description || `Read "${post.title}" on the START Munich blog.`;

  return {
    title: post.title ?? 'Post',
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: post.title ?? 'Post',
      description,
      images: postImage ? [{ url: postImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title ?? 'Post',
      description,
      images: postImage ? [postImage] : undefined,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await client.fetch<{
    _id: string;
    title: string;
    category?: string;
    description?: string;
    publishedAt: string;
    slug: string;
    image?: SanityImageSource;
    body?: unknown;
    author?: {
      name?: string;
      linkedin?: string;
      image?: SanityImageSource;
    } | null;
  }>(POST_QUERY, { slug }, options);

  if (!post) {
    notFound();
  }

  const postImage = post.image
    ? urlFor(post.image)?.width(1200).height(675).fit('crop').crop('focalpoint')
    : null;
  const authorImage = post.author?.image
    ? urlFor(post.author.image)?.width(160).height(160).fit('crop').crop('focalpoint')
    : null;
  const categoryLabel = post.category ? (CATEGORY_LABELS[post.category] ?? post.category) : null;

  const authorContent = (
    <div className="flex items-center gap-4">
      {authorImage && (
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-brand-pink/50">
          <Image
            src={authorImage.url()}
            alt={post.author?.name ?? 'Author'}
            className="object-cover"
            fill
            sizes="64px"
          />
        </div>
      )}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-pink">Author</p>
        <p className="mt-1 font-black uppercase tracking-tight text-white">
          {post.author?.name ?? 'START Munich'}
        </p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-brand-dark-blue text-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-brand-pink"
        >
          <span aria-hidden>←</span>
          Back to posts
        </Link>

        <div className="mt-10">
          {categoryLabel && (
            <span className="inline-block rounded-full border border-brand-pink/30 bg-brand-pink/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-pink">
              {categoryLabel}
            </span>
          )}

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-brand-pink">
            Published: {new Date(post.publishedAt).toLocaleDateString()}
          </p>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          {post.description && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
              {post.description}
            </p>
          )}
        </div>

        {postImage && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={postImage.url()}
              alt={post.title}
              className="aspect-video w-full object-cover"
              width="1200"
              height="675"
              priority
            />
          </div>
        )}

        {post.author && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20 hover:bg-white/5">
            {post.author.linkedin ? (
              <a
                href={post.author.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4"
              >
                {authorContent}
                <span className="flex-shrink-0 text-xs font-bold uppercase tracking-widest text-brand-pink transition-colors hover:text-white">
                  LinkedIn
                </span>
              </a>
            ) : (
              authorContent
            )}
          </div>
        )}

        <div className="prose prose-invert mt-10">
          {Array.isArray(post.body) && <PortableText value={post.body} />}
        </div>
      </div>
    </main>
  );
}
