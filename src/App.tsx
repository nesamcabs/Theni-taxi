import { Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/components/AuthProvider';
import { PhoneAuthModal } from '@/components/PhoneAuthModal';
import { Layout } from '@/components/Layout';
import { RouteErrorBoundary } from '@/shared/components/RouteErrorBoundary';
import { HomePage } from '@/pages/Home';
import { BookPage } from '@/pages/Book';
import { BookingConfirmationPage } from '@/pages/BookingConfirmation';
import { TripStatusPage } from '@/pages/TripStatus';
import { LocalTaxiPage } from '@/pages/LocalTaxi';
import { OutstationTaxiPage } from '@/pages/OutstationTaxi';
import { AirportTaxiPage } from '@/pages/AirportTaxi';
import { TourPackagesPage } from '@/pages/TourPackages';
import { FareTariffPage } from '@/pages/FareTariff';
import { AboutPage } from '@/pages/About';
import { ContactPage } from '@/pages/Contact';
import { FaqPage } from '@/pages/Faq';
import { RouteLandingPage } from '@/pages/RouteLanding';
import { NotFoundPage } from '@/pages/NotFound';

export default function App() {
  const location = useLocation();
  return (
    <AuthProvider>
      <Layout>
        <RouteErrorBoundary resetKey={location.pathname}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/book" element={<BookPage />} />
            <Route path="/book/confirmation/:id" element={<BookingConfirmationPage />} />
            <Route path="/trip/:id" element={<TripStatusPage />} />
            <Route path="/local-taxi" element={<LocalTaxiPage />} />
            <Route path="/outstation-taxi" element={<OutstationTaxiPage />} />
            <Route path="/airport-taxi" element={<AirportTaxiPage />} />
            <Route path="/tour-packages" element={<TourPackagesPage />} />
            <Route path="/fare-tariff" element={<FareTariffPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/theni-to/:slug" element={<RouteLandingPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </RouteErrorBoundary>
      </Layout>
      <PhoneAuthModal />
    </AuthProvider>
  );
}
