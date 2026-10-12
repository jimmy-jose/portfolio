import { ArrowUpRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

export function ProjectLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <a
      href={href}
      className={buttonVariants({
        variant: secondary ? 'outline' : 'default',
        className: `ref-button ${secondary ? 'ref-button-secondary' : ''}`,
      })}
    >
      {children}
      <ArrowUpRight size={17} strokeWidth={1.6} aria-hidden="true" />
    </a>
  );
}
