'use client';

import type { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface UserProfileProps {
  user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
  const xpForNextLevel = 300; // Changed from 1000 to 300 XP per level
  const currentLevelXp = user.xp % xpForNextLevel;
  const progressPercentage = (currentLevelXp / xpForNextLevel) * 100;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">{user.name}</CardTitle>
        <CardDescription>{user.career}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-2 flex justify-between text-sm font-medium">
            <span className="text-muted-foreground">Level {user.level}</span>
            <span className="text-primary">{user.xp} XP</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="mt-1 text-right text-xs text-muted-foreground">
            {xpForNextLevel - currentLevelXp} XP to next level
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {user.skills.length > 0 ? (
              user.skills.map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No skills listed yet.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
