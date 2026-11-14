import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingContact } from './FloatingContact';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="page">
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <FloatingContact />
    </div>
  );
}
