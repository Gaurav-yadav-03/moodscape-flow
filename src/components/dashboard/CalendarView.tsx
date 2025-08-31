import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Entry, MOOD_OPTIONS } from '@/types/journal';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  entries: Entry[];
  loading: boolean;
}

export function CalendarView({ entries, loading }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getMoodEmoji = (mood: string) => {
    return MOOD_OPTIONS.find(m => m.value === mood)?.emoji || '😐';
  };

  const getEntryForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return entries.find(entry => entry.date === dateStr);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  if (loading) {
    return (
      <Card className="journal-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse-soft text-muted-foreground">
              Loading your calendar...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="journal-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">{monthYear}</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigateMonth('prev')}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigateMonth('next')}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="p-2" />;
            }
            
            const entry = getEntryForDate(date);
            const hasEntry = !!entry;
            const today = isToday(date);
            
            return (
              <Button
                key={date.toISOString()}
                variant="ghost"
                className={cn(
                  "h-16 p-2 flex flex-col items-center justify-center relative transition-smooth",
                  today && "ring-2 ring-primary",
                  hasEntry && "bg-gradient-to-br from-primary/10 to-accent/10",
                  "hover:scale-105 hover:shadow-medium"
                )}
              >
                <span className={cn(
                  "text-sm font-medium",
                  today && "text-primary font-bold",
                  hasEntry && "text-foreground"
                )}>
                  {date.getDate()}
                </span>
                
                {hasEntry && (
                  <div className="mt-1 space-y-1">
                    <div className="text-lg leading-none">
                      {getMoodEmoji(entry.mood)}
                    </div>
                    <div className="w-2 h-2 bg-primary rounded-full mx-auto" />
                  </div>
                )}
              </Button>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span>Has entry</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 border-2 border-primary rounded-full" />
              <span>Today</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}