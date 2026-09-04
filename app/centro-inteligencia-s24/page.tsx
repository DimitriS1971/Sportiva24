import type { Metadata } from 'next';

import Footer from '@/app/components/Footer';
import IntelligenceCenterS24Panel from '@/app/components/IntelligenceCenterS24Panel';
import Navbar from '@/app/components/Navbar';
import { getIntelligenceCenterData } from '@/lib/intelligence-s24/intelligence-center';

export const metadata: Metadata = {
  title: 'Centro de Inteligencia Deportiva S24 | Sportiva24',
  description: 'Panel de inteligencia deportiva S24 orientado a ecosistema: clubes, competiciones, tendencias, rankings y alertas.',
};

export default async function CentroInteligenciaS24Page() {
  const data = await getIntelligenceCenterData();

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <IntelligenceCenterS24Panel data={data} />

      <Footer />
    </main>
  );
}
