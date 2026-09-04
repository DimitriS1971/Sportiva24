import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
import PlayerIntelligenceS24View from '@/app/components/PlayerIntelligenceS24View';
import { getPlayerIntelligenceData, getPlayerIntelligenceHubData } from '@/lib/intelligence-s24/player-intelligence';

interface PlayerIntelligenceDetailPageProps {
  params: Promise<{ slug?: string }>;
}

export async function generateMetadata({ params }: PlayerIntelligenceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: slug ? `Player Intelligence ${slug} | Sportiva24` : 'Player Intelligence | Sportiva24',
    description: 'Perfil metodologico de jugadores con indicadores, narrativa, comparacion y alertas.',
  };
}

export default async function PlayerIntelligenceDetailPage({ params }: PlayerIntelligenceDetailPageProps) {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }

  const hub = await getPlayerIntelligenceHubData();
  const exists = hub.players.some((player) => player.slug === slug);
  if (!exists) {
    notFound();
  }

  const data = await getPlayerIntelligenceData({ playerSlug: slug });

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <PlayerIntelligenceS24View data={data} />
      <Footer />
    </main>
  );
}
