---
title: 'Propza - Property Management SaaS'
summary: 'A comprehensive property management platform for landlords and tenants, built with Angular and Supabase.'
date: 2024-10-01
cover: '/images/propza-cover.jpg'
tags: ['SaaS', 'Full-Stack', 'Real-time']
tech: ['Angular 19', 'Supabase', 'Tailwind CSS', 'TypeScript', 'Vercel']
url: 'https://propza.vercel.app'
featured: true
---

## The Challenge

Property management is often fragmented across spreadsheets, emails, and manual tracking. Landlords need a centralized system to manage properties, track rent payments, and communicate with tenants. Tenants need transparency around their payments and an easy way to reach their landlords.

## The Solution

Propza is a full-stack SaaS application that brings property management into one intuitive platform. Built with Angular 19 and Supabase, it provides:

### Key Features

- **Role-based Authentication**: Separate experiences for landlords and tenants with secure, email-verified sign-up
- **Real-time Dashboards**: Interactive charts and metrics showing property performance, rent due dates, and payment history
- **Automated Rent Tracking**: Smart calculations for rent due dates, payment status, and arrears
- **Dark Mode**: Fully themed UI with persistent user preference
- **Responsive Design**: Mobile-first approach ensures usability on all devices

## Technical Approach

### Architecture

The application follows Angular's modular architecture with lazy-loaded feature modules for optimal performance. Supabase provides:

- **Database**: PostgreSQL with Row Level Security (RLS) policies
- **Authentication**: Email/password with role-based claims
- **Real-time**: Subscriptions for live data updates
- **Storage**: Document and image uploads

### Key Technical Decisions

1. **State Management**: RxJS + Angular services for reactive data flow
2. **Type Safety**: Strict TypeScript configuration with Supabase-generated types
3. **Styling**: Tailwind CSS with CSS custom properties for theming
4. **Performance**: Standalone components, OnPush change detection, virtual scrolling for large lists

## Code Highlights

```typescript
// rent-calculation.service.ts
calculateNextDueDate(lastPayment: Date, frequency: 'monthly' | 'weekly'): Date {
  const next = new Date(lastPayment);
  frequency === 'monthly'
    ? next.setMonth(next.getMonth() + 1)
    : next.setDate(next.getDate() + 7);
  return next;
}

isOverdue(dueDate: Date): boolean {
  return new Date() > new Date(dueDate);
}
```

*Example of rent calculation logic for real-time property dashboards.*

## Results & Impact

- ⚡ **Lighthouse Score**: 95+ across all metrics
- 🎯 **Bundle Size**: < 250KB initial load (lazy modules)
- 🔒 **Security**: Full RLS policies, no sensitive data exposed
- ♿ **Accessibility**: WCAG 2.1 AA compliant
- 📱 **Mobile-First**: Responsive down to 320px viewport

## Lessons Learned

1. **Supabase RLS is powerful**: Properly configured policies eliminate entire classes of security bugs
2. **Theme tokens > hardcoded values**: CSS variables made dark mode trivial to implement
3. **Real-time is a feature multiplier**: Users love seeing updates without refreshing
4. **Start with types**: Generating TypeScript types from the database schema saved countless hours

