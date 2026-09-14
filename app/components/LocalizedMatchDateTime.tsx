'use client';

import { useEffect, useState } from 'react';

interface LocalizedMatchDateTimeProps {
  dateTimeUtc?: string;
  fallback: string;
  dateOnly?: boolean;
}

function formatDateTime(value: string, dateOnly: boolean): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('es-ES', dateOnly
    ? { dateStyle: 'long' }
    : { dateStyle: 'long', timeStyle: 'short' }).format(date);
}

export default function LocalizedMatchDateTime({ dateTimeUtc, fallback, dateOnly = false }: LocalizedMatchDateTimeProps) {
  const [label, setLabel] = useState(fallback);

  useEffect(() => {
    if (dateTimeUtc) {
      setLabel(formatDateTime(dateTimeUtc, dateOnly));
    }
  }, [dateTimeUtc, dateOnly]);

  return <>{label}</>;
}
