import { schedule } from './rtss-data';
import { Pill, SplitCta } from './rtss-ui';

/**
 * The running order. The programme lists start times only — end times change
 * with every pitch, so showing them would be a promise we cannot keep.
 */
export default function RtssSchedule() {
  return (
    <section
      id="schedule"
      className="grid scroll-mt-8 grid-cols-[38%_1fr] items-start gap-[6.5%] px-5 pt-[140px] pb-[200px] max-[1100px]:grid-cols-[36%_1fr] max-[1100px]:gap-[6%] max-sm:grid-cols-1 max-sm:gap-[45px] max-sm:pt-0 max-sm:pb-[100px] sm:px-8 lg:px-10"
    >
      <div className="sticky top-20 max-sm:static">
        <Pill>Schedule</Pill>
        <h2 className="my-6 text-[80px] leading-[1.08] font-medium tracking-[-0.055em] max-sm:my-5">
          The evening
        </h2>
        <p className="mb-[42px] text-[20px] leading-[1.4] tracking-[-0.035em] text-muted-foreground max-sm:mb-[30px] max-sm:text-[18px]">
          Live pitches. Bold ideas. Real connections. Join us from 17:00.
        </p>
        <SplitCta />
        <p
          id="registration"
          className="mt-6 scroll-mt-8 text-[17px] leading-[1.5] text-muted-foreground"
        >
          Join the waitlist to be first to hear when early-bird passes become available.
        </p>
      </div>

      <div>
        {/* A column label, not a session: as an <h3> it sat alongside the session
            titles and read as one more session in the heading outline. */}
        <p className="border-b border-border pb-6 text-[18px] font-normal">Schedule</p>
        {schedule.map((session) => (
          <article
            key={`${session.start}-${session.title}`}
            className="grid grid-cols-[24%_1fr] border-b border-border pt-[43px] pb-10 max-[1100px]:grid-cols-[23%_1fr] max-sm:gap-2 max-sm:py-[30px]"
          >
            <div className="text-[24px] leading-[1.3] tracking-[-0.04em] max-sm:text-[18px]">
              {session.start}
            </div>
            <div>
              <h3 className="mb-3.5 text-[32px] leading-[1.25] font-medium tracking-[-0.04em] max-[1100px]:text-[27px] max-sm:mb-[13px] max-sm:text-[25px]">
                {session.title}
              </h3>
              <p className="text-[18px] leading-[1.4] text-muted-foreground max-sm:text-[15px]">
                {session.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
