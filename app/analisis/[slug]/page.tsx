import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Footer from '@/app/components/Footer';
import MatchAnalysisEditorial from '@/app/components/MatchAnalysisEditorial';
import Navbar from '@/app/components/Navbar';
import { sportsDataService } from '@/lib/data';
import { buildInformeS24V1 } from '@/lib/intelligence-s24/informeS24V1';
import { getRealMatchContext } from '@/lib/intelligence-s24/realMatchContext';

interface AnalysisPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AnalysisPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await sportsDataService.getMatchBySlugWithMeta(decodeURIComponent(slug));

  if (!result.match) {
    return { title: 'Análisis no encontrado' };
  }

  return {
    title: `Análisis ${result.match.homeTeam.name} vs ${result.match.awayTeam.name}`,
    description: `Probabilidades, contexto táctico y lectura S24 de ${result.match.homeTeam.name} vs ${result.match.awayTeam.name}.`,
  };
}

export default async function MatchAnalysisEditorialPage({ params }: AnalysisPageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const result = await sportsDataService.getMatchBySlugWithMeta(slug);

  if (!result.match) {
    notFound();
  }

  const realContext = await getRealMatchContext(result.match.slug, result.providerId);
  const informe = buildInformeS24V1({
    match: result.match,
    providerId: result.providerId,
    usedFailover: result.usedFallback,
    realContext,
  });

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 md:px-8 md:pt-28">
        <MatchAnalysisEditorial informe={informe} context={realContext} />
      </div>
      <Footer />
    </main>
  );
}
