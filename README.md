# KryptoCritics - Movie Review Platform

A modern, professional movie review platform built with React, TypeScript, and Supabase. Users can discover movies, submit ratings and reviews, and manage their personal watchlists.

## Features

- **Movie Discovery**: Browse and explore a curated collection of movies
- **User Authentication**: Secure sign-up and sign-in functionality
- **Rating System**: Rate movies on a 5-star scale
- **Review Management**: Write and share detailed movie reviews
- **Personal Wishlist**: Save movies to watch later
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Live data synchronization with Supabase

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **State Management**: React Query, Context API
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/nandhayogesh/film-folio-notes.git
cd film-folio-notes
```

2. Install dependencies
```bash
npm install
```

3. Environment Setup
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Set up the database
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL script from `QUICK_SETUP.sql`

6. Start the development server
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React context providers
├── data/               # Static data and constants
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and services
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

## Database Schema

The application uses the following main tables:

- **profiles**: User profile information
- **reviews**: Movie reviews and ratings
- **watchlist**: User movie watchlists

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables (Production)

Set these variables in your Vercel project settings:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- Row Level Security (RLS) enabled on all database tables
- Environment variables for sensitive configuration
- Secure authentication with Supabase Auth
- Input validation and sanitization

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.

---

Built with React, TypeScript, and Supabase

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
