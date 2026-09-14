'use client';

import { useEffect, useState } from 'react';

export default function SiteVisitCounter() {
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    fetch('/api/visits', { method: 'POST' })
      .then(async (response) => {
        if (!response.ok) return null;
        const contentType = response.headers.get('content-type') ?? '';
        if (!contentType.includes('application/json')) return null;
        return response.json();
      })
      .then((payload: { visits?: number | null } | null) => {
        if (active && payload && typeof payload.visits === 'number') {
          setVisits(payload.visits);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="border-t border-slate-800/80 bg-black px-4 py-3 text-center text-xs text-slate-500">
      {visits === null ? 'Visitas del sitio' : `Visitas del sitio: ${visits.toLocaleString('es-ES')}`}
    </div>
  );
}