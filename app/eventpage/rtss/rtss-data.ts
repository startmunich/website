/**
 * Content for the Road to START Summit microsite.
 *
 * The event copy is fixed by the organisers, so it lives here rather than in
 * Sanity: only `/`–`/partners` are CMS-driven, and this is a one-off campaign
 * page whose links and agenda change per edition.
 */

export const rtssConfig = {
  title: 'Road to START Summit',
  /** Displayed large across the hero footer. */
  dateParts: ['09.12', '2026'],
  city: 'Munich',
  venue: 'Freiheitshalle · Munich',
  longDate: '9 December 2026',
  /** Event-specific attendee ticket booking. */
  ticketUrl: 'https://luma.com/road-to-start-summit',
  applicationUrl: 'https://tally.so/r/5BW1Wv',
  directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Freiheitshalle+Munich',
} as const;

export const navItems = [
  ['About', '#about'],
  ['Speakers & Jury', '#speakers'],
  ['Tickets & Applications', '#tickets'],
  ['Schedule', '#schedule'],
  ['FAQ', '#questions'],
] as const;

export const aboutCopy = [
  "The Road to START Summit is Munich's most exciting student-organized pitching competition, hosted by START Munich, the city's leading entrepreneurship student initiative.",
  'This year, the event brings together the most promising early-stage DeepTech startups to pitch their ideas in front of an audience of founders, investors, students, and industry experts.',
  "The winner secures a spot at START Summit in St. Gallen, Europe's largest student-organized startup conference with 6,000+ attendees, and competes for CHF 10,000 in prize money.",
];

export const attendeeCopy = [
  'Discover the next wave of DeepTech, learn from founders building the future, and watch bold ideas take the stage. Meet 300+ founders, investors, students, and industry experts — and turn a conversation into your next opportunity.',
  'Enjoy live pitches, a keynote, a founder panel, booths, food, drinks, and relaxed beats. Whether you’re curious about startups or already building your own venture, there’s a place for you.',
];

export const startupCopy = [
  'Bring your Tech or DeepTech startup to the stage and pitch to founders, investors, mentors, and industry experts. Get your idea in front of the people who can help you build beyond the pitch.',
  'The winner secures a spot at START Summit in St. Gallen, a guaranteed booth and startup pass, and the chance to compete for CHF 10,000. Founded in 2024 or later, in Seed or Pre-Seed, and an independent legal entity? This could be your next step.',
];

/** Organiser-supplied technology imagery for the scroll-driven fan. */
export const fanImages = [
  { src: 'tech-engines.jpg', alt: 'Rocket engine cluster beneath a spacecraft' },
  { src: 'tech-chip.jpg', alt: 'Exploded layers of a smartphone and processor' },
  { src: 'tech-start.jpg', alt: 'Transparent technology card with the START symbol' },
  { src: 'tech-robot.jpg', alt: 'Robotic arm illuminated in pink' },
  { src: 'tech-rocket.jpg', alt: 'Rocket launching through pink and white clouds' },
  { src: 'tech-reactor.jpg', alt: 'Metallic interior of a fusion reactor' },
  { src: 'tech-atom.jpg', alt: 'Atomic model illuminated with pink light' },
] as const;

export type Session = {
  /** 24-hour start time; the programme deliberately shows no end times. */
  start: string;
  title: string;
  description: string;
};

export const schedule: Session[] = [
  {
    start: '17:00',
    title: 'Doors open',
    description: 'Arrive, explore the booths, and enjoy food, drinks, Glühwein, and relaxed beats.',
  },
  {
    start: '18:30',
    title: 'Intro',
    description: 'Our host welcomes you and walks you through the evening and the START programs.',
  },
  {
    start: '18:45',
    title: 'Keynote',
    description: 'Get inspired by a founder who is building the future.',
  },
  {
    start: '19:05',
    title: 'Panel',
    description: 'Top founders share real insights, and you can ask your own questions.',
  },
  {
    start: '19:35',
    title: 'First Break',
    description: 'Recharge, meet fellow founders, and visit the booths.',
  },
  {
    start: '20:00',
    title: 'Pitches',
    description: 'Watch the next wave of startups pitch live on stage.',
  },
  {
    start: '21:30',
    title: 'Jury deliberation',
    description: 'Our jury picks the winner while you mingle.',
  },
  {
    start: '21:45',
    title: 'Announcement',
    description: 'Find out who wins, then celebrate with snacks.',
  },
  {
    start: '22:00',
    title: 'End of event',
    description: 'Wrap up the night with good company and one last DJ set.',
  },
];

