# Kalen Young - Portfolio

A production-ready portfolio website with an adventure/expedition theme, built with Astro, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Fast & Performant**: Astro's islands architecture for minimal JavaScript
- **Accessible**: WCAG 2.1 AA compliant with semantic HTML and ARIA labels
- **Responsive**: Mobile-first design that works beautifully on all devices
- **Dark Mode**: Persistent theme toggle with smooth transitions
- **Animated**: Tasteful motion with Motion One, respecting `prefers-reduced-motion`
- **SEO Optimized**: Meta tags, Open Graph, sitemap, and robots.txt
- **Type-Safe**: Strict TypeScript with Content Collections for Markdown

## 📁 Project Structure

```
/
├── public/
│   ├── images/              # Project covers and photos (replace placeholders)
│   ├── favicon.svg
│   ├── og.png              # Social sharing image
│   ├── robots.txt
│   └── cv.pdf              # Your CV (replace placeholder)
├── src/
│   ├── components/         # Reusable UI components
│   ├── content/
│   │   └── case-studies/   # Markdown files for project case studies
│   ├── data/
│   │   └── projects.ts     # Project data (edit here!)
│   ├── layouts/
│   │   └── Base.astro      # Base HTML template
│   ├── pages/              # File-based routing
│   ├── styles/             # Global styles and theme tokens
│   └── utils/              # Animation helpers
├── astro.config.mjs
├── tailwind.config.ts
└── package.json
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- Git

### Install Dependencies

```bash
cd /tmp/kalenyoung-portfolio
npm install
# or
pnpm install
# or
yarn install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) to view the site.

### Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## ✏️ Content Editing

### Update Personal Info

1. **Projects**: Edit `src/data/projects.ts` to add/modify projects
2. **Case Studies**: Add/edit Markdown files in `src/content/case-studies/`
3. **Skills**: Edit the skills object in `src/components/SkillsGrid.astro`
4. **About**: Update bio and timeline in `src/pages/index.astro` (About section)
5. **Contact**: Change social links in `src/components/Footer.astro` and `src/components/ContactPanel.astro`
6. **Now Page**: Update what you're working on in `src/pages/now.astro`

### Replace Placeholder Images

All placeholder images are SVGs. Replace them with your actual photos:

- `/public/images/propza-cover.jpg` - Propza project screenshot
- `/public/images/wedding-cover.jpg` - Wedding site screenshot
- `/public/images/winterscar-cover.jpg` - Winterscar screenshot
- `/public/images/kalen-about.jpg` - Your photo for the About section
- `/public/og.png` - Social sharing image (1200x630px)
- `/public/cv.pdf` - Your actual CV

### Add a New Project

1. Add entry to `src/data/projects.ts`:

```typescript
{
  slug: 'my-project',
  title: 'My Awesome Project',
  summary: 'A brief description...',
  tech: ['React', 'Node.js'],
  year: 2024,
  highlights: ['Feature 1', 'Feature 2'],
  image: '/images/my-project-cover.jpg',
  url: 'https://myproject.com',
  repo: 'https://github.com/you/project',
  caseStudy: 'my-project',
}
```

2. Create case study at `src/content/case-studies/my-project.md`:

```markdown
---
title: 'My Awesome Project'
summary: 'A brief description...'
date: 2024-10-18
cover: '/images/my-project-cover.jpg'
tags: ['Web App', 'Full-Stack']
tech: ['React', 'Node.js']
url: 'https://myproject.com'
repo: 'https://github.com/you/project'
featured: true
---

## The Challenge
...
```

3. Add cover image to `/public/images/my-project-cover.jpg`

## 🎨 Customization

### Theme Colors

Edit `src/styles/tokens.css` to change the color palette:

```css
:root {
  --ink: #0a0e16;
  --alpine: #1e3a34;
  --mist: #a8b4b0;
  --ember: #f76c1b;
  --paper: #f9f9f9;
}
```

### Typography

Change fonts in `tailwind.config.ts`:

```typescript
fontFamily: {
  heading: ['Your Heading Font', 'serif'],
  body: ['Your Body Font', 'sans-serif'],
  code: ['Your Code Font', 'monospace'],
}
```

Don't forget to update the Google Fonts import in `src/styles/globals.css`.

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Vercel will auto-detect Astro and configure everything
4. Set your custom domain (kalenyoung.co.uk) in Project Settings

The site will auto-deploy on every push to `main`.

### Environment Variables

No environment variables needed for the static site. If you add backend integrations (like a contact form), set them in Vercel's Environment Variables section.

### Custom Domain

In Vercel:
1. Go to Project Settings → Domains
2. Add `kalenyoung.co.uk`
3. Follow Vercel's DNS instructions with your domain registrar

## 🧪 Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier
- `npm run typecheck` - TypeScript type checking

## 📊 Performance

Target Lighthouse scores (mobile):
- Performance: ≥ 95
- Accessibility: ≥ 95
- Best Practices: ≥ 95
- SEO: ≥ 95

Tips:
- Keep images optimized (use WebP, responsive sizes)
- Lazy-load images below the fold
- Minimize custom fonts
- Use Astro's `<Image>` component for automatic optimization

## ♿ Accessibility

Built with accessibility in mind:
- Semantic HTML throughout
- Skip-to-content link for keyboard users
- Visible focus indicators
- ARIA labels on interactive elements
- High contrast text
- `prefers-reduced-motion` respected
- Keyboard navigation for all interactive elements

## 🐛 Troubleshooting

### Build fails with TypeScript errors

Run `npm run typecheck` to see detailed errors. Common issues:
- Missing image paths in `/public/images/`
- Incorrect frontmatter in Markdown files

### Styles not applying

Clear `.astro/` cache and restart dev server:
```bash
rm -rf .astro node_modules/.astro
npm run dev
```

### Dark mode not persisting

Check that the theme initialization script in `src/layouts/Base.astro` is running before render.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Astro](https://astro.build)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Animated with [Motion One](https://motion.dev)
- Inspired by the [Now Page](https://nownownow.com) movement

---

**Built with ❤️ and ☕ by Kalen Young**

