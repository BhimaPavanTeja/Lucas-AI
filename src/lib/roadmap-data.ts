export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  category: 'foundation' | 'core' | 'advanced' | 'specialization' | 'mastery';
  skills: string[];
  prerequisites: string[];
  estimatedTime: string;
  resources: {
    title: string;
    type: 'course' | 'book' | 'tutorial' | 'practice' | 'certification';
    url?: string;
    free: boolean;
  }[];
  projects: string[];
  completed?: boolean;
  current?: boolean;
}

export interface CareerRoadmapData {
  careerId: string;
  careerName: string;
  description: string;
  totalEstimatedTime: string;
  nodes: RoadmapNode[];
  paths: {
    from: string;
    to: string;
  }[];
}

export const roadmapData: Record<string, CareerRoadmapData> = {
  'web-developer': {
    careerId: 'web-developer',
    careerName: 'Web Developer',
    description: 'Complete roadmap to become a professional web developer',
    totalEstimatedTime: '6-12 months',
    nodes: [
      {
        id: 'html-basics',
        title: 'HTML Fundamentals',
        description: 'Learn the building blocks of web pages',
        category: 'foundation',
        skills: ['HTML5', 'Semantic HTML', 'Forms', 'Accessibility'],
        prerequisites: [],
        estimatedTime: '2-3 weeks',
        resources: [
          { title: 'MDN HTML Tutorial', type: 'tutorial', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', free: true },
          { title: 'freeCodeCamp HTML', type: 'course', url: 'https://www.freecodecamp.org', free: true },
          { title: 'HTML & CSS by Jon Duckett', type: 'book', free: false }
        ],
        projects: ['Personal resume page', 'Simple blog layout', 'Contact form']
      },
      {
        id: 'css-basics',
        title: 'CSS Fundamentals',
        description: 'Style your web pages with modern CSS',
        category: 'foundation',
        skills: ['CSS3', 'Flexbox', 'Grid', 'Responsive Design', 'CSS Variables'],
        prerequisites: ['html-basics'],
        estimatedTime: '3-4 weeks',
        resources: [
          { title: 'CSS Grid Garden', type: 'practice', url: 'https://cssgridgarden.com', free: true },
          { title: 'Flexbox Froggy', type: 'practice', url: 'https://flexboxfroggy.com', free: true },
          { title: 'CSS Complete Guide', type: 'course', free: false }
        ],
        projects: ['Responsive portfolio', 'CSS art project', 'Landing page clone']
      },
      {
        id: 'javascript-basics',
        title: 'JavaScript Fundamentals',
        description: 'Add interactivity to your websites',
        category: 'foundation',
        skills: ['ES6+', 'DOM Manipulation', 'Event Handling', 'Async/Await', 'APIs'],
        prerequisites: ['html-basics', 'css-basics'],
        estimatedTime: '4-6 weeks',
        resources: [
          { title: 'JavaScript.info', type: 'tutorial', url: 'https://javascript.info', free: true },
          { title: 'Eloquent JavaScript', type: 'book', url: 'https://eloquentjavascript.net', free: true },
          { title: 'JavaScript30', type: 'practice', url: 'https://javascript30.com', free: true }
        ],
        projects: ['Todo app', 'Weather app', 'Calculator', 'Quiz game']
      },
      {
        id: 'version-control',
        title: 'Git & Version Control',
        description: 'Manage your code with Git and GitHub',
        category: 'foundation',
        skills: ['Git', 'GitHub', 'Branching', 'Merging', 'Pull Requests'],
        prerequisites: ['javascript-basics'],
        estimatedTime: '1-2 weeks',
        resources: [
          { title: 'Pro Git Book', type: 'book', url: 'https://git-scm.com/book', free: true },
          { title: 'GitHub Learning Lab', type: 'practice', url: 'https://lab.github.com', free: true },
          { title: 'Git Branching Tutorial', type: 'tutorial', url: 'https://learngitbranching.js.org', free: true }
        ],
        projects: ['Portfolio with Git history', 'Collaborative project', 'Open source contribution']
      },
      {
        id: 'react-basics',
        title: 'React Fundamentals',
        description: 'Build modern user interfaces with React',
        category: 'core',
        skills: ['React', 'JSX', 'Components', 'Props', 'State', 'Hooks'],
        prerequisites: ['javascript-basics', 'version-control'],
        estimatedTime: '4-5 weeks',
        resources: [
          { title: 'Official React Tutorial', type: 'tutorial', url: 'https://react.dev/learn', free: true },
          { title: 'React Developer Tools', type: 'practice', free: true },
          { title: 'Full Stack Open', type: 'course', url: 'https://fullstackopen.com', free: true }
        ],
        projects: ['Component library', 'E-commerce product list', 'Social media feed']
      },
      {
        id: 'backend-basics',
        title: 'Backend Development',
        description: 'Learn server-side development with Node.js',
        category: 'core',
        skills: ['Node.js', 'Express.js', 'REST APIs', 'Databases', 'Authentication'],
        prerequisites: ['react-basics'],
        estimatedTime: '5-6 weeks',
        resources: [
          { title: 'Node.js Official Docs', type: 'tutorial', url: 'https://nodejs.org/en/docs', free: true },
          { title: 'Express.js Guide', type: 'tutorial', url: 'https://expressjs.com', free: true },
          { title: 'The Complete Node.js Course', type: 'course', free: false }
        ],
        projects: ['REST API', 'Authentication system', 'Blog backend', 'File upload service']
      },
      {
        id: 'database-design',
        title: 'Database Management',
        description: 'Design and work with databases',
        category: 'core',
        skills: ['SQL', 'PostgreSQL', 'MongoDB', 'Database Design', 'ORMs'],
        prerequisites: ['backend-basics'],
        estimatedTime: '3-4 weeks',
        resources: [
          { title: 'PostgreSQL Tutorial', type: 'tutorial', url: 'https://www.postgresqltutorial.com', free: true },
          { title: 'MongoDB University', type: 'course', url: 'https://university.mongodb.com', free: true },
          { title: 'SQL Practice', type: 'practice', url: 'https://sqlbolt.com', free: true }
        ],
        projects: ['Database schema design', 'Data migration scripts', 'Analytics dashboard']
      },
      {
        id: 'fullstack-projects',
        title: 'Full-Stack Projects',
        description: 'Build complete web applications',
        category: 'advanced',
        skills: ['Full-Stack Development', 'Deployment', 'CI/CD', 'Testing', 'Performance'],
        prerequisites: ['database-design'],
        estimatedTime: '6-8 weeks',
        resources: [
          { title: 'Vercel Documentation', type: 'tutorial', url: 'https://vercel.com/docs', free: true },
          { title: 'Testing Library', type: 'tutorial', url: 'https://testing-library.com', free: true },
          { title: 'Web Performance Guide', type: 'tutorial', free: true }
        ],
        projects: ['Social media platform', 'E-commerce site', 'Task management app', 'Real-time chat app']
      },
      {
        id: 'advanced-frontend',
        title: 'Advanced Frontend',
        description: 'Master advanced frontend techniques',
        category: 'specialization',
        skills: ['Next.js', 'TypeScript', 'State Management', 'Testing', 'Performance Optimization'],
        prerequisites: ['fullstack-projects'],
        estimatedTime: '4-5 weeks',
        resources: [
          { title: 'Next.js Documentation', type: 'tutorial', url: 'https://nextjs.org/docs', free: true },
          { title: 'TypeScript Handbook', type: 'tutorial', url: 'https://www.typescriptlang.org/docs', free: true },
          { title: 'React Testing Guide', type: 'tutorial', free: true }
        ],
        projects: ['SSR application', 'Progressive Web App', 'Component testing suite']
      },
      {
        id: 'professional-skills',
        title: 'Professional Development',
        description: 'Skills for working in development teams',
        category: 'mastery',
        skills: ['Agile/Scrum', 'Code Review', 'Documentation', 'Mentoring', 'System Design'],
        prerequisites: ['advanced-frontend'],
        estimatedTime: '2-3 weeks',
        resources: [
          { title: 'Agile Methodology Guide', type: 'tutorial', free: true },
          { title: 'Code Review Best Practices', type: 'tutorial', free: true },
          { title: 'System Design Primer', type: 'tutorial', url: 'https://github.com/donnemartin/system-design-primer', free: true }
        ],
        projects: ['Team project leadership', 'Technical documentation', 'Code review process']
      }
    ],
    paths: [
      { from: 'html-basics', to: 'css-basics' },
      { from: 'css-basics', to: 'javascript-basics' },
      { from: 'javascript-basics', to: 'version-control' },
      { from: 'version-control', to: 'react-basics' },
      { from: 'react-basics', to: 'backend-basics' },
      { from: 'backend-basics', to: 'database-design' },
      { from: 'database-design', to: 'fullstack-projects' },
      { from: 'fullstack-projects', to: 'advanced-frontend' },
      { from: 'advanced-frontend', to: 'professional-skills' }
    ]
  },
  
  'mobile-developer': {
    careerId: 'mobile-developer',
    careerName: 'Mobile Developer',
    description: 'Complete roadmap to become a mobile app developer',
    totalEstimatedTime: '8-14 months',
    nodes: [
      {
        id: 'programming-basics',
        title: 'Programming Fundamentals',
        description: 'Learn programming concepts and logic',
        category: 'foundation',
        skills: ['Programming Logic', 'Data Structures', 'Algorithms', 'Problem Solving'],
        prerequisites: [],
        estimatedTime: '3-4 weeks',
        resources: [
          { title: 'Programming Basics Course', type: 'course', free: true },
          { title: 'Data Structures Guide', type: 'tutorial', free: true }
        ],
        projects: ['Basic calculator', 'Number guessing game', 'Simple data manipulation']
      },
      {
        id: 'mobile-platforms',
        title: 'Mobile Platform Basics',
        description: 'Understand mobile development platforms',
        category: 'foundation',
        skills: ['iOS Ecosystem', 'Android Ecosystem', 'Mobile UI/UX', 'App Lifecycle'],
        prerequisites: ['programming-basics'],
        estimatedTime: '2-3 weeks',
        resources: [
          { title: 'Mobile Development Overview', type: 'tutorial', free: true },
          { title: 'Mobile Design Guidelines', type: 'tutorial', free: true }
        ],
        projects: ['Platform comparison study', 'UI mockups', 'User flow diagrams']
      },
      {
        id: 'native-development',
        title: 'Native Development',
        description: 'Learn native mobile development',
        category: 'core',
        skills: ['Swift/Kotlin', 'Native APIs', 'Platform Tools', 'UI Components'],
        prerequisites: ['mobile-platforms'],
        estimatedTime: '8-10 weeks',
        resources: [
          { title: 'Swift Programming', type: 'course', free: true },
          { title: 'Kotlin for Android', type: 'course', free: true },
          { title: 'Apple Developer Docs', type: 'tutorial', free: true }
        ],
        projects: ['Weather app', 'Todo list app', 'Photo gallery app']
      },
      {
        id: 'cross-platform',
        title: 'Cross-Platform Development',
        description: 'Build apps for multiple platforms',
        category: 'core',
        skills: ['React Native', 'Flutter', 'Cross-Platform APIs', 'Code Sharing'],
        prerequisites: ['native-development'],
        estimatedTime: '6-8 weeks',
        resources: [
          { title: 'React Native Docs', type: 'tutorial', url: 'https://reactnative.dev/docs/getting-started', free: true },
          { title: 'Flutter Documentation', type: 'tutorial', url: 'https://flutter.dev/docs', free: true }
        ],
        projects: ['Cross-platform todo app', 'Social media app', 'E-commerce app']
      },
      {
        id: 'mobile-backend',
        title: 'Mobile Backend Services',
        description: 'Connect apps to backend services',
        category: 'advanced',
        skills: ['APIs', 'Authentication', 'Push Notifications', 'Cloud Services', 'Offline Storage'],
        prerequisites: ['cross-platform'],
        estimatedTime: '4-5 weeks',
        resources: [
          { title: 'Firebase for Mobile', type: 'tutorial', free: true },
          { title: 'REST API Design', type: 'tutorial', free: true }
        ],
        projects: ['Chat application', 'Social login system', 'Offline-first app']
      },
      {
        id: 'app-deployment',
        title: 'App Store Deployment',
        description: 'Publish apps to app stores',
        category: 'advanced',
        skills: ['App Store Guidelines', 'Play Store Publishing', 'App Signing', 'Store Optimization'],
        prerequisites: ['mobile-backend'],
        estimatedTime: '2-3 weeks',
        resources: [
          { title: 'App Store Guidelines', type: 'tutorial', free: true },
          { title: 'Play Console Guide', type: 'tutorial', free: true }
        ],
        projects: ['Published mobile app', 'App store listing optimization', 'Beta testing program']
      }
    ],
    paths: [
      { from: 'programming-basics', to: 'mobile-platforms' },
      { from: 'mobile-platforms', to: 'native-development' },
      { from: 'native-development', to: 'cross-platform' },
      { from: 'cross-platform', to: 'mobile-backend' },
      { from: 'mobile-backend', to: 'app-deployment' }
    ]
  },
  
  'data-scientist': {
    careerId: 'data-scientist',
    careerName: 'Data Scientist',
    description: 'Complete roadmap to become a data scientist',
    totalEstimatedTime: '10-16 months',
    nodes: [
      {
        id: 'math-statistics',
        title: 'Mathematics & Statistics',
        description: 'Foundation in math and statistical concepts',
        category: 'foundation',
        skills: ['Statistics', 'Probability', 'Linear Algebra', 'Calculus'],
        prerequisites: [],
        estimatedTime: '6-8 weeks',
        resources: [
          { title: 'Khan Academy Statistics', type: 'course', url: 'https://www.khanacademy.org/math/statistics-probability', free: true },
          { title: 'Linear Algebra Course', type: 'course', free: true }
        ],
        projects: ['Statistical analysis report', 'Probability simulations', 'Math problem solving']
      },
      {
        id: 'python-programming',
        title: 'Python Programming',
        description: 'Learn Python for data science',
        category: 'foundation',
        skills: ['Python Basics', 'NumPy', 'Pandas', 'Data Manipulation'],
        prerequisites: ['math-statistics'],
        estimatedTime: '4-6 weeks',
        resources: [
          { title: 'Python for Data Science', type: 'course', free: true },
          { title: 'Pandas Documentation', type: 'tutorial', url: 'https://pandas.pydata.org/docs', free: true }
        ],
        projects: ['Data cleaning project', 'Exploratory data analysis', 'Data visualization dashboard']
      },
      {
        id: 'data-visualization',
        title: 'Data Visualization',
        description: 'Create compelling data visualizations',
        category: 'core',
        skills: ['Matplotlib', 'Seaborn', 'Plotly', 'Tableau', 'Data Storytelling'],
        prerequisites: ['python-programming'],
        estimatedTime: '3-4 weeks',
        resources: [
          { title: 'Matplotlib Tutorials', type: 'tutorial', free: true },
          { title: 'Tableau Public', type: 'practice', url: 'https://public.tableau.com', free: true }
        ],
        projects: ['Interactive dashboard', 'Data story presentation', 'Visualization portfolio']
      },
      {
        id: 'machine-learning',
        title: 'Machine Learning',
        description: 'Build predictive models',
        category: 'core',
        skills: ['Scikit-learn', 'Supervised Learning', 'Unsupervised Learning', 'Model Evaluation'],
        prerequisites: ['data-visualization'],
        estimatedTime: '8-10 weeks',
        resources: [
          { title: 'Scikit-learn User Guide', type: 'tutorial', url: 'https://scikit-learn.org/stable/user_guide.html', free: true },
          { title: 'Machine Learning Course', type: 'course', free: true }
        ],
        projects: ['Prediction model', 'Classification system', 'Recommendation engine']
      },
      {
        id: 'deep-learning',
        title: 'Deep Learning',
        description: 'Neural networks and deep learning',
        category: 'advanced',
        skills: ['TensorFlow', 'PyTorch', 'Neural Networks', 'CNN', 'RNN'],
        prerequisites: ['machine-learning'],
        estimatedTime: '6-8 weeks',
        resources: [
          { title: 'TensorFlow Tutorials', type: 'tutorial', url: 'https://www.tensorflow.org/tutorials', free: true },
          { title: 'Deep Learning Specialization', type: 'course', free: false }
        ],
        projects: ['Image classification', 'Natural language processing', 'Time series forecasting']
      },
      {
        id: 'big-data',
        title: 'Big Data Technologies',
        description: 'Handle large-scale data processing',
        category: 'specialization',
        skills: ['Apache Spark', 'Hadoop', 'Cloud Platforms', 'Data Pipelines'],
        prerequisites: ['deep-learning'],
        estimatedTime: '4-5 weeks',
        resources: [
          { title: 'Apache Spark Documentation', type: 'tutorial', free: true },
          { title: 'AWS Data Analytics', type: 'course', free: false }
        ],
        projects: ['Data pipeline', 'Large-scale analysis', 'Real-time processing system']
      }
    ],
    paths: [
      { from: 'math-statistics', to: 'python-programming' },
      { from: 'python-programming', to: 'data-visualization' },
      { from: 'data-visualization', to: 'machine-learning' },
      { from: 'machine-learning', to: 'deep-learning' },
      { from: 'deep-learning', to: 'big-data' }
    ]
  }
};

export const getRoadmapByCareer = (careerId: string): CareerRoadmapData | undefined => {
  return roadmapData[careerId];
};