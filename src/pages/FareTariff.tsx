import { Link } from 'react-router-dom';
import { useSeo } from '@/lib/seo';
import { ContentHero } from '@/components/ContentHero';
import { useRideCategories } from '@/lib/useRideCategories';
import { formatINR } from '@core/utils/format';
import { hasEstimate } from '@core/services/pricingService';

export function FareTariffPage() {
  useSeo({
    title: 'Taxi Fare & Tariff in Theni',
    description: 'Indicative taxi fares and tariff for local and outstation trips from Theni — base fare, per-km rate and driver allowance by vehicle type.',
    keywords: 'theni taxi fare, theni taxi tariff, theni cab rate per km',
    canonical: '/fare-tariff',
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Fare & Tariff', path: '/fare-tariff' }],
  });
  const { categories } = useRideCategories();

  return (
    <div>
      <ContentHero eyebrow="Transparent pricing" title="Fare & Tariff" breadcrumb="Fare & Tariff"
        intro="Indicative rates by vehicle — the exact fare for your trip is always confirmed live when you book, including any applicable discount." />

      <section className="band">
        <div className="wrap">
          <div className="fare-table-wrap">
            <table className="fare-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Seats</th>
                  <th>Base fare</th>
                  <th>Per km</th>
                  <th>Minimum fare</th>
                  <th>Driver allowance*</th>
                </tr>
              </thead>
              <tbody>
                {categories.filter(hasEstimate).map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.seats}</td>
                    <td className="price">{formatINR(c.fare.baseFare)}</td>
                    <td className="price">{formatINR(c.fare.perKmRate)}/km</td>
                    <td className="price">{formatINR(c.fare.minimumFare)}</td>
                    <td>{formatINR(c.fare.driverAllowance)}/day</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small muted" style={{ marginTop: 14 }}>
            *Driver allowance applies on outstation trips over 40 km one way. GST (5%) and any night charge (10 PM – 6 AM) are added at
            checkout, before you confirm. Toll, parking and permit charges, where applicable, are paid directly by you during the trip.
          </p>
          <div className="content-cta" style={{ marginTop: 24 }}>
            <Link to="/book" className="btn btn--primary btn--lg">Get my exact fare</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
