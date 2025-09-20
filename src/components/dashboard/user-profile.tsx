'use client';

import type { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User as UserIcon } from 'lucide-react';

interface UserProfileProps {
  user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
  const xpForNextLevel = 1000;
  const currentLevelXp = user.xp % xpForNextLevel;
  const progressPercentage = (currentLevelXp / xpForNextLevel) * 100;

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src={`https://i.pravatar.cc/150?u=${user.uid}`} alt={user.name} />
          <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <CardDescription>{user.career}</CardDescription>
        </div>
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
