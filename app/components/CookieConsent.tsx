'use client';

import { useEffect, useState } from 'react';

export type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  advertising: boolean;
  preferences: boolean;
};

const storageKey = 'sportiva24-cookie-preferences';
const consentEvent = 'sportiva24-cookie-preferences-updated';

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  advertising: false,
  preferences: false,
};

export function getCookiePreferences(): CookiePreferences | null {
  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? { ...defaultPreferences, ...JSON.parse(stored), necessary: true } : null;
  } catch {
    return null;
  }
}

function saveCookiePreferences(preferences: CookiePreferences) {
  window.localStorage.setItem(storageKey, JSON.stringify(preferences));
  document.cookie = `${storageKey}=1; Max-Age=31536000; Path=/; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent(consentEvent));
}

export function hasAnalyticsConsent(): boolean {
  return getCookiePreferences()?.analytics === true;
}

export default function CookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [draft, setDraft] = useState(defaultPreferences);

  useEffect(() => {
    const stored = getCookiePreferences();
    setPreferences(stored);
    if (stored) setDraft(stored);

    const openSettings = () => setIsSettingsOpen(true);
    window.addEventListener('sportiva24-open-cookie-settings', openSettings);
    return () => window.removeEventListener('sportiva24-open-cookie-settings', openSettings);
  }, []);

  const acceptAll = () => {
    const next = { ...defaultPreferences, analytics: true, preferences: true };
    saveCookiePreferences(next);
    setPreferences(next);
    setDraft(next);
    setIsSettingsOpen(false);
  };

  const rejectOptional = () => {
    saveCookiePreferences(defaultPreferences);
    setPreferences(defaultPreferences);
    setDraft(defaultPreferences);
    setIsSettingsOpen(false);
  };

  const saveCustom = () => {
    saveCookiePreferences(draft);
    setPreferences(draft);
    setIsSettingsOpen(false);
  };

  return (
    <>
      {preferences ? (
        <button type="button" onClick={() => setIsSettingsOpen(true)} className="fixed bottom-4 left-4 z-[60] rounded-full border border-slate-700 bg-slate-950/95 px-4 py-2 text-xs font-semibold text-slate-300 shadow-xl hover:border-sky-400 hover:text-white">
          Preferencias de cookies
        </button>
      ) : (
        <section className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-3xl rounded-2xl border border-slate-700 bg-slate-950 p-5 shadow-2xl shadow-black/60 md:inset-x-auto md:right-6 md:left-auto">
          <p className="text-sm font-semibold text-white">Tu privacidad importa</p>
          <p className="mt-2 text-xs leading-6 text-slate-400">Usamos cookies necesarias para el funcionamiento y, solo con tu permiso, medición analítica. No activamos publicidad comportamental en este sitio.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={acceptAll} className="rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-400">Aceptar todas</button>
            <button type="button" onClick={rejectOptional} className="rounded-lg border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-slate-400">Rechazar opcionales</button>
            <button type="button" onClick={() => setIsSettingsOpen(true)} className="rounded-lg border border-sky-500/50 px-4 py-2 text-xs font-semibold text-sky-200 hover:border-sky-300">Configurar</button>
          </div>
        </section>
      )}

      {isSettingsOpen ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 p-4 md:items-center">
          <section role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title" className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-950 p-6 shadow-2xl">
            <h2 id="cookie-settings-title" className="text-xl font-bold text-white">Centro de preferencias de cookies</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Elige qué categorías opcionales permites. Puedes cambiar tu decisión desde el botón fijo de preferencias.</p>
            <div className="mt-5 space-y-3">
              <PreferenceRow title="Necesarias" description="Permiten funciones básicas, seguridad y sesión." checked disabled onChange={() => undefined} />
              <PreferenceRow title="Analíticas" description="Ayudan a entender el uso y el rendimiento mediante Vercel Analytics y el contador agregado de visitas." checked={draft.analytics} onChange={(checked) => setDraft((current) => ({ ...current, analytics: checked }))} />
              <PreferenceRow title="Publicidad" description="Actualmente no hay una red publicitaria comportamental conectada." checked={draft.advertising} onChange={(checked) => setDraft((current) => ({ ...current, advertising: checked }))} />
              <PreferenceRow title="Preferencias" description="Permiten recordar opciones no esenciales de navegación." checked={draft.preferences} onChange={(checked) => setDraft((current) => ({ ...current, preferences: checked }))} />
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={rejectOptional} className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200">Rechazar opcionales</button>
              <button type="button" onClick={saveCustom} className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400">Guardar selección</button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function PreferenceRow({ title, description, checked, disabled = false, onChange }: { title: string; description: string; checked: boolean; disabled?: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-xl border border-slate-800 bg-black/30 p-4">
      <span><span className="block text-sm font-semibold text-white">{title}</span><span className="mt-1 block text-xs leading-5 text-slate-400">{description}</span></span>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} className="mt-1 h-4 w-4 accent-sky-500" />
    </label>
  );
}
