import type { DirectoryNode, FileNode } from '../lib/terminal/types';
import { projects } from './portfolio';
const file = (content: string, view?: FileNode['view']): FileNode => ({
  type: 'file',
  content,
  view,
});
const dir = (children: DirectoryNode['children']): DirectoryNode => ({
  type: 'directory',
  children,
});
export const filesystem: DirectoryNode = dir({
  about: dir({
    'bio.txt': file(
      'Jimmy Jose\n\nSenior Software Engineer from Kerala, India.\n\n10 years building production software across mobile, backend, cloud and AI systems.\n\nI enjoy owning products end-to-end: architecture, implementation, deployment and production.',
    ),
    'contact.txt': file('CONTACT', 'contact'),
    'education.txt': file(
      'Bachelor of Technology\nComputer Science and Engineering\n\nMahatma Gandhi University',
    ),
  }),
  experience: dir({
    spenmo: dir({
      'overview.txt': file(
        'SPENMO\nSenior Software Engineer · Bangalore\nOct 2019 – Present\n\nAI-enabled B2B FinTech SaaS platform for managing and tracking business expenses.\n\nEngineering across backend systems, AI infrastructure and Android. Ownership from architecture to production.',
      ),
      'backend.txt': file(
        'BACKEND ENGINEERING\nOct 2021 – Present\n\nBuilt and maintained:\n→ REST APIs\n→ background jobs\n→ Go microservices\n\nWorked across development, deployment and production systems.',
      ),
      'ai.txt': file(
        'AI INFRASTRUCTURE\n\nOwned the AI service and its infrastructure.\n\n→ architecture\n→ development\n→ deployment\n→ maintenance\n→ LLM-powered workflows',
        'ai',
      ),
      'android.txt': file(
        'ANDROID ENGINEERING\nOct 2019 – Present\n\nOwned Android development across:\n→ design\n→ development\n→ testing\n→ deployment\n→ production releases\n\nKotlin · MVVM',
      ),
      'impact.txt': file(
        'SYSTEM IMPACT\n\nCrash rate improved from ~4% to <1% through crash analysis and production fixes.\n\nAlso improved backend response times by removing redundant reads and optimizing request processing.',
        'impact',
      ),
    }),
    zemoso: dir({
      'overview.txt': file(
        'ZeMoSo\nSenior Software Engineer · Hyderabad\nNov 2016 – Sept 2019\n\nZero-to-one product engineering consultancy.\n\nFrom mobile product development to deploying cloud infrastructure.',
      ),
      'drone-applications.txt': file(
        'FIRST RESPONDER & PILOT\nDrone Applications\nAug 2018 – Sept 2019\n\nBuilt Android applications for:\n→ drone flight planning\n→ geographical no-fly-zone management\n\nFocus: maintainability, unit testing and production-quality Android engineering.',
      ),
      'devops.txt': file(
        'DEVOPS\nKubernetes + Docker\n\nDeployed a containerised .NET FaaS service to AWS and GCP.\n\nDocker · Kubernetes · AWS · GCP · Kubernetes namespaces',
      ),
      'mindhive.txt': file(
        'MINDHIVE\n\nPrivacy-focused social networking application.\n\nWorked across:\n→ development\n→ testing\n→ deployment\n\nJava · Kotlin · Android',
      ),
    }),
  }),
  projects: dir(
    Object.fromEntries(
      Object.values(projects).map((project) => [
        project.id,
        dir({
          'overview.txt': file(
            `${project.name.toUpperCase()}\n\n${project.overview}`,
          ),
          'stack.txt': file(project.tags.join('\n')),
          'features.txt': file(
            project.features.map((feature) => `→ ${feature}`).join('\n'),
          ),
        }),
      ]),
    ),
  ),
  skills: dir({
    'backend.txt': file(
      'BACKEND / WEB\n\nGo\nREST APIs\nMicroservices\nNext.js\nReact\nLaravel\nSQL',
    ),
    'mobile.txt': file(
      'MOBILE\n\nAndroid\nKotlin\nJetpack Compose\nKotlin Multiplatform\nMVVM',
    ),
    'cloud.txt': file('CLOUD / DEVOPS\n\nAWS\nGCP\nDocker\nKubernetes\nCI/CD'),
    'languages.txt': file(
      'LANGUAGES\n\nGo\nKotlin\nJava\nJavaScript\nTypeScript\nSQL',
    ),
  }),
  'resume.pdf': file(
    'The original resume has not been attached yet. Please email Jimmy for a copy.',
    'resume',
  ),
});
