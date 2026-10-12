export type ProjectId = 'jda' | 'thekken';

export type ProjectScreenshot = {
  src: string;
  alt: string;
  width: number;
  height: number;
  publication: 'public-capture' | 'client-approved' | 'draft';
  source: string;
  capturedAt?: string;
};

export type CaseStudy = {
  id: ProjectId;
  name: string;
  category: string;
  title: string;
  summary: string;
  client: string;
  contribution: string;
  challenge: string;
  solution: string;
  outcome: string;
  technologies: string[];
  website?: string;
  screenshots: ProjectScreenshot[];
  // Editorial notes never enter a Client Component or the public content model.
  editorialNotes: string[];
};

export type Testimonial = {
  projectId: ProjectId;
  status: 'draft' | 'approved';
  name: string;
  designation: string;
  organization: string;
  quote: string;
  photograph?: ProjectScreenshot;
  logo?: ProjectScreenshot;
};

export type ClientReference = {
  projectId: ProjectId;
  // Approval to be named as a reference is separate from testimonial approval.
  status: 'draft' | 'approved';
  name: string;
  designation: string;
  organization: string;
  contact?: {
    method: 'email' | 'phone' | 'website';
    value: string;
    // Explicit permission to publicly display this specific contact method.
    publicationApproved: boolean;
  };
};

export const referencesPage = {
  url: 'https://jimmyj.is-a.dev/references',
  title: 'Selected Work & Client References | Jimmy Jose',
  description:
    'Selected software projects by Jimmy Jose, an independent software engineer with 10 years of experience. Explore client work and discuss a freelance or contract project.',
  identifier: 'Independent software engineer · 10 years of experience',
  introduction:
    'A selection of software products I’ve built for real businesses, from understanding their workflows to delivering production-ready solutions.',
};

export const caseStudies: CaseStudy[] = [
  {
    id: 'jda',
    name: 'JDA',
    category: 'Internal business software / Workflow automation',
    title: 'Practice management, built around the practice.',
    summary:
      'An internal practice-management application for a chartered accountancy firm, designed to help organize clients, responsibilities and day-to-day work.',
    client: 'JDA, a chartered accountancy practice',
    contribution: 'Application development',
    challenge:
      'A CA practice needs a clear way to organize client work, responsibilities and daily operations around its own workflows.',
    solution:
      'A dedicated internal application designed around the practice’s operational needs, rather than a one-size-fits-all process.',
    outcome:
      'A practice-management application delivered for JDA. Product screens and client-specific operational details remain private.',
    technologies: ['Next.js', 'MySQL', 'Cloudflare R2'],
    screenshots: [],
    editorialNotes: [
      'Technology stack confirmed by Jimmy on 2026-10-12.',
      'Confirm architecture, deployment and technical ownership before expanding the contribution.',
      'Confirm individual features and client-validated operational outcomes before publication.',
      'Add only client-approved, anonymized screenshots. Do not recreate a fictitious dashboard.',
    ],
  },
  {
    id: 'thekken',
    name: 'Thekken.in',
    category: 'Consumer web application / Local discovery',
    title: 'Helping a town discover what’s around it.',
    summary:
      'A mobile-first platform helping people discover local merchants, products and services in Thiruvalla, Kerala.',
    client: 'Thekken, Thiruvalla',
    contribution: 'Application development',
    challenge:
      'Local shops and services can be difficult to discover in one organized place, especially when you’re looking for something nearby.',
    solution:
      'A searchable local directory with category browsing and location-aware discovery, bringing local businesses into a focused web experience.',
    outcome:
      'A live, publicly accessible discovery platform for Thiruvalla, with a mobile-first interface for search and browsing.',
    technologies: ['Next.js', 'MySQL', 'Cloudflare R2'],
    website: 'https://thekken.in/',
    screenshots: [
      {
        src: '/references/thekken-desktop.webp',
        alt: 'Thekken’s live homepage with local search, category browsing and the current empty listing sections.',
        width: 1440,
        height: 1054,
        publication: 'public-capture',
        source: 'https://www.thekken.in/',
        capturedAt: '2026-10-12',
      },
      {
        src: '/references/thekken-mobile.webp',
        alt: 'Thekken’s mobile homepage showing nearby search and Home, Categories and Search navigation.',
        width: 390,
        height: 844,
        publication: 'public-capture',
        source: 'https://www.thekken.in/',
        capturedAt: '2026-10-12',
      },
    ],
    editorialNotes: [
      'Technology stack confirmed by Jimmy on 2026-10-12.',
      'Public UI reviewed and captured on 2026-10-12. Listing sections were empty; do not claim traffic, adoption or populated listings.',
      'Administration capabilities supplied in the brief; exact personal scope and deployment ownership still need confirmation.',
    ],
  },
];

// Sample copy requested by Jimmy. Visible ONLY in development, explicitly labelled.
// Replace the quote and attribution with exact client-approved text, then approve.
// A testimonial approval does NOT approve publication of reference contact details.
export const testimonials: Testimonial[] = [
  {
    projectId: 'jda',
    status: 'draft',
    name: 'JDA client',
    designation: 'Client representative (draft)',
    organization: 'JDA',
    quote:
      'Jimmy took the time to understand our working day and turned our requirements into practical software. Communication was clear throughout.',
  },
  {
    projectId: 'thekken',
    status: 'draft',
    name: 'Thekken client',
    designation: 'Client representative (draft)',
    organization: 'Thekken',
    quote:
      'Jimmy brought a thoughtful approach to the product, from the first conversations to the details of the mobile experience.',
  },
];

export const clientReferences: ClientReference[] = [
  {
    projectId: 'jda',
    status: 'draft',
    name: '',
    designation: '',
    organization: 'JDA',
  },
  {
    projectId: 'thekken',
    status: 'draft',
    name: '',
    designation: '',
    organization: 'Thekken',
  },
];
