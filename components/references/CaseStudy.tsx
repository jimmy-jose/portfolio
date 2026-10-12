import Image from 'next/image';
import { ArrowUpRight, LockKeyhole } from 'lucide-react';
import type {
  PublishedCaseStudy,
  PublishedTestimonial,
} from '@/lib/references';
import { TestimonialQuote } from './ClientVoices';

function ProductPreview({ project }: { project: PublishedCaseStudy }) {
  const [desktop, mobile] = project.screenshots;
  if (!desktop) {
    return (
      <figure className="ref-product-figure">
        <div className="ref-private-cover">
          <span className="ref-cover-kicker">Software for the working day</span>
          <div className="ref-cover-name">
            {project.name}
            <span>Practice management</span>
          </div>
          <div className="ref-private-note">
            <LockKeyhole size={17} strokeWidth={1.5} aria-hidden="true" />
            <span>
              Internal application
              <br />
              Product screens kept private
            </span>
          </div>
        </div>
        <figcaption>
          Client confidentiality comes first. Approved product images can be
          shared when available.
        </figcaption>
      </figure>
    );
  }
  return (
    <figure className="ref-product-figure">
      <div className="ref-product-stage">
        <div className="ref-desktop-preview">
          <div className="ref-browser-bar" aria-hidden="true">
            <span />
            <span />
            <span />
            <p>
              {project.website
                ? new URL(project.website).hostname
                : 'Private application'}
            </p>
            <LockKeyhole size={11} />
          </div>
          <Image
            src={desktop.src}
            alt={desktop.alt}
            width={desktop.width}
            height={desktop.height}
            sizes="(max-width: 767px) 85vw, (max-width: 1100px) 48vw, 590px"
            className="ref-product-image"
            unoptimized={false}
          />
        </div>
        {mobile && (
          <div className="ref-mobile-preview">
            <Image
              src={mobile.src}
              alt={mobile.alt}
              width={mobile.width}
              height={mobile.height}
              sizes="(max-width: 767px) 30vw, 160px"
              unoptimized={false}
            />
          </div>
        )}
      </div>
      <figcaption>
        {desktop.publication === 'public-capture'
          ? `Captured from the live product${desktop.capturedAt ? ` · ${new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(desktop.capturedAt))}` : ''}`
          : 'Client-approved product screenshot.'}
        {project.website && (
          <a
            href={project.website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.name} in a new tab`}
          >
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        )}
      </figcaption>
    </figure>
  );
}

export function CaseStudy({
  project,
  testimonial,
}: {
  project: PublishedCaseStudy;
  testimonial?: PublishedTestimonial;
}) {
  return (
    <article
      id={project.id}
      className={`ref-case-study ref-case-${project.id}`}
      aria-labelledby={`${project.id}-heading`}
    >
      <div className="ref-case-main">
        <div className="ref-case-intro">
          <p className="ref-eyebrow">{project.category}</p>
          <h3 id={`${project.id}-heading`}>
            {project.name}
            <span className="ref-name-period">.</span>
          </h3>
          <p className="ref-case-title">{project.title}</p>
          <p className="ref-case-summary">{project.summary}</p>
          <dl className="ref-project-facts">
            <div>
              <dt>Client</dt>
              <dd>{project.client}</dd>
            </div>
            <div>
              <dt>My contribution</dt>
              <dd>{project.contribution}</dd>
            </div>
            {project.technologies.length > 0 && (
              <div>
                <dt>Built with</dt>
                <dd>{project.technologies.join(' / ')}</dd>
              </div>
            )}
          </dl>
          {project.website ? (
            <a
              className="ref-text-link ref-visit-link"
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit {new URL(project.website).hostname}{' '}
              <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <span className="ref-private-label">
              <LockKeyhole size={13} strokeWidth={1.6} aria-hidden="true" />{' '}
              Private client application
            </span>
          )}
        </div>
        <ProductPreview project={project} />
      </div>
      <dl className="ref-case-story">
        <div>
          <dt>The challenge</dt>
          <dd>{project.challenge}</dd>
        </div>
        <div>
          <dt>The solution</dt>
          <dd>{project.solution}</dd>
        </div>
        <div>
          <dt>The outcome</dt>
          <dd>{project.outcome}</dd>
        </div>
      </dl>
      {testimonial && <TestimonialQuote item={testimonial} compact />}
    </article>
  );
}
