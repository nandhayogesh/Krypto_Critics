# 🎬 KryptoCritics - Movie Review Platform

A modern, professional movie review platform built with React, TypeScript, and Supabase. Users can rate movies, write reviews, and manage their watchlists.

## 🚀 Features

- **Movie Reviews & Ratings**: Rate and review movies with a 5-star system
- **User Authentication**: Secure sign-up/sign-in with Supabase Auth
- **Wishlist Management**: Add movies to personal watchlist
- **Professional UI**: Clean, dark theme with responsive design
- **Real-time Data**: Live updates with Supabase integration
- **Auto-playing Carousel**: Featured movies showcase
- **Mobile Responsive**: Optimized for all devices

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: React Query, Context API
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Deployment**: Vercel

## 🚀 Deployment Guide

### Prerequisites

1. **Supabase Account**: Create a project at [supabase.com](https://supabase.com)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **GitHub Repository**: Push your code to GitHub

### Step 1: Setup Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** → **New Query**
3. Copy and paste the contents of `QUICK_SETUP.sql`
4. Click **Run** to create all necessary tables

### Step 2: Configure Environment Variables

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public key**
3. In Vercel, go to your project → **Settings** → **Environment Variables**
4. Add these variables:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# For production deployment
vercel --prod
```

#### Option B: GitHub Integration
1. Connect your GitHub repository to Vercel
2. Import your project
3. Configure environment variables
4. Deploy automatically on push

### Step 4: Verify Deployment

1. Check that the site loads correctly
2. Test user registration/login
3. Verify movie rating and review functionality
4. Test wishlist features

## 🔧 Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd film-folio-notes

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your Supabase credentials to .env.local
# VITE_SUPABASE_URL=your_url
# VITE_SUPABASE_ANON_KEY=your_key

# Run development server
npm run dev
```

## 📦 Build Commands

```bash
# Development build
npm run build:dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🗄️ Database Schema

The application uses these main tables:
- **profiles**: User profile information
- **reviews**: Movie reviews and ratings
- **watchlist**: User movie watchlists

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- User authentication with Supabase Auth
- Environment variables for sensitive data
- Secure API endpoints

## 🎯 Performance Optimizations

- Lazy loading of images
- Code splitting with React Router
- Optimized bundle with Vite
- CDN delivery via Vercel
- Responsive image loading

## 🐛 Troubleshooting

### Common Issues

1. **Offline Mode Banner**: Ensure Supabase environment variables are set correctly
2. **Build Errors**: Check TypeScript types and dependencies
3. **Routing Issues**: Verify `vercel.json` is properly configured
4. **Database Errors**: Ensure all tables are created in Supabase

### Environment Variables Checklist

- [ ] `VITE_SUPABASE_URL` is set
- [ ] `VITE_SUPABASE_ANON_KEY` is set
- [ ] Variables are prefixed with `VITE_`
- [ ] No trailing slashes in URLs

## 📞 Support

For deployment issues:
1. Check Vercel deployment logs
2. Verify Supabase connection
3. Ensure environment variables are set
4. Check browser console for errors

## 🎉 Success!

Once deployed, your KryptoCritics movie review platform will be live and ready for users to discover, rate, and review their favorite movies!

---

**Made with ❤️ using React, TypeScript, and Supabase**

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f36ab71e-b383-411b-9064-398aa664f62c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
