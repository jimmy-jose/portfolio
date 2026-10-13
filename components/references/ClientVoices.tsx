import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type {
  PublishedReference,
  PublishedTestimonial,
} from '@/lib/references';

export function TestimonialQuote({
  item,
  compact = false,
}: {
  item: PublishedTestimonial;
  compact?: boolean;
}) {
  return (
    <figure className={compact ? 'ref-quote ref-quote-compact' : 'ref-quote'}>
      <blockquote>
        <p>“{item.quote}”</p>
      </blockquote>
      <figcaption className="ref-attribution">
        {item.photograph && (
          <Image
            src={item.photograph.src}
            alt=""
            width={44}
            height={44}
            className="ref-avatar"
            unoptimized={false}
          />
        )}
        <span>
          <strong>{item.name}</strong>
          <span>
            {item.designation}, {item.organization}
          </span>
        </span>
        {item.logo && (
          <Image
            src={item.logo.src}
            alt={`${item.organization} logo`}
            width={80}
            height={36}
            className="ref-client-logo"
            unoptimized={false}
          />
        )}
      </figcaption>
    </figure>
  );
}

export function ClientVoices({ items }: { items: PublishedTestimonial[] }) {
  if (!items.length) return null;
  return (
    <section
      id="client-words"
      className="ref-voices"
      aria-labelledby="client-words-heading"
    >
      <p className="ref-eyebrow">The working relationship</p>
      <h2 id="client-words-heading">Words from clients.</h2>
      <div className="ref-voices-grid">
        {items.map((item) => (
          <div key={item.projectId}>
            <a
              className="ref-text-link ref-quote-project"
              href={`#${item.projectId}`}
            >
              {item.organization} project{' '}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <TestimonialQuote item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function ReferenceList({
  items,
  enquiryUrl,
}: {
  items: PublishedReference[];
  enquiryUrl: string;
}) {
  return (
    <section
      id="references"
      className="ref-references"
      aria-labelledby="references-heading"
    >
      <div>
        <p className="ref-eyebrow">A conversation, if it helps</p>
        <h2 id="references-heading">References available.</h2>
        <p className="ref-section-copy">
          Previous clients can speak to my communication, technical ownership
          and professionalism.
        </p>
      </div>
      <div className="ref-reference-details">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.projectId} className="ref-reference-person">
              <h3>{item.name}</h3>
              <p>
                {item.designation}, {item.organization}
              </p>
              <a href={`#${item.projectId}`} className="ref-text-link">
                View associated project{' '}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
              {item.contact ? (
                <a className="ref-text-link" href={item.contact.href}>
                  {item.contact.label}{' '}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              ) : (
                <p className="ref-contact-fallback">
                  Contact available on request
                </p>
              )}
            </div>
          ))
        ) : (
          <>
            <p className="ref-reference-title">A personal introduction.</p>
            <p>
              Contact available on request. I’ll check availability and
              permission with the client before making an introduction.
            </p>
          </>
        )}
        <a className="ref-text-link" href={enquiryUrl}>
          Ask about a reference{' '}
          <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
