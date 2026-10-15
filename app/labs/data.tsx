import type { FaqItem } from '@/components/site/faq';

/** Static content for the START Labs MedTech Edition microsite. */

export const APPLY_URL = 'https://tally.so/r/rjdeQM';

export interface TimelineItem {
  week: string;
  weekNum: number;
  tag: string;
  emoji: string;
  title: string;
  desc: string;
  details: string[];
  image: string;
  isLast?: boolean;
}

export const timelineItems: TimelineItem[] = [
  {
    week: 'Week 01',
    weekNum: 1,
    tag: 'Onboarding',
    emoji: '🚀',
    title: 'Onboarding day',
    desc: "Meet your partners. Understand the challenge firsthand. From day one, you're a founder, not just a participant.",
    details: ['Meet your team & partners', 'Deep dive into the challenge', 'Set your 8-week goals'],
    image: '/labs/images/timeline/onboarding.JPG',
  },
  {
    week: 'Week 02',
    weekNum: 2,
    tag: 'Experts',
    emoji: '🔥',
    title: 'Roast Session #1',
    desc: "Founders, clinicians, healthcare operators who've built in this space. Ask them anything.",
    details: ['Get brutally honest feedback', 'Meet industry founders', 'Refine your approach'],
    image: '/labs/images/timeline/roast-session-1.JPG',
  },
  {
    week: 'Week 04',
    weekNum: 4,
    tag: 'Midterm',
    emoji: '🎯',
    title: 'Midterm pitch',
    desc: 'Present your progress to your partners. Pivot or persevere based on real feedback. No grades. Real consequences.',
    details: ['Present to partners', 'Get real feedback', 'Decide: pivot or persevere'],
    image: '/labs/images/timeline/midterm.JPG',
  },
  {
    week: 'Week 06',
    weekNum: 6,
    tag: 'Experts',
    emoji: '💡',
    title: 'Roast Session #2',
    desc: 'Deep dive with industry experts. Get tactical advice on your biggest challenges.',
    details: ['Deep dive with experts', 'Get tactical advice', 'Fine-tune your MVP'],
    image: '/labs/images/timeline/roast-session-2.jpeg',
  },
  {
    week: 'Week 08',
    weekNum: 8,
    tag: 'Final',
    emoji: '🏆',
    title: 'Final Pitch',
    desc: 'Present your MVP to partners, clinicians, and a live audience. Real stakes. No safety net.',
    details: ['Present your MVP', 'Live audience + partners', 'Real stakes, no safety net'],
    image: '/labs/images/timeline/final.JPG',
    isLast: true,
  },
];

export const formatSpecs = [
  {
    number: '01',
    title: '8 WEEKS',
    desc: 'Not 6 months. Not a semester. 8 intense weeks to build, test, iterate, and sell.',
    stat: '56 days to prove yourself',
    icon: '⏱️',
  },
  {
    number: '02',
    title: 'STUDENT-RUN',
    desc: 'Built by students, for students. No corporate sponsors dictating direction. Just founders helping founders.',
    stat: 'No BS environment',
    icon: '🤝',
  },
  {
    number: '03',
    title: 'REAL PROBLEMS',
    desc: 'Sourced directly from hospitals healthcare organizations, and startups. Problems that exist right now.',
    stat: 'From actual partners',
    icon: '🏥',
  },
  {
    number: '04',
    title: 'YOUR STARTUP',
    desc: "You build it. You own it. 100% of the equity. We're not taking a cut. This is your company.",
    stat: '100% yours',
    icon: '🚀',
  },
];

export const criteria = {
  apply: [
    {
      title: 'Hard problems energize you.',
      text: "You don't quit when things get tough. You get obsessed.",
    },
    {
      title: 'The status quo makes you angry.',
      text: 'You see broken systems and think “I can fix this.”',
    },
    {
      title: 'You have fire. Not just interest.',
      text: "Genuine, can't-sleep-at-night passion for building things that matter.",
    },
  ],
  skip: [
    {
      title: 'Your calendar is already drowning.',
      text: 'We need 10+ hours per week of real commitment.',
    },
    { title: 'You want a cozy lecture series.', text: 'This is hands-on, messy, and real.' },
    {
      title: "You're collecting badges for your CV.",
      text: "Build something you actually care about, or don't apply.",
    },
  ],
};

export const labsFaqs: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Is this paid?',
    answer: (
      <>
        Not in salary. But you&apos;ll work on{' '}
        <span className="text-primary">real healthcare challenges</span>, build a working MVP, get
        hands-on mentorship, and have a shot at your{' '}
        <span className="text-primary">first paying customer</span>. If that&apos;s not enough, this
        probably isn&apos;t for you.
      </>
    ),
  },
  {
    id: 'faq-2',
    question: 'Do we have to give up equity?',
    answer: (
      <>
        <span className="text-primary">No.</span> Your product, your pitch, your decision.{' '}
        <span className="text-primary">Whoever builds, owns.</span>
      </>
    ),
  },
  {
    id: 'faq-3',
    question: 'Do I need MedTech experience?',
    answer: (
      <>
        <span className="text-primary">No.</span> We provide domain access, clinical partners, and
        problem context. You just need the skills and the drive to solve hard problems.
      </>
    ),
  },
  {
    id: 'faq-4',
    question: 'Do I have to speak German?',
    answer: (
      <>
        It helps on the business and sales side. If you&apos;re focused on tech or design, English
        is fine.
      </>
    ),
  },
  {
    id: 'faq-5',
    question: 'Can I participate online?',
    answer: (
      <>
        <span className="text-primary">No.</span> We go out and touch grass. In-person only, Munich.
      </>
    ),
  },
  {
    id: 'faq-6',
    question: 'Do I have to be a student?',
    answer: (
      <>
        Nope. Recent graduates and young professionals are welcome. No hard cut-off. If you&apos;re
        at the start of your career and want to build something real,{' '}
        <span className="text-primary">we want you in</span>.
      </>
    ),
  },
  {
    id: 'faq-7',
    question: 'Can I do it next to studying?',
    answer: (
      <>
        Yes, but be realistic. If you&apos;re taking 6+ courses and a working student job, it might
        be a stretch. The{' '}
        <span className="text-primary">more time you put in, the more you get out</span>.
      </>
    ),
  },
  {
    id: 'faq-8',
    question: 'Can I do it next to a working student job?',
    answer: (
      <>
        It depends. Some manage both, especially if they can adjust hours. Just be{' '}
        <span className="text-primary">honest with yourself</span> about your capacity.
      </>
    ),
  },
];
