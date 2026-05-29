---
title: Simon Clark Fitness
tagline: Astro marketing site. Scoped, delivered on time, live in production.
role: Freelance
year: 2026
featured: true
flagship: false
tech:
  - Astro
  - HTML
  - CSS
  - TypeScript
cover: /images/projects/simon-clark-cover.webp
---

Simon is a personal trainer based in Berkshire, working primarily with clients over 50. He had no website. Bookings came through word of mouth, and there was no way for someone searching locally to find him, understand what he offers, or get in touch.

The brief was simple: fix that. A site that works for someone searching "personal trainer Berkshire," explains Simon's services clearly, and makes booking easy. Delivered in a month.

## The stack

Astro 6, plain CSS, no framework, no CMS. The output is a static site: HTML, CSS, and small client-side script blocks. No server, no API routes, no database. The dependency list is essentially Astro plus EmailJS. That was a deliberate choice. A personal trainer does not need a React app. He needs fast pages, clear copy, and a contact form that works.

## Forms without a backend

The main technical decision was how to handle contact and booking without a backend. The answer was EmailJS: client-side email delivery via a shared helper in `src/utils/formSubmission.ts` that handles validation, message formatting, and an optional auto-reply to the person who submitted the form.

Two entry points use it: the contact section and a booking modal. Credentials come from Astro public env vars. If the env vars are missing, the form shows a friendly fallback rather than breaking silently.

<div class="callout">

The tradeoffs are real and were made consciously. The EmailJS public key is exposed client-side. Deliverability and spam handling sit with EmailJS, not with a backend you control. For a small business site with low form volume, that's an acceptable tradeoff. A bespoke form backend would be over-engineering for Simon's needs and would add ongoing maintenance he'd have to rely on me for.

</div>

## Local SEO as product work

The `Layout.astro` file does more than wrap pages. It carries a default title and description tuned for Berkshire and over-50s personal training, Open Graph and Twitter card meta, geo meta tags, and a `LocalBusiness` JSON-LD block with phone, address, hours, and geo coordinates.

That JSON-LD is the difference between a site that looks nice and a site that has a chance of appearing in local search results. Structured data tells Google exactly what the business is, where it operates, and how to reach it. That's product work as much as dev work, and it's invisible to most clients until they start getting found.

## UX in vanilla JS

No UI library. Several features are hand-rolled:

- Scroll-reveal via `IntersectionObserver`
- A booking modal with open/close handling, Escape key support, body scroll lock, and focus on first field on open
- A mobile nav drawer
- A testimonial carousel with dot navigation, `aria-hidden` management, swipe support, and `prefers-reduced-motion` respect

The carousel is probably the most engineered piece on the site. Accessibility and overflow detection on a brochure site are easy to skip. They're in there anyway because the site represents Simon's business and it should work properly for everyone who lands on it.

## The handoff

Simon is not technical. The handoff had to account for that. DNS and hosting were handled on my side. The site went live on Vercel. After launch, Simon got a plain-language walkthrough covering what he owns, where it lives, and what to do if he needs something changed.

<div class="callout">

His email after launch: "It has been a pleasure, I will certainly be recommending you to others."

</div>

That's the finish line. Not the build, the handoff. A client who understands what they received and feels confident about it.

## What one month looked like

Discovery and scope first: understanding Simon's clients, his services, what "booking" means in his context (a phone call or email, not an online payment). Design and copy next, incrementally demoed so there were no surprises at the end. Build against that agreed scope. Launch covering DNS, Vercel deployment, and domain hookup. Handoff covering ownership and basic maintenance.

Freelance means you own the whole chain. There is no project manager chasing approvals, no handoff between a designer and a developer, no separate DevOps step. One person, one month, shipped.
