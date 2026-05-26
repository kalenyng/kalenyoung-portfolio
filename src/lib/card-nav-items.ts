export const cardNavItems = [
  {
    label: 'Work',
    bgColor: '#1a1917',
    textColor: '#e8e4dc',
    links: [
      { label: 'Experience', href: '/#experience', ariaLabel: 'Production experience' },
      { label: 'Selected work', href: '/#work', ariaLabel: 'Selected projects' },
      { label: 'GitHub', href: 'https://github.com/kalenyng', ariaLabel: 'GitHub profile', external: true },
    ],
  },
  {
    label: 'About',
    bgColor: '#2e2c28',
    textColor: '#e8e4dc',
    links: [{ label: 'How I work', href: '/#how-i-work', ariaLabel: 'How Kalen works' }],
  },
  {
    label: 'Contact',
    bgColor: '#c24e08',
    textColor: '#121110',
    links: [
      { label: 'Email', href: 'mailto:kalenyoung03@gmail.com', ariaLabel: 'Email Kalen Young' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kalen-young', ariaLabel: 'LinkedIn profile', external: true },
      { label: 'CV', href: '/docs/kalen-young-fullstack.pdf', ariaLabel: 'Download CV' },
    ],
  },
] as const;

export const cardNavTheme = {
  baseColor: '#1a1917',
  menuColor: '#e8e4dc',
  buttonBgColor: '#e8610a',
  buttonTextColor: '#121110',
  ctaLabel: 'Contact',
  ctaHref: '/#contact',
  ease: 'power3.out',
} as const;
