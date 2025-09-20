// Firebase Data Seeding Script
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA9sayEMq2n_XXO0-RB7GQBGYqvKahLlxk",
  authDomain: "system-lucas.firebaseapp.com",
  projectId: "system-lucas",
  storageBucket: "system-lucas.firebasestorage.app",
  messagingSenderId: "1005991093019",
  appId: "1:1005991093019:web:de368791013a9dc104e9be"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample roadmap data
const roadmapData = {
  career: "Full Stack Developer",
  steps: [
    {
      title: "Master HTML & CSS Fundamentals",
      description: "Learn the building blocks of web development including semantic HTML5 and modern CSS3 features.",
      isCompleted: false
    },
    {
      title: "JavaScript Proficiency",
      description: "Become proficient in vanilla JavaScript, ES6+ features, and understand the DOM manipulation.",
      isCompleted: false
    },
    {
      title: "Learn a Frontend Framework",
      description: "Master React.js or Vue.js to build dynamic and interactive user interfaces.",
      isCompleted: false
    },
    {
      title: "Backend Development",
      description: "Learn Node.js, Express.js, and database integration to build complete web applications.",
      isCompleted: false
    },
    {
      title: "Database Management",
      description: "Understand SQL and NoSQL databases, data modeling, and database optimization.",
      isCompleted: false
    }
  ]
};

// Sample quests data
const questsData = [
  {
    career: "Full Stack Developer",
    level: 0,
    questTitle: "Build Your First HTML Page",
    questDesc: "Create a simple HTML page with proper structure and semantic elements.",
    xpReward: 50,
    difficulty: "beginner"
  },
  {
    career: "Full Stack Developer", 
    level: 0,
    questTitle: "Style with CSS",
    questDesc: "Add styling to your HTML page using CSS selectors and properties.",
    xpReward: 75,
    difficulty: "beginner"
  },
  {
    career: "Full Stack Developer",
    level: 1,
    questTitle: "JavaScript Variables and Functions",
    questDesc: "Learn to declare variables and create functions in JavaScript.",
    xpReward: 100,
    difficulty: "beginner"
  }
];

// Sample resources data
const resourcesData = [
  {
    career: "Full Stack Developer",
    title: "MDN Web Docs - HTML",
    link: "https://developer.mozilla.org/en-US/docs/Web/HTML"
  },
  {
    career: "Full Stack Developer",
    title: "CSS-Tricks",
    link: "https://css-tricks.com/"
  },
  {
    career: "Full Stack Developer",
    title: "JavaScript.info",
    link: "https://javascript.info/"
  },
  {
    career: "Full Stack Developer",
    title: "React Documentation",
    link: "https://react.dev/"
  }
];

async function seedData() {
  try {
    console.log('Seeding roadmap data...');
    await addDoc(collection(db, 'roadmaps'), roadmapData);
    
    console.log('Seeding quests data...');
    for (const quest of questsData) {
      await addDoc(collection(db, 'quests'), quest);
    }
    
    console.log('Seeding resources data...');
    for (const resource of resourcesData) {
      await addDoc(collection(db, 'resources'), resource);
    }
    
    console.log('Data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seedData();