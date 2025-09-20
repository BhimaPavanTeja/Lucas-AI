'use client';

import { useState } from 'react';
import type { Quest } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Award, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { completeQuestClientSide } from '@/lib/quest-completion';

interface QuestItemProps {
  quest: Quest;
  userId: string;
  onComplete?: () => void; // Callback to refresh the quest list
}

export default function QuestItem({ quest, userId, onComplete }: QuestItemProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleComplete = async () => {
    console.log('🎯 QuestItem handleComplete called with:', { userId, questId: quest.id, xpReward: quest.xpReward });
    
    if (!userId) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'User ID not found. Please log out and log back in.',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('🚀 Starting client-side quest completion...');
      
      const result = await completeQuestClientSide({ 
        userId, 
        xpReward: quest.xpReward, 
        questId: quest.id 
      });
      
      console.log('🎊 Quest completion result:', result);
      
      if (result.success) {
        toast({
          title: result.levelUp ? '🎉 Level Up!' : '✨ Quest Completed!',
          description: result.message,
          duration: 6000,
        });
        
        // Call the callback to refresh the quest list
        if (onComplete) {
          console.log('🔄 Triggering quest list refresh...');
          setTimeout(onComplete, 1000);
        }
      } else {
        console.error('❌ Quest completion failed:', result.message);
        toast({
          variant: 'destructive',
          title: 'Quest Completion Failed',
          description: result.message,
          duration: 10000,
        });
      }
    } catch (error) {
      console.error('💥 Unexpected error in handleComplete:', error);
      toast({
        variant: 'destructive',
        title: 'Unexpected Error',
        description: 'Something went wrong. Please try again.',
        duration: 10000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-secondary/50 transition-shadow hover:shadow-md">
      <div className="flex items-center p-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold">{quest.questTitle}</CardTitle>
            <Badge variant={quest.type === 'daily' ? 'default' : 'secondary'} className="text-xs">
              {quest.type === 'daily' ? (
                <>
                  <Clock className="mr-1 h-3 w-3" />
                  Daily
                </>
              ) : (
                <>
                  <Calendar className="mr-1 h-3 w-3" />
                  Weekly
                </>
              )}
            </Badge>
            {quest.difficulty && (
              <Badge variant="outline" className="text-xs capitalize">
                {quest.difficulty}
              </Badge>
            )}
          </div>
          <CardDescription className="text-sm">{quest.questDesc}</CardDescription>
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
