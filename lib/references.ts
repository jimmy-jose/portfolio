import type {
  CaseStudy,
  ClientReference,
  ProjectScreenshot,
  Testimonial,
} from '../data/references';

export function publicScreenshot(image: ProjectScreenshot) {
  return (
    image.publication !== 'draft' &&
    image.src.startsWith('/') &&
    !image.src.startsWith('//')
  );
}

export function publishedCaseStudies(projects: CaseStudy[]) {
  return projects.map(
    ({ editorialNotes: _notes, screenshots, ...project }) => ({
      ...project,
      screenshots: screenshots.filter(publicScreenshot),
    }),
  );
}

export function publishedTestimonials(
  items: Testimonial[],
  showDrafts = false,
) {
  return items
    .filter(
      (item) =>
        (item.status === 'approved' || showDrafts) &&
        item.name.trim() &&
        item.designation.trim() &&
        item.organization.trim() &&
        item.quote.trim(),
    )
    .map(({ photograph, logo, ...item }) => ({
      ...item,
      photograph:
        photograph && publicScreenshot(photograph) ? photograph : undefined,
      logo: logo && publicScreenshot(logo) ? logo : undefined,
    }));
}

export function publishedReferences(items: ClientReference[]) {
  return items
    .filter(
      (item) =>
        item.status === 'approved' &&
        item.name.trim() &&
        item.designation.trim() &&
        item.organization.trim(),
    )
    .map(({ contact, ...item }) => ({
      ...item,
      // Remove private values entirely, rather than just hiding a rendered link.
      contact: contact?.publicationApproved
        ? safeReferenceContact(contact)
        : undefined,
    }));
}

function safeReferenceContact(
  contact: NonNullable<ClientReference['contact']>,
) {
  const value = contact.value.trim();
  if (
    contact.method === 'email' &&
    /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(value)
  ) {
    return { label: value, href: `mailto:${value}` };
  }
  if (contact.method === 'phone' && /^\+?[\d ()-]{6,24}$/.test(value)) {
    return { label: value, href: `tel:${value.replace(/[ ()-]/g, '')}` };
  }
  if (contact.method === 'website') {
    try {
      const url = new URL(value);
      if (url.protocol === 'https:' && !url.username && !url.password) {
        return { label: url.hostname, href: url.href };
      }
    } catch {
      /* An invalid contact falls back to an introduction on request. */
    }
  }
  return undefined;
}

export type PublishedCaseStudy = ReturnType<
  typeof publishedCaseStudies
>[number];
export type PublishedTestimonial = ReturnType<
  typeof publishedTestimonials
>[number];
export type PublishedReference = ReturnType<typeof publishedReferences>[number];
