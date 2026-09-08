import { contact } from '@/data/portfolio';
export function ContactLinks() {
  return (
    <div className="contact-links">
      {contact.email && (
        <a href={`mailto:${contact.email}`}>
          <span>Email</span>
          <span>{contact.email} ↗</span>
        </a>
      )}
      {contact.linkedin && (
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
          <span>LinkedIn</span>
          <span>Open profile ↗</span>
        </a>
      )}
      {contact.github && (
        <a href={contact.github} target="_blank" rel="noopener noreferrer">
          <span>GitHub</span>
          <span>Explore code ↗</span>
        </a>
      )}
      {contact.resume && (
        <a href={contact.resume} target="_blank" rel="noopener noreferrer">
          <span>Resume</span>
          <span>Open PDF ↗</span>
        </a>
      )}
    </div>
  );
}
