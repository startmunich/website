import { START_CHAPTER_COUNT } from '@/lib/startNetwork';

/** Static content for /member-journey. */

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  image: string | string[];
  details: string[];
}

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
  responsibilities: string[];
}

export interface InternalEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  frequency: string;
  icon: string;
  images: string[];
}

export interface MemberStory {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  story: string;
  department: string;
  logos?: { src: string; url?: string }[];
}

const placeholderImage = '/internalevents-opt.png';

export const timelineEvents: TimelineEvent[] = [
  {
    id: 'application',
    title: 'Application',
    description: 'Your entry into START Munich.',
    image: '',
    details: [
      'Apply in April or October',
      'Stage 1: Written Application',
      'Stage 2: Two Interviews (same day, 30 minutes each)',
    ],
  },
  {
    id: 'start-sprint',
    title: 'START Sprint',
    description:
      "Your first month at START. Get to know and bond with ambitious people you wouldn't meet in your usual circles, and build a real product together.",
    image: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
    ],
    details: [
      'Develop your own idea from concept to MVP in just 4 weeks',
      'Two workshops per week to learn foundations of building a startup',
      'Get to know key players within Munich startup ecosystem',
      'Spend an unforgettable weekend with our community in Austria',
      'Final pitch in front of a jury, compete to win START Summit tickets',
    ],
  },
  {
    id: 'department-selection',
    title: 'Department Selection',
    description:
      'Develop yourself and shape the future of START. START is completely student-run. What happens here depends on what you do.',
    image: '',
    details: [
      'Choose one of five departments',
      'Work on real projects with visible impact inside and outside START',
      'Learn useful startup skills in practice',
      'Grow fast by taking ownership',
      'Initiate new formats',
    ],
  },
  {
    id: 'active-member',
    title: 'Active Member',
    description:
      'Enjoy the benefits of being a STARTie and expand your network through exclusive opportunities.',
    image: placeholderImage,
    details: [
      'Join the Bay Area trip, 2 weeks, 20+ curated visits to top startups, VCs, and labs',
      'Research Stay @ Cambridge through direct research collaboration',
      `Become part of the START Network, ${START_CHAPTER_COUNT} chapters worldwide`,
      'Find co-founders or start your own venture within a community of 100+ startups, including teams backed by Y Combinator',
    ],
  },
  {
    id: 'alumni',
    title: 'START Alumni',
    description: 'Once a STARTie, always a STARTie. Stay connected as you build your own path.',
    image: placeholderImage,
    details: [
      'Become alumni after two active semesters',
      'Find co-founders, investors, and collaborators across the START Global Network',
      'Give back by mentoring, sharing, and supporting new STARTies',
      'Stay involved as much as you want, department work is optional',
    ],
  },
];

export const departments: Department[] = [
  {
    id: 'people',
    name: 'People',
    description:
      'Learn how to spot the right talent, keep them motivated, and build a community that accelerates your startup journey.',
    icon: '👥',
    responsibilities: [
      'Run recruiting, interviews, and onboarding.',
      'Organize START Sprint and shape new batches.',
      'Keep members engaged and connected through formats like Hut Weekend, START Goes Eating, and more.',
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description:
      'Learn how to highlight our people, events, and achievements to reach millions and build a trusted brand.',
    icon: '📢',
    responsibilities: [
      'Create content, posts, and campaigns for LinkedIn and Instagram.',
      'Shoot and edit photos and videos from events.',
      "Build and maintain START's brand and image.",
    ],
  },
  {
    id: 'techops',
    name: 'TechOps',
    description:
      "Learn how to design and build custom tools and automate workflows to increase START's output and influence.",
    icon: '🛠️',
    responsibilities: [
      'Build internal tools like Members Platform or Financial Dashboard.',
      'Improve our core systems like Slack, n8n and Notion.',
      'Handle contract management, ensuring compliance.',
    ],
  },
  {
    id: 'partnerships',
    name: 'Partnerships',
    description:
      "Learn how to secure partners, close deals, and bring in the resources that multiply START's impact across the ecosystem.",
    icon: '🤝',
    responsibilities: [
      'Run outreach campaigns and handle rejection.',
      'Build and manage relationships that create long-term value.',
      "Close deals that fund START's projects.",
    ],
  },
  {
    id: 'events',
    name: 'Events',
    description:
      'Learn how to run flagship events where people meet, learn, and build across START, the Munich ecosystem, and beyond.',
    icon: '🎉',
    responsibilities: [
      'Organize and run large-scale events with 300+ attendees, like hackathons and summits.',
      'Organize workshops, startup visits, and other learning opportunities.',
      'Create experiences people remember and come back for.',
    ],
  },
];

export const internalEvents: InternalEvent[] = [
  {
    id: 'monthly',
    title: 'The Monthly',
    description:
      'Each month all active members meet at MTZ to share updates, pitch their startups, and connect across the community.',
    category: 'Meeting',
    frequency: 'Monthly',
    icon: '📅',
    images: [
      '/memberJourney/monthly/2-opt.jpg',
      '/memberJourney/monthly/3-opt.png',
      '/memberJourney/monthly/4-opt.png',
    ],
  },
  {
    id: 'department-work',
    title: 'Department Work',
    description: 'Meet with your department at our MTZ office to align on projects and progress.',
    category: 'Department',
    frequency: 'Weekly',
    icon: '💼',
    images: ['/memberJourney/departmentwork/2-opt.jpg', '/memberJourney/departmentwork/1-opt.jpg'],
  },
  {
    id: 'builders-weekend',
    title: 'Builders Weekend',
    description: 'Meet on the weekend to build your own startup.',
    category: 'Building',
    frequency: 'Monthly',
    icon: '🔨',
    images: ['/memberJourney/builderWeekend/1-opt.jpg'],
  },
  {
    id: 'workshops',
    title: 'Member Workshops',
    description: 'Workshops with VCs and other professionals.',
    category: 'Learning',
    frequency: '',
    icon: '🎓',
    images: ['/memberJourney/memberworkshop/1-opt.jpg', '/memberJourney/memberworkshop/3-opt.jpeg'],
  },
  {
    id: 'startup-visits',
    title: 'Startup Visits',
    description: 'Visit startups and learn from the experienced.',
    category: 'Networking',
    frequency: '',
    icon: '🏢',
    images: ['/memberJourney/startupVisit/1-opt.png', '/memberJourney/startupVisit/2-opt.png'],
  },
];

export const memberStories: MemberStory[] = [
  {
    id: 'story-1',
    name: 'Felix Haas',
    role: 'Founder & Investor',
    company: 'IDNow | Bits & Pretzels',
    image: '/memberJourney/alumni/FelixHaas-opt.png',
    story:
      'At START Munich, I laid the foundation for my current network. From this starting point, I built several companies, invested in more than 80 start-ups and helped set up Bits & Pretzels.',
    department: 'Alumni',
    logos: [
      {
        src: 'https://cdn.prod.website-files.com/65f98ea7c70b10b668ccbeb3/65f98ea7c70b10b668ccbeea_Vectors-Wrapper.svg',
        url: 'https://www.idnow.io/',
      },
      {
        src: 'https://cdn.prod.website-files.com/65f98ea7c70b10b668ccbeb3/65f98ea7c70b10b668ccbece_logo.svg',
        url: 'https://www.bitsandpretzels.com/',
      },
    ],
  },
  {
    id: 'story-3',
    name: 'Elisabeth Goebel',
    role: 'Early Operator',
    company: 'ZeitAI | CDTM',
    image: '/memberJourney/alumni/Elisa-opt.png',
    story:
      'START is where things actually happen. I co-founded ISAR Unfiltered, met people who think and move the way I do, and built a network that directly led me to where I am today: Early Operator at a YC-backed AI startup.',
    department: 'People',
    logos: [
      {
        src: 'https://cdn.prod.website-files.com/6902359088cc8683c4db0171/69249d98617b1b96682cca65_44a5d2ba9e6004a1281eed9068c62a95_zeitai-logo-opt.png',
        url: 'https://www.zeit.ai/',
      },
    ],
  },
  {
    id: 'story-2',
    name: 'Joshua Cornelius',
    role: 'Co-Founder',
    company: 'Freeletics | CDTM',
    image: '/memberJourney/alumni/JoshuaCornelius-opt.png',
    story:
      'Before we founded Freeletics, START Munich - in addition to CDTM - gave my co-founder and me the ideal opportunity to make first contacts in the Munich startup scene.',
    department: 'Alumni',
    logos: [
      {
        src: 'https://cdn.prod.website-files.com/65f98ea7c70b10b668ccbeb3/65f98ea7c70b10b668ccbeef_5eb3c929c8c4590004435152-opt.png',
        url: 'https://www.freeletics.com/',
      },
    ],
  },
];

/** The collage shown for "And a lot more...". */
export const moreImages = [
  'https://images.unsplash.com/photo-1528605105345-5344ea20e269?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop',
];
