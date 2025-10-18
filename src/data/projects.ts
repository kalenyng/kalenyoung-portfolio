export interface Project {
  slug: string;
  title: string;
  summary: string;
  tech: string[];
  year: number;
  highlights: string[];
  image: string;
  url?: string;
  repo?: string;
  caseStudy?: string;
  isPrivate?: boolean;
}

export const projects: Project[] = [
  {
    slug: 'propza',
    title: 'Propza',
    summary:
      'A full-stack property management web app built for landlords and tenants. Propza focuses on simplicity, real-time data, and a clean dashboard experience.',
    tech: ['Angular 19', 'Supabase', 'Tailwind CSS', 'TypeScript', 'Vercel'],
    year: 2025,
    highlights: [
      'Built a modular Angular architecture with feature-based lazy loading',
      'Integrated Supabase Auth for landlord and tenant roles',
      'Implemented real-time rent tracking and payment history using Supabase Realtime',
      'Developed custom dashboards with analytics and quick-view summaries',
      'Designed responsive layouts with persistent dark mode and accessibility in mind',
    ],
    image: '/images/propza-cover.jpg',
    url: 'https://propza.vercel.app',
    caseStudy: 'propza',
  },
  {
    slug: 'eiran-ruth-wedding',
    title: 'Wedding Website',
    summary:
      'A personalised wedding website built for real guests, combining an elegant design with dynamic features like RSVP, dietary preferences, and gallery uploads.',
    tech: ['Angular', 'Supabase', 'Cloudinary', 'Tailwind CSS', 'TypeScript'],
    year: 2025,
    highlights: [
      'Developed a secure RSVP system linked to a Supabase backend',
      'Added custom dietary requirement modals with editable guest data',
      'Integrated Cloudinary for image uploads, optimization, and folder management',
      'Created an admin view for managing attendees and event updates',
      'Focused on UX details like smooth animations and mobile accessibility',
    ],
    image: '/images/wedding-cover.jpg',
    url: 'https://eiranandrutswedding.vercel.app',
    caseStudy: 'eiran-ruth-wedding',
    isPrivate: true,
  },
  {
    slug: 'winterscar',
    title: 'Winterscar Chronicles',
    summary:
      'A creative storytelling site that blends web design and world-building. Built to experiment with motion design, Astro performance, and modular content systems.',
    tech: ['Astro', 'Tailwind CSS', 'TypeScript', 'Motion One'],
    year: 2024,
    highlights: [
      'Designed and developed an interactive fantasy map with hoverable regions',
      'Created reusable Astro components for chapters, characters, and lore entries',
      'Used Motion One for parallax hero animations and smooth transitions',
      'Structured content in Markdown for fast editing and scalability',
      'Achieved near-perfect Lighthouse scores for performance and accessibility',
    ],
    image: '/images/winterscar-cover.jpg',
    url: 'https://winterscar-chronicles.vercel.app/',
    repo: 'https://github.com/kalenyng/winterscar-chronicles',
    caseStudy: 'winterscar',
  },
  {
    slug: 'safe-bookkeeping',
    title: 'Safe Bookkeeping',
    summary:
      'A professional business website built for a UK-based bookkeeping firm using Angular. Focused on clarity, SEO performance, and a clean, trustworthy design that reflects financial reliability.',
    tech: ['Angular', 'Tailwind CSS', 'TypeScript', 'Vercel'],
    year: 2024,
    highlights: [
      'Developed a responsive Angular site optimized for business clarity and accessibility',
      'Implemented SEO best practices with dynamic meta tags, Open Graph data, and sitemap integration',
      'Structured reusable Angular components for services, pricing, and testimonials',
      'Optimized for performance with lazy-loaded routes and image compression',
      'Deployed through Vercel for global delivery and continuous integration',
    ],
    image: '/images/safebookkeeping-cover.jpg',
    url: 'https://www.safebookkeeping.co.uk/',
    repo: 'https://github.com/kalenyng/SafeBookkeeping',
    caseStudy: 'safe-bookkeeping',
  },  
  {
    slug: 'coho-automation',
    title: 'COHO Document Automation',
    summary:
      'A prototype for an AI-powered document processing pipeline developed with COHO AI. Focused on data extraction, OCR workflows, and scalable back-end integration.',
    tech: ['Python', 'FastAPI', 'Supabase', 'TypeScript', 'OpenAI API'],
    year: 2025,
    highlights: [
      'Designed a document ingestion pipeline with Supabase Storage and FastAPI',
      'Implemented OpenAI API calls for summarization and entity extraction',
      'Built a structured JSON output layer for processed document data',
      'Collaborated on workflow design and database schema for enterprise scaling',
      'Created early-stage front-end integration for testing the pipeline in real-time',
    ],
    image: '/images/coho-cover.jpg',
    url: '#',
    caseStudy: 'coho-automation',
    isPrivate: true,
  },
  {
    slug: 'portfolio-v2',
    title: 'Portfolio v2',
    summary:
      'The current iteration of my personal site — rebuilt with Astro, TypeScript, and TailwindCSS to focus on performance, motion, and storytelling.',
    tech: ['Astro', 'Tailwind CSS', 'TypeScript', 'Motion One', 'Vercel'],
    year: 2025,
    highlights: [
      'Re-designed from the ground up with a modular, component-based layout',
      'Integrated subtle 3D background and custom cursor interactions',
      'Added Markdown-driven case studies for each project',
      'Optimized Lighthouse scores across all metrics',
      'Deployed to Vercel with continuous integration via GitHub',
    ],
    image: '/images/portfolio-cover.jpg',
    repo: 'https://github.com/kalenyng/kalenyoung-portfolio',
    caseStudy: 'portfolio-v2',
  },
];
