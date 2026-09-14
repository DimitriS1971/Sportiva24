'use client';

import { useEffect, useState } from 'react';

function formatLocalTime(dateTimeUtc: string, fallback: string): string {
  const kickoff = new Date(dateTimeUtc);
  if (Number.isNaN(kickoff.getTime())) {
    return fallback;
  }

  const now = new Date();
  const localDate = kickoff.toDateString();
  const today = now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const prefix = localDate === today
    ? 'Hoy'
    : localDate === tomorrow.toDateString()
      ? 'Mañana'
      : new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' }).format(kickoff);
  const time = new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZoneName: 'shortOffset',
  }).format(kickoff);

  return `${prefix}, ${time}`;
}

export default function LocalizedMatchTime({ dateTimeUtc, fallback }: { dateTimeUtc?: string; fallback: string }) {
  const [label, setLabel] = useState(fallback);

  useEffect(() => {
    if (dateTimeUtc) {
      setLabel(formatLocalTime(dateTimeUtc, fallback));
    }
  }, [dateTimeUtc, fallback]);

  return <>{label}</>;
}