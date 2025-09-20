import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface QuestTemplate {
  title: string;
  description: string;
  xpReward: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  level: number;
}

const careerQuestTemplates: Record<string, {
  daily: QuestTemplate[],
  weekly: QuestTemplate[]
}> = {
  "Full Stack Developer": {
    daily: [
      {
        title: "Code Review Practice",
        description: "Review and analyze a piece of code, identify potential improvements and best practices.",
        xpReward: 25,
        difficulty: "beginner",
        level: 0
      },
      {
        title: "HTML Structure Challenge",
        description: "Create a semantic HTML page structure for a blog article with proper headings and sections.",
        xpReward: 30,
        difficulty: "beginner", 
        level: 0
      },
      {
        title: "CSS Styling Exercise",
        description: "Style a navigation menu using CSS Flexbox or Grid layout system.",
        xpReward: 35,
        difficulty: "beginner",
        level: 0
      },
      {
        title: "JavaScript Function Writing",
        description: "Write a JavaScript function that manipulates DOM elements and handles user interactions.",
        xpReward: 40,
        difficulty: "intermediate",
        level: 1
      },
      {
        title: "API Integration Task",
        description: "Fetch data from a public API and display it on a webpage using modern JavaScript.",
        xpReward: 50,
        difficulty: "intermediate",
        level: 2
      },
      {
        title: "React Component Building",
        description: "Build a reusable React component with props and state management.",
        xpReward: 60,
        difficulty: "intermediate",
        level: 3
      },
      {
        title: "Database Query Optimization",
        description: "Write and optimize database queries for better performance and efficiency.",
        xpReward: 70,
        difficulty: "advanced",
        level: 4
      }
    ],
    weekly: [
      {
        title: "Complete Web Page Project",
        description: "Build a complete responsive web page from scratch including HTML, CSS, and basic JavaScript functionality.",
        xpReward: 150,
        difficulty: "beginner",
        level: 0
      },
      {
        title: "Interactive Web Application",
        description: "Create an interactive web application with user input, data validation, and dynamic content updates.",
        xpReward: 200,
        difficulty: "intermediate",
        level: 1
      },
      {
        title: "REST API Development",
        description: "Build a RESTful API with proper endpoints, error handling, and database integration.",
        xpReward: 250,
        difficulty: "intermediate",
        level: 2
      },
      {
        title: "Full Stack Feature Implementation",
        description: "Implement a complete feature from frontend to backend including authentication and data persistence.",
        xpReward: 300,
        difficulty: "advanced",
        level: 3
      },
      {
        title: "Performance Optimization Challenge",
        description: "Optimize an existing web application for performance, including code splitting, lazy loading, and caching strategies.",
        xpReward: 350,
        difficulty: "advanced",
        level: 4
      }
    ]
  },
  "Web Developer": {
    daily: [
      {
        title: "Responsive Design Practice",
        description: "Create a responsive layout that works across desktop, tablet, and mobile devices.",
        xpReward: 30,
        difficulty: "beginner",
        level: 0
      },
      {
        title: "Cross-browser Compatibility",
        description: "Test and fix styling issues across different web browsers.",
        xpReward: 35,
        difficulty: "beginner",
        level: 0
      },
      {
        title: "Web Accessibility Improvement",
        description: "Implement accessibility features like ARIA labels, keyboard navigation, and screen reader support.",
        xpReward: 40,
        difficulty: "intermediate",
        level: 1
      },
      {
        title: "CSS Animation Creation",
        description: "Create smooth CSS animations and transitions to enhance user experience.",
        xpReward: 45,
        difficulty: "intermediate",
        level: 2
      },
      {
        title: "JavaScript ES6+ Features",
        description: "Practice using modern JavaScript features like arrow functions, destructuring, and async/await.",
        xpReward: 50,
        difficulty: "intermediate",
        level: 2
      }
    ],
    weekly: [
      {
        title: "Portfolio Website Creation",
        description: "Build a professional portfolio website showcasing your web development skills and projects.",
        xpReward: 180,
        difficulty: "beginner",
        level: 0
      },
      {
        title: "E-commerce Product Page",
        description: "Create a complete e-commerce product page with image gallery, product details, and shopping cart functionality.",
        xpReward: 220,
        difficulty: "intermediate",
        level: 1
      },
      {
        title: "Progressive Web App (PWA)",
        description: "Convert a web application into a Progressive Web App with offline functionality and app-like features.",
        xpReward: 280,
        difficulty: "advanced",
        level: 3
      }
    ]
  },
  "Data Scientist": {
    daily: [
      {
        title: "Data Cleaning Exercise",
        description: "Clean and preprocess a messy dataset to prepare it for analysis.",
        xpReward: 35,
        difficulty: "beginner",
        level: 0
      },
      {
        title: "Statistical Analysis Task",
        description: "Perform descriptive statistics and identify patterns in a given dataset.",
        xpReward: 40,
        difficulty: "beginner",
        level: 0
      },
      {
        title: "Data Visualization Creation",
        description: "Create informative charts and graphs to visualize data insights using Python or R.",
        xpReward: 45,
        difficulty: "intermediate",
        level: 1
      },
      {
        title: "Machine Learning Model Training",
        description: "Train a simple machine learning model on a prepared dataset and evaluate its performance.",
        xpReward: 60,
        difficulty: "intermediate",
        level: 2
      }
    ],
    weekly: [
      {
        title: "Complete Data Analysis Project",
        description: "Conduct a full data analysis project from raw data to insights and recommendations.",
        xpReward: 200,
        difficulty: "beginner",
        level: 0
      },
      {
        title: "Predictive Model Development",
        description: "Build and deploy a predictive model to solve a real-world business problem.",
        xpReward: 300,
        difficulty: "advanced",
        level: 3
      }
    ]
  }
};

