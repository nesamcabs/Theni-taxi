// Theni outstation corridor pages — one per popular destination, rendered by
// pages/RouteLanding.tsx at /theni-to/:slug. Distances are approximate road
// distances via the usual route; the live quote at booking is the fare that counts.
export interface RouteCorridor {
  slug: string;
  destination: string;
  state: string;
  distanceKm: number;
  travelTime: string;
  h1: string;
  intro: string;
  overview: string;
  highlights: string[];
  sedanFareFrom: number;
  suvFareFrom: number;
  faqs: { q: string; a: string }[];
}

export const ROUTES: RouteCorridor[] = [
  {
    slug: 'madurai',
    destination: 'Madurai',
    state: 'Tamil Nadu',
    distanceKm: 75,
    travelTime: '1 hr 45 min',
    h1: 'Theni to Madurai Taxi',
    intro: 'A quick, flat drive on NH 85 — our most booked outstation run.',
    overview:
      'Theni to Madurai is the route our drivers know best: a smooth 75 km stretch on NH 85 through Andipatti and Usilampatti, done in under two hours outside peak traffic. Riders use it for Meenakshi Temple visits, Madurai Junction train connections, Madurai Airport (IXM) drop and same-day return trips for business or college admissions.',
    highlights: ['Meenakshi Amman Temple', 'Madurai Junction railway station', 'Madurai Airport (IXM)', 'Government Rajaji Hospital'],
    sedanFareFrom: 1950,
    suvFareFrom: 2600,
    faqs: [
      { q: 'How long does a Theni to Madurai taxi take?', a: 'About 1 hour 45 minutes to 2 hours by sedan or SUV on NH 85, depending on traffic through Usilampatti.' },
      { q: 'Can I book a one-way drop from Theni to Madurai?', a: 'Yes — Theni Taxi runs one-way drop taxis to Madurai with no empty-return charge added to your fare; the quoted price is what you pay.' },
      { q: 'Do you drop at Madurai Airport?', a: 'Yes, airport drop and pickup at Madurai Airport (IXM) is available 24/7 — just select Airport Taxi when booking.' },
    ],
  },
  {
    slug: 'madurai-airport',
    destination: 'Madurai Airport',
    state: 'Tamil Nadu',
    distanceKm: 80,
    travelTime: '2 hrs',
    h1: 'Theni to Madurai Airport Taxi',
    intro: 'Flight-timed pickups from anywhere in Theni, Bodi, Cumbum or Periyakulam.',
    overview:
      'Catching a flight from Madurai Airport (IXM)? Theni Taxi tracks your flight time and schedules the pickup backwards so you reach with a comfortable buffer — no rushing through Usilampatti traffic. The same service runs in reverse for arrivals: tell us your flight number and we track landing time instead of a fixed clock time.',
    highlights: ['Madurai Airport (IXM) departures & arrivals', 'Flight-time tracking', 'Meet & greet at arrivals'],
    sedanFareFrom: 2000,
    suvFareFrom: 2650,
    faqs: [
      { q: 'Do you track flight delays for airport pickup?', a: 'Yes — share your flight number at booking and we adjust the pickup time to the actual landing time, at no extra charge for reasonable delays.' },
      { q: 'How early should I leave Theni for a flight from Madurai?', a: 'We recommend leaving at least 3 hours before departure to allow for the 2-hour drive plus airport check-in time.' },
    ],
  },
  {
    slug: 'kodaikanal',
    destination: 'Kodaikanal',
    state: 'Tamil Nadu',
    distanceKm: 80,
    travelTime: '2 hrs 30 min',
    h1: 'Theni to Kodaikanal Taxi',
    intro: 'Ghat-road drivers who know every one of the 22 hairpin bends via Periyakulam.',
    overview:
      'The Theni to Kodaikanal taxi route climbs through Periyakulam and the Kodaikanal ghat road — 22 numbered hairpin bends through shola forest, with Pambar waterfalls and Silver Cascade on the way up. Our drivers run this hill route daily and know where to stop for the view without losing time. Popular for day trips, Kodai Lake visits and honeymoon packages.',
    highlights: ['Kodaikanal Lake', 'Pambar / Silver Cascade Falls', 'Coakers Walk', 'Pillar Rocks', 'Bryant Park'],
    sedanFareFrom: 2400,
    suvFareFrom: 3200,
    faqs: [
      { q: 'Is the Kodaikanal ghat road safe at night?', a: 'We schedule hill-route pickups for daylight hours where possible; our drivers are experienced on the ghat section regardless of time.' },
      { q: 'Can I book a round trip with sightseeing stops in Kodaikanal?', a: 'Yes — choose Round Trip and add your stops (Coakers Walk, Pillar Rocks, Bryant Park); the driver waits through your itinerary.' },
    ],
  },
  {
    slug: 'munnar',
    destination: 'Munnar',
    state: 'Kerala',
    distanceKm: 90,
    travelTime: '3 hrs',
    h1: 'Theni to Munnar Taxi',
    intro: 'Cross into Kerala via Bodinayakanur and the Top Station ghat road.',
    overview:
      'Theni to Munnar is a favourite tea-estate run via Bodinayakanur and the Kerala border, climbing through Top Station for a panoramic view back over the Theni plains before dropping into Munnar\'s tea gardens. Expect interstate permit formalities at the border, which our drivers handle as part of the trip.',
    highlights: ['Top Station viewpoint', 'Tea estates & Kolukkumalai', 'Mattupetty Dam', 'Eravikulam National Park'],
    sedanFareFrom: 2700,
    suvFareFrom: 3600,
    faqs: [
      { q: 'Do I need anything extra for an interstate trip to Munnar?', a: 'No — the interstate permit is arranged as part of your fare; just confirm the trip at booking so the driver carries the right vehicle papers.' },
    ],
  },
  {
    slug: 'thekkady',
    destination: 'Thekkady (Kumily)',
    state: 'Kerala',
    distanceKm: 75,
    travelTime: '2 hrs',
    h1: 'Theni to Thekkady Taxi',
    intro: 'Via Cumbum and the Kumily border check-post into Periyar.',
    overview:
      'The Theni to Thekkady taxi runs through Cumbum and Kumily to reach Periyar Tiger Reserve and the spice plantations around Thekkady. It\'s the shortest way into Kerala\'s Periyar hills from Theni district, popular for day safaris and spice-garden tours.',
    highlights: ['Periyar Tiger Reserve', 'Periyar Lake boating', 'Spice plantations', 'Kumily market'],
    sedanFareFrom: 2250,
    suvFareFrom: 3000,
    faqs: [
      { q: 'Can the taxi wait while I do the Periyar boat safari?', a: 'Yes — on a round trip booking the driver waits at Thekkady through your safari and sightseeing before the return leg.' },
    ],
  },
  {
    slug: 'coimbatore',
    destination: 'Coimbatore',
    state: 'Tamil Nadu',
    distanceKm: 140,
    travelTime: '3 hrs',
    h1: 'Theni to Coimbatore Taxi',
    intro: 'Via Dindigul and Palani on NH 83 — comfortable for business trips.',
    overview:
      'Theni to Coimbatore runs via Dindigul and Palani, a straightforward highway stretch popular with business travellers and for Coimbatore International Airport (CJB) connections onward.',
    highlights: ['Coimbatore International Airport (CJB)', 'Palani Murugan Temple en route', 'Isha Yoga Center'],
    sedanFareFrom: 3600,
    suvFareFrom: 4800,
    faqs: [
      { q: 'Does the Theni to Coimbatore route pass Palani?', a: 'Yes, Palani is directly on the way — many riders stop at the Murugan temple en route, which the driver can factor into the trip.' },
    ],
  },
  {
    slug: 'dindigul',
    destination: 'Dindigul',
    state: 'Tamil Nadu',
    distanceKm: 45,
    travelTime: '1 hr',
    h1: 'Theni to Dindigul Taxi',
    intro: 'A short, frequent run for daily commuters and locknut-city visitors.',
    overview:
      'Theni to Dindigul is a quick one-hour hop, often booked same-day for college, hospital and court visits, or as the first leg of a longer rail journey from Dindigul Junction.',
    highlights: ['Dindigul Rock Fort', 'Dindigul Junction railway station', 'Government Rajaji Hospital, Dindigul'],
    sedanFareFrom: 1350,
    suvFareFrom: 1800,
    faqs: [
      { q: 'Is a Theni to Dindigul taxi available on short notice?', a: 'Yes, being a short local-outstation run it is usually available within 20–30 minutes of booking.' },
    ],
  },
  {
    slug: 'trichy',
    destination: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    distanceKm: 140,
    travelTime: '3 hrs',
    h1: 'Theni to Trichy Taxi',
    intro: 'Via Dindigul for Trichy Airport, Rockfort and Srirangam temple visits.',
    overview:
      'Theni to Tiruchirappalli (Trichy) runs via Dindigul, used for Trichy International Airport (TRZ) connections, Rockfort Temple and Srirangam visits, and as a gateway for onward travel further north.',
    highlights: ['Trichy International Airport (TRZ)', 'Rockfort Temple', 'Srirangam Ranganathaswamy Temple'],
    sedanFareFrom: 3500,
    suvFareFrom: 4600,
    faqs: [
      { q: 'Do you offer drop to Trichy Airport?', a: 'Yes, Airport Taxi drop and pickup at Trichy International Airport is available around the clock.' },
    ],
  },
  {
    slug: 'rameswaram',
    destination: 'Rameswaram',
    state: 'Tamil Nadu',
    distanceKm: 210,
    travelTime: '4 hrs 30 min',
    h1: 'Theni to Rameswaram Taxi',
    intro: 'A long pilgrimage run via Madurai and Ramanathapuram.',
    overview:
      'Theni to Rameswaram is a popular pilgrimage booking via Madurai and Ramanathapuram to the Ramanathaswamy Temple and Pamban Bridge. Most riders book it as a round trip with an overnight halt, or a long single-day darshan trip starting before dawn.',
    highlights: ['Ramanathaswamy Temple', 'Pamban Bridge', 'Dhanushkodi'],
    sedanFareFrom: 5200,
    suvFareFrom: 6900,
    faqs: [
      { q: 'Can we do Theni to Rameswaram and back in one day?', a: 'It is possible but long (about 9 hours of driving); most riders prefer a round trip with one night at Rameswaram.' },
    ],
  },
  {
    slug: 'kanyakumari',
    destination: 'Kanyakumari',
    state: 'Tamil Nadu',
    distanceKm: 290,
    travelTime: '6 hrs',
    h1: 'Theni to Kanyakumari Taxi',
    intro: 'For the Vivekananda Rock, sunrise point and the southern tip of India.',
    overview:
      'Theni to Kanyakumari is usually booked as a round trip with an overnight stay, covering the Vivekananda Rock Memorial, Thiruvalluvar Statue and the famous Kanyakumari sunrise/sunset point at the southern tip of the subcontinent.',
    highlights: ['Vivekananda Rock Memorial', 'Thiruvalluvar Statue', 'Sunrise / sunset point'],
    sedanFareFrom: 7200,
    suvFareFrom: 9600,
    faqs: [
      { q: 'Is Kanyakumari better as a one-way or round trip booking?', a: 'Most riders book it round trip with one or two nights at Kanyakumari, since the drive each way is about 6 hours.' },
    ],
  },
];

export const findRoute = (slug: string): RouteCorridor | undefined => ROUTES.find((r) => r.slug === slug);
