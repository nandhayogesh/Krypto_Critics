# Deployment Guide

## Prerequisites

- Supabase account and project
- Vercel account
- GitHub repository

## Database Setup

1. Access your Supabase dashboard
2. Navigate to SQL Editor > New Query
3. Execute the SQL script from `QUICK_SETUP.sql`

## Vercel Deployment

### Using Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Using GitHub Integration

1. Connect your GitHub repository to Vercel
2. Import the project
3. Configure environment variables
4. Deploy

## Environment Variables

Configure these in your Vercel project settings:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Verification

After deployment, verify:
- Site loads without errors
- User authentication works
- Movie rating and review functionality
- Wishlist functionality
- Mobile responsiveness

## Troubleshooting

### Build Issues
- Check TypeScript compilation: `npm run type-check`
- Verify all dependencies are installed
- Test local build: `npm run build`

### Runtime Issues
- Verify environment variables are set correctly
- Check Supabase connection in dashboard
- Review browser console for errors
- Check Vercel deployment logs