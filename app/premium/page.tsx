"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import BenefitCard from "@/app/components/BenefitCard";
import { benefits, comparisonFeatures } from "@/app/data/premium";
import Link from "next/link";

export default function Premium() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-blue-950/40 to-black/80 pt-20 md:pt-32 pb-16 md:pb-24 border-b border-blue-900/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              SPORTIVA24
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                PREMIUM
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light mb-12 leading-relaxed">
              La inteligencia deportiva llevada al siguiente nivel.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 text-lg">
                Comenzar ahora
              </button>
              <button className="px-8 py-4 border-2 border-blue-600 text-blue-400 hover:text-blue-300 font-bold rounded-xl transition-all duration-300 hover:border-blue-400 text-lg hover:bg-blue-600/10">
                Ver funcionalidades
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Beneficios Exclusivos
            </h2>
            <p className="text-lg text-gray-400">
              Todo lo que necesitas para dominar el análisis deportivo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit) => (
              <BenefitCard key={benefit.id} benefit={benefit} />
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Band */}
      <section className="w-full py-12 md:py-16 bg-black border-y border-blue-900/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Metric 1 */}
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-blue-400 mb-2">
                450+
              </div>
              <p className="text-sm md:text-base text-gray-400 font-light">
                Variables analizadas
              </p>
            </div>

            {/* Metric 2 */}
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-purple-400 mb-2">
                2
              </div>
              <p className="text-sm md:text-base text-gray-400 font-light">
                Deportes disponibles
              </p>
            </div>

            {/* Metric 3 */}
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-green-400 mb-2">
                ⚡
              </div>
              <p className="text-sm md:text-base text-gray-400 font-light">
                Actualización continua
              </p>
            </div>

            {/* Metric 4 */}
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-cyan-400 mb-2">
                AI
              </div>
              <p className="text-sm md:text-base text-gray-400 font-light">
                Modelo S24
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-black to-blue-950/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Comparativa
            </h2>
            <p className="text-lg text-gray-400">
              Encuentra el plan perfecto para ti
            </p>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-blue-900/50">
                  <th className="text-left py-6 px-6 font-bold text-lg text-white">
                    Funcionalidad
                  </th>
                  <th className="text-center py-6 px-6 font-bold text-lg text-gray-300">
                    Gratis
                  </th>
                  <th className="text-center py-6 px-6 font-bold text-lg text-blue-400">
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-blue-900/20 hover:bg-blue-900/10 transition-colors duration-200"
                  >
                    <td className="py-5 px-6 text-gray-300">{feature.feature}</td>
                    <td className="text-center py-5 px-6">
                      {typeof feature.free === "boolean" ? (
                        feature.free ? (
                          <span className="text-green-400 font-bold text-xl">✓</span>
                        ) : (
                          <span className="text-gray-500 font-bold text-xl">✗</span>
                        )
                      ) : (
                        <span className="text-gray-400 text-sm">{feature.free}</span>
                      )}
                    </td>
                    <td className="text-center py-5 px-6">
                      {typeof feature.premium === "boolean" ? (
                        feature.premium ? (
                          <span className="text-green-400 font-bold text-xl">✓</span>
                        ) : (
                          <span className="text-gray-500 font-bold text-xl">✗</span>
                        )
                      ) : (
                        <span className="text-blue-300 text-sm font-semibold">
                          {feature.premium}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Institutional Block */}
      <section className="w-full py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-600/30 rounded-2xl p-12 md:p-16">
            {/* Title */}
            <h3 className="text-3xl md:text-4xl font-black text-white mb-8">
              La inteligencia detrás de Sportiva24
            </h3>

            {/* Content */}
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              El modelo S24 Index combina inteligencia artificial, estadística avanzada y análisis contextual para evaluar cada partido utilizando cientos de variables deportivas. Nuestro objetivo es transformar grandes volúmenes de datos en información clara, útil y accionable para quienes buscan comprender el deporte desde una perspectiva profesional.
            </p>

            {/* Signature */}
            <p className="text-sm text-blue-400 font-semibold uppercase tracking-wide">
              Equipo Sportiva24
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-black to-blue-950/40">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Acceso Instantáneo
          </h2>
          <p className="text-lg text-gray-300 mb-12 leading-relaxed">
            Comienza a utilizar Sportiva24 Premium hoy mismo. Acceso completo a todas las funcionalidades premium, sin compromisos de largo plazo.
          </p>

          <button className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 text-lg mb-6">
            Activar Premium Ahora
          </button>

          <p className="text-sm text-gray-500">
            Garantía de 30 días de devolución de dinero. Sin tarjeta de crédito requerida.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
