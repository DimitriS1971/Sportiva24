import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Footer from '@/app/components/Footer';
import LeagueIntelligenceS24View from '@/app/components/LeagueIntelligenceS24View';
import Navbar from '@/app/components/Navbar';
import { getLeagueIntelligenceData, getLeagueIntelligenceHubData } from '@/lib/intelligence-s24/league-intelligence';

interface LeagueIntelligenceDetailPageProps {
  params: Promise<{ slug?: string }>;
}

export async function generateMetadata({ params }: LeagueIntelligenceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: slug ? `League Intelligence ${slug} | Sportiva24` : 'League Intelligence | Sportiva24',
    description: 'Radiografia competitiva de ligas con narrativa e insights automaticos.',
  };
}

export default async function LeagueIntelligenceDetailPage({ params }: LeagueIntelligenceDetailPageProps) {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }

  const hub = await getLeagueIntelligenceHubData();
  const exists = hub.leagues.some((league) => league.slug === slug);
  if (!exists) {
    notFound();
  }

  const data = await getLeagueIntelligenceData({ leagueSlug: slug });

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <LeagueIntelligenceS24View data={data} />
      <Footer />
    </main>
  );
}
