# Journal+ Setup Guide

## Overview
Journal+ is a modern personal diary web application with AI-powered features, mood tracking, streak counting, and gamification elements.

## Technology Stack
- **Frontend**: React + TypeScript + TailwindCSS + Vite
- **Backend**: Supabase (Authentication, Database, Edge Functions)
- **AI**: OpenAI GPT API
- **UI Components**: shadcn/ui

## Prerequisites
- Node.js (v18+)
- npm or bun package manager
- Supabase account
- OpenAI API account

## Local Development Setup

### 1. Clone and Install Dependencies
```bash
git clone <your-repo-url>
cd journal-plus
npm install
# or
bun install
```

### 2. Supabase Setup

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for setup to complete
4. Note your project URL and anon key from Settings > API

#### Database Setup
The database schema will be automatically created with the following tables:
- `profiles` - User profile information
- `entries` - Journal entries with date, content, mood, theme settings

#### Row Level Security (RLS)
All tables have RLS enabled with policies ensuring users can only access their own data.

### 3. Environment Configuration

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration  
OPENAI_API_KEY=your_openai_api_key
```

**Important**: The OpenAI API key should be added through Supabase Edge Functions secrets, not as a frontend environment variable.

### 4. OpenAI API Setup

#### Get OpenAI API Key
1. Visit [platform.openai.com](https://platform.openai.com)
2. Create account or log in
3. Go to API Keys section
4. Create new secret key
5. Copy the key (save it securely - you won't see it again)

#### Add API Key to Supabase
1. In your Supabase dashboard, go to Edge Functions
2. Navigate to Settings/Secrets
3. Add new secret:
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key

### 5. Start Development Server

```bash
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:5173`

## Features Overview

### Core Features
- **Authentication**: Email/password with Supabase Auth
- **Daily Entries**: One entry per day restriction
- **Mood Tracking**: Visual mood selection and tracking
- **Themes**: Multiple visual themes + custom backgrounds
- **Autosave**: Entries save automatically as you type

### AI Features (Requires OpenAI API)
- **AI Summarizer**: Generate concise summaries of entries
- **Mood Detection**: AI analyzes text and suggests mood
- **AI Reflection**: Personalized insights and encouragement

### Gamification
- **Streak Tracking**: Consecutive days of journaling
- **Achievement Badges**: Unlock badges for various milestones
- **Mood Calendar**: Visual 30-day mood progression

### Advanced Features
- **Sticky Notes**: Quick thoughts alongside main entry
- **Emoji Picker**: Insert emojis anywhere in text
- **Responsive Design**: Works on desktop and mobile

## Deployment

### Supabase Production Deployment
1. Your Supabase project is already production-ready
2. Edge functions deploy automatically
3. Ensure all secrets are configured in production

### Frontend Deployment Options

#### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

#### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

#### Other Platforms
The app is a standard Vite React application and can be deployed to any static hosting service.

## Troubleshooting

### AI Features Not Working
1. **Check OpenAI API Key**: Ensure it's correctly added to Supabase secrets
2. **API Quota**: Verify your OpenAI account has sufficient credits
3. **Edge Function Logs**: Check Supabase Edge Function logs for errors

### Authentication Issues
1. **Email Settings**: Check Supabase Auth settings
2. **RLS Policies**: Ensure Row Level Security policies are properly configured
3. **URL Configuration**: Verify Supabase URL and keys are correct

### Database Issues
1. **Migration Status**: Check if all migrations have run successfully
2. **RLS Policies**: Verify policies allow user access to their data
3. **Table Structure**: Ensure all required tables exist

### Common Error Messages

#### "FunctionsHttpError: Edge Function returned a non-2xx status code"
- Check OpenAI API key in Supabase secrets
- Verify API key has sufficient credits
- Check Edge Function logs for detailed error

#### "Failed to fetch entries"
- Check database connection
- Verify RLS policies
- Ensure user is authenticated

## Development Notes

### File Structure
```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard views
│   ├── entry/          # Diary entry components
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── lib/                # Utility functions

supabase/
├── functions/          # Edge functions
└── migrations/         # Database migrations
```

### Key Hooks
- `useAuth()` - Authentication state management
- `useEntries()` - Journal entries CRUD operations
- `useAI()` - AI feature integration
- `useStreaks()` - Streak calculation
- `useBadges()` - Achievement system

### Database Schema
See `src/types/journal.ts` for complete type definitions.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase and OpenAI documentation
3. Check browser console for error messages
4. Verify all environment variables are correctly set

## Security Notes

- Never commit API keys to version control
- Use Supabase secrets for server-side API keys
- All database access is protected by Row Level Security
- User data is isolated and secure

## License

[Your License Here]