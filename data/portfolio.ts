export const contact = {
  email: 'jimmy.jose96@gmail.com',
  linkedin: '',
  github: '',
  resume: '',
};
export const progression = [
  'Mobile',
  'Product engineering',
  'Cloud / DevOps',
  'Backend systems',
  'AI infrastructure',
  'End-to-end ownership',
];
export type Project = {
  id: string;
  name: string;
  category: string;
  description: string;
  overview: string;
  tags: string[];
  features: string[];
  metric?: string;
  metricLabel?: string;
};
export const projects: Record<string, Project> = {
  loanlog: {
    id: 'loanlog',
    name: 'LoanLog',
    category: 'PERSONAL FINANCE',
    description: 'Keep track of what you lend. And what you owe.',
    overview:
      'Kotlin Multiplatform finance app for tracking personal lending and borrowing.\n\n1,000+ installs.',
    tags: ['Kotlin Multiplatform', 'Finance', 'Android', 'Indie Product'],
    features: [
      'Track personal lending',
      'Keep borrowing organized',
      'A focused mobile finance experience',
    ],
    metric: '1,000+',
    metricLabel: 'installs',
  },
  garagelog: {
    id: 'garagelog',
    name: 'GarageLog',
    category: 'VEHICLE MANAGEMENT',
    description: 'Your vehicles. Their documents. Every reminder.',
    overview:
      'React Native vehicle-management app. Track vehicles, documents and reminders.',
    tags: ['React Native', 'Mobile', 'Indie Product'],
    features: [
      'Manage vehicles',
      'Organize vehicle documents',
      'Track reminders',
    ],
  },
  rival: {
    id: 'rival',
    name: 'Rival',
    category: 'SPORTS & AI',
    description: 'A better system for the team behind the game.',
    overview:
      'Next.js sports-club management platform with player statistics, club management and an AI-powered coaching assistant.',
    tags: ['Next.js', 'AI', 'Full Stack'],
    features: [
      'Player statistics',
      'Club management',
      'AI-powered coaching assistant',
    ],
  },
  iinspect: {
    id: 'iinspect',
    name: 'Iinspect',
    category: 'PERSONAL FINANCE',
    description: 'Find the credit card that fits the way you spend.',
    overview:
      'Next.js product that recommends credit cards based on the user’s spending patterns.',
    tags: ['Next.js', 'Finance', 'Full Stack'],
    features: [
      'Spending-pattern analysis',
      'Personalized credit-card recommendations',
    ],
  },
};
