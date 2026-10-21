import Image from 'next/image';

import { LogoImage } from '@/components/site/logo-image';
import { Card, CardMedia } from '@/components/ui/card';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  /** Company or partner name. */
  company: string;
  image: string;
  story: string;
  logos?: { src: string; url?: string }[];
}

/** A person's photo, name, role and a quote about their START experience. */
export function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <Card interactive className="gap-0 py-0">
      <CardMedia className="h-64">
        <Image
          src={item.image}
          alt={item.name}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </CardMedia>
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
            <p className="text-sm font-semibold text-primary">{item.role}</p>
            <p className="text-xs text-muted-foreground">{item.company}</p>
          </div>
          {item.logos && item.logos.length > 0 && (
            <div className="flex shrink-0 flex-col gap-2">
              {item.logos.map((logo) => {
                const img = (
                  <LogoImage
                    src={logo.src}
                    name={item.company}
                    className="h-5 w-auto"
                    fallbackClassName="hidden"
                  />
                );
                return logo.url ? (
                  <a
                    key={logo.src}
                    href={logo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded p-1 transition-opacity hover:opacity-80"
                  >
                    {img}
                  </a>
                ) : (
                  <div key={logo.src} className="rounded p-1">
                    {img}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <blockquote className="border-t border-border pt-4">
          <p className="border-l-2 border-primary py-1 pl-4 text-sm leading-relaxed text-muted-foreground">
            {item.story}
          </p>
        </blockquote>
      </div>
    </Card>
  );
}
