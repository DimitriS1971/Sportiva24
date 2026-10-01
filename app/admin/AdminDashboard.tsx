'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

type Article = { id: string; title: string; excerpt: string; content: string; image: string; category: string; published_at: string | null; featured: boolean };

type ArticleAction = 'unpublish' | 'archive' | 'republish';

const emptyForm = { title: '', excerpt: '', content: '', image: '', category: 'Fútbol', publish: true };

export default function AdminDashboard({ email }: { email: string }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  async function load() {
    const response = await fetch('/api/admin/articles');
    if (response.ok) setArticles(await response.json());
  }

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch('/api/admin/articles', {
      method: editingId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
    });
    const result = await response.json();
    setMessage(response.ok ? (editingId ? 'Artículo actualizado.' : 'Artículo guardado.') : result.error);
    if (response.ok) {
      setForm(emptyForm);
      setEditingId(null);
      await load();
    }
  }

  function editArticle(article: Article) {
    setEditingId(article.id);
    setForm({ title: article.title, excerpt: article.excerpt, content: article.content, image: article.image, category: article.category, publish: Boolean(article.published_at) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function updateArticle(id: string, action: ArticleAction) {
    const label = action === 'archive' ? 'archivar' : action === 'republish' ? 'republicar' : 'despublicar';
    const detail = action === 'republish' ? 'Volverá a aparecer en la web.' : 'Dejará de aparecer en la web.';
    if (!window.confirm(`¿Quieres ${label} este artículo? ${detail}`)) return;

    setBusyId(id);
    const response = await fetch('/api/admin/articles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
    const result = await response.json();
    setMessage(response.ok ? `Artículo ${action === 'archive' ? 'archivado' : action === 'republish' ? 'republicado' : 'despublicado'}.` : result.error);
    setBusyId(null);
    if (response.ok) await load();
  }

  async function toggleFeatured(article: Article) {
    setBusyId(article.id);
    const response = await fetch('/api/admin/articles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: article.id, action: article.featured ? 'unfeature' : 'feature' }),
    });
    const result = await response.json();
    setMessage(response.ok ? (article.featured ? 'Artículo quitado de destacados.' : 'Artículo marcado como destacado.') : result.error);
    setBusyId(null);
    if (response.ok) await load();
  }

  async function deleteArticle(article: Article) {
    if (!window.confirm(`¿Eliminar definitivamente "${article.title}"? Esta acción no se puede deshacer.`)) return;

    setBusyId(article.id);
    const response = await fetch('/api/admin/articles', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: article.id }),
    });
    const result = response.status === 204 ? null : await response.json();
    setMessage(response.ok ? 'Artículo eliminado.' : result?.error ?? 'No se pudo eliminar.');
    setBusyId(null);
    if (response.ok) await load();
  }

  async function signOut() {
    await createSupabaseBrowserClient().auth.signOut();
    window.location.href = '/admin/login';
  }

  function wrapSelection(prefix: string, suffix: string, placeholder: string) {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = form.content.slice(start, end) || placeholder;
    const value = `${form.content.slice(0, start)}${prefix}${selected}${suffix}${form.content.slice(end)}`;
    setForm({ ...form, content: value });
    window.setTimeout(() => textarea.focus(), 0);
  }

  function insertArticleLink() {
    const target = window.prompt('Pega la URL interna de la nota, por ejemplo /noticias/mi-nota');
    if (!target || !target.startsWith('/noticias/')) {
      if (target) setMessage('El enlace debe comenzar con /noticias/.');
      return;
    }
    wrapSelection('[', `](${target})`, 'Texto del enlace');
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Sportiva24</p>
            <h1 className="mt-2 text-3xl font-semibold">Administrador de artículos</h1>
            <p className="mt-1 text-sm text-slate-400">{email}</p>
          </div>
          <button onClick={signOut} className="rounded-lg border border-slate-700 px-4 py-2 text-sm">Cerrar sesión</button>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={save} className="rounded-2xl border border-slate-800 bg-black/30 p-5 md:p-7">
            <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-semibold">{editingId ? 'Editar artículo' : 'Nuevo artículo'}</h2>{editingId ? <button type="button" onClick={cancelEdit} className="text-sm text-slate-400 hover:text-white">Cancelar</button> : null}</div>
            <input required placeholder="Título" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3" />
            <input placeholder="Imagen (URL opcional)" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3" />
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
              <input required placeholder="Resumen" value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3" />
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-3"><option>Fútbol</option><option>Basketball</option><option>Análisis</option><option>Noticias</option></select>
            </div>
            <div className="mt-3 flex items-center gap-2 border border-slate-700 bg-slate-900 p-2">
              <button type="button" onClick={() => wrapSelection('**', '**', 'Texto en negrita')} className="flex h-9 w-9 items-center justify-center border border-slate-600 text-sm font-black" title="Negrita" aria-label="Negrita">B</button>
              <button type="button" onClick={insertArticleLink} className="flex h-9 w-9 items-center justify-center border border-slate-600 text-sm font-semibold" title="Enlazar otra nota" aria-label="Enlazar otra nota">Link</button>
            </div>
            <textarea ref={contentRef} required placeholder="Contenido" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} rows={10} className="w-full rounded-b-lg border border-t-0 border-slate-700 bg-slate-950 px-3 py-3" />
            <label className="mt-4 flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={form.publish} onChange={(event) => setForm({ ...form, publish: event.target.checked })} /> Publicar inmediatamente</label>
            {message ? <p className="mt-4 text-sm text-cyan-300">{message}</p> : null}
            <button className="mt-4 rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-950">{editingId ? 'Guardar cambios' : 'Guardar artículo'}</button>
          </form>

          <section className="rounded-2xl border border-slate-800 bg-black/30 p-5 md:p-7">
            <h2 className="text-xl font-semibold">Artículos guardados</h2>
            <div className="mt-5 space-y-3">
              {articles.map((article) => {
                const isBusy = busyId === article.id;
                return (
                  <article key={article.id} className="rounded-lg border border-slate-800 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{article.title}</h3>
                        <p className="mt-1 text-xs text-slate-400">{article.category} · {article.published_at ? 'Publicado' : 'Archivado / no publicado'}{article.featured ? ' · Destacado' : ''}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button disabled={isBusy} onClick={() => editArticle(article)} className="rounded border border-blue-500/60 px-2 py-1 text-xs text-blue-200 disabled:opacity-50">Editar</button>
                      <button disabled={isBusy} onClick={() => void toggleFeatured(article)} className="rounded border border-yellow-500/60 px-2 py-1 text-xs text-yellow-200 disabled:opacity-50">{article.featured ? 'Quitar destacado' : 'Destacar'}</button>
                      {article.published_at ? <button disabled={isBusy} onClick={() => void updateArticle(article.id, 'unpublish')} className="rounded border border-amber-500/60 px-2 py-1 text-xs text-amber-200 disabled:opacity-50">Despublicar</button> : <button disabled={isBusy} onClick={() => void updateArticle(article.id, 'republish')} className="rounded border border-cyan-500/60 px-2 py-1 text-xs text-cyan-200 disabled:opacity-50">Republicar</button>}
                      {article.published_at ? <button disabled={isBusy} onClick={() => void updateArticle(article.id, 'archive')} className="rounded border border-slate-600 px-2 py-1 text-xs text-slate-300 disabled:opacity-50">Archivar</button> : null}
                      <button disabled={isBusy} onClick={() => void deleteArticle(article)} className="rounded border border-rose-500/60 px-2 py-1 text-xs text-rose-200 disabled:opacity-50">Eliminar</button>
                    </div>
                  </article>
                );
              })}
              {!articles.length ? <p className="text-sm text-slate-400">Todavía no hay artículos.</p> : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
