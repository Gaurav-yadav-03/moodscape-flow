import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Award } from 'lucide-react';
import { useBadges, Badge as BadgeType } from '@/hooks/useBadges';
import { Entry } from '@/types/journal';

interface BadgeDisplayProps {
  entries: Entry[];
}

export function BadgeDisplay({ entries }: BadgeDisplayProps) {
  const { badges, earnedBadges, totalBadges, earnedCount } = useBadges(entries);

  const badgesByCategory = badges.reduce((acc, badge) => {
    if (!acc[badge.category]) acc[badge.category] = [];
    acc[badge.category].push(badge);
    return acc;
  }, {} as Record<string, BadgeType[]>);

  const categoryNames = {
    streak: 'Consistency',
    depth: 'Deep Thinking',
    mood: 'Emotional Growth',
    special: 'Special Moments'
  };

  const progressPercentage = (earnedCount / totalBadges) * 100;

  return (
    <Card className="journal-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Achievement Badges</span>
          </div>
          <Badge variant="secondary">
            {earnedCount}/{totalBadges}
          </Badge>
        </CardTitle>
        <Progress value={progressPercentage} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(badgesByCategory).map(([category, categoryBadges]) => (
          <div key={category} className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              {categoryNames[category as keyof typeof categoryNames]}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {categoryBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`
                    p-3 rounded-lg border transition-all
                    ${badge.earned 
                      ? 'border-primary bg-primary/5 shadow-sm' 
                      : 'border-border bg-muted/50 opacity-60'
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`text-2xl ${badge.earned ? '' : 'grayscale'}`}>
                      {badge.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm ${badge.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {badge.name}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {badge.description}
                      </div>
                      {badge.earned && badge.earnedDate && (
                        <div className="text-xs text-primary font-medium mt-1">
                          Earned {new Date(badge.earnedDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {badge.earned && (
                      <Award className="h-4 w-4 text-primary flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {earnedBadges.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Start writing to unlock your first badge!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}