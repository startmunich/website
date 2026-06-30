import type { ReactNode } from 'react';

export default function LabsLayout({ children }: { children: ReactNode }) {
  // This layout wraps the /labs route
  // The CSS in globals.css will hide the main Navigation and Footer
  // when it detects the .labs-page class
  return <>{children}</>;
}
