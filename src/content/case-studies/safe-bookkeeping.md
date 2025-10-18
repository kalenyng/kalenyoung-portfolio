---
title: 'Safe Bookkeeping'
summary: 'A professional business website built for a UK-based bookkeeping firm using Angular. Focused on clarity, SEO performance, and a clean, trustworthy design that reflects financial reliability.'
date: 2024-03-15
cover: '/images/safebookkeeping-cover.jpg'
tags: ['Business', 'Front-End', 'Angular', 'SEO']
tech: ['Angular', 'Tailwind CSS', 'TypeScript', 'Vercel']
url: 'https://www.safebookkeeping.co.uk/'
repo: 'https://github.com/kalenyng/SafeBookkeeping'
featured: false
---

## The Challenge

The client needed a modern, trustworthy online presence to attract small business clients and improve their Google search visibility. Their previous site lacked structure, SEO, and mobile optimization.

## The Solution

I developed a new Angular-based website with a focus on responsive design, clear information architecture, and SEO-friendly metadata. The layout highlights services, testimonials, and contact options while maintaining a polished, professional aesthetic.

## Key Features

- **Responsive Angular front-end** optimized for mobile and desktop
- **Dynamic meta and Open Graph tags** for SEO and social sharing
- **Modular component structure** for scalable updates
- **Accessibility-focused layout** following WCAG 2.1 AA principles
- **Image and content optimization** for fast Core Web Vitals

## Technical Approach

- **Framework**: Angular with standalone components and lazy-loaded routes
- **Styling**: Tailwind CSS for utility-based responsive layouts
- **SEO**: Angular Meta service for dynamic titles and descriptions
- **Deployment**: Vercel for CI/CD and edge delivery

## Code Highlights

```typescript
// meta.service.ts
constructor(private meta: Meta, private title: Title) {}

setPageMeta(titleText: string, description: string) {
  this.title.setTitle(titleText);
  this.meta.updateTag({ name: 'description', content: description });
  this.meta.updateTag({ property: 'og:title', content: titleText });
  this.meta.updateTag({ property: 'og:description', content: description });
}
```

*Dynamic meta tag management for SEO and Open Graph optimization.*

## Results & Impact

- ⚡ **Lighthouse score**: 98 performance / 100 accessibility
- 📈 **Improved SEO visibility** for local bookkeeping searches
- 📱 **Fully responsive design** across all devices
- 💡 **Easy content management** through modular Angular structure

## Lessons Learned

Combining SEO strategy with modern front-end tooling requires careful metadata management and consistent structure. Focusing on clarity and performance was key to achieving strong business impact.

