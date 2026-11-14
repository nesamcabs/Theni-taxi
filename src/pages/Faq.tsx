import { Link } from 'react-router-dom';
import { useSeo } from '@/lib/seo';
import { faqSchema } from '@/seo/site';
import { ContentHero } from '@/components/ContentHero';
import { FaqAccordion } from '@/components/FaqAccordion';

const FAQS = [
  { q: 'How do I book a taxi in Theni?', a: 'Tap Book a Taxi, choose your pickup and drop, pick a trip type and time, then choose a vehicle. You confirm your phone number by OTP and the booking is sent for confirmation.' },
  { q: 'How is the fare calculated?', a: 'Local trips are priced on base fare plus distance and time; outstation trips are priced per kilometre plus a driver allowance. GST (5%) and any night charge are shown before you confirm — the price you see is the price you pay.' },
  { q: 'Do I need to pay online?', a: 'No — every Theni Taxi booking is pay-later. Settle with the driver by cash or UPI at the end of the trip.' },
  { q: 'Can I cancel a booking?', a: 'Yes. Cancellation is free before a driver is assigned, and usually free for a short window after assignment; a small fee may apply once a driver is already on the way — shown clearly before you cancel.' },
  { q: 'What if I need to change my pickup time?', a: 'Call or WhatsApp us with the new time and we’ll update it, subject to driver availability.' },
  { q: 'Do you operate at night?', a: 'Yes — Theni Taxi runs 24 hours, 7 days a week, for both local and outstation trips.' },
  { q: 'Which areas do you serve?', a: 'Local rides across Theni, Bodinayakanur, Cumbum, Periyakulam, Kambam and Chinnamanur, plus outstation trips to Madurai, Kodaikanal, Munnar, Thekkady, Coimbatore, Trichy, Rameswaram and more.' },
];

export function FaqPage() {
  useSeo({
    title: 'Frequently Asked Questions',
    description: 'Answers to common questions about booking a taxi in Theni — fares, payment, cancellation and the areas we cover.',
    canonical: '/faq',
    schema: faqSchema(FAQS),
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'FAQ', path: '/faq' }],
  });

  return (
    <div>
      <ContentHero eyebrow="Help" title="Frequently Asked Questions" breadcrumb="FAQ" intro="Everything riders usually ask us before their first trip." />
      <section className="band">
        <div className="wrap">
          <FaqAccordion items={FAQS} />
          <div className="content-cta" style={{ marginTop: 32 }}>
            <Link to="/contact" className="btn btn--secondary">Still have a question? Contact us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
