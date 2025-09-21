'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import { collection, getDocs, query, where, limit, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { initializeUserData } from '@/lib/initialize-data';
import { generateQuestsForUser } from '@/lib/quest-generator';
import type { User, Roadmap, Quest, Resource } from '@/lib/types';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Header } from '@/components/layout/header';
import UserProfile from '@/components/dashboard/user-profile';
import RoadmapDisplay from '@/components/dashboard/roadmap';
import QuestsList from '@/components/dashboard/quests';
import ResourceVault from '@/components/dashboard/resource-vault';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, User as UserIcon, AlertCircle, TrendingUp } from 'lucide-react';
import { FirebaseStatus } from '@/components/debug/firebase-status';

// Data fetching functions
const fetchUser = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { uid: userDoc.id, ...userDoc.data() } as User;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
};

const fetchRoadmap = async (career: string): Promise<Roadmap | null> => {
  try {
    const roadmapQuery = query(
      collection(db, 'roadmaps'),
      where('career', '==', career),
      limit(1)
    );
    const roadmapSnap = await getDocs(roadmapQuery);
    if (!roadmapSnap.empty) {
      const roadmapData = roadmapSnap.docs[0].data() as Omit<Roadmap, 'id'>;
      return { id: roadmapSnap.docs[0].id, ...roadmapData };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch roadmap:", error);
    throw error;
  }
};

const fetchQuests = async (career: string, level: number, experience?: string, userId?: string): Promise<Quest[]> => {
  try {
    // Get completed quest IDs for this user
    let completedQuestIds: string[] = [];
    if (userId) {
      try {
        // First get all quests to know which ones to check for completion
        const allQuestsQuery = query(
          collection(db, 'quests'),
          where('career', '==', career)
        );
        const allQuestsSnap = await getDocs(allQuestsQuery);
        const allQuests = allQuestsSnap.docs.map(doc => doc.id);
        
        // Check completion status for each quest using the new document ID format
        const completionChecks = allQuests.map(async (questId) => {
          const completionDocId = `${userId}_${questId}`;
          const completionDocRef = doc(db, 'questCompletions', completionDocId);
          const completionDoc = await getDoc(completionDocRef);
          return completionDoc.exists() ? questId : null;
        });
        
        const completionResults = await Promise.all(completionChecks);
        completedQuestIds = completionResults.filter(questId => questId !== null) as string[];
      } catch (completionsError) {
        console.log('Error checking quest completions:', completionsError);
        // Continue without filtering - this is fine for new users
      }
    }

    // First, just query by career to avoid composite index requirement
    const questsQuery = query(
      collection(db, 'quests'),
      where('career', '==', career),
      orderBy('type', 'desc'), // Weekly first, then daily
      limit(20)
    );
    const questsSnap = await getDocs(questsQuery);
    let questsData = questsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quest));
    
    // Filter out completed quests
    questsData = questsData.filter(quest => !completedQuestIds.includes(quest.id));
    
    // Filter by level on the client side
    questsData = questsData.filter(quest => quest.level <= level + 1); // Allow quests slightly above level
    
    // Filter out expired quests
    const now = new Date();
    questsData = questsData.filter(quest => {
      const expiresAt = quest.expiresAt ? new Date(quest.expiresAt.seconds * 1000) : null;
      return !expiresAt || expiresAt > now;
    });
    
    // Filter quests by difficulty based on user experience if available
    if (experience) {
      questsData = questsData.filter(quest => 
        !quest.difficulty || quest.difficulty === experience || experience === 'beginner'
      );
    }
    
    // Sort: daily quests first, then weekly, then by XP reward
    questsData.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'daily' ? -1 : 1;
      }
      return b.xpReward - a.xpReward;
    });
    
    return questsData;
  } catch (error) {
    console.error("Failed to fetch quests:", error);
    throw error;
  }
};

const fetchResources = async (career: string): Promise<Resource[]> => {
  try {
    const resourcesQuery = query(
      collection(db, 'resources'),
      where('career', '==', career)
    );
    const resourcesSnap = await getDocs(resourcesQuery);
    return resourcesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    throw error;
  }
};

