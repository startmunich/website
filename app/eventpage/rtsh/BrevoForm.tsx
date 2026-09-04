'use client';

import { useEffect, useRef } from 'react';

const FORM_SRC =
  'https://ffd0351e.sibforms.com/v2/serve/MUIFALaeotTze6qpyfasz0d5An6nyNpf6mY1cfXYQBMGk0rxMWAdCPPfSD5khAecTT3Q6rx5HvN_h3zTjIsMvEIQ78tnf6jijCUygucYTr3qpz5Ml8IWfRrdrLA_kgmYUSKPk1BO77uNDM-izrkA9c2k5OAHyqf-DAKT4o4WB9SGn5QD3AJAHJ77Jdgem5aHKJWSZKMR4GB92Bvb';

export default function BrevoForm() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let frame: number | undefined;
    const allowedOrigin = new URL(iframe.src).origin;

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== allowedOrigin) return;

      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (!data || typeof data.height !== 'number' || data.height <= 0) return;

        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          iframe.style.height = `${data.height}px`;
        });
      } catch {
        // ignore non-JSON messages from other windows
      }
    };

    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      className="block w-full max-w-[520px]"
      src={FORM_SRC}
      title="Join the Road to START Hack 2026 waitlist"
      height={560}
      loading="lazy"
      allow="clipboard-write"
      sandbox="allow-forms allow-popups allow-same-origin allow-scripts"
      style={{ border: 'none', transition: 'height 0.2s ease' }}
    />
  );
}
