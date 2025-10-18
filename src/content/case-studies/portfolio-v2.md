---
title: 'Portfolio v2'
summary: 'The second iteration of my personal portfolio — rebuilt from scratch to emphasize speed, motion, and storytelling using Astro and TypeScript.'
date: 2025-02-01
cover: '/images/portfolio-v2-cover.jpg'
tags: ['Front-End', 'Astro', 'Tailwind']
tech: ['Astro', 'Tailwind CSS', 'TypeScript', 'Motion One', 'Vercel']
repo: 'https://github.com/kalenyng/kalenyoung-portfolio'
featured: false
---

## The Challenge

To design a portfolio that felt modern and interactive without sacrificing performance or accessibility.

## The Solution

A custom Astro site featuring subtle 3D effects, dynamic section reveals, and Markdown-driven project pages — all deployed through Vercel for lightning-fast builds.

## Key Features

- **Custom cursor** and interactive 3D background
- **Smooth scroll-based transitions** and animations
- **Markdown-based project pages** for easy updates
- **Fully responsive and accessible** design
- **Continuous integration** via GitHub + Vercel

## Technical Approach

- **Motion**: Motion One for GPU-accelerated transitions
- **Content**: Astro collections for project metadata
- **Styling**: Tailwind with CSS tokens for consistent theming
- **Build**: Optimized Astro static build with image compression

## Code Highlights

```typescript
// cursor.ts
document.addEventListener('mousemove', e => {
  const cursor = document.querySelector('.cursor') as HTMLElement;
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(1)`;
});
```

*Custom 3D cursor logic for dynamic user interactivity.*

## Results & Impact

- ⚡ **Lighthouse 100 performance**
- 🎨 **Positive feedback** for clean, interactive design
- 🧩 **Modular content structure** for future scalability

## Lessons Learned

Small motion details can elevate UX — timing and easing are key.

