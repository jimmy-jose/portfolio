'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export function CaseStudyDisclosure({
  id,
  name,
  category,
  title,
  children,
}: {
  id: string;
  name: string;
  category: string;
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <h3 id={`${id}-heading`}>
        <CollapsibleTrigger
          className="ref-case-trigger"
          aria-controls={`${id}-details`}
          aria-labelledby={`${id}-name ${id}-action`}
        >
          <span className="ref-case-overview">
            <span className="ref-eyebrow">{category}</span>
            <span id={`${id}-name`} className="ref-case-name">
              {name}
              <span className="ref-name-period">.</span>
            </span>
            <span className="ref-case-title">{title}</span>
          </span>
          <span className="ref-case-action">
            <span id={`${id}-action`}>
              {open ? 'Minimize' : 'View case study'}
            </span>
            <span className="ref-case-chevron" aria-hidden="true">
              <ChevronDown size={18} strokeWidth={1.6} />
            </span>
          </span>
        </CollapsibleTrigger>
      </h3>
      <CollapsibleContent
        id={`${id}-details`}
        className="ref-case-panel"
        render={<section />}
        aria-labelledby={`${id}-name`}
        aria-hidden={!open}
        inert={!open}
        keepMounted
      >
        <div className="ref-case-details">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
