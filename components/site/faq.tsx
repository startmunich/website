import * as React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

export interface FaqItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

/** Questions as separate cards that expand in place. One open at a time. */
export function Faq({
  items,
  defaultValue,
  className,
}: {
  items: FaqItem[];
  /** Ids of the items that start open. */
  defaultValue?: string[];
  className?: string;
}) {
  return (
    <Accordion defaultValue={defaultValue} className={cn('gap-4', className)}>
      {items.map((faq) => (
        <AccordionItem
          key={faq.id}
          value={faq.id}
          className="overflow-hidden rounded-2xl border bg-card transition-colors not-last:border-b hover:border-primary/30"
        >
          <AccordionTrigger className="items-center rounded-2xl px-6 py-5 text-left text-lg font-bold hover:bg-accent/40 hover:no-underline **:data-[slot=accordion-trigger-icon]:size-5 **:data-[slot=accordion-trigger-icon]:text-primary md:px-7">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-5 text-base leading-relaxed text-muted-foreground md:px-7 [&_a]:text-primary [&_a]:no-underline [&_a]:hover:underline">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
