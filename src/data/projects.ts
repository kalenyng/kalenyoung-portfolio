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
}

export const projects: Project[] = [
  {
    slug: 'propza',
    title: 'Propza',
    summary:
      'A comprehensive property management SaaS for landlords and tenants, featuring real-time dashboards, automated rent tracking, and dark mode support.',
    tech: ['Angular 19', 'Supabase', 'Tailwind CSS', 'TypeScript', 'Vercel'],
    year: 2024,
    highlights: [
      'Secure authentication with role-based access (landlord/tenant)',
      'Real-time rent due calculations and payment tracking',
      'Interactive dashboards with property analytics',
      'Fully responsive dark mode with persistent theme',
      'Optimized bundle size with lazy-loaded modules',
    ],
    image: '/images/propza-cover.jpg',
    url: 'https://propza.vercel.app',
    repo: 'https://github.com/kalenyoung/propza',
    caseStudy: 'propza',
  },
  {
    slug: 'eiran-ruth-wedding',
    title: 'Eiran & Ruth Wedding',
    summary:
      'A beautiful, custom wedding website with photo galleries, RSVP management, dietary requirements, and guest messaging powered by Cloudinary and Supabase.',
    tech: ['Angular', 'Supabase', 'Cloudinary', 'Tailwind CSS', 'TypeScript'],
    year: 2023,
    highlights: [
      'Dynamic photo gallery with Cloudinary optimization',
      'Guest RSVP system with dietary requirement forms',
      'Secure admin panel for managing guest lists',
      'Responsive design with elegant animations',
      'Real-time updates via Supabase subscriptions',
    ],
    image: '/images/wedding-cover.jpg',
    url: 'https://eiranandrutswedding.vercel.app',
    caseStudy: 'eiran-ruth-wedding',
  },
  {
    slug: 'winterscar',
    title: 'Winterscar Chronicles',
    summary:
      'An immersive creative portfolio site for a fictional fantasy book series, featuring interactive maps, character profiles, and atmospheric design.',
    tech: ['Astro', 'Tailwind CSS', 'TypeScript', 'Motion One'],
    year: 2024,
    highlights: [
      'Parallax hero with custom SVG mountain illustrations',
      'Interactive map with clickable regions and tooltips',
      'Markdown-based content for book chapters',
      'Optimized for performance (Lighthouse 100)',
      'Accessible keyboard navigation and screen reader support',
    ],
    image: '/images/winterscar-cover.jpg',
    url: 'https://winterscar.vercel.app',
    repo: 'https://github.com/kalenyoung/winterscar',
    caseStudy: 'winterscar',
  },
];

