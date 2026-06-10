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

export interface Prenda {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  tipo: string;
  categoria: string;
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
