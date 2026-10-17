'use client';

import { motion } from 'motion/react';
import { useState } from 'react';

import { faqs } from './rtss-data';
import { Reveal, usePrefersReducedMotion } from './rtss-motion';
import { Pill } from './rtss-ui';

/**
 * Single-open accordion. Answers collapse with an animated height so the row
 * below slides up rather than snapping, and links inside a collapsed answer are
 * taken out of the tab order.
 */
export default function RtssFaq() {
  const [open, setOpen] = useState<number | null>(null);
  const reduce = usePrefersReducedMotion();

  return (
    <section
      id="questions"
      className="grid scroll-mt-8 grid-cols-[42%_1fr] gap-[7%] px-5 pt-[50px] pb-[200px] max-sm:grid-cols-1 max-sm:gap-10 max-sm:pt-0 max-sm:pb-[100px] sm:px-8 lg:px-10"
    >
      <Reveal>
        <Pill>FAQ</Pill>
        <h2 className="my-6 text-[80px] leading-[1.08] font-medium tracking-[-0.055em] max-sm:my-5">
          Questions &amp;
          <br />
          Answers
        </h2>
        <p className="text-[20px] leading-[1.4] tracking-[-0.035em] text-muted-foreground max-sm:text-[18px]">
          From pitching to joining us, here&rsquo;s
          <br className="max-sm:hidden" /> what you might be wondering.
        </p>
      </Reveal>

      <div>
        {faqs.map((faq, index) => {
          const isOpen = open === index;

          return (
            <div key={faq.question} className="border-t border-border">
              <h3 className="font-medium">
                <button
                  type="button"
                  id={`faq-question-${index}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => setOpen(isOpen ? null : index)}
                  // `group` so the "+" can read the button's own aria-expanded;
                  // on itself `aria-expanded:rotate-45` matched nothing, so it
                  // never turned.
                  className="group flex w-full cursor-pointer items-center justify-between gap-5 py-[42px] text-left text-[24px] leading-[1.3] tracking-[-0.045em] transition-colors group-aria-expanded:pb-4 hover:text-brand-pink max-[1100px]:text-[22px] max-sm:py-[27px] max-sm:text-[20px] max-sm:tracking-[-0.035em]"
                >
                  {faq.question}
                  <span
                    aria-hidden="true"
                    className="text-[28px] font-normal transition-transform duration-300 group-aria-expanded:rotate-45"
                  >
                    +
                  </span>
                </button>
              </h3>
              <motion.div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                aria-hidden={!isOpen}
                className="overflow-hidden"
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="pr-[50px] pb-[38px] text-[18px] leading-[1.4] text-muted-foreground max-sm:pr-[15px] max-sm:pb-7 max-sm:text-[16px]">
                  <p>{faq.answer}</p>
                  {faq.links && (
                    <p className="mt-5">
                      {faq.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          tabIndex={isOpen ? 0 : -1}
                          className="mr-6 text-foreground underline decoration-brand-pink decoration-2 underline-offset-4"
                        >
                          {link.label}
                        </a>
                      ))}
                    </p>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
