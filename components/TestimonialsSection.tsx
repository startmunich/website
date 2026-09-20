import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string; // This can be company name or partner name
  image: string;
  story: string;
  quote?: string;
  href?: string; // Optional link to a dedicated detail page
  logos?: { src: string; url?: string }[]; // Optional logos with optional links
}

interface TestimonialsSectionProps {
  title: React.ReactNode;
  description: string;
  items: TestimonialItem[];
  className?: string;
}

export default function TestimonialsSection({
  title,
  description,
  items,
  className = 'mb-20',
}: TestimonialsSectionProps) {
  return (
    <div className={className}>
      <div className="mb-12">
        <h2 className="mb-3 text-3xl font-black text-white md:text-4xl">{title}</h2>
        <p className="max-w-3xl text-lg text-gray-400">{description}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const card = (
            <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] transition-all duration-300 hover:border-brand-pink/30">
              {/* Image */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                {/* Person Info with Logo */}
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="mb-1 text-lg font-bold text-white">{item.name}</h3>
                    <p className="mb-1 text-sm font-semibold text-brand-pink">{item.role}</p>
                    <p className="text-xs text-gray-400">{item.company}</p>
                  </div>
                  {item.logos && item.logos.length > 0 && (
                    <div className="ml-4 flex flex-shrink-0 flex-col gap-2">
                      {item.logos.map((logo, index) => {
                        const logoImg = (
                          // Partner logos have varying aspect ratios and we render at fixed
                          // height with auto width; next/image needs explicit dimensions
                          // and a wrapper, which would distort the logos.
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={logo.src}
                            alt={item.company}
                            className="h-5 w-auto object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        );
                        return logo.url ? (
                          <a
                            key={index}
                            href={logo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1 shadow-lg transition-opacity hover:opacity-80"
                          >
                            {logoImg}
                          </a>
                        ) : (
                          <div key={index} className="rounded p-1 shadow-lg">
                            {logoImg}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Story */}
                <div className="border-t border-white/10 pt-4">
                  <blockquote className="border-l-2 border-brand-pink py-1 pl-4">
                    <p className="text-sm leading-relaxed text-gray-300">{item.story}</p>
                  </blockquote>
                </div>

                {/* Detail link */}
                {item.href && (
                  <div className="mt-auto pt-2">
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-pink transition-all group-hover/read:gap-3">
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
                )}
              </div>
            </div>
          );

          return item.href ? (
            <Link
              key={item.id}
              href={item.href}
              className="group/read block h-full transition-transform duration-300 hover:-translate-y-1"
            >
              {card}
            </Link>
          ) : (
            card
          );
        })}
      </div>
    </div>
  );
}
