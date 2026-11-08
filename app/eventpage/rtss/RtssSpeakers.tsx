import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import Image from 'next/image';

import { Button, ButtonLink } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { speakersAndJury } from './rtss-data';
import { Pill, rtssImage } from './rtss-ui';

export default function RtssSpeakers() {
  return (
    <section
      id="speakers"
      aria-labelledby="speakers-heading"
      className="scroll-mt-24 px-5 py-24 sm:px-8 lg:px-10"
    >
      <div className="mb-16 max-w-2xl">
        <Pill>Meet the people</Pill>
        <h2
          id="speakers-heading"
          className="mt-6 text-[80px] leading-[1.08] font-medium tracking-[-0.055em] max-sm:text-[56px]"
        >
          Speakers &amp; Jury
        </h2>
        <p className="mt-6 max-w-md text-xl leading-[1.4] tracking-[-0.035em] text-muted-foreground">
          The founders shaping what’s next. The investors backing bold ideas.
        </p>
      </div>
      <div className="mx-auto grid max-w-7xl items-start gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-16 lg:gap-y-24">
        {speakersAndJury.map((person) => (
          <article key={person.name} className="group lg:[&:nth-child(3n+2)]:translate-y-24">
            <Dialog>
              <DialogTrigger
                aria-label={`About ${person.name}`}
                className="relative block aspect-square w-full cursor-pointer overflow-hidden rounded-2xl bg-card text-left focus-visible:ring-3 focus-visible:ring-primary focus-visible:outline-none"
              >
                <Image
                  src={rtssImage(person.image)}
                  alt={person.name}
                  fill
                  sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 30vw"
                  className="object-cover grayscale transition duration-500 group-hover:scale-105 motion-reduce:transition-none"
                />
                <span className="absolute top-4 left-4 rounded-full bg-background px-3 py-1.5 text-sm text-foreground">
                  {person.category}
                </span>
              </DialogTrigger>
              <DialogPortal>
                <DialogOverlay className="bg-brand-navy/80 supports-backdrop-filter:backdrop-blur-none" />
                <DialogPrimitive.Popup className="theme-rtss fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-primary/30 bg-background p-7 text-foreground shadow-card outline-none">
                  <div className="flex items-center gap-4 pr-8">
                    <Image
                      src={rtssImage(person.image)}
                      alt=""
                      width={52}
                      height={52}
                      sizes="52px"
                      className="size-13 rounded-full object-cover grayscale"
                    />
                    <div>
                      <DialogTitle className="text-2xl tracking-tight">{person.name}</DialogTitle>
                      <p className="mt-1 text-xs text-muted-foreground">{person.role}</p>
                    </div>
                  </div>
                  <DialogDescription className="mt-6 text-base leading-relaxed text-foreground">
                    {person.bio}
                  </DialogDescription>
                  <ButtonLink
                    href={person.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="link"
                    className="mt-6"
                  >
                    LinkedIn ↗<span className="sr-only"> (opens in a new tab)</span>
                  </ButtonLink>
                  <DialogClose
                    render={
                      <Button size="icon-sm" shape="pill" className="absolute top-5 right-5" />
                    }
                    aria-label="Close biography"
                  >
                    ×
                  </DialogClose>
                </DialogPrimitive.Popup>
              </DialogPortal>
            </Dialog>
            <h3 className="mt-5 text-3xl font-medium tracking-[-0.04em]">{person.name}</h3>
            <p className="mt-2 text-base leading-snug text-muted-foreground">{person.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
