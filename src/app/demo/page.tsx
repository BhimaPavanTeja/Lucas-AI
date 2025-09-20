'use client';

import { Header } from '@/components/layout/header';
import UserProfile from '@/components/dashboard/user-profile';
import RoadmapDisplay from '@/components/dashboard/roadmap';
import QuestsList from '@/components/dashboard/quests';
import ResourceVault from '@/components/dashboard/resource-vault';
import type { User, Roadmap, Quest, Resource } from '@/lib/types';

// Demo data - no Firebase needed!
const demoUser: User = {
  uid: 'demo-user',
  name: 'Demo User',
  email: 'demo@example.com',
  career: 'Software Engineer',
  skills: ['React', 'Next.js', 'TypeScript', 'Firebase'],
  xp: 750,
  level: 1,
  isProfileComplete: true
};

const demoRoadmap: Roadmap = {
  id: 'demo-roadmap',
  career: 'Software Engineer',
  steps: [
    {
      title: 'Learn Programming Fundamentals',
      description: 'Master the basics of programming including data structures, algorithms, and problem-solving',
      isCompleted: true,
    },
    {
      title: 'Choose a Tech Stack',
      description: 'Pick a primary programming language and framework to specialize in',
      isCompleted: true,
    },
    {
      title: 'Build Projects',
      description: 'Create portfolio projects to demonstrate your skills',
      isCompleted: false,
    },
    {
      title: 'Learn Version Control',
      description: 'Master Git and GitHub for code collaboration',
      isCompleted: false,
    },
    {
      title: 'Deploy Applications',
      description: 'Learn how to deploy your applications to production',
      isCompleted: false,
    },
  ],
};

const demoQuests: Quest[] = [
  {
    id: 'quest-1',
    career: 'Software Engineer',
    level: 1,
    questTitle: 'Complete a Code Challenge',
    questDesc: 'Solve a programming problem on LeetCode or HackerRank',
    xpReward: 50,
    type: 'daily',
  },
  {
    id: 'quest-2',
    career: 'Software Engineer',
    level: 1,
    questTitle: 'Read Tech Articles',
    questDesc: 'Read 3 technical articles about your chosen technology stack',
    xpReward: 30,
    type: 'daily',
  },
  {
    id: 'quest-3',
    career: 'Software Engineer',
    level: 1,
    questTitle: 'Build a Mini Project',
    questDesc: 'Create a small application using your preferred framework',
    xpReward: 200,
    type: 'weekly',
  },
  {
    id: 'quest-4',
    career: 'Software Engineer',
    level: 1,
    questTitle: 'Contribute to Open Source',
    questDesc: 'Make a meaningful contribution to an open source project',
    xpReward: 150,
    type: 'weekly',
  },
];

const demoResources: Resource[] = [
  {
    id: 'resource-1',
    career: 'Software Engineer',
    title: 'React Documentation',
    link: 'https://react.dev',
  },
  {
    id: 'resource-2',
    career: 'Software Engineer',
    title: 'JavaScript MDN Guide',
    link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  },
  {
    id: 'resource-3',
    career: 'Software Engineer',
    title: 'Next.js Learn',
    link: 'https://nextjs.org/learn',
  },
  {
    id: 'resource-4',
    career: 'Software Engineer',
    title: 'TypeScript Handbook',
    link: 'https://www.typescriptlang.org/docs/',
  },
];

export default function DemoDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <h2 className="text-xl font-bold text-blue-800 mb-2">🎉 Demo Dashboard - No Authentication Required!</h2>
            <p className="text-blue-700">
              This is a fully functional demo of your Lucas AI dashboard with sample data. 
              All components are working perfectly!
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            <div className="flex flex-col gap-6 lg:col-span-1">
              <UserProfile user={demoUser} />
              <RoadmapDisplay roadmap={demoRoadmap} />
            </div>
            <div className="flex flex-col gap-6 lg:col-span-2">
              <QuestsList quests={demoQuests} user={demoUser} />
              <ResourceVault resources={demoResources} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}