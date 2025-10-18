export interface BioPeriod {
  id: string;
  year: string;
  title: string;
  description: string[];
  highlights?: string[];
}

export const bioPeriods: BioPeriod[] = [
  {
    id: '2024',
    year: '2024',
    title: 'Full-Stack Development',
    description: [
      "In 2024, I've been building production-level SaaS applications using Angular, Supabase, and modern TypeScript. Projects like Propza demonstrate my ability to handle authentication, real-time data, and complex state management.",
      "My focus is on scalable architecture, reusable component libraries, and crafting intuitive UX patterns. I'm particularly interested in performance optimization and accessibility best practices."
    ],
    highlights: ['Angular 19', 'Supabase', 'Real-time apps', 'TypeScript'],
  },
  {
    id: '2022',
    year: '2022',
    title: 'Career Transition',
    description: [
      "In 2022, I made the leap from hospitality into tech, teaching myself web development through hands-on projects and structured learning. This was a period of intense exploration—building everything from wedding websites to creative portfolios.",
      "I immersed myself in modern frameworks (React, Angular, Astro), UI design principles, and TypeScript fundamentals. Every project was a learning opportunity to understand how great web applications are built."
    ],
    highlights: ['Self-taught', 'React & Angular', 'UI/UX design', 'Side projects'],
  },
  {
    id: '2015',
    year: '2015–2021',
    title: 'Hospitality Management',
    description: [
      "Before becoming a developer, I spent six years in hospitality and events management, coordinating high-pressure operations and client experiences. I learned to manage teams, handle complex logistics, and solve problems creatively under tight deadlines.",
      "These years shaped my approach to collaboration, attention to detail, and user empathy—skills that directly translate to building great software. Understanding people and their needs has been invaluable in my transition to tech."
    ],
    highlights: ['Team leadership', 'Client relations', 'Problem-solving', 'Operations'],
  },
];

