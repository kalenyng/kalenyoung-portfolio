---
title: 'Eiran & Ruth Wedding Website'
summary: 'A custom wedding website with photo galleries, RSVP management, and guest messaging.'
date: 2023-09-15
cover: '/images/wedding-cover.jpg'
tags: ['Personal Project', 'Full-Stack', 'Event Management']
tech: ['Angular', 'Supabase', 'Cloudinary', 'Tailwind CSS', 'TypeScript']
url: 'https://eiranandrutswedding.vercel.app'
featured: false
---

## The Challenge

Weddings involve coordinating hundreds of details with dozens of guests. The couple wanted a beautiful, personalized website that could:

- Display event details and venue information
- Showcase engagement photos in an elegant gallery
- Collect RSVPs with dietary requirements
- Allow guests to leave messages and well-wishes
- Provide a secure admin panel for managing responses

## The Solution

A custom-built wedding website that combines visual elegance with practical functionality. The site serves as both a digital invitation and a guest management system.

### Key Features

- **Photo Gallery**: Cloudinary-powered image optimization with lazy loading and responsive srcsets
- **RSVP System**: Multi-step form with validation, dietary preferences, and plus-one management
- **Guest Messages**: Real-time message board with moderation capabilities
- **Admin Dashboard**: Secure panel for viewing RSVPs, managing dietary requirements, and downloading guest lists
- **Timeline**: Interactive schedule of wedding day events
- **Venue Maps**: Embedded maps with directions to ceremony and reception locations

## Technical Approach

### Architecture

Built as a single-page application with Angular, leveraging Supabase for backend services:

- **Database**: Guest table with RSVP status, dietary info, and messages
- **Storage**: Cloudinary for image CDN and transformations
- **Real-time**: Live updates to message board
- **Authentication**: Admin-only access for management features

### Design Philosophy

The design takes inspiration from classic wedding stationery with a modern twist:

- Serif typography (Playfair Display) for elegance
- Soft color palette: ivory, sage green, and gold accents
- Subtle parallax scrolling for depth
- Card-based layouts for information hierarchy
- Mobile-first responsive design

### Code Highlights

```typescript
// RSVP form with reactive validation
export class RsvpFormComponent {
  rsvpForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    attending: ['', Validators.required],
    dietaryRequirements: [''],
    plusOne: [false],
    plusOneName: [''],
    message: ['', Validators.maxLength(500)]
  });

  async submitRsvp() {
    const { data, error } = await this.supabase
      .from('rsvps')
      .insert(this.rsvpForm.value);
    
    if (!error) {
      this.showSuccessMessage();
    }
  }
}
```

### Image Optimization

Cloudinary transformations ensure fast load times:

```typescript
getOptimizedImage(publicId: string, width: number): string {
  return `https://res.cloudinary.com/demo/image/upload/w_${width},q_auto,f_auto/${publicId}`;
}
```

## Results & Impact

- 📸 **150+ Photos**: Optimized and served via Cloudinary CDN
- 👥 **200+ RSVPs**: Collected and managed through the platform
- ⚡ **3s Load Time**: Even on 3G connections
- 💌 **100% Positive Feedback**: From both the couple and guests
- 📱 **Mobile Usage**: 75% of visitors accessed via mobile devices

## Lessons Learned

1. **Accessibility matters**: Large text, high contrast, and keyboard navigation were essential for guests of all abilities
2. **Form UX is critical**: Multi-step forms with clear progress indicators reduced abandonment
3. **Image optimization is non-negotiable**: Cloudinary saved 80% bandwidth vs. unoptimized images
4. **Real-time creates delight**: Watching messages appear instantly added a sense of community
5. **Admin tools save time**: Being able to export CSV of RSVPs and dietary requirements was invaluable for caterers

## Special Touches

- Custom animated SVG illustrations of the venue
- Countdown timer to the wedding day
- Playlist preview of ceremony and reception music
- Interactive seating chart (admin only)
- QR code for easy mobile access from paper invites

---

*A labor of love built for friends, demonstrating the power of modern web technologies to create meaningful experiences for life's special moments.*