export async function generateDailyQuests(career: string, userLevel: number, userExperience: string = 'beginner'): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Check if daily quests already exist for today
    const existingDailyQuests = await getDocs(query(
      collection(db, 'quests'),
      where('career', '==', career),
      where('type', '==', 'daily'),
      where('generatedDate', '==', today)
    ));

    if (!existingDailyQuests.empty) {
      console.log('Daily quests already generated for today');
      return;
    }

    const templates = careerQuestTemplates[career]?.daily || careerQuestTemplates["Full Stack Developer"].daily;
    
    // Filter templates based on user level and experience
    const suitableTemplates = templates.filter(template => 
      template.level <= userLevel + 1 && // Allow quests slightly above current level
      (template.difficulty === userExperience || userExperience === 'beginner')
    );

    // Generate 2-3 daily quests
    const selectedTemplates = suitableTemplates
      .sort(() => Math.random() - 0.5) // Shuffle
      .slice(0, Math.min(3, suitableTemplates.length));

    for (const template of selectedTemplates) {
      await addDoc(collection(db, 'quests'), {
        career: career,
        level: template.level,
        questTitle: template.title,
        questDesc: template.description,
        xpReward: template.xpReward,
        type: 'daily',
        difficulty: template.difficulty,
        generatedDate: today,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expires in 24 hours
      });
    }

    console.log(`Generated ${selectedTemplates.length} daily quests for ${career}`);
  } catch (error) {
    console.error('Error generating daily quests:', error);
  }
}

export async function generateWeeklyQuests(career: string, userLevel: number, userExperience: string = 'beginner'): Promise<void> {
  try {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay())).toISOString().split('T')[0];
    
    // Check if weekly quests already exist for this week
    const existingWeeklyQuests = await getDocs(query(
      collection(db, 'quests'),
      where('career', '==', career),
      where('type', '==', 'weekly'),
      where('weekStart', '==', weekStart)
    ));

    if (!existingWeeklyQuests.empty) {
      console.log('Weekly quests already generated for this week');
      return;
    }

    const templates = careerQuestTemplates[career]?.weekly || careerQuestTemplates["Full Stack Developer"].weekly;
    
    // Filter templates based on user level and experience
    const suitableTemplates = templates.filter(template => 
      template.level <= userLevel + 1 &&
      (template.difficulty === userExperience || userExperience === 'beginner')
    );

    // Generate 1-2 weekly quests
    const selectedTemplates = suitableTemplates
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(2, suitableTemplates.length));

    for (const template of selectedTemplates) {
      await addDoc(collection(db, 'quests'), {
        career: career,
        level: template.level,
        questTitle: template.title,
        questDesc: template.description,
        xpReward: template.xpReward,
        type: 'weekly',
        difficulty: template.difficulty,
        weekStart: weekStart,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 7 days
      });
    }

    console.log(`Generated ${selectedTemplates.length} weekly quests for ${career}`);
  } catch (error) {
    console.error('Error generating weekly quests:', error);
  }
}

export async function generateQuestsForUser(career: string, level: number, experience: string = 'beginner'): Promise<void> {
  await Promise.all([
    generateDailyQuests(career, level, experience),
    generateWeeklyQuests(career, level, experience)
  ]);
}