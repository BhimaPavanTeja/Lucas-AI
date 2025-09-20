export type User = {
  uid: string;
  name: string;
  email: string | null;
  photoURL?: string | null;
  career: string;
  skills: string[];
  xp: number;
  level: number;
  isProfileComplete: boolean;
  dateOfBirth?: string;
  location?: string;
  bio?: string;
  experience?: string; // 'beginner' | 'intermediate' | 'advanced'
};

export type RoadmapStep = {
  title: string;
  description: string;
  isCompleted: boolean;
};

export type Roadmap = {
  id: string;
  career: string;
  steps: RoadmapStep[];
};

export type Quest = {
  id: string;
  career: string;
  level: number;
  questTitle: string;
  questDesc: string;
  xpReward: number;
  type: 'daily' | 'weekly';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  expiresAt?: any; // Firestore timestamp
  generatedDate?: string; // For daily quests
  weekStart?: string; // For weekly quests
};

export type Resource = {
  id: string;
  career: string;
  title: string;
  link: string;
  type?: 'documentation' | 'tutorial' | 'course' | 'tool';
};

export type CareerInfo = {
  id: string;
  name: string;
  description: string;
  overview: string;
  opportunities: string[];
  projects: string[];
  skills: string[];
  averageSalary?: string;
  growthRate?: string;
};
