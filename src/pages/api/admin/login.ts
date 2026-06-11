import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
  const JSON_H = { 'Content-Type': 'application/json' };
  try {
    const { user, pass } = await request.json();
    const expUser = import.meta.env.ADMIN_USER   ?? 'admin';
    const expPass = import.meta.env.ADMIN_PASS   ?? 'admin123';
    const secret  = import.meta.env.ADMIN_SECRET ?? 'changeme';

    if (user === expUser && pass === expPass) {
      cookies.set('atm_admin', secret, {
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 días
      });
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: JSON_H });
    }
    return new Response(JSON.stringify({ error: 'Credenciales incorrectas' }), { status: 401, headers: JSON_H });
  } catch {
    return new Response(JSON.stringify({ error: 'Solicitud inválida' }), { status: 400, headers: JSON_H });
  }
};

export const POST_logout: APIRoute = async ({ cookies }) => {
  cookies.delete('atm_admin', { path: '/' });
  return new Response(null, { status: 302, headers: { Location: '/admin/login' } });
};
