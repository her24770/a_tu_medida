import db from './db';

export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
}

export function getCategorias(): Categoria[] {
  return db.prepare('SELECT * FROM categorias ORDER BY nombre ASC').all() as Categoria[];
}
