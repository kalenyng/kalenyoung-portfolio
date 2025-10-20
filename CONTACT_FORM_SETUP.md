# Contact Form Setup

The contact form uses [Web3Forms](https://web3forms.com/) to handle email submissions. It's a free service for static sites with no backend required.

## Setup Instructions

1. **Get your Access Key:**
   - Go to https://web3forms.com/
   - Sign up for a free account
   - Add your email address (kalenyoung03@gmail.com)
   - Copy your Access Key

2. **Update the ContactForm component:**
   - Open `src/components/ContactForm.tsx`
   - Find line with: `value="YOUR_WEB3FORMS_ACCESS_KEY"`
   - Replace `YOUR_WEB3FORMS_ACCESS_KEY` with your actual access key

3. **Test the form:**
   - Run your dev server: `npm run dev`
   - Navigate to the contact section
   - Click "Email Me" to open the form
   - Submit a test message
   - Check your inbox for the form submission

## Features

- ✅ No backend required - works with static sites
- ✅ Free tier: 250 submissions/month
- ✅ Spam protection built-in
- ✅ Email notifications to kalenyoung03@gmail.com
- ✅ Mobile-friendly modal form
- ✅ Loading states and error handling
- ✅ Success confirmation message

## Alternative Services

If you prefer a different service, you can easily replace Web3Forms with:
- [Formspree](https://formspree.io/)
- [Getform](https://getform.io/)
- [Formcarry](https://formcarry.com/)

Just update the API endpoint in the `handleSubmit` function.

