import type { Metadata } from 'next';

import Footer from '@/app/components/Footer';
import LeagueIntelligenceHub from '@/app/components/LeagueIntelligenceHub';
import Navbar from '@/app/components/Navbar';
import { getLeagueIntelligenceHubData } from '@/lib/intelligence-s24/league-intelligence';

export const metadata: Metadata = {
  title: 'League Intelligence S24 | Sportiva24',
  description: 'Estado competitivo integral de competiciones con metodologia S24.',
};

export const revalidate = 300;

export default async function LeagueIntelligencePage() {
  const data = await getLeagueIntelligenceHubData();

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <LeagueIntelligenceHub data={data} />
      <Footer />
    </main>
  );
}
