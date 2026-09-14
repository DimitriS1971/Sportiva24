import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc('increment_site_visits');

    if (error) {
      console.error('No se pudo registrar la visita:', error.message);
      return NextResponse.json({ visits: null }, { status: 503 });
    }

    return NextResponse.json({ visits: Number(data) });
  } catch (error) {
    console.error('Error en el contador de visitas:', error);
    return NextResponse.json({ visits: null }, { status: 503 });
  }
}