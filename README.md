# A Tu Medida

Sitio web de tienda de prendas de moda confeccionadas a medida. Incluye catálogo público con detalle por prenda, panel de administración protegido y almacenamiento de imágenes en la nube.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | [Astro 5](https://astro.build) — SSR con adapter Node |
| Base de datos | SQLite vía [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3) |
| Almacenamiento de imágenes | [Cloudflare R2](https://developers.cloudflare.com/r2/) (S3-compatible) |
| Runtime | Node.js 22 |
| Contenedor | Docker |
| Lenguaje | TypeScript |

---

## Requisitos

- Docker y Docker Compose
- Una cuenta de Cloudflare con un bucket R2 creado (para subir imágenes)

---

## Variables de entorno

Copiá el archivo de ejemplo y completá los valores:

```bash
cp .env.example .env
```

| Variable | Descripción |
|---|---|
| `DB_PATH` | Ruta al archivo SQLite dentro del contenedor. Por defecto `/app/data/db.sqlite` |
| `ADMIN_USER` | Usuario para acceder al panel de administración |
| `ADMIN_PASS` | Contraseña del panel de administración |
| `ADMIN_SECRET` | Valor secreto que se guarda en la cookie de sesión. Usá una cadena larga y aleatoria |
| `R2_ACCOUNT_ID` | ID de tu cuenta de Cloudflare |
| `R2_ACCESS_KEY_ID` | Access Key del token de API R2 |
| `R2_SECRET_ACCESS_KEY` | Secret Key del token de API R2 |
| `R2_BUCKET_NAME` | Nombre del bucket R2 |
| `R2_PUBLIC_URL` | URL pública del bucket (ej: `https://pub-xxxx.r2.dev`) |

---

## Levantar el proyecto

### Desarrollo

```bash
# Construir y levantar el contenedor
docker compose up --build

# En segundo plano
docker compose up --build -d
```

El sitio queda disponible en `http://localhost:4321`.

### Producción

Los datos de SQLite se persisten en un volumen Docker llamado `a_tu_medida_sqlite`, por lo que sobreviven reinicios y rebuilds.

```bash
docker compose up -d
```

---

## Datos de demo

Para cargar prendas de prueba en la base de datos, ejecutar el script de seed dentro del contenedor:

```bash
docker compose exec app node scripts/seed-demo.mjs
```

---

## Estructura del proyecto

```
src/
├── components/
│   ├── admin/          # Componentes del panel admin
│   ├── home/           # Secciones de la página principal (Hero, Destacados, Servicios…)
│   ├── CardPrenda.astro
│   ├── Header.astro
│   └── Footer.astro
│
├── layouts/
│   └── Layout.astro    # Layout base con nav, tema claro/oscuro y fuentes
│
├── lib/
│   ├── db.ts           # Conexión SQLite + creación de tablas + seed de categorías
│   ├── prendas.ts      # CRUD de prendas
│   ├── categorias.ts   # Lectura de categorías
│   ├── servicios.ts    # Lectura de servicios
│   └── r2.ts           # Cliente de Cloudflare R2 para subir/borrar imágenes
│
├── pages/
│   ├── index.astro         # Página principal
│   ├── catalogo.astro      # Catálogo con filtros por categoría
│   ├── prendas/
│   │   └── [slug].astro    # Detalle de prenda
│   ├── admin/
│   │   ├── index.astro     # Panel de administración (requiere auth)
│   │   └── login.astro     # Login del admin
│   └── api/
│       ├── admin/
│       │   ├── login.ts    # POST — autentica y setea cookie de sesión
│       │   └── logout.ts   # POST — borra cookie y redirige al login
│       └── prendas/
│           ├── index.ts    # GET — lista prendas públicas
│           └── [id].ts     # GET / PUT / DELETE — operaciones sobre una prenda
│
├── types/
│   └── prenda.ts       # Interfaces TypeScript (Prenda, Imagen, Color)
│
└── config.ts           # Datos del sitio: nombre, WhatsApp, redes sociales

public/
├── assets/             # Imágenes estáticas generales
└── prendas/            # Imágenes locales de prendas (si no se usa R2)

scripts/
└── seed-demo.mjs       # Script para poblar la BD con datos de prueba
```

---

## Base de datos

SQLite con tres tablas. Se crean automáticamente al iniciar el servidor si no existen.

### `categorias`
| Campo | Tipo | Descripción |
|---|---|---|
| id | INTEGER | Clave primaria |
| nombre | TEXT | Nombre legible (ej: "Vestido de Novia") |
| slug | TEXT | Identificador URL (ej: "vestido-de-novia") |

Categorías precargadas: Vestido de Novia, Quinceañera, Danza, Gala, Civil, Casual, Playa, Danza de Iglesia.

### `servicios`
| Campo | Tipo | Descripción |
|---|---|---|
| id | INTEGER | Clave primaria |
| nombre | TEXT | Nombre del servicio |
| descripcion | TEXT | Descripción larga |
| icono | TEXT | Identificador de ícono |
| orden | INTEGER | Orden de aparición |
| activo | INTEGER | 1 = visible, 0 = oculto |

### `prendas`
| Campo | Tipo | Descripción |
|---|---|---|
| id | INTEGER | Clave primaria |
| nombre | TEXT | Nombre de la prenda |
| slug | TEXT | Identificador URL único |
| descripcion | TEXT | Descripción |
| tipo | TEXT | Tipo (ej: "Vestido largo") |
| categoria_slug | TEXT | FK a `categorias.slug` |
| destacado | INTEGER | 1 = aparece en sección Destacados |
| disponible | INTEGER | 1 = visible en el catálogo público |
| imagenes | TEXT | JSON: `[{ url, publicId, alt, orden }]` — la de menor `orden` es la principal |
| colores | TEXT | JSON: `[{ nombre, hex }]` |
| telas | TEXT | JSON: `["Organza", "Satín", …]` |
| caracteristicas | TEXT | JSON: `["Bordado artesanal", …]` |
| tiempoEntrega | TEXT | Tiempo estimado de entrega |
| creadoEn | TEXT | Fecha de creación |
| actualizadoEn | TEXT | Fecha de última modificación |

---

## Panel de administración

Accesible en `/admin/login`. Requiere las credenciales definidas en `ADMIN_USER` y `ADMIN_PASS`.

Permite:
- Ver todas las prendas (disponibles y no disponibles)
- Filtrar por categoría
- Editar cualquier campo de una prenda
- Marcar como destacada o como no disponible
- Eliminar prendas

La sesión se maneja con una cookie `httpOnly` que expira en 7 días.

---

## Imágenes

Las imágenes se almacenan en Cloudflare R2. En la base de datos solo se guarda la URL pública y el `publicId` (clave del objeto en el bucket).

El campo `imagenes` de cada prenda es un array JSON ordenado por `orden`. La imagen con `orden: 0` es la principal y se muestra como fondo en el detalle de la prenda. Las demás aparecen en el carousel de galería.

Si una prenda no tiene imágenes, la sección de foto y el carousel no se renderizan.

---

## API endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/prendas` | No | Lista prendas disponibles. Acepta `?tipo=` y `?categoria=` |
| GET | `/api/prendas/:id` | No | Retorna una prenda por ID |
| PUT | `/api/prendas/:id` | Sí | Actualiza una prenda |
| DELETE | `/api/prendas/:id` | Sí | Elimina una prenda |
| POST | `/api/admin/login` | No | Autentica y crea cookie de sesión |
| POST | `/api/admin/logout` | No | Elimina la cookie y redirige al login |
