# Administrador de artículos

## Supabase

1. Crea un proyecto en Supabase.
2. En Authentication > Users, crea el único usuario administrador.
3. En SQL Editor, ejecuta `supabase/schema.sql`.
4. Copia la URL del proyecto y la anon key a `.env.local` y a Vercel:

```text
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

El usuario de Supabase es el único acceso al panel. No se debe usar la service role key en el navegador.
