# Journal+ - Personal Digital Diary

A beautiful, modern personal diary app for capturing life's moments, tracking moods, and reflecting on your journey. Built with React, TypeScript, Tailwind CSS, and Supabase.

## ✨ Features

### Core Features
- **Daily Journaling**: Create one entry per day with rich text editing
- **Mood Tracking**: Track your emotions with intuitive emoji-based mood selection
- **Calendar View**: Visual calendar showing your journaling streak and mood history
- **Search & Filter**: Find past entries with powerful search functionality
- **Responsive Design**: Beautiful UI that works on all devices

### AI-Powered Features (Optional)
- **Smart Summaries**: AI-generated summaries of your entries
- **Mood Detection**: Automatic mood analysis from your writing
- **Reflections**: Personalized insights and positive reflections

### Design & UX
- **Modern UI**: Clean, minimal design with smooth animations
- **Multiple Themes**: Choose from different visual themes
- **Typography Options**: Select from multiple font styles
- **Auto-save**: Never lose your thoughts with automatic saving
- **Streak Tracking**: Gamified experience to maintain consistency

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- OpenAI API key (optional, for AI features)

### Installation

1. **Clone and install dependencies**
```bash
git clone <your-repo-url>
cd journal-plus
npm install
```

2. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your URL and anon key
   - Copy `.env.example` to `.env` and add your Supabase credentials

3. **Run database migrations**
   - In your Supabase dashboard, go to SQL Editor
   - Run the migration files in order:
     - `supabase/migrations/20250829043629_*.sql`
     - `supabase/migrations/20250829043733_*.sql`
     - `supabase/migrations/add_ai_features.sql`

4. **Configure AI features (Optional)**
   - Get an OpenAI API key from [platform.openai.com](https://platform.openai.com)
   - Add `VITE_OPENAI_API_KEY=your_key_here` to your `.env` file

5. **Start the development server**
```bash
npm run dev
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard and calendar views
│   ├── entry/          # Diary entry editor
│   └── ui/            # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and AI integration
├── pages/             # Main page components
├── types/             # TypeScript type definitions
└── integrations/      # Supabase client and types
```

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradient (#8B5CF6 to #EC4899)
- **Background**: Soft gray (#F8FAFC)
- **Cards**: Pure white with subtle shadows
- **Moods**: Semantic colors for different emotions

### Typography
- **Primary**: Inter (clean, modern)
- **Accent**: Playfair Display (elegant headers)
- **Code**: JetBrains Mono (focus mode)

### Components
- Consistent 8px spacing system
- Rounded corners (12px default)
- Subtle shadows and hover effects
- Smooth transitions and micro-interactions

## 🔧 Configuration

### Environment Variables
```env
# Required
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional (for AI features)
VITE_OPENAI_API_KEY=your_openai_api_key
```

### Supabase Setup
1. Create tables using the provided migration files
2. Enable Row Level Security (RLS) - already configured in migrations
3. Set up authentication with email/password (no email confirmation required)

### AI Features Setup
1. Create an OpenAI account and get an API key
2. Add the key to your `.env` file
3. AI features will automatically activate when the key is present

## 📱 Usage

### Creating Entries
- Only one entry per day is allowed
- Entries are automatically saved as you type
- Choose your mood, theme, and font style
- Add emojis with the quick picker

### Viewing Entries
- **Calendar Mode**: See your mood history at a glance
- **List Mode**: Browse and search through all entries
- Click any entry to edit (only today's entry can be modified)

### AI Features
When enabled, the app will:
- Generate summaries for entries over 50 words
- Detect mood from your writing
- Provide positive reflections and insights

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI**: OpenAI GPT-3.5-turbo
- **Build Tool**: Vite
- **UI Components**: Radix UI + shadcn/ui

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- API keys stored securely in environment variables
- Client-side OpenAI integration (consider server-side for production)

## 🚀 Deployment

### Recommended: Vercel/Netlify
1. Connect your repository
2. Add environment variables
3. Deploy automatically on push

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🆘 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify your Supabase configuration
3. Ensure all environment variables are set correctly
4. Check that database migrations have been applied

---

**Journal+** - Your personal space for thoughts and growth 🌱