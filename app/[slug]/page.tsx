import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText, type SanityDocument } from 'next-sanity';

import { client } from '@/sanity/client';

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset ? createImageUrlBuilder({ projectId, dataset }).image(source) : null;

const options = { next: { revalidate: 30 } };

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await client.fetch<SanityDocument>(POST_QUERY, await params, options);
  const postImage = post.image ? urlFor(post.image)?.width(550).height(310) : null;

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

        {postImage && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={postImage.url()}
              alt={post.title}
              className="aspect-video w-full object-cover"
              width="550"
              height="310"
              priority
            />
          </div>
        )}

        <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-brand-pink">
          Published: {new Date(post.publishedAt).toLocaleDateString()}
        </p>
        <h1 className="mt-4 text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">
          {post.title}
        </h1>

        <div className="prose prose-invert mt-10">
          {Array.isArray(post.body) && <PortableText value={post.body} />}
        </div>
      </div>
    </main>
  );
}
