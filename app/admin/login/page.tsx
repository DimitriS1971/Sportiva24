'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const { error: signInError } = await createSupabaseBrowserClient().auth.signInWithPassword({ email, password });
    if (signInError) setError('Correo o contraseña incorrectos.');
    else { router.push('/admin'); router.refresh(); }
    setLoading(false);
  }

  return <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white"><form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950 p-6 md:p-8"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Sportiva24</p><h1 className="mt-3 text-3xl font-semibold">Acceso administrador</h1><label className="mt-6 block text-sm text-slate-300">Correo<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-black px-3 py-3" /></label><label className="mt-4 block text-sm text-slate-300">Contraseña<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-black px-3 py-3" /></label>{error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}<button disabled={loading} className="mt-6 w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-950">{loading ? 'Entrando...' : 'Entrar'}</button></form></main>;
}
