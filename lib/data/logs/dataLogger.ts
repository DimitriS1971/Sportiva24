import { dataEnv } from '@/lib/data/config/env';

type LogLevel = 'info' | 'warn' | 'error';

interface DataLogMeta {
  provider?: string;
  operation?: string;
  durationMs?: number;
  fallback?: boolean;
  error?: unknown;
}

function formatMeta(meta?: DataLogMeta): string {
  if (!meta) return '';
  const parts = [
    meta.provider ? `provider=${meta.provider}` : '',
    meta.operation ? `operation=${meta.operation}` : '',
    typeof meta.durationMs === 'number' ? `durationMs=${meta.durationMs}` : '',
    typeof meta.fallback === 'boolean' ? `fallback=${meta.fallback}` : '',
  ].filter(Boolean);

  return parts.length > 0 ? ` [${parts.join(' ')}]` : '';
}

function write(level: LogLevel, message: string, meta?: DataLogMeta): void {
  if ((level === 'info' || level === 'warn') && !dataEnv.dataDebugLogs) {
    return;
  }

  const suffix = formatMeta(meta);
  const line = `[data:${level}] ${message}${suffix}`;

  if (level === 'error') {
    console.error(line, meta?.error ?? '');
    return;
  }

  if (level === 'warn') {
    console.warn(line);
    return;
  }

  console.log(line);
}

export const dataLogger = {
  info(message: string, meta?: DataLogMeta) {
    write('info', message, meta);
  },
  warn(message: string, meta?: DataLogMeta) {
    write('warn', message, meta);
  },
  error(message: string, meta?: DataLogMeta) {
    write('error', message, meta);
  },
};
