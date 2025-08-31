import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Save, 
  Palette, 
  Type, 
  Smile, 
  Clock,
  Heart,
  Sparkles,
  Cloud,
  Sun,
  Moon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DiaryEntryProps {
  onNavigate: (page: "dashboard" | "diary") => void;
  onLogout: () => void;
}

const DiaryEntry = ({ onNavigate, onLogout }: DiaryEntryProps) => {
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState("neutral");
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [selectedFont, setSelectedFont] = useState("inter");
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const { toast } = useToast();

  const moods = [
    { id: "happy", emoji: "😊", label: "Happy", color: "mood-happy" },
    { id: "excited", emoji: "🤩", label: "Excited", color: "mood-excited" },
    { id: "calm", emoji: "😌", label: "Calm", color: "mood-calm" },
    { id: "neutral", emoji: "😐", label: "Neutral", color: "mood-neutral" },
    { id: "sad", emoji: "😢", label: "Sad", color: "mood-sad" },
    { id: "stressed", emoji: "😰", label: "Stressed", color: "mood-stressed" },
  ];

  const themes = [
    { id: "default", name: "Default", bg: "bg-card", preview: "bg-gradient-to-br from-card to-muted" },
    { id: "sunset", name: "Sunset", bg: "bg-gradient-sunset", preview: "bg-gradient-sunset" },
    { id: "ocean", name: "Ocean", bg: "bg-gradient-to-br from-blue-50 to-cyan-50", preview: "bg-gradient-to-br from-blue-100 to-cyan-100" },
  ];

  const fonts = [
    { id: "inter", name: "Inter", class: "font-inter", preview: "Modern & Clean" },
    { id: "playfair", name: "Playfair", class: "font-playfair", preview: "Elegant & Classic" },
    { id: "mono", name: "Mono", class: "font-mono", preview: "Code & Focus" },
  ];

  const emojis = ["😊", "❤️", "🌟", "🌈", "☀️", "🌙", "🎉", "💫", "🦋", "🌸", "🍃", "✨"];

  const handleAutoSave = () => {
    setIsAutoSaving(true);
    setTimeout(() => {
      setIsAutoSaving(false);
      toast({
        title: "Auto-saved",
        description: "Your entry has been saved automatically",
        duration: 2000,
      });
    }, 1000);
  };

  const handleSave = () => {
    toast({
      title: "Entry saved!",
      description: "Your thoughts have been captured for today",
    });
  };

  const insertEmoji = (emoji: string) => {
    setContent(prev => prev + emoji);
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => onNavigate("dashboard")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-playfair font-semibold">Today's Entry</h1>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isAutoSaving && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 animate-spin" />
                  Auto-saving...
                </div>
              )}
              <Button variant="gradient" onClick={handleSave}>
                <Save className="w-4 h-4" />
                Save Entry
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-3">
            <Card className={`journal-card border-0 min-h-[600px] ${themes.find(t => t.id === selectedTheme)?.bg}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-playfair">What's on your mind?</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      <span className="mr-1">{moods.find(m => m.id === selectedMood)?.emoji}</span>
                      {selectedMood}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onBlur={handleAutoSave}
                  placeholder="Start writing your thoughts, feelings, or anything that comes to mind..."
                  className={`min-h-[400px] border-0 bg-transparent resize-none text-base leading-relaxed ${fonts.find(f => f.id === selectedFont)?.class} placeholder:text-muted-foreground/50 focus-visible:ring-0`}
                  style={{ fontSize: '16px', lineHeight: '1.7' }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Controls */}
          <div className="space-y-6">
            {/* Mood Selection */}
            <Card className="journal-card border-0">
              <CardHeader>
                <CardTitle className="text-lg font-playfair flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  How are you feeling?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {moods.map((mood) => (
                    <Button
                      key={mood.id}
                      variant={selectedMood === mood.id ? "mood" : "outline"}
                      size="sm"
                      onClick={() => setSelectedMood(mood.id)}
                      className={`flex flex-col items-center gap-1 h-auto py-3 ${
                        selectedMood === mood.id ? mood.color : ""
                      }`}
                    >
                      <span className="text-lg">{mood.emoji}</span>
                      <span className="text-xs">{mood.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Theme Selection */}
            <Card className="journal-card border-0">
              <CardHeader>
                <CardTitle className="text-lg font-playfair flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Theme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {themes.map((theme) => (
                    <Button
                      key={theme.id}
                      variant={selectedTheme === theme.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTheme(theme.id)}
                      className="w-full justify-start"
                    >
                      <div className={`w-4 h-4 rounded-full mr-2 ${theme.preview}`}></div>
                      {theme.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Font Selection */}
            <Card className="journal-card border-0">
              <CardHeader>
                <CardTitle className="text-lg font-playfair flex items-center gap-2">
                  <Type className="w-5 h-5 text-primary" />
                  Font Style
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {fonts.map((font) => (
                    <Button
                      key={font.id}
                      variant={selectedFont === font.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedFont(font.id)}
                      className={`w-full justify-start ${font.class}`}
                    >
                      <Type className="w-4 h-4 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">{font.name}</div>
                        <div className="text-xs text-muted-foreground">{font.preview}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emoji Picker */}
            <Card className="journal-card border-0">
              <CardHeader>
                <CardTitle className="text-lg font-playfair flex items-center gap-2">
                  <Smile className="w-5 h-5 text-primary" />
                  Quick Emojis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {emojis.map((emoji, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => insertEmoji(emoji)}
                      className="text-lg hover:bg-muted/50 transition-smooth"
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="journal-card border-0">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Word count</p>
                  <p className="text-2xl font-bold text-primary">
                    {content.split(' ').filter(word => word.length > 0).length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryEntry;