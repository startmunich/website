import { ParallaxPhoto } from './rtss-motion';

/** Three frames from the last edition, drifting at different speeds. */
export default function RtssGallery() {
  return (
    <section
      aria-label="Scenes from START Munich RTSS 2025"
      className="relative -mx-[120px] grid h-[780px] grid-cols-3 gap-4 max-sm:mr-0 max-sm:ml-[-205px] max-sm:h-[440px] max-sm:grid-cols-[repeat(3,240px)] max-sm:gap-3"
    >
      <ParallaxPhoto
        file="rtss-gallery-host.jpg"
        alt="START Munich host speaking on stage at RTSS 2025"
        sizes="(max-width: 640px) 240px, 33vw"
        imageClassName="object-[75%_center]"
      />
      <ParallaxPhoto
        file="rtss-gallery-audience.jpg"
        alt="Audience members listening at START Munich RTSS 2025"
        sizes="(max-width: 640px) 240px, 33vw"
      />
      <ParallaxPhoto
        file="rtss-gallery-stage.jpg"
        alt="A presenter addressing the RTSS 2025 audience beneath a large stage screen"
        sizes="(max-width: 640px) 240px, 33vw"
        imageClassName="object-[20%_center]"
      />
    </section>
  );
}
