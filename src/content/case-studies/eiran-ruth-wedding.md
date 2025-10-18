---
title: 'Wedding Website'
summary: 'A real wedding website built to handle guest RSVPs, dietary preferences, and photo galleries — combining elegant design, real-time updates, and secure data handling.'
date: 2023-07-15
cover: '/images/wedding-cover.jpg'
tags: ['Full-Stack', 'Angular', 'Cloudinary']
tech: ['Angular', 'Supabase', 'Cloudinary', 'Tailwind CSS', 'TypeScript']
url: 'https://eiranandrutswedding.vercel.app'
featured: false
isPrivate: true
---

## The Challenge

Creating a personalized digital space for a real wedding that allowed hundreds of guests to RSVP, submit dietary requirements, and view event galleries — all while keeping the admin experience simple and intuitive.

## The Solution

A full-stack Angular application with Supabase as the backend, enabling real-time RSVP management and Cloudinary-powered media storage. Guests could register their attendance and dietary info securely, while the couple could manage submissions through an admin dashboard.

## Key Features

- **RSVP form** with secure Supabase insertions
- **Dietary requirement modal** for special meal notes
- **Cloudinary gallery integration** for optimized image loading
- **Real-time guest list updates**
- **Custom admin panel** for viewing and editing guest entries

## Technical Approach

- **Authentication**: Email-based admin login with Supabase Auth
- **Storage**: Cloudinary SDK for file upload, transformations, and CDN delivery
- **UI**: Angular standalone components styled with TailwindCSS
- **Performance**: Lazy loading and route-based prefetching

## Code Highlights

```typescript
// rsvp.service.ts
async submitRSVP(guestId: string, attending: boolean, notes?: string) {
  const { error } = await this.supabase
    .from('guests')
    .update({ attending, notes })
    .eq('id', guestId);

  if (error) throw error;
  return 'RSVP updated successfully';
}
```

*Handles guest RSVPs with Supabase CRUD and real-time updates.*

## Results & Impact

- 🎯 **100+ live RSVPs** managed successfully
- 📷 **Optimized gallery** with instant loading
- 💡 **Streamlined guest admin workflow** for event planners

## Lessons Learned

Managing a real event with live data introduced edge cases in authentication, data validation, and async workflows — improving my understanding of Supabase Realtime and Cloudinary optimization.
