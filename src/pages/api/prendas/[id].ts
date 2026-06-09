import type { APIRoute } from 'astro';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { Prenda } from '@/models/Prenda';

export const GET: APIRoute = async ({ params }) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id!)) {
      return new Response(JSON.stringify({ error: 'ID inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await connectDB();
    const prenda = await Prenda.findById(params.id).lean();

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
