import mongoose, { Schema, type Document } from 'mongoose';

export interface IImagen {
  url: string;
  publicId: string;
  alt: string;
  orden: number;
}

export interface IColor {
  nombre: string;
  hex: string;
}

export interface IPrenda extends Document {
  nombre: string;
  slug: string;
  descripcion: string;
  tipo: string;
  categoria: 'noche' | 'civil' | 'quinceañera' | 'casual' | 'playa';
  destacado: boolean;
  disponible: boolean;
  imagenes: IImagen[];
  colores: IColor[];
  telas: string[];
  caracteristicas: string[];
  tiempoEntrega: string;
  creadoEn: Date;
  actualizadoEn: Date;
}

const ImagenSchema = new Schema<IImagen>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String, required: true },
    orden: { type: Number, default: 0 },
  },
  { _id: false }
);

const ColorSchema = new Schema<IColor>(
  {
    nombre: { type: String, required: true },
    hex: { type: String, required: true },
  },
  { _id: false }
);

const PrendaSchema = new Schema<IPrenda>(
  {
    nombre: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    descripcion: { type: String, required: true },
    tipo: { type: String, required: true },
    categoria: {
      type: String,
      enum: ['noche', 'civil', 'quinceañera', 'casual', 'playa'],
      required: true,
    },
    destacado: { type: Boolean, default: false },
    disponible: { type: Boolean, default: true },
    imagenes: { type: [ImagenSchema], default: [] },
    colores: { type: [ColorSchema], default: [] },
    telas: { type: [String], default: [] },
    caracteristicas: { type: [String], default: [] },
    tiempoEntrega: { type: String, default: '' },
  },
  {
    timestamps: { createdAt: 'creadoEn', updatedAt: 'actualizadoEn' },
  }
);

export const Prenda =
  mongoose.models.Prenda || mongoose.model<IPrenda>('Prenda', PrendaSchema);
