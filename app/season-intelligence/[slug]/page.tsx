import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
import SeasonIntelligenceS24View from '@/app/components/SeasonIntelligenceS24View';
import { getSeasonIntelligenceData, getSeasonIntelligenceHubData } from '@/lib/intelligence-s24/season-intelligence';

interface SeasonIntelligenceDetailPageProps {
  params: Promise<{ slug?: string }>;
}

export async function generateMetadata({ params }: SeasonIntelligenceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: slug ? `Season Intelligence ${slug} | Sportiva24` : 'Season Intelligence | Sportiva24',
    description: 'Evolucion competitiva de temporadas con narrativa, insights y comparacion intertemporada.',
  };
}

export default async function SeasonIntelligenceDetailPage({ params }: SeasonIntelligenceDetailPageProps) {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }

  const hub = await getSeasonIntelligenceHubData();
  const exists = hub.seasons.some((season) => season.slug === slug);
  if (!exists) {
    notFound();
  }

  const data = await getSeasonIntelligenceData({ seasonSlug: slug });

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <SeasonIntelligenceS24View data={data} />
      <Footer />
    </main>
  );
}
