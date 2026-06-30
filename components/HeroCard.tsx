import React from 'react';

interface HeroCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function HeroCard({ children, className = '' }: HeroCardProps) {
  return (
    <div
      className={`relative w-full rounded-[1.5rem] border border-white/15 bg-white/[0.08] p-6 shadow-xl shadow-black/20 backdrop-blur-md sm:p-8 ${className}`}
    >
      <div className="relative text-center">{children}</div>
    </div>
  );
}
