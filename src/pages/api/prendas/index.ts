import type { APIRoute } from 'astro';
import { connectDB } from '@/lib/db';
import { Prenda } from '@/models/Prenda';

export const GET: APIRoute = async ({ url }) => {
  try {
    await connectDB();

    const tipo = url.searchParams.get('tipo');
    const categoria = url.searchParams.get('categoria');

    const filtro: Record<string, unknown> = { disponible: true };
    if (tipo) filtro.tipo = tipo;
    if (categoria) filtro.categoria = categoria;

    const prendas = await Prenda.find(filtro).sort({ creadoEn: -1 }).lean();

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
