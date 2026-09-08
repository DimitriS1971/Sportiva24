import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function slugify(value: string) { return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  const { data, error } = await supabase.from('articles').select('id,title,excerpt,content,image,category,published_at,featured').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  const body = await request.json() as { title?: string; excerpt?: string; content?: string; image?: string; category?: string; publish?: boolean };
  if (!body.title || !body.excerpt || !body.content) return NextResponse.json({ error: 'Título, resumen y contenido son obligatorios.' }, { status: 400 });
  const { data, error } = await supabase.from('articles').insert({ title: body.title, slug: `${slugify(body.title)}-${Date.now()}`, excerpt: body.excerpt, content: body.content, image: body.image || '/hero/hero-sportiva24.svg', category: body.category || 'Fútbol', published_at: body.publish ? new Date().toISOString() : null }).select('id,title,category,published_at').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });

  const body = await request.json() as { id?: string; action?: 'unpublish' | 'archive' | 'republish' | 'feature' | 'unfeature'; title?: string; excerpt?: string; content?: string; image?: string; category?: string; featured?: boolean };
  if (!body.id) return NextResponse.json({ error: 'Falta el artículo.' }, { status: 400 });

  if (!body.action) {
    if (!body.title || !body.excerpt || !body.content) return NextResponse.json({ error: 'Título, resumen y contenido son obligatorios.' }, { status: 400 });
    const { data, error } = await supabase
      .from('articles')
      .update({ title: body.title, excerpt: body.excerpt, content: body.content, image: body.image || '/hero/hero-sportiva24.svg', category: body.category || 'Fútbol', updated_at: new Date().toISOString() })
      .eq('id', body.id)
      .select('id,title,excerpt,content,image,category,published_at')
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  if (body.action === 'feature') {
    const { error: clearError } = await supabase.from('articles').update({ featured: false }).neq('id', body.id);
    if (clearError) return NextResponse.json({ error: clearError.message }, { status: 500 });
  }

  const { data, error } = await supabase
    .from('articles')
    .update({
      published_at: body.action === 'republish' ? new Date().toISOString() : body.action === 'unpublish' || body.action === 'archive' ? null : undefined,
      featured: body.action === 'feature' ? true : body.action === 'unfeature' ? false : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq('id', body.id)
    .select('id,title,category,published_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ...data, action: body.action });
}

export async function DELETE(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });

  const body = await request.json() as { id?: string };
  if (!body.id) return NextResponse.json({ error: 'Falta el artículo.' }, { status: 400 });

  const { error } = await supabase.from('articles').delete().eq('id', body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
