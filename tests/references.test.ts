import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  caseStudies,
  clientReferences,
  testimonials,
  type ClientReference,
  type ProjectScreenshot,
  type Testimonial,
} from '../data/references';
import {
  publishedCaseStudies,
  publishedReferences,
  publishedTestimonials,
} from '../lib/references';

void test('unapproved client feedback and identities are absent from production content', () => {
  const drafts = testimonials.map((item) => ({
    ...item,
    status: 'draft' as const,
  }));
  assert.deepEqual(publishedTestimonials(drafts), []);
  assert.deepEqual(
    publishedTestimonials(testimonials).map((item) => item.projectId),
    ['jda', 'thekken'],
  );
  assert.deepEqual(publishedReferences(clientReferences), []);
  assert.equal(
    publishedTestimonials(testimonials, true).length,
    testimonials.length,
  );
});

void test('only complete approved testimonials publish and exact feedback is preserved', () => {
  const approved: Testimonial = {
    ...testimonials[0],
    status: 'approved',
    quote: 'Exact approved wording.\nSecond line.',
  };
  assert.equal(publishedTestimonials([approved])[0].quote, approved.quote);
  assert.deepEqual(publishedTestimonials([{ ...approved, name: ' ' }]), []);
  assert.deepEqual(publishedTestimonials([{ ...approved, quote: '' }]), []);
});

void test('testimonial approval grants no reference or contact publication permission', () => {
  const reference: ClientReference = {
    ...clientReferences[0],
    status: 'approved',
    name: 'Reference test fixture',
    designation: 'Owner',
    contact: {
      method: 'email',
      value: 'private@example.test',
      publicationApproved: false,
    },
  };
  const result = publishedReferences([reference]);
  assert.equal(result.length, 1);
  assert.equal(result[0].contact, undefined);
  assert.ok(!JSON.stringify(result).includes('private@example.test'));
  assert.deepEqual(
    publishedReferences([
      {
        ...reference,
        status: 'draft',
        contact: { ...reference.contact!, publicationApproved: true },
      },
    ]),
    [],
  );
});

void test('approved contacts produce safe email, phone and web links', () => {
  const reference: ClientReference = {
    projectId: 'jda',
    status: 'approved',
    name: 'Reference test fixture',
    designation: 'Owner',
    organization: 'Test organization',
  };
  const publish = (method: 'email' | 'phone' | 'website', value: string) =>
    publishedReferences([
      { ...reference, contact: { method, value, publicationApproved: true } },
    ])[0].contact;
  assert.equal(
    publish('email', 'hello@example.test')?.href,
    'mailto:hello@example.test',
  );
  assert.equal(
    publish('phone', '+44 (20) 1234-5678')?.href,
    'tel:+442012345678',
  );
  assert.equal(
    publish('website', 'https://example.test/contact')?.href,
    'https://example.test/contact',
  );
  for (const value of [
    'javascript:alert(1)',
    'http://example.test',
    'https://user:secret@example.test',
    'broken',
  ])
    assert.equal(publish('website', value), undefined);
  assert.equal(
    publish('email', 'hello@example.test?bcc=private@example.test'),
    undefined,
  );
});

void test('draft screenshots and editorial notes never enter the public project model', () => {
  const draft: ProjectScreenshot = {
    src: '/private-client-screen.png',
    alt: 'Confidential',
    width: 500,
    height: 300,
    source: 'Internal',
    publication: 'draft',
  };
  const result = publishedCaseStudies([
    { ...caseStudies[0], screenshots: [draft] },
  ]);
  assert.deepEqual(result[0].screenshots, []);
  assert.ok(!('editorialNotes' in result[0]));
  const quote: Testimonial = {
    ...testimonials[0],
    status: 'approved',
    photograph: draft,
    logo: draft,
  };
  assert.equal(publishedTestimonials([quote])[0].photograph, undefined);
  assert.equal(publishedTestimonials([quote])[0].logo, undefined);
});

void test('approved JDA screenshots replace the privacy cover without new presentation code', () => {
  const screenshot: ProjectScreenshot = {
    ...caseStudies[1].screenshots[0],
    publication: 'client-approved',
  };
  assert.equal(
    publishedCaseStudies([{ ...caseStudies[0], screenshots: [screenshot] }])[0]
      .screenshots.length,
    1,
  );
});

void test('published screenshots exist locally with dimensions and source provenance', () => {
  for (const project of publishedCaseStudies(caseStudies)) {
    for (const image of project.screenshots) {
      assert.ok(existsSync(join(process.cwd(), 'public', image.src)));
      assert.ok(image.width > 0 && image.height > 0);
      assert.ok(image.alt.trim());
      assert.match(image.source, /^https:\/\//);
    }
  }
  assert.deepEqual(
    caseStudies.map((project) => project.technologies),
    [
      [
        'Next.js App Router with TypeScript',
        'React 19 and Tailwind CSS',
        'Turso/libSQL with Drizzle ORM',
        'Better Auth for authentication',
        'S3-compatible private storage for files',
        'Vitest and Playwright for testing',
        'Vercel for deployment',
      ],
      [
        'Next.js 16 + React 19',
        'TypeScript 5',
        'Tailwind CSS 4 + shadcn/ui',
        'TiDB Cloud + Drizzle ORM',
        'Better Auth',
        'Cloudflare R2',
        'Resend',
        'Vercel + Analytics',
      ],
    ],
  );
});