export type FaqItem = {
  question: string;
  answer: string;
  /** Rendered as underlined links below the answer. */
  links?: { label: string; href: string }[];
};

export const faqs: FaqItem[] = [
  {
    question: 'What is the Road to START Summit?',
    answer:
      'Road to START Summit is a series of events organized by START chapters throughout Europe. START Munich hosts a student-organized pitching competition to identify promising startups that will represent Munich at START Summit in St. Gallen.',
  },
  {
    question: 'Where and when does it take place?',
    answer:
      'Join us on 9 December 2026 at Freiheitshalle in Munich. Doors open at 17:00 and the evening runs late. Get your ticket on Luma.',
  },
  {
    question: 'What are the requirements for startups?',
    answer:
      'Your startup was founded in 2024 or later, is in Seed or Pre-Seed stage, and is an independent legal entity. There are no limitations regarding the amount of funding you have already received. Your startup must have a deep tech focus.',
  },
  {
    question: 'What does Deep Tech Focus mean?',
    answer:
      'We all know the classic SaaS startups built around GPT wrappers that can now be implemented with AI in two hours. We’re looking for startups that dare to dream: scientifically backed startups building something extraordinary that cannot easily be replicated with a Claude Pro subscription.',
  },
  {
    question: 'What can the winning startup receive?',
    answer:
      'The winner secures a spot at START Summit in St. Gallen, a guaranteed startup booth, a startup pass, and the opportunity to compete for CHF 10,000 in prize money.',
  },
  {
    question: 'How is it different from START Hack League Munich?',
    answer:
      'START Hack League Munich is a weekend-long hackathon where students build software and hardware projects. Road to START Summit is a pitching competition for startups.',
  },
  {
    question: 'How can I attend or apply?',
    answer: 'To come along, get your ticket on Luma.',
    links: [
      { label: 'Tickets', href: rtssConfig.ticketUrl },
      { label: 'Apply as a startup', href: rtssConfig.applicationUrl },
    ],
  },
];

/** Verified public profiles; portrait and biography sources accompany the local assets. */
export const speakersAndJury = [
  {
    name: 'Felix Haas',
    category: 'Speaker',
    role: 'Entrepreneur, investor & Bits & Pretzels co-host',
    image: 'felix-haas-supplied.png',
    linkedin: 'https://www.linkedin.com/in/felixhaas/',
    bio: 'Felix co-founded amiando and IDnow and is a co-host of Bits & Pretzels. A founder of START Munich, he brings experience in building companies, investing in startups, and connecting the next generation of entrepreneurs.',
  },
  {
    name: 'Balázs Nagy',
    category: 'Speaker',
    role: 'CEO & Co-Founder, TYTAN Technologies',
    image: 'balazs-nagy-supplied.png',
    linkedin: 'https://www.linkedin.com/in/balazsnagy1994/',
    bio: 'Balázs is CEO and co-founder of TYTAN Technologies. He is building AI-powered drone defence systems for European armed forces, turning aerospace engineering into technology that protects people and critical infrastructure.',
  },
  {
    name: 'Mika Voss',
    category: 'Jury',
    role: 'Investment Analyst, UVC Partners',
    image: 'mika-voss-supplied.png',
    linkedin: 'https://www.linkedin.com/in/mika-voss-501573222/',
    bio: 'Mika combines a passion for DeepTech with a data-driven approach to venture capital at UVC Partners. With experience in finance and at FINN, he brings both an investor and operator perspective to evaluating emerging companies.',
  },
  {
    name: 'Constance Perez',
    category: 'Jury',
    role: 'Investment Analyst, Climate Founders',
    image: 'constance-perez-supplied.png',
    linkedin: 'https://www.linkedin.com/in/constanceperez/',
    bio: 'Based in Munich, Constance manages dealflow and applications at Climate Founders and supports investment due diligence. Her background in environmental consulting informs her work with founders developing solutions for a more sustainable future.',
  },
] as const;
