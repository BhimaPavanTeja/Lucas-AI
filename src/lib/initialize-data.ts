import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function initializeUserData(career: string) {
  try {
    // Check if roadmap exists for this career
    const roadmapQuery = query(collection(db, 'roadmaps'), where('career', '==', career));
    const roadmapSnap = await getDocs(roadmapQuery);
    
    if (roadmapSnap.empty) {
      // Create a basic roadmap for this career
      await addDoc(collection(db, 'roadmaps'), {
        career: career,
        steps: [
          {
            title: "Get Started",
            description: `Begin your journey in ${career} with fundamental concepts and tools.`,
            isCompleted: false
          },
          {
            title: "Build Foundation",
            description: `Develop core skills essential for ${career} success.`,
            isCompleted: false
          },
          {
            title: "Practice Projects",
            description: `Apply your knowledge through hands-on projects and exercises.`,
            isCompleted: false
          },
          {
            title: "Advanced Concepts",
            description: `Explore advanced topics and specialized areas in ${career}.`,
            isCompleted: false
          }
        ]
      });
    }

    // Check if quests exist for this career
    const questsQuery = query(collection(db, 'quests'), where('career', '==', career));
    const questsSnap = await getDocs(questsQuery);
    
    if (questsSnap.empty) {
      // Create basic quests for this career
      const basicQuests = [
        {
          career: career,
          level: 0,
          questTitle: "Welcome Quest",
          questDesc: `Complete your first task in ${career} to get started!`,
          xpReward: 50,
          difficulty: "beginner"
        },
        {
          career: career,
          level: 0,
          questTitle: "Learning Foundation",
          questDesc: `Study the fundamentals of ${career} and complete a basic exercise.`,
          xpReward: 75,
          difficulty: "beginner"
        }
      ];

      for (const quest of basicQuests) {
        await addDoc(collection(db, 'quests'), quest);
      }
    }

    // Check if resources exist for this career
    const resourcesQuery = query(collection(db, 'resources'), where('career', '==', career));
    const resourcesSnap = await getDocs(resourcesQuery);
    
    if (resourcesSnap.empty) {
      // Create basic resources for this career
      const basicResources = [
        {
          career: career,
          title: `${career} - Getting Started Guide`,
          link: "https://github.com"
        },
        {
          career: career,
          title: `${career} - Best Practices`,
          link: "https://stackoverflow.com"
        }
      ];

      for (const resource of basicResources) {
        await addDoc(collection(db, 'resources'), resource);
      }
    }

    return { success: true, message: `Initialized data for ${career}` };
  } catch (error) {
    console.error('Error initializing user data:', error);
    return { success: false, error };
  }
}