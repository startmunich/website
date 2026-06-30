'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface CTAButton {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
  external?: boolean;
}

interface CTAProps {
  title: string | ReactNode;
  description: string | ReactNode;
  buttons: CTAButton[];
  layout?: 'centered' | 'split';
  className?: string;
}

export default function CTA({
  title,
  description,
  buttons,
  layout = 'centered',
  className = '',
}: CTAProps) {
  const renderButton = (button: CTAButton, index: number) => {
    const isPrimary = button.variant === 'primary' || (index === 0 && !button.variant);
    const baseClasses = 'px-8 py-3 font-bold rounded-full transition-all duration-300';
    const primaryClasses =
      'bg-[#d0006f] hover:bg-[#d0006f]/90 text-white hover:shadow-lg hover:shadow-[#d0006f]/50';
    const secondaryClasses = 'border border-[#d0006f] text-[#d0006f] hover:bg-[#d0006f]/10';

    const classes = `${baseClasses} ${isPrimary ? primaryClasses : secondaryClasses}`;

    if (button.external) {
      return (
        <a key={index} href={button.href} target="_blank" rel="noopener" className={classes}>
          {button.label}
        </a>
      );
    }

    return (
      <Link key={index} href={button.href} className={classes}>
        {button.label}
      </Link>
    );
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 border-[#d0006f]/50 bg-gradient-to-br from-[#1a1a3e] via-[#00002c] to-[#0d0d1f] shadow-2xl shadow-[#d0006f]/20 ${className}`}
    >
      {/* Decorative Elements */}
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#d0006f]/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#d0006f]/5 blur-3xl"></div>

      <div className="relative p-8 md:p-12">
        {layout === 'centered' ? (
          <div className="flex flex-col items-center gap-8 text-center">
            <div>
              <h3 className="mb-4 text-3xl font-black text-white md:text-4xl">{title}</h3>
              <p className="max-w-2xl text-lg text-gray-300">{description}</p>
            </div>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">{buttons.map(renderButton)}</div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            {/* Left Side - Content */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="mb-4 text-3xl font-black text-white md:text-4xl">{title}</h3>
              <p className="max-w-2xl text-lg text-gray-300">{description}</p>
            </div>

            {/* Right Side - Buttons */}
            <div className="flex flex-shrink-0 flex-col gap-4 sm:flex-row">
              {buttons.map(renderButton)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
