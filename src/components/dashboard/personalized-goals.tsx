'use client';

import { useState, useTransition } from 'react';
import type { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Wand2, CheckSquare } from 'lucide-react';
import { getAiGeneratedGoals } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PersonalizedGoalsProps {
  user: User;
}

export default function PersonalizedGoals({ user }: PersonalizedGoalsProps) {
  const [isPending, startTransition] = useTransition();
  const [goals, setGoals] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGenerateGoals = () => {
    startTransition(async () => {
      const result = await getAiGeneratedGoals({
        careerPath: user.career,
        xpLevel: user.xp,
        userSkills: user.skills,
        userGoals: "Advance in my career and learn new technologies.",
      });

      if (result.success && result.data) {
        setGoals(result.data.weeklyGoals);
        toast({
          title: 'New Goals Generated!',
          description: 'Your personalized weekly goals are ready.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Could not generate AI goals.',
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertTitle>Unlock Your Potential</AlertTitle>
        <AlertDescription>
          Use our AI to generate personalized weekly goals based on your career path and experience level.
        </AlertDescription>
      </Alert>
      
      <div className="text-center">
        <Button onClick={handleGenerateGoals} disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate My Weekly Goals
            </>
          )}
        </Button>
      </div>

      {isPending && (
         <div className="space-y-2 pt-4">
            <div className="h-6 w-3/4 animate-pulse rounded-md bg-muted-foreground/20"></div>
            <div className="h-6 w-1/2 animate-pulse rounded-md bg-muted-foreground/20"></div>
            <div className="h-6 w-2/3 animate-pulse rounded-md bg-muted-foreground/20"></div>
         </div>
      )}

      {!isPending && goals.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-lg font-semibold">Your New Goals:</h3>
          <ul className="space-y-2">
            {goals.map((goal, index) => (
              <li key={index} className="flex items-start gap-3 rounded-md bg-secondary/50 p-3">
                <CheckSquare className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