export default function DashboardPage() {
  return (
    <ProtectedRoute requireProfileComplete={true}>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, loading: authLoading } = useAuth();

  // Add SWR for user data to get real-time updates
  const { data: currentUser, mutate: mutateUser } = useSWR(
    user?.uid ? `user-${user.uid}` : null,
    () => fetchUser(user!.uid),
    {
      fallbackData: user, // Use auth user as fallback
      refreshInterval: 0, // Don't auto-refresh
    }
  );

  // Use currentUser (from SWR) if available, fallback to auth user
  const userData = currentUser || user;

  // SWR data fetching hooks
  const { data: roadmap, error: roadmapError, isLoading: roadmapLoading, mutate: mutateRoadmap } = useSWR(
    userData?.career ? `roadmap-${userData.career}` : null,
    () => fetchRoadmap(userData!.career)
  );

  const { data: quests, error: questsError, isLoading: questsLoading, mutate: mutateQuests } = useSWR(
    userData?.career && userData?.level !== undefined && userData?.uid ? `quests-${userData.career}-${userData.level}-${userData.experience}-${userData.uid}` : null,
    () => fetchQuests(userData!.career, userData!.level, userData!.experience, userData!.uid)
  );

  const { data: resources, error: resourcesError, isLoading: resourcesLoading, mutate: mutateResources } = useSWR(
    userData?.career ? `resources-${userData.career}` : null,
    () => fetchResources(userData!.career)
  );

  const isLoading = roadmapLoading || questsLoading || resourcesLoading;

  // Function to refresh all data
  const refreshDashboard = async () => {
    if (userData?.career) {
      await initializeUserData(userData.career);
      await generateQuestsForUser(userData.career, userData.level, userData.experience);
      mutateUser(); // Refresh user data
      mutateRoadmap();
      mutateQuests();
      mutateResources();
    }
  };

  useEffect(() => {
    // Initialize data and generate quests if user has completed profile
    if (userData && userData.isProfileComplete && userData.career) {
      // Add a small delay to ensure SWR has attempted to fetch first
      const timer = setTimeout(async () => {
        // Generate daily and weekly quests
        await generateQuestsForUser(userData.career, userData.level, userData.experience);
        
        // Initialize basic data if none exists
        if (!roadmap && !quests && !resources && !isLoading) {
          await initializeUserData(userData.career);
          mutateRoadmap();
          mutateQuests();
          mutateResources();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [userData, roadmap, quests, resources, isLoading, mutateRoadmap, mutateQuests, mutateResources]);

  // Show loading while checking authentication or waiting for data
  if (authLoading || !user || !userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="container mx-auto max-w-7xl">
          {/* Welcome banner for new users */}
          {userData.level === 0 && (
            <Card className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <UserIcon className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-blue-800">
                    Welcome to Your Dashboard, {userData.name}!
                  </h2>
                </div>
                <p className="text-blue-700 mb-4">
                  🎉 You're all set up and ready to start your {userData.career} journey! 
                  Explore your personalized quests, roadmap, and resources below.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-white/70 p-3 rounded-lg">
                    <span className="text-gray-600">Career Path:</span>
                    <p className="font-medium text-gray-800">{userData.career}</p>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg">
                    <span className="text-gray-600">Current Level:</span>
                    <p className="font-medium text-gray-800">Level {userData.level}</p>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg">
                    <span className="text-gray-600">Skills:</span>
                    <p className="font-medium text-gray-800">{userData.skills?.length || 0} skills</p>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg">
                    <span className="text-gray-600">Experience:</span>
                    <p className="font-medium text-gray-800 capitalize">{userData.experience || 'Beginner'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading your personalized dashboard...</p>
              </div>
            </div>
          ) : (roadmapError || questsError || resourcesError) ? (
            <div className="flex h-64 items-center justify-center">
              <Card className="p-6 text-center">
                <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Setting Up Your Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  We're preparing personalized content for your {userData.career} journey.
                </p>
                <Button onClick={refreshDashboard}>
                  Initialize Dashboard Content
                </Button>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
              <div className="flex flex-col gap-6 lg:col-span-1">
                <UserProfile user={userData} />
                {roadmap ? <RoadmapDisplay roadmap={roadmap} /> : (
                  <Card className="p-4 text-center">
                    <p className="text-muted-foreground">Roadmap coming soon for {userData.career}!</p>
                  </Card>
                )}
              </div>
              <div className="flex flex-col gap-6 lg:col-span-2">
                <QuestsList 
                  quests={quests || []} 
                  user={userData} 
                  onQuestComplete={() => {
                    mutateUser(); // Refresh user data to get updated XP and level
                    mutateQuests(); // Refresh quest list to remove completed quest
                  }}
                />
                
                {/* Job Insights Quick Access */}
                <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-800">
                      <TrendingUp className="h-5 w-5" />
                      Job Market Insights
                    </CardTitle>
                    <CardDescription className="text-purple-700">
                      Discover trending jobs, salary insights, and market opportunities for {userData.career}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-800">1.2M+</div>
                        <div className="text-xs text-purple-600">Active Jobs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-800">$85K</div>
                        <div className="text-xs text-purple-600">Avg Salary</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-800">35%</div>
                        <div className="text-xs text-purple-600">Remote Jobs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-800">+12%</div>
                        <div className="text-xs text-purple-600">Growth Rate</div>
                      </div>
                    </div>
                    <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                      <Link href="/job-insights">
                        Explore Job Insights
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                
                <ResourceVault resources={resources || []} />
                <FirebaseStatus />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
