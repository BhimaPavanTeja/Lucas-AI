import { CareerInfo } from './types';

export { type CareerInfo } from './types';

export const careers: CareerInfo[] = [
  {
    id: 'web-developer',
    name: 'Web Developer',
    description: 'Build and maintain websites and web applications',
    overview: 'Web developers create the digital experiences we use every day. From simple landing pages to complex web applications, you\'ll bring designs to life and make them interactive.',
    opportunities: [
      'Frontend Developer at tech startups',
      'Fullstack Developer at established companies', 
      'Freelance Web Developer for small businesses',
      'UI/UX Developer at design agencies',
      'E-commerce Developer for online retailers',
      'WordPress Developer for content sites'
    ],
    projects: [
      'Personal Portfolio Website',
      'E-commerce Store with Payment Integration',
      'Social Media Dashboard',
      'Task Management App',
      'Restaurant Website with Online Ordering',
      'Blog Platform with CMS'
    ],
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Responsive Design'],
    averageSalary: '$50,000 - $100,000',
    growthRate: '13% (Much faster than average)'
  },
  {
    id: 'mobile-developer',
    name: 'Mobile Developer',
    description: 'Create applications for smartphones and tablets',
    overview: 'Mobile developers build apps that millions of people use on their phones every day. Whether it\'s iOS, Android, or cross-platform, you\'ll create mobile experiences that solve real problems.',
    opportunities: [
      'iOS Developer at Apple-focused companies',
      'Android Developer at Google ecosystem companies',
      'React Native Developer for cross-platform apps',
      'Mobile Game Developer at gaming studios',
      'Enterprise Mobile Developer for corporations',
      'Freelance App Developer for startups'
    ],
    projects: [
      'Weather App with Location Services',
      'Fitness Tracking App',
      'Social Networking App',
      'Mobile Game with Leaderboards',
      'Food Delivery App',
      'Personal Finance Manager'
    ],
    skills: ['Swift', 'Kotlin', 'React Native', 'Flutter', 'Mobile UI/UX', 'App Store Optimization'],
    averageSalary: '$55,000 - $120,000',
    growthRate: '22% (Much faster than average)'
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    description: 'Analyze complex data to drive business decisions',
    overview: 'Data scientists turn raw data into actionable insights. You\'ll use statistics, machine learning, and programming to solve complex business problems and predict future trends.',
    opportunities: [
      'Data Scientist at tech companies',
      'Machine Learning Engineer at AI startups',
      'Business Intelligence Analyst at corporations',
      'Research Scientist at universities',
      'Data Consultant for various industries',
      'Product Data Scientist at product companies'
    ],
    projects: [
      'Customer Churn Prediction Model',
      'Sales Forecasting Dashboard',
      'Recommendation System',
      'Fraud Detection Algorithm',
      'Market Analysis Report',
      'A/B Testing Framework'
    ],
    skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization'],
    averageSalary: '$70,000 - $150,000',
    growthRate: '35% (Much faster than average)'
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity Specialist',
    description: 'Protect systems and data from digital threats',
    overview: 'Cybersecurity specialists are the digital guardians protecting our increasingly connected world. You\'ll defend against hackers, secure networks, and ensure data privacy.',
    opportunities: [
      'Security Analyst at financial institutions',
      'Penetration Tester at security firms',
      'Chief Information Security Officer',
      'Cybersecurity Consultant',
      'Incident Response Specialist',
      'Government Security Analyst'
    ],
    projects: [
      'Network Security Assessment',
      'Vulnerability Scanning Tool',
      'Incident Response Playbook',
      'Security Awareness Training Program',
      'Penetration Testing Report',
      'Security Monitoring Dashboard'
    ],
    skills: ['Network Security', 'Ethical Hacking', 'Risk Assessment', 'Compliance', 'Incident Response', 'Cryptography'],
    averageSalary: '$65,000 - $140,000',
    growthRate: '31% (Much faster than average)'
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    description: 'Bridge development and operations for efficient software delivery',
    overview: 'DevOps engineers streamline the software development lifecycle. You\'ll automate deployments, manage cloud infrastructure, and ensure applications run smoothly in production.',
    opportunities: [
      'DevOps Engineer at cloud-native companies',
      'Site Reliability Engineer at large tech firms',
      'Cloud Architect at enterprises',
      'Infrastructure Engineer at startups',
      'Release Manager at software companies',
      'Platform Engineer at scale-ups'
    ],
    projects: [
      'CI/CD Pipeline Setup',
      'Container Orchestration with Kubernetes',
      'Infrastructure as Code Implementation',
      'Monitoring and Alerting System',
      'Auto-scaling Cloud Architecture',
      'Disaster Recovery Plan'
    ],
    skills: ['Docker', 'Kubernetes', 'AWS/Azure', 'CI/CD', 'Infrastructure as Code', 'Monitoring'],
    averageSalary: '$75,000 - $160,000',
    growthRate: '21% (Much faster than average)'
  },
  {
    id: 'game-developer',
    name: 'Game Developer',
    description: 'Create interactive entertainment experiences',
    overview: 'Game developers bring imagination to life through interactive entertainment. You\'ll create engaging gameplay, stunning visuals, and immersive worlds that captivate players.',
    opportunities: [
      'Game Programmer at AAA studios',
      'Indie Game Developer',
      'Mobile Game Developer',
      'VR/AR Game Developer',
      'Game Engine Developer',
      'Educational Game Developer'
    ],
    projects: [
      '2D Platformer Game',
      'Mobile Puzzle Game',
      'Multiplayer Online Game',
      'VR Experience',
      'Educational Learning Game',
      'Game Development Tool'
    ],
    skills: ['C#', 'Unity', 'Unreal Engine', 'Game Design', '3D Graphics', 'Physics Simulation'],
    averageSalary: '$45,000 - $110,000',
    growthRate: '11% (Faster than average)'
  }
];

export const getCareerById = (id: string): CareerInfo | undefined => {
  return careers.find(career => career.id === id);
};

export const getCareerNames = (): string[] => {
  return careers.map(career => career.name);
};