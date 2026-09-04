import type { Metadata } from 'next';

import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
import PlayerIntelligenceHub from '@/app/components/PlayerIntelligenceHub';
import { getPlayerIntelligenceHubData } from '@/lib/intelligence-s24/player-intelligence';

export const metadata: Metadata = {
  title: 'Player Intelligence S24 | Sportiva24',
  description: 'Evaluacion metodologica inteligente de jugadores bajo el ecosistema S24.',
};

export default async function PlayerIntelligencePage() {
  const data = await getPlayerIntelligenceHubData();

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <PlayerIntelligenceHub data={data} />
      <Footer />
    </main>
  );
}
