---
title: 'Winterscar Chronicles'
summary: 'An immersive creative site that brings a fictional fantasy world to life through interactive maps, character profiles, and rich atmosphere.'
date: 2024-01-15
cover: '/images/winterscar-cover.jpg'
tags: ['Creative', 'Astro', 'Motion']
tech: ['Astro', 'Tailwind CSS', 'TypeScript', 'Motion One']
url: 'https://winterscar-chronicles.vercel.app/'
repo: 'https://github.com/kalenyng/winterscar-chronicles'
featured: false
---

## The Challenge

To create a performant, immersive experience blending storytelling and design — without compromising load times or accessibility.

## The Solution

Built entirely in Astro to leverage static performance and modern motion. The site uses modular components for characters, maps, and lore, with smooth Motion One animations and Markdown-based content authoring.

## Key Features

- **Parallax hero section** using Motion One
- **Interactive map** with hoverable tooltips
- **Character profile cards** with flip animations
- **Markdown-driven content** for stories and lore
- **Optimized assets** for high Lighthouse scores

## Technical Approach

- **Framework**: Astro + Motion One for low-cost animations
- **Data**: Markdown files transformed into frontmatter-driven routes
- **Styling**: Tailwind utilities and CSS variables for theme consistency
- **Performance**: Static generation with optimized image handling

## Code Highlights

```typescript
// getPosts.ts
import fs from 'fs';
import matter from 'gray-matter';

export function getAllLoreEntries() {
  const files = fs.readdirSync('./src/content/lore');
  return files.map(file => {
    const content = fs.readFileSync(`./src/content/lore/${file}`, 'utf-8');
    const { data, content: body } = matter(content);
    return { ...data, body };
  });
}
```

*Loads and parses Markdown lore entries for the interactive map.*

## Results & Impact

- ⚡ **Lighthouse 100 Performance**
- 🎨 **Recognized for creative design** and animation execution
- 📖 **Improved Markdown-driven workflow** for future projects

## Lessons Learned

Animation timing and easing are crucial for immersion — subtle movement feels more polished than over-the-top motion.
