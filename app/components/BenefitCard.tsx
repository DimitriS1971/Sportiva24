import { Benefit } from "@/app/data/premium";

interface BenefitCardProps {
  benefit: Benefit;
}

export default function BenefitCard({ benefit }: BenefitCardProps) {
  return (
    <div className="group relative bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-2xl p-8 hover:border-blue-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 overflow-hidden">
      {/* Gradient background on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-900/10 to-purple-900/10" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
          {benefit.icon}
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-200">
          {benefit.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed">
          {benefit.description}
        </p>
      </div>
    </div>
  );
}
