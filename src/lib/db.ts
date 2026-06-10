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
  CREATE TABLE IF NOT EXISTS servicios (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre      TEXT    NOT NULL UNIQUE,
    descripcion TEXT    NOT NULL DEFAULT '',
    icono       TEXT    NOT NULL DEFAULT 'tool',
    orden       INTEGER NOT NULL DEFAULT 0,
    activo      INTEGER NOT NULL DEFAULT 1
  );

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

`);

// ── Seed de categorías ───────────────────────────────────────────────────────
// INSERT OR IGNORE: solo inserta si el slug no existe todavía.

const seedCategoria = db.prepare(
  'INSERT OR IGNORE INTO categorias (nombre, slug) VALUES (?, ?)'
);
const seedServicio = db.prepare(
  'INSERT OR IGNORE INTO servicios (nombre, descripcion, icono, orden) VALUES (?, ?, ?, ?)'
);

const seedAll = db.transaction(() => {
  seedCategoria.run('Vestido de Novia', 'vestido-de-novia');
  seedCategoria.run('Quinceañera',      'quinceañera');
  seedCategoria.run('Danza',            'danza');
  seedCategoria.run('Gala',             'gala');
  seedCategoria.run('Civil',            'civil');
  seedCategoria.run('Casual',           'casual');
  seedCategoria.run('Playa',            'playa');
  seedCategoria.run('Danza de Iglesia', 'danza-iglesia');

  seedServicio.run('Uniformes Escolares',      'Confección de uniformes completos para colegios e instituciones educativas. Se necesita el código del uniforme o la tela del colegio para comenzar.',  'school',   1);
  seedServicio.run('Uniformes de Banda',       'Trajes oficiales para bandas estudiantiles y grupos musicales, con acabados de alta presentación.',            'music',    2);
  seedServicio.run('Vestidos de Novia',        'Diseños exclusivos para el día más especial de tu vida, confeccionados 100 % a tus medidas y personalidad. También confecciono vestidos para damas de honor a juego.', 'heart', 3);
  seedServicio.run('Vestidos de Gala y Casual','Desde una reunión informal hasta una gala de etiqueta, cada vestido nace de tus medidas exactas.',                       'star',     4);
  seedServicio.run('Trajes Semiformales',      'Conjuntos elegantes para graduaciones, bautizos, cumpleaños o cualquier ocasión que merezca algo especial.',             'formal',   5);
  seedServicio.run('Pantalones y Blusas',      'Prendas básicas confeccionadas a tu cuerpo: la diferencia entre "sirve" y "queda perfecto".',                           'scissors', 6);
  seedServicio.run('Ajustes y Reparaciones',   'Adaptamos y renovamos la ropa que ya tenés. Cambios de talla, largos, cierres o rediseños completos.',                  'tool',     7);
});

seedAll();

export default db;
