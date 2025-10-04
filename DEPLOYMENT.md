# 🚀 Vercel Deployment Checklist

## Pre-Deployment Checklist

### ✅ Environment Setup
- [ ] Supabase project created and configured
- [ ] Database tables created (run `QUICK_SETUP.sql`)
- [ ] Environment variables ready (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] GitHub repository created and code pushed

### ✅ Code Quality
- [ ] `npm run lint` passes without errors
- [ ] `npm run type-check` passes without TypeScript errors
- [ ] `npm run build` completes successfully
- [ ] All console errors fixed

### ✅ Testing
- [ ] Application runs locally (`npm run dev`)
- [ ] User authentication works
- [ ] Movie rating/review functionality works
- [ ] Wishlist functionality works
- [ ] Mobile responsive design tested

## Deployment Steps

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy (First Time)
```bash
# From project root directory
vercel

# Answer the setup questions:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? krypto-critics (or your preferred name)
# - Directory? ./
# - Want to override settings? Y
# - Build command? npm run build
# - Output directory? dist
# - Development command? npm run dev
```

### 4. Configure Environment Variables
In Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
3. Set for: Production, Preview, and Development

### 5. Deploy to Production
```bash
vercel --prod
```

## Post-Deployment Verification

### ✅ Basic Functionality
- [ ] Site loads without errors
- [ ] All pages accessible (home, movie details, etc.)
- [ ] No 404 errors on refresh
- [ ] Console shows no critical errors

### ✅ Features Testing
- [ ] User can sign up/sign in
- [ ] Movie ratings work
- [ ] Reviews can be submitted
- [ ] Wishlist functionality works
- [ ] Navigation works correctly

### ✅ Performance
- [ ] Page load time under 3 seconds
- [ ] Images load properly
- [ ] Mobile experience is smooth
- [ ] No broken links or assets

## Common Issues & Solutions

### 🔧 Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check

# Test local build
npm run build
npm run preview
```

### 🔧 Environment Variables Not Working
- Ensure variables start with `VITE_`
- Redeploy after adding environment variables
- Check Vercel dashboard settings

### 🔧 Routing Issues (404 on refresh)
- Verify `vercel.json` is in project root
- Check that rewrites configuration is correct

### 🔧 Supabase Connection Issues
- Test database connection in Supabase dashboard
- Verify RLS policies are set up correctly
- Check browser network tab for API errors

## Useful Commands

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs

# Remove deployment
vercel rm <deployment-url>

# Set custom domain
vercel domains add <your-domain.com>
```

## Success! 🎉

Your KryptoCritics app is now live on Vercel!

**Next Steps:**
1. Share the live URL
2. Monitor Vercel analytics
3. Set up custom domain (optional)
4. Monitor application performance
5. Set up continuous deployment from GitHub