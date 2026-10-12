import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { CaseStudy } from '@/components/references/CaseStudy';
import {
  ClientVoices,
  ReferenceList,
} from '@/components/references/ClientVoices';
import { ProjectLink } from '@/components/references/ProjectLink';
import { contact } from '@/data/portfolio';
import {
  caseStudies,
  clientReferences,
  referencesPage,
  testimonials,
} from '@/data/references';
import {
  publishedCaseStudies,
  publishedReferences,
  publishedTestimonials,
} from '@/lib/references';
import styles from './references.module.css';

const sans = localFont({
  src: '../../public/references/fonts/geist-regular.woff2',
  variable: '--ref-font-sans',
  display: 'swap',
  weight: '100 900',
  fallback: ['Arial'],
});
const editorial = localFont({
  src: [
    {
      path: '../../public/references/fonts/eb-garamond-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/references/fonts/eb-garamond-italic.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--ref-font-editorial',
  display: 'swap',
  fallback: ['Georgia'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jimmyj.is-a.dev'),
  title: referencesPage.title,
  description: referencesPage.description,
  alternates: { canonical: referencesPage.url },
  openGraph: {
    type: 'website',
    url: referencesPage.url,
    siteName: 'Jimmy Jose',
    title: referencesPage.title,
    description: referencesPage.description,
    images: [
      {
        url: 'https://jimmyj.is-a.dev/references/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Selected work and client references by Jimmy Jose',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: referencesPage.title,
    description: referencesPage.description,
    images: ['https://jimmyj.is-a.dev/references/opengraph-image'],
  },
};

export default function ReferencesPage() {
  const projects = publishedCaseStudies(caseStudies);
  const voices = publishedTestimonials(
    testimonials,
    process.env.NODE_ENV === 'development',
  );
  const references = publishedReferences(clientReferences);
  const projectEnquiry = `mailto:${contact.email}?subject=${encodeURIComponent('Let’s discuss a project')}`;
  const referenceEnquiry = `mailto:${contact.email}?subject=${encodeURIComponent('Client reference enquiry')}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': 'https://jimmyj.is-a.dev/#jimmy',
        name: 'Jimmy Jose',
        jobTitle: 'Independent Software Engineer',
        url: 'https://jimmyj.is-a.dev/',
      },
      {
        '@type': 'CollectionPage',
        '@id': referencesPage.url,
        url: referencesPage.url,
        name: referencesPage.title,
        description: referencesPage.description,
        author: { '@id': 'https://jimmyj.is-a.dev/#jimmy' },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: projects.map((project, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'CreativeWork',
              '@id': `${referencesPage.url}#${project.id}`,
              name: `${project.name}: ${project.title}`,
              description: project.summary,
              url: project.website ?? `${referencesPage.url}#${project.id}`,
              creator: { '@id': 'https://jimmyj.is-a.dev/#jimmy' },
            },
          })),
        },
      },
    ],
  };
  return (
    <div className={`${styles.page} ${sans.variable} ${editorial.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <a href="#main-content" className="ref-skip-link">
        Skip to content
      </a>
      <div className="ref-container">
        <header className="ref-header">
          <Link href="/" className="ref-brand" prefetch={false}>
            <span className="ref-monogram" aria-hidden="true">
              j<span>_</span>
            </span>
            <span>
              Jimmy Jose
              <span className="ref-brand-description">
                Independent software engineer
              </span>
              <span className="sr-only"> (main portfolio)</span>
            </span>
          </Link>
          <nav aria-label="Page navigation" className="ref-nav">
            <a href="#selected-work" className="ref-nav-active">
              Selected work
            </a>
            <a href="#references">References</a>
            <a href={projectEnquiry}>
              Let’s talk{' '}
              <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" />
            </a>
          </nav>
        </header>
        <main id="main-content" tabIndex={-1}>
          <section className="ref-hero" aria-labelledby="references-title">
            <p className="ref-eyebrow">{referencesPage.identifier}</p>
            <h1 id="references-title">
              Selected work &amp;
              <br className="ref-title-break" /> <em>client references.</em>
            </h1>
            <div className="ref-hero-bottom">
              <p>{referencesPage.introduction}</p>
              <div className="ref-hero-action">
                <ProjectLink href={projectEnquiry}>
                  Discuss a project
                </ProjectLink>
                <span>
                  <i aria-hidden="true" /> Available for freelance &amp;
                  contract work
                </span>
              </div>
            </div>
          </section>
          <section
            id="selected-work"
            className="ref-selected-work"
            aria-labelledby="selected-work-heading"
          >
            <div className="ref-section-heading">
              <h2 id="selected-work-heading">Selected client projects</h2>
              <a href="#jda" className="ref-work-index">
                Explore the work{' '}
                <ArrowDown size={14} strokeWidth={1.6} aria-hidden="true" />
              </a>
            </div>
            {projects.map((project) => (
              <CaseStudy
                key={project.id}
                project={project}
                testimonial={voices.find(
                  (item) => item.projectId === project.id,
                )}
              />
            ))}
          </section>
          <ClientVoices items={voices} />
          <ReferenceList items={references} enquiryUrl={referenceEnquiry} />
          <section
            id="contact"
            className="ref-contact"
            aria-labelledby="contact-heading"
          >
            <p className="ref-eyebrow">Let’s build something useful</p>
            <h2 id="contact-heading">Have a project in mind?</h2>
            <p>
              I work with businesses and teams to design, build and deliver
              reliable software, from early ideas to production systems.
            </p>
            <ProjectLink href={projectEnquiry}>
              Let’s discuss your project
            </ProjectLink>
            <a href={`mailto:${contact.email}`} className="ref-email">
              {contact.email}
            </a>
          </section>
        </main>
        <footer className="ref-footer">
          <span>
            Jimmy Jose
            <span className="ref-footer-note">
              Software built with intent. Delivered with care.
            </span>
          </span>
          <Link href="/" className="ref-text-link" prefetch={false}>
            Explore the main portfolio{' '}
            <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" />
          </Link>
        </footer>
      </div>
    </div>
  );
}
