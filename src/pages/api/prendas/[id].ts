import type { APIRoute } from 'astro';
import { getPrendaById } from '@/lib/prendas';

export const GET: APIRoute = async ({ params }) => {
  try {
    const prenda = getPrendaById(params.id!);

    if (!prenda) {
      return new Response(JSON.stringify({ error: 'Prenda no encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(prenda), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Error al obtener la prenda' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
