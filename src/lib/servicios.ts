import db from './db';

export interface Servicio {
  id:          number;
  nombre:      string;
  descripcion: string;
  icono:       string;
  orden:       number;
  activo:      boolean;
}

export function getServicios(): Servicio[] {
  return (db.prepare(
    'SELECT * FROM servicios WHERE activo = 1 ORDER BY orden ASC'
  ).all() as any[]).map(r => ({
    id:          r.id,
    nombre:      r.nombre,
    descripcion: r.descripcion,
    icono:       r.icono,
    orden:       r.orden,
    activo:      Boolean(r.activo),
  }));
}
