import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Plus, TrendingUp, Heart, BookOpen, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  // Mock data for demonstration
  const moodData = {
    "2024-08-28": { mood: "happy", entry: "Had a wonderful day with friends!" },
    "2024-08-27": { mood: "calm", entry: "Peaceful morning meditation session." },
    "2024-08-26": { mood: "excited", entry: "Got the promotion I was hoping for!" },
    "2024-08-25": { mood: "sad", entry: "Missing home today." },
  };

  const streakCount = 7;
  const totalEntries = 23;
  const currentMood = "happy";

  const handleNewEntry = () => {
    toast({
      title: "Ready to write?",
      description: "Let's capture today's thoughts and feelings",
    });
    // Navigate to diary entry page
  };

  const getMoodEmoji = (mood: string) => {
    const moods = {
      happy: "😊",
      sad: "😢",
      excited: "🤩",
      calm: "😌",
      stressed: "😰",
      neutral: "😐"
    };
    return moods[mood as keyof typeof moods] || "😐";
  };

  const getMoodColor = (mood: string) => {
    const colors = {
      happy: "mood-happy",
      sad: "mood-sad",
      excited: "mood-excited",
      calm: "mood-calm",
      stressed: "mood-stressed",
      neutral: "mood-neutral"
    };
    return colors[mood as keyof typeof colors] || "mood-neutral";
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-warm rounded-xl shadow-soft">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-playfair font-semibold text-foreground">
                  Journal<span className="text-primary">+</span>
                </h1>
                <p className="text-sm text-muted-foreground">Welcome back, Alex!</p>
              </div>
            </div>
            
            <Button variant="gradient" onClick={handleNewEntry} className="shadow-medium">
              <Plus className="w-4 h-4" />
              New Entry
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Calendar Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="journal-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-playfair">
                  <CalendarDays className="w-5 h-5 text-primary" />
                  Your Journey
                </CardTitle>
                <CardDescription>
                  Track your daily thoughts and emotions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-xl border-0 w-full"
                  classNames={{
                    day: "h-12 w-12 text-sm rounded-xl transition-smooth hover:bg-muted/50",
                    day_selected: "bg-primary text-primary-foreground shadow-soft",
                    day_today: "bg-accent text-accent-foreground font-medium",
                    day_outside: "text-muted-foreground/50",
                    nav_button: "h-10 w-10 rounded-xl hover:bg-muted/50 transition-smooth",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-lg font-medium",
                    table: "w-full border-collapse",
                    head_row: "flex",
                    head_cell: "text-muted-foreground rounded-md w-12 font-normal text-xs",
                    row: "flex w-full mt-2",
                    cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
                  }}
                />
                
                {/* Mood indicators overlay */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.entries(moodData).map(([date, data]) => (
                    <div
                      key={date}
                      className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-xl backdrop-blur-sm"
                    >
                      <span className="text-lg">{getMoodEmoji(data.mood)}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(date).getDate()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Entries */}
            <Card className="journal-card border-0">
              <CardHeader>
                <CardTitle className="font-playfair">Recent Entries</CardTitle>
                <CardDescription>Your latest thoughts and reflections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(moodData).slice(0, 3).map(([date, data]) => (
                  <div
                    key={date}
                    className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-smooth cursor-pointer group"
                  >
                    <div className={`p-2 rounded-full ${getMoodColor(data.mood)}`}>
                      <span className="text-lg">{getMoodEmoji(data.mood)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">
                          {new Date(date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                        <Badge variant="secondary" className="capitalize text-xs">
                          {data.mood}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground transition-smooth">
                        {data.entry}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="journal-card border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary">{streakCount}</p>
                      <p className="text-xs text-muted-foreground">Day Streak</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="journal-card border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-accent">{totalEntries}</p>
                      <p className="text-xs text-muted-foreground">Total Entries</p>
                    </div>
                    <div className="p-3 bg-accent/10 rounded-xl">
                      <Heart className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Mood */}
            <Card className="journal-card border-0">
              <CardHeader>
                <CardTitle className="text-lg font-playfair">Today's Mood</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${getMoodColor(currentMood)}`}>
                    <span className="text-3xl">{getMoodEmoji(currentMood)}</span>
                  </div>
                  <div>
                    <p className="font-medium capitalize text-lg">{currentMood}</p>
                    <p className="text-sm text-muted-foreground">
                      Keep up the positive energy!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="journal-card border-0">
              <CardHeader>
                <CardTitle className="text-lg font-playfair">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Sparkles className="w-4 h-4" />
                  View Insights
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <CalendarDays className="w-4 h-4" />
                  Monthly Review
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Heart className="w-4 h-4" />
                  Mood Patterns
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <Button 
        variant="floating" 
        size="floating" 
        onClick={handleNewEntry}
        className="shadow-strong"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default Dashboard;