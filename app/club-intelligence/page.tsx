import type { Metadata } from 'next';

import ClubIntelligenceHub from '@/app/components/ClubIntelligenceHub';
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
import { getClubIntelligenceHubData } from '@/lib/intelligence-s24/club-intelligence';

export const metadata: Metadata = {
  title: 'Club Intelligence S24 | Sportiva24',
  description: 'Hub de inteligencia deportiva centrado en clubes con radiografias metodologicas S24.',
};

export default async function ClubIntelligenceHubPage() {
  const data = await getClubIntelligenceHubData();

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <ClubIntelligenceHub data={data} />
      <Footer />
    </main>
  );
}
