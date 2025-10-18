export interface BioPeriod {
  id: string;
  year: string;
  title: string;
  description: string[];
  highlights?: string[];
}

export const bioPeriods: BioPeriod[] = [
  {
    id: '2025',
    year: '2025',
    title: 'Refining & Expanding',
    description: [
      "Lately, I’ve been focused on refining my approach to development—writing cleaner, more considered code and exploring how architecture, performance, and design all come together in a well-built product.",
      "It’s been a year of working on real applications, learning from the details, and growing more confident in building reliable, production-ready experiences."
    ],
    highlights: ['Full-stack development', 'Angular', 'Supabase', 'TypeScript'],
  },
  {
    id: '2024',
    year: '2024',
    title: 'Building Confidence',
    description: [
      "As my skills grew, I began to connect the pieces of front-end and back-end development—learning how data, logic, and design interact to create seamless user experiences.",
      "This was when I started approaching projects with more intention, focusing on maintainability, accessibility, and the craft behind good interface design."
    ],
    highlights: ['Angular', 'Supabase', 'Astro', 'Cloudinary'],
  },
  {
    id: '2023',
    year: '2023',
    title: 'Hands-On Learning',
    description: [
      "2023 was all about putting knowledge into practice. I built small applications, experimented with frameworks, and learned how to structure ideas into real, working projects.",
      "Through plenty of trial and error, I began to understand how to plan, test, and improve software in a way that balances creativity with functionality."
    ],
    highlights: ['UI/UX', 'APIs', 'Supabase', 'Practical skills'],
  },
  {
    id: '2022',
    year: '2022',
    title: 'Transition to Tech',
    description: [
      "After several years in hospitality, I decided to pursue my long-standing interest in technology. I began teaching myself the fundamentals of web development—HTML, CSS, and JavaScript—while exploring the basics of modern frameworks.",
      "It was the start of a new direction: one built on curiosity, persistence, and a desire to create experiences that people genuinely enjoy using."
    ],
    highlights: ['Self-taught', 'HTML/CSS/JS', 'React & Angular', 'Career change'],
  },
  {
    id: '2015',
    year: '2015–2021',
    title: 'Hospitality & Operations',
    description: [
      "Before moving into development, I spent several years in hospitality and events—fast-paced environments that demanded teamwork, empathy, and clear communication.",
      "That experience still shapes how I work today: staying organised under pressure, understanding people’s needs, and focusing on detail and delivery."
    ],
    highlights: ['Team leadership', 'Client care', 'Organisation', 'Problem-solving'],
  },
];
