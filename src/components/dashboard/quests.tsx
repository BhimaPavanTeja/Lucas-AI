'use client';

import type { Quest, User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck, Calendar, Sparkles } from 'lucide-react';
import QuestItem from './quest-item';
import PersonalizedGoals from './personalized-goals';

interface QuestsListProps {
  quests: Quest[];
  user: User;
}

export default function QuestsList({ quests, user }: QuestsListProps) {
  const dailyQuests = quests.filter((q) => q.type === 'daily');
  const weeklyQuests = quests.filter((q) => q.type === 'weekly');

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span>Your Quests</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">
              <Calendar className="mr-2 h-4 w-4" /> Daily
            </TabsTrigger>
            <TabsTrigger value="weekly">
              <Calendar className="mr-2 h-4 w-4" /> Weekly
            </TabsTrigger>
            <TabsTrigger value="ai-goals">
              <Sparkles className="mr-2 h-4 w-4" /> AI Goals
            </TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="mt-4">
            <div className="space-y-4">
              {dailyQuests.length > 0 ? (
                dailyQuests.map((quest) => <QuestItem key={quest.id} quest={quest} userId={user.uid} />)
              ) : (
                <p className="pt-8 text-center text-sm text-muted-foreground">No daily quests today. Enjoy your day!</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="weekly" className="mt-4">
            <div className="space-y-4">
              {weeklyQuests.length > 0 ? (
                weeklyQuests.map((quest) => <QuestItem key={quest.id} quest={quest} userId={user.uid} />)
              ) : (
                <p className="pt-8 text-center text-sm text-muted-foreground">No weekly quests available. Check back soon!</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="ai-goals" className="mt-4">
            <PersonalizedGoals user={user} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
