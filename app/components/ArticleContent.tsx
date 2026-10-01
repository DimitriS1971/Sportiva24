import Link from 'next/link';

function InlineContent({ value }: { value: string }) {
  const tokens = value.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^\s)]+\))/g);

  return tokens.map((token, index) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={index}>{token.slice(2, -2)}</strong>;
    }

    const link = token.match(/^\[([^\]]+)\]\(([^\s)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      if (href.startsWith('/noticias/')) {
        return <Link key={index} href={href} className="font-semibold text-cyan-300 underline underline-offset-4 hover:text-cyan-200">{label}</Link>;
      }
    }

    return token;
  });
}

export default function ArticleContent({ content }: { content: string }) {
  return (
    <div className="prose prose-invert mt-10 max-w-none text-lg leading-8 text-slate-200">
      {content.split(/\r?\n/).map((paragraph, index) => (
        paragraph.trim() ? <p key={index}><InlineContent value={paragraph} /></p> : <br key={index} />
      ))}
    </div>
  );
}