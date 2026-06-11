import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies }) => {
  cookies.delete('atm_admin', { path: '/' });
  return new Response(null, { status: 302, headers: { Location: '/admin/login' } });
};
