import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ClubIntelligenceS24View from '@/app/components/ClubIntelligenceS24View';
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
import { getClubIntelligenceData, getClubIntelligenceHubData } from '@/lib/intelligence-s24/club-intelligence';

interface ClubIntelligenceDetailPageProps {
  params: Promise<{ slug?: string }>;
}

export async function generateMetadata({ params }: ClubIntelligenceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: slug ? `Club Intelligence ${slug} | Sportiva24` : 'Club Intelligence | Sportiva24',
    description: 'Radiografia inteligente de clubes con Motor S24, narrativa e insights automaticos.',
  };
}

export default async function ClubIntelligenceDetailPage({ params }: ClubIntelligenceDetailPageProps) {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }

  const hub = await getClubIntelligenceHubData();
  const exists = hub.clubs.some((club) => club.slug === slug);
  if (!exists) {
    notFound();
  }

  const data = await getClubIntelligenceData({ clubSlug: slug });

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <ClubIntelligenceS24View data={data} />
      <Footer />
    </main>
  );
}
