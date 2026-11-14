import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

export function ContentHero({ eyebrow, title, intro, breadcrumb, children }: { eyebrow: string; title: string; intro: string; breadcrumb: string; children?: ReactNode }) {
  return (
    <section className="content-hero">
      <div className="wrap">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{breadcrumb}</span>
        </nav>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{intro}</p>
        {children}
      </div>
    </section>
  );
}
