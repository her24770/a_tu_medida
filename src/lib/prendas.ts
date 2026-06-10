import db from './db';
import type { Prenda } from '@/types/prenda';

type Row = Record<string, unknown>;

function parse(row: Row): Prenda {
  return {
    id: String(row.id),
    nombre: row.nombre as string,
    slug: row.slug as string,
    descripcion: row.descripcion as string,
    tipo: row.tipo as string,
    categoria: row.categoria_slug as string,
    destacado: Boolean(row.destacado),
    disponible: Boolean(row.disponible),
    imagenes: JSON.parse(row.imagenes as string),
    colores: JSON.parse(row.colores as string),
    telas: JSON.parse(row.telas as string),
    caracteristicas: JSON.parse(row.caracteristicas as string),
    tiempoEntrega: row.tiempoEntrega as string,
    creadoEn: row.creadoEn as string,
    actualizadoEn: row.actualizadoEn as string,
  };
}

export function getPrendas(tipo?: string, categoria?: string): Prenda[] {
  const conditions = ['disponible = 1'];
  const params: string[] = [];

  if (tipo) { conditions.push('tipo = ?'); params.push(tipo); }
  if (categoria) { conditions.push('categoria_slug = ?'); params.push(categoria); }

  const sql = `SELECT * FROM prendas WHERE ${conditions.join(' AND ')} ORDER BY creadoEn DESC`;
  return (db.prepare(sql).all(...params) as Row[]).map(parse);
}

export function getDestacados(): Prenda[] {
  return (db.prepare(
    'SELECT * FROM prendas WHERE destacado = 1 AND disponible = 1 ORDER BY creadoEn DESC'
  ).all() as Row[]).map(parse);
}

export function getPrendaById(id: string): Prenda | null {
  const row = db.prepare('SELECT * FROM prendas WHERE id = ?').get(id) as Row | undefined;
  return row ? parse(row) : null;
}

export function getPrendaBySlug(slug: string): Prenda | null {
  const row = db.prepare(
    'SELECT * FROM prendas WHERE slug = ? AND disponible = 1'
  ).get(slug) as Row | undefined;
  return row ? parse(row) : null;
}
