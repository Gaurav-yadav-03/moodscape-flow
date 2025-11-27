# MoodScape Flow

A modern, beautiful personal diary and mood tracking application built for mindful journaling and emotional wellness.

## 🌟 Features

### Core Features
- **Daily Journaling** - Write one entry per day with rich text editing
- **Mood Tracking** - Track your emotional state with visual mood selection
- **Autosave** - Never lose your thoughts with automatic saving
- **Themes & Customization** - Multiple visual themes and custom backgrounds
- **Responsive Design** - Works seamlessly on desktop and mobile

### AI-Powered Features
- **Smart Summarization** - Get concise summaries of your entries
- **Mood Detection** - AI analyzes your writing and suggests moods
- **Personal Reflections** - Receive thoughtful insights and encouragement
- **Trend Analysis** - Understand your emotional patterns over time

### Gamification
- **Streak Tracking** - Build consistency with daily journaling streaks
- **Achievement Badges** - Unlock badges for various milestones
- **Mood Calendar** - Visualize your 30-day emotional journey

### Additional Features
- **Sticky Notes** - Quick thoughts alongside your main entry
- **Emoji Picker** - Express yourself with emojis
- **Secure & Private** - Your data is protected with Row Level Security

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + shadcn/ui components
- **Backend**: Supabase (Authentication, Database, Edge Functions)
- **AI**: Local sentiment analysis with optional OpenAI integration
- **State Management**: TanStack Query (React Query)

## 📋 Prerequisites

- Node.js 18+ or Bun
- Supabase account
- (Optional) OpenAI API key for enhanced AI features

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd moodscape-flow
npm install
# or
bun install
```

### 2. Environment Setup

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

See `.env.example` for a complete template.

### 3. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key from Settings > API
3. The database migrations will auto-apply on first use
4. (Optional) Deploy the edge function from `supabase/functions/analyze-entry`

### 4. Run Development Server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:8080](http://localhost:8080) to view the app.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🗄️ Database Schema

The application uses three main tables:

- **profiles** - User profile information
- **entries** - Journal entries with content, mood, and theme settings
- **user_settings** - User preferences and default settings

All tables are protected with Row Level Security (RLS) policies ensuring users can only access their own data.

## 🔒 Security

- Authentication handled by Supabase Auth
- Row Level Security (RLS) on all database tables
- User data is completely isolated
- No API keys exposed in frontend code
- Secure session management with auto-refresh

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify

1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Other Platforms

The app is a standard Vite React application and can be deployed to any static hosting service.

## 📖 Documentation

For detailed setup instructions, see [SETUP_README.md](./SETUP_README.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🆘 Support

For issues or questions:
1. Check the [SETUP_README.md](./SETUP_README.md) troubleshooting section
2. Review browser console for error messages
3. Verify all environment variables are correctly set
4. Check Supabase dashboard for database and auth issues

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Export entries to PDF/Markdown
- [ ] Voice journaling
- [ ] Advanced analytics dashboard
- [ ] Social features (optional sharing)
- [ ] Integration with meditation apps

---

Built with ❤️ for mindful journaling and emotional wellness.
