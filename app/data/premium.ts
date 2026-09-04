export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ComparisonFeature {
  feature: string;
  free: boolean | string;
  premium: boolean | string;
}

export const benefits: Benefit[] = [
  {
    id: "1",
    title: "Análisis Predictivo Avanzado",
    description: "Acceso al S24 Index completo con 450+ variables. Probabilidades en tiempo real, análisis de escenarios y modelos predictivos exclusivos.",
    icon: "📊",
  },
  {
    id: "2",
    title: "Reportes Personalizados",
    description: "Crea reportes detallados sobre tus equipos y mercados favoritos. Exporta en PDF, comparte con tu equipo, recibe alertas automáticas.",
    icon: "📄",
  },
  {
    id: "3",
    title: "Datos en Tiempo Real",
    description: "Estadísticas actualizadas cada minuto. Monitoreo de lesiones, cambios tácticos, odds comparativas. Acceso a historiales completos.",
    icon: "⚡",
  },
  {
    id: "4",
    title: "Comunidad Premium",
    description: "Acceso a análisis exclusivos de expertos, debates privados, webinars semanales y acceso prioritario a nuevas funcionalidades.",
    icon: "🎯",
  },
];

export const comparisonFeatures: ComparisonFeature[] = [
  { feature: "Acceso a análisis básicos", free: true, premium: true },
  { feature: "S24 Index completo", free: false, premium: true },
  { feature: "Análisis predictivo avanzado", free: false, premium: true },
  { feature: "Reportes personalizados", free: false, premium: true },
  { feature: "Datos en tiempo real", free: "Limitado", premium: "Completo" },
  { feature: "Alertas automáticas", free: false, premium: true },
  { feature: "API acceso", free: false, premium: true },
  { feature: "Soporte prioritario", free: false, premium: true },
  { feature: "Webinars exclusivos", free: false, premium: true },
  { feature: "Comunidad premium", free: false, premium: true },
];

export const testimonial = {
  text: "Con Sportiva24 Premium he mejorado mis decisiones en un 40%. El S24 Index es la herramienta más precisa que hemos usado. El equipo detrás es excepcional.",
  author: "Carlos Mendoza",
  role: "Analista Deportivo Profesional",
  company: "Trading Sports Europe",
};
