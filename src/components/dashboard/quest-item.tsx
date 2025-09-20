'use client';

import { useState } from 'react';
import type { Quest } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Loader2, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { completeQuest } from '@/app/actions';

interface QuestItemProps {
  quest: Quest;
  userId: string;
}

export default function QuestItem({ quest, userId }: QuestItemProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleComplete = async () => {
    setLoading(true);
    const result = await completeQuest({ userId, xpReward: quest.xpReward });
    if (result.success) {
      toast({
        title: 'Quest Completed!',
        description: `You've earned ${quest.xpReward} XP. Keep up the great work!`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }
    setLoading(false);
  };

  return (
    <Card className="bg-secondary/50 transition-shadow hover:shadow-md">
      <div className="flex items-center p-4">
        <div className="flex-1">
          <CardTitle className="text-base font-semibold">{quest.questTitle}</CardTitle>
          <CardDescription className="text-sm mt-1">{quest.questDesc}</CardDescription>
        </div>
        <div className="ml-4 flex flex-col items-center justify-center space-y-2 text-center">
            <div className="flex items-center font-bold text-primary">
                <Award className="mr-1 h-5 w-5" />
                <span>{quest.xpReward} XP</span>
            </div>
            <Button size="sm" onClick={handleComplete} disabled={loading}>
            {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Check className="mr-2 h-4 w-4" />
            )}
            Complete
            </Button>
        </div>
      </div>
    </Card>
  );
}
