import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="flex min-h-[72vh] items-center justify-center px-6 py-32 md:px-12">
        <div className="w-full max-w-3xl rounded-3xl border border-slate-800/80 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_48%),linear-gradient(145deg,rgba(15,23,42,0.92),rgba(2,6,23,0.98))] p-8 text-center shadow-2xl shadow-black/40 md:p-14">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Error 404</p>
          <h1 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">Este partido ya no está en nuestra base</h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-400 md:text-lg">El enlace puede haber caducado, cambiado de identificador o no estar disponible en la agenda actual.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/match" className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(14,165,233,0.28)] transition hover:from-sky-400 hover:to-blue-500">
              Volver a partidos
            </Link>
            <Link href="/analisis" className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-950/70 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-sky-400 hover:text-sky-200">
              Ver análisis de hoy
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
