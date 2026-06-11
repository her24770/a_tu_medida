import type { APIRoute } from 'astro';
import { getPrendaById, updatePrenda, deletePrenda } from '@/lib/prendas';

const JSON_H = { 'Content-Type': 'application/json' };

function checkAuth(cookies: Parameters<APIRoute>[0]['cookies']): boolean {
  const secret = import.meta.env.ADMIN_SECRET ?? 'changeme';
  return cookies.get('atm_admin')?.value === secret;
}

export const GET: APIRoute = async ({ params }) => {
  try {
    const prenda = getPrendaById(params.id!);
    if (!prenda) return new Response(JSON.stringify({ error: 'No encontrada' }), { status: 404, headers: JSON_H });
    return new Response(JSON.stringify(prenda), { status: 200, headers: JSON_H });
  } catch {
    return new Response(JSON.stringify({ error: 'Error al obtener' }), { status: 500, headers: JSON_H });
  }
};

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  if (!checkAuth(cookies)) return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401, headers: JSON_H });
  try {
    const body = await request.json();
    const ok = updatePrenda(params.id!, body);
    if (!ok) return new Response(JSON.stringify({ error: 'No encontrada' }), { status: 404, headers: JSON_H });
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: JSON_H });
  } catch {
    return new Response(JSON.stringify({ error: 'Error al actualizar' }), { status: 500, headers: JSON_H });
  }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  if (!checkAuth(cookies)) return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401, headers: JSON_H });
  try {
    const ok = deletePrenda(params.id!);
    if (!ok) return new Response(JSON.stringify({ error: 'No encontrada' }), { status: 404, headers: JSON_H });
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: JSON_H });
  } catch {
    return new Response(JSON.stringify({ error: 'Error al eliminar' }), { status: 500, headers: JSON_H });
  }
};
