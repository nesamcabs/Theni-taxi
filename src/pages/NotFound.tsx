import { Link } from 'react-router-dom';
import { useSeo } from '@/lib/seo';

export function NotFoundPage() {
  useSeo({ title: 'Page Not Found', noindex: true });
  return (
    <div className="wrap confirm-page">
      <h1>404</h1>
      <p className="muted">We couldn&rsquo;t find that page.</p>
      <Link to="/" className="btn btn--primary btn--lg" style={{ marginTop: 20 }}>Back to home</Link>
    </div>
  );
}
