/**
 * Seed de datos de prueba — correr manualmente:
 *   node --env-file=.env scripts/seed-demo.mjs
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH   = process.env.DB_PATH      ?? path.join(process.cwd(), 'data', 'db.sqlite');
const PUB_URL   = process.env.R2_PUBLIC_URL ?? 'https://TU-DOMINIO.r2.dev';

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

function img(file, alt) {
  return JSON.stringify([{
    url:      `${PUB_URL}/prendas/${file}`,
    publicId: `prendas/${file}`,
    alt,
    orden: 0,
  }]);
}

const prendas = [
  {
    nombre:          'Amaranta',
    slug:            'vestido-amaranta',
    descripcion:     'Vestido de danza folclórica confeccionado 100 % a la medida, con vuelo amplio y detalles bordados a mano. Ideal para presentaciones, festivales culturales y competencias de danza.',
    tipo:            'Vestido de Danza',
    categoria_slug:  'danza',
    destacado:       1,
    disponible:      1,
    imagenes:        img('amaranta.png', 'Vestido Amaranta — Danza Folclórica'),
    colores:         JSON.stringify([{ nombre: 'Magenta', hex: '#8a2057' }]),
    telas:           JSON.stringify(['Tafetán', 'Encaje', 'Tul']),
    caracteristicas: JSON.stringify([
      'Vuelo amplio multicapa',
      'Bordados artesanales',
      'Cintura ajustada con ballenas',
      'Falda con aro estructurado',
    ]),
    tiempoEntrega: '15 a 20 días hábiles',
  },
  {
    nombre:          'Celeste',
    slug:            'vestido-celeste',
    descripcion:     'Vestido de novia clásico con silueta evasé y tela delicada. Elegancia atemporal para el día más especial, confeccionado completamente a tu medida y con acabados de alta costura.',
    tipo:            'Vestido de Novia',
    categoria_slug:  'vestido-de-novia',
    destacado:       1,
    disponible:      1,
    imagenes:        img('celeste.png', 'Vestido Celeste — Novia'),
    colores:         JSON.stringify([{ nombre: 'Champagne', hex: '#b9ab92' }]),
    telas:           JSON.stringify(['Satén', 'Tul', 'Encaje bordado']),
    caracteristicas: JSON.stringify([
      'Silueta evasé',
      'Escote corazón',
      'Cola corte catedral',
      'Cierre de botones forrados',
    ]),
    tiempoEntrega: '30 a 45 días hábiles',
  },
  {
    nombre:          'Aurora',
    slug:            'vestido-aurora',
    descripcion:     'Vestido de gala en tono azul real con detalles de pedrería en el escote. Corte recto y elegante, perfecto para eventos formales, ceremonias y galas de noche.',
    tipo:            'Vestido de Gala',
    categoria_slug:  'gala',
    destacado:       1,
    disponible:      1,
    imagenes:        img('aurora.png', 'Vestido Aurora — Gala'),
    colores:         JSON.stringify([{ nombre: 'Azul Real', hex: '#42608f' }]),
    telas:           JSON.stringify(['Mikado', 'Chiffon']),
    caracteristicas: JSON.stringify([
      'Corte recto largo al piso',
      'Pedrería en escote',
      'Espalda semiabierta',
      'Forro de satén interno',
    ]),
    tiempoEntrega: '20 a 30 días hábiles',
  },
  {
    nombre:          'Carmesí',
    slug:            'vestido-carmesi',
    descripcion:     'Vestido de gala nocturna en tono carmesí intenso. Silueta ajustada que resalta la figura con una abertura lateral sutil. Ideal para cenas de etiqueta y eventos de alto perfil.',
    tipo:            'Vestido de Gala',
    categoria_slug:  'gala',
    destacado:       1,
    disponible:      1,
    imagenes:        img('carmesi.png', 'Vestido Carmesí — Gala de Noche'),
    colores:         JSON.stringify([{ nombre: 'Carmesí', hex: '#bd3a51' }]),
    telas:           JSON.stringify(['Terciopelo', 'Satén elástico']),
    caracteristicas: JSON.stringify([
      'Silueta ajustada',
      'Abertura lateral',
      'Escote asimétrico',
      'Sin mangas con hombros descubiertos',
    ]),
    tiempoEntrega: '20 a 30 días hábiles',
  },
  {
    nombre:          'Zafiro',
    slug:            'vestido-zafiro',
    descripcion:     'Vestido de ceremonia civil en azul zafiro profundo. Corte midi de máxima elegancia con bordado floral delicado en el corpino, perfecto para bodas civiles y eventos íntimos.',
    tipo:            'Vestido Civil',
    categoria_slug:  'civil',
    destacado:       1,
    disponible:      1,
    imagenes:        img('zafiro.png', 'Vestido Zafiro — Ceremonia Civil'),
    colores:         JSON.stringify([{ nombre: 'Zafiro', hex: '#1f2f86' }]),
    telas:           JSON.stringify(['Organza', 'Forro satinado']),
    caracteristicas: JSON.stringify([
      'Corte midi',
      'Bordado floral en corpino',
      'Escote en V',
      'Mangas largas semitransparentes',
    ]),
    tiempoEntrega: '20 a 25 días hábiles',
  },
];

const insert = db.prepare(`
  INSERT OR IGNORE INTO prendas
    (nombre, slug, descripcion, tipo, categoria_slug, destacado, disponible,
     imagenes, colores, telas, caracteristicas, tiempoEntrega)
  VALUES
    (@nombre, @slug, @descripcion, @tipo, @categoria_slug, @destacado, @disponible,
     @imagenes, @colores, @telas, @caracteristicas, @tiempoEntrega)
`);

const run = db.transaction(() => {
  for (const p of prendas) insert.run(p);
});

run();

console.log(`✓ ${prendas.length} prendas de prueba insertadas (INSERT OR IGNORE).`);
console.log(`  URLs apuntando a: ${PUB_URL}/prendas/`);
