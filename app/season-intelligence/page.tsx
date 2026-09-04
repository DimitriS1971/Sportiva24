import type { Metadata } from 'next';

import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
import SeasonIntelligenceHub from '@/app/components/SeasonIntelligenceHub';
import { getSeasonIntelligenceHubData } from '@/lib/intelligence-s24/season-intelligence';

export const metadata: Metadata = {
  title: 'Season Intelligence S24 | Sportiva24',
  description: 'Analisis inteligente de temporadas completas bajo metodologia S24.',
};

export const revalidate = 300;

export default async function SeasonIntelligencePage() {
  const data = await getSeasonIntelligenceHubData();

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <SeasonIntelligenceHub data={data} />
      <Footer />
    </main>
  );
}
