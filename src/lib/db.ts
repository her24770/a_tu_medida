import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), 'data', 'db.sqlite');

const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');

// ── Tablas ──────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS categorias (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre  TEXT    NOT NULL UNIQUE,
    slug    TEXT    NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS prendas (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre          TEXT    NOT NULL,
    slug            TEXT    NOT NULL UNIQUE,
    descripcion     TEXT    NOT NULL,
    tipo            TEXT    NOT NULL,
    categoria_slug  TEXT    NOT NULL REFERENCES categorias(slug),
    destacado       INTEGER NOT NULL DEFAULT 0,
    disponible      INTEGER NOT NULL DEFAULT 1,
    imagenes        TEXT    NOT NULL DEFAULT '[]',
    colores         TEXT    NOT NULL DEFAULT '[]',
    telas           TEXT    NOT NULL DEFAULT '[]',
    caracteristicas TEXT    NOT NULL DEFAULT '[]',
    tiempoEntrega   TEXT    NOT NULL DEFAULT '',
    creadoEn        TEXT    NOT NULL DEFAULT (datetime('now')),
    actualizadoEn   TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS configuracion (
    id            INTEGER PRIMARY KEY DEFAULT 1,
    nombre        TEXT NOT NULL DEFAULT '',
    tagline       TEXT NOT NULL DEFAULT '',
    heroImagenUrl TEXT NOT NULL DEFAULT '',
    whatsapp      TEXT NOT NULL DEFAULT '',
    instagram     TEXT NOT NULL DEFAULT '',
    email         TEXT NOT NULL DEFAULT '',
    facebook      TEXT NOT NULL DEFAULT '',
    tiktok        TEXT NOT NULL DEFAULT ''
  );
`);

// ── Seed de categorías ───────────────────────────────────────────────────────
// INSERT OR IGNORE: solo inserta si el slug no existe todavía.

const seedCategorias = db.prepare(
  'INSERT OR IGNORE INTO categorias (nombre, slug) VALUES (?, ?)'
);

const seedAll = db.transaction(() => {
  seedCategorias.run('Vestido de Novia', 'vestido-de-novia');
  seedCategorias.run('Quinceañera',      'quinceañera');
  seedCategorias.run('Danza',            'danza');
  seedCategorias.run('Gala',             'gala');
  seedCategorias.run('Civil',            'civil');
  seedCategorias.run('Casual',           'casual');
  seedCategorias.run('Playa',            'playa');
});

seedAll();

export default db;
