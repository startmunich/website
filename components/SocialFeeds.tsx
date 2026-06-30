'use client';

import { InstagramEmbed } from 'react-social-media-embed';

export default function SocialFeeds() {
  return (
    <div className="mt-12">
      <h2 className="mb-8 text-3xl font-bold">Follow Us on Instagram</h2>
      <InstagramEmbed url="https://www.instagram.com/startmunich/" width="100%" />
    </div>
  );
}
