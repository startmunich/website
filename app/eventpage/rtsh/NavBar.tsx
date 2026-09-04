'use client';

import { useEffect, useState } from 'react';

type NavBarProps = {
  logoSvg: string;
};

export default function NavBar({ logoSvg }: NavBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame: number | undefined;

    const update = () => {
      setVisible(window.scrollY > window.innerHeight * 0.9);
    };

    const onScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[#34e1b8]/10 bg-[#0c2724]/70 backdrop-blur-xl transition-[transform,visibility] duration-300 ${
        visible ? 'visible translate-y-0' : 'invisible -translate-y-full'
      }`}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex h-[70px] max-w-[1100px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="#top" aria-label="START Hack, home" className="flex items-center">
          <div
            className="h-[26px] w-auto [&_svg]:h-full [&_svg]:w-auto"
            dangerouslySetInnerHTML={{ __html: logoSvg }}
          />
        </a>
        <a href="#waitlist" className="btn-primary">
          Join the waitlist
        </a>
      </div>
    </header>
  );
}
