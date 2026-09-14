'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LiveMatchRefresh({ enabled }: { enabled: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return undefined;

    const refresh = () => {
      if (document.visibilityState === 'visible') {
        router.refresh();
      }
    };

    const interval = window.setInterval(refresh, 30_000);
    return () => window.clearInterval(interval);
  }, [enabled, router]);

  return null;
}
