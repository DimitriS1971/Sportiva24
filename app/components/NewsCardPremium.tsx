import Link from "next/link";
import { NewsArticle } from "@/app/data/news";

interface NewsCardPremiumProps {
  article: NewsArticle;
}

export default function NewsCardPremium({ article }: NewsCardPremiumProps) {
  return (
    <Link href={`/noticias/${article.slug}`}>
      <div className="group h-full bg-gradient-to-br from-blue-900/10 to-purple-900/10 border border-blue-800/20 rounded-xl overflow-hidden hover:border-blue-600/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer">
        {/* Image Container */}
        <div className="relative overflow-hidden h-48 bg-gradient-to-br from-blue-900 to-purple-900">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          
          {/* Category badge */}
          <div className="absolute top-4 left-4 bg-blue-600/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white">
            {article.category}
          </div>
        </div>

        {/* Content Container */}
        <div className="p-8">
          {/* Date */}
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-4">
            {article.date}
          </p>

          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-4 line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-gray-300 line-clamp-2 mb-6">
            {article.excerpt}
          </p>

          {/* Read more link */}
          <div className="flex items-center text-blue-400 text-sm font-semibold group-hover:text-blue-300 transition-colors duration-200">
            Leer artículo
            <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
