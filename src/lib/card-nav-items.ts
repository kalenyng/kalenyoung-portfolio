export const cardNavItems = [
  {
    label: 'Work',
    bgColor: '#1a1917',
    textColor: '#e8e4dc',
    links: [
      {
        label: 'Experience',
        href: '/#experience',
        ariaLabel: 'Production experience',
        umamiEvent: 'nav-click',
        umamiTarget: 'experience',
      },
      {
        label: 'Selected work',
        href: '/#work',
        ariaLabel: 'Selected projects',
        umamiEvent: 'nav-click',
        umamiTarget: 'work',
      },
      {
        label: 'GitHub',
        href: 'https://github.com/kalenyng',
        ariaLabel: 'GitHub profile',
        external: true,
        umamiEvent: 'social-click',
        umamiPlatform: 'github',
      },
    ],
  },
  {
    label: 'About',
    bgColor: '#2e2c28',
    textColor: '#e8e4dc',
    links: [
      {
        label: 'How I work',
        href: '/#how-i-work',
        ariaLabel: 'How Kalen works',
        umamiEvent: 'nav-click',
        umamiTarget: 'how-i-work',
      },
    ],
  },
  {
    label: 'Contact',
    bgColor: '#c24e08',
    textColor: '#121110',
    links: [
      {
        label: 'Email',
        href: 'mailto:kalenyoung03@gmail.com',
        ariaLabel: 'Email Kalen Young',
        umamiEvent: 'contact-click',
      },
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/kalen-young',
        ariaLabel: 'LinkedIn profile',
        external: true,
        umamiEvent: 'social-click',
        umamiPlatform: 'linkedin',
      },
      {
        label: 'CV',
        href: '/docs/kalen-young-fullstack.pdf',
        ariaLabel: 'Download CV (opens in a new tab)',
        external: true,
        umamiEvent: 'cv-download',
      },
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
