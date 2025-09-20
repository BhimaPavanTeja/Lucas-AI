export type User = {
  uid: string;
  name: string;
  email: string | null;
  career: string;
  skills: string[];
  xp: number;
  level: number;
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
};

export type Resource = {
  id: string;
  career: string;
  title: string;
  link: string;
};
