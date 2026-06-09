export interface Imagen {
  url: string;
  publicId: string;
  alt: string;
  orden: number;
}

export interface Color {
  nombre: string;
  hex: string;
}

export type Categoria = 'noche' | 'civil' | 'quinceañera' | 'casual' | 'playa';

export interface Prenda {
  _id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  tipo: string;
  categoria: Categoria;
  destacado: boolean;
  disponible: boolean;
  imagenes: Imagen[];
  colores: Color[];
  telas: string[];
  caracteristicas: string[];
  tiempoEntrega: string;
  creadoEn: string | Date;
  actualizadoEn: string | Date;
}
