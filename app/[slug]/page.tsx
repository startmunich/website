import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
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
  const postImageUrl = post.image ? urlFor(post.image)?.width(550).height(310).url() : null;

  return (
    <main className="container mx-auto flex min-h-screen max-w-3xl flex-col gap-4 p-8">
      <Link href="/" className="hover:underline">
        ← Back to posts
      </Link>
      {postImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={postImageUrl}
          alt={post.title}
          className="aspect-video rounded-xl"
          width="550"
          height="310"
        />
      )}
      <h1 className="mb-8 text-4xl font-bold">{post.title}</h1>
      <div className="prose">
        <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p>
        {Array.isArray(post.body) && <PortableText value={post.body} />}
      </div>
    </main>
  );
}
