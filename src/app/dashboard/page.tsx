'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import type { User, Roadmap, Quest, Resource } from '@/lib/types';
import { Header } from '@/components/layout/header';
import UserProfile from '@/components/dashboard/user-profile';
import RoadmapDisplay from '@/components/dashboard/roadmap';
import QuestsList from '@/components/dashboard/quests';
import ResourceVault from '@/components/dashboard/resource-vault';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      setUserProfile(authUser);
      const fetchData = async () => {
        setDataLoading(true);
        try {
          // Fetch Roadmap
          const roadmapQuery = query(
            collection(db, 'roadmaps'),
            where('career', '==', authUser.career),
            limit(1)
          );
          const roadmapSnap = await getDocs(roadmapQuery);
          if (!roadmapSnap.empty) {
            const roadmapData = roadmapSnap.docs[0].data() as Omit<Roadmap, 'id'>;
            setRoadmap({ id: roadmapSnap.docs[0].id, ...roadmapData });
          }

          // Fetch Quests
          const questsQuery = query(
            collection(db, 'quests'),
            where('career', '==', authUser.career),
            where('level', '<=', authUser.level)
          );
          const questsSnap = await getDocs(questsQuery);
          setQuests(questsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quest)));

          // Fetch Resources
          const resourcesQuery = query(
            collection(db, 'resources'),
            where('career', '==', authUser.career)
          );
          const resourcesSnap = await getDocs(resourcesQuery);
          setResources(resourcesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource)));
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
        } finally {
          setDataLoading(false);
        }
      };
      fetchData();
    } else if (!authLoading) {
      setDataLoading(false);
    }
  }, [authUser, authLoading]);

  if (authLoading || (dataLoading && authUser)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!authUser) {
     // Should be redirected by root page, but as a fallback
    return null;
  }
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            <div className="flex flex-col gap-6 lg:col-span-1">
              {userProfile && <UserProfile user={userProfile} />}
              {roadmap ? <RoadmapDisplay roadmap={roadmap} /> : <div/>}
            </div>
            <div className="flex flex-col gap-6 lg:col-span-2">
              {userProfile && <QuestsList quests={quests} user={userProfile} />}
              <ResourceVault resources={resources} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
