import type { APIRoute } from 'astro';
import { getPrendas } from '@/lib/prendas';

export const GET: APIRoute = async ({ url }) => {
  try {
    const tipo = url.searchParams.get('tipo') ?? undefined;
    const categoria = url.searchParams.get('categoria') ?? undefined;

    const prendas = getPrendas(tipo, categoria);

    return new Response(JSON.stringify(prendas), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Error al obtener las prendas' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
