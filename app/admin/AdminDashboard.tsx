'use client';

import { FormEvent, useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

type Article = { id: string; title: string; category: string; published_at: string | null };

export default function AdminDashboard({ email }: { email: string }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', image: '', category: 'Fútbol', publish: true });
  const [message, setMessage] = useState('');

  async function load() { const response = await fetch('/api/admin/articles'); if (response.ok) setArticles(await response.json()); }
  useEffect(() => { void load(); }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch('/api/admin/articles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const result = await response.json();
    setMessage(response.ok ? 'Artículo guardado.' : result.error);
    if (response.ok) { setForm({ title: '', excerpt: '', content: '', image: '', category: 'Fútbol', publish: true }); await load(); }
  }

  async function signOut() { await createSupabaseBrowserClient().auth.signOut(); window.location.href = '/admin/login'; }

  return <main className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-10"><div className="mx-auto max-w-6xl"><header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6"><div><p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Sportiva24</p><h1 className="mt-2 text-3xl font-semibold">Administrador de artículos</h1><p className="mt-1 text-sm text-slate-400">{email}</p></div><button onClick={signOut} className="rounded-lg border border-slate-700 px-4 py-2 text-sm">Cerrar sesión</button></header><div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"><form onSubmit={save} className="rounded-2xl border border-slate-800 bg-black/30 p-5 md:p-7"><h2 className="text-xl font-semibold">Nuevo artículo</h2><input required placeholder="Título" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3" /><input placeholder="Imagen (URL opcional)" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3" /><div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]"><input required placeholder="Resumen" value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3" /><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-3"><option>Fútbol</option><option>Basketball</option><option>Análisis</option><option>Noticias</option></select></div><textarea required placeholder="Contenido" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} rows={10} className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3" /><label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={form.publish} onChange={(event) => setForm({ ...form, publish: event.target.checked })} /> Publicar inmediatamente</label>{message ? <p className="mt-4 text-sm text-cyan-200">{message}</p> : null}<button className="mt-5 rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950">Guardar artículo</button></form><section className="rounded-2xl border border-slate-800 bg-black/30 p-5 md:p-7"><h2 className="text-xl font-semibold">Artículos guardados</h2><div className="mt-5 space-y-3">{articles.length === 0 ? <p className="text-sm text-slate-400">No hay artículos todavía.</p> : articles.map((article) => <article key={article.id} className="rounded-lg border border-slate-800 p-3"><p className="font-medium">{article.title}</p><p className="mt-1 text-xs text-slate-400">{article.category} · {article.published_at ? 'Publicado' : 'Borrador'}</p></article>)}</div></section></div></div></main>;
}
