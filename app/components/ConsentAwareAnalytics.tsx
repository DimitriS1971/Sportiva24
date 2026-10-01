'use client';

import { Analytics } from '@vercel/analytics/next';
import { useEffect, useState } from 'react';
import { getCookiePreferences } from './CookieConsent';

export default function ConsentAwareAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const update = () => setEnabled(getCookiePreferences()?.analytics === true);
    update();
    window.addEventListener('sportiva24-cookie-preferences-updated', update);
    return () => window.removeEventListener('sportiva24-cookie-preferences-updated', update);
  }, []);

  return enabled ? <Analytics /> : null;
}
