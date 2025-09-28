# 🚀 Supabase Integration Setup Guide

## **1. Create Supabase Project**

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up/Sign in with GitHub
4. Create a new project:
   - **Project Name**: `film-folio`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to you
   - Click "Create new project"

## **2. Get Your Supabase Credentials**

1. In your Supabase dashboard, go to **Settings > API**
2. Copy the following:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon/public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## **3. Configure Environment Variables**

1. Update your `.env.local` file with your actual credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Important**: Replace `your-project-id` and the key with your actual values!

## **4. Set Up Database Tables**

1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy and paste the entire contents of `supabase-setup.sql`
4. Click **Run** to execute the SQL

This will create:
- ✅ `profiles` table for user data
- ✅ `reviews` table for movie reviews  
- ✅ `watchlist` table for saved movies
- ✅ Row Level Security policies
- ✅ Automatic user profile creation trigger

## **5. Configure Authentication**

1. Go to **Authentication > Settings** in Supabase
2. Under **Site URL**, add: `http://localhost:8083`
3. Under **Redirect URLs**, add: `http://localhost:8083`
4. Enable **Email confirmations** if desired (optional for development)

## **6. Test Your Setup**

1. Start your development server: `npm run dev`
2. Open `http://localhost:8083`
3. Click "Sign In" and try creating a new account
4. If successful, you should see the auth modal and be able to sign up!

## **📱 Features Now Available**

✅ **Real User Authentication**
- Sign up with email/password
- Email verification (optional)
- Secure session management

✅ **Real-time Database**
- PostgreSQL database with Supabase
- Row Level Security for data protection
- Real-time updates

✅ **User Reviews System**
- Rate and review movies (1-5 stars)
- Edit/update existing reviews
- View personal review history
- Real-time review statistics

✅ **User Profiles**
- Automatic profile creation on signup
- Username, first name, last name
- Avatar support (ready for future enhancement)

## **🔧 Development Notes**

- **No Demo Data**: All demo users and fake data removed
- **Production Ready**: Uses industry-standard Supabase backend
- **Scalable**: Can handle thousands of users and reviews
- **Secure**: Row Level Security ensures users only see their own data

## **🚀 Next Steps**

Your Film Folio app now has a complete authentication and database system! Users can:

1. **Sign up** for real accounts
2. **Rate & review** movies with persistent storage
3. **View their review history** in "My Reviews"
4. **Real-time updates** when reviews are added/modified

The demo data has been completely removed and replaced with a professional Supabase backend that can scale to production use!

## **📞 Need Help?**

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your `.env.local` credentials are correct
3. Ensure the SQL setup completed successfully
4. Check Supabase logs in the dashboard

Happy coding! 🎬✨