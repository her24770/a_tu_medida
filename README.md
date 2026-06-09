# A Tu Medida

Sitio web para una diseñadora de modas que crea prendas 100% a la medida. Funciona como catálogo visual con información de contacto y un panel de administración protegido para gestionar el contenido.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend + API | Astro SSR (Node.js adapter) |
| Base de datos | MongoDB |
| Almacenamiento de imágenes | Cloudflare R2 |
| Infraestructura | Docker Compose |

## Arquitectura

```
Docker Compose
├── app        → Astro SSR (servidor Node.js — páginas + endpoints)
└── mongodb    → MongoDB

Cloudflare R2  → almacenamiento de imágenes (externo, con CDN de Cloudflare)
```

Las páginas públicas se renderizan en el servidor con los datos ya incluidos en el HTML (sin fetch en el browser). El panel admin usa fetch para las operaciones CRUD.

## Estructura del proyecto

```
src/
├── pages/
│   ├── index.astro              → Hero + destacados
│   ├── catalogo.astro           → Galería completa de prendas
│   ├── prendas/
│   │   └── [slug].astro         → Detalle de una prenda
│   ├── admin/
│   │   ├── login.astro          → Login del administrador
│   │   ├── index.astro          → Panel admin — lista de prendas
│   │   ├── nuevo.astro          → Crear prenda
│   │   └── editar/
│   │       └── [id].astro       → Editar prenda
│   └── api/
│       ├── auth/
│       │   └── login.ts         → POST /api/auth/login
│       └── prendas/
│           ├── index.ts         → GET / POST /api/prendas
│           └── [id].ts          → GET / PUT / DELETE /api/prendas/:id
├── components/
├── layouts/
└── lib/
    ├── db.ts                    → conexión MongoDB
    ├── r2.ts                    → cliente Cloudflare R2
    └── auth.ts                  → validación de sesión
```

## Entidades

### prendas
Única entidad del sistema. Representa una prenda del catálogo.

```ts
{
  _id:             ObjectId
  nombre:          string          // "Vestido Sirena Dorado"
  slug:            string          // "vestido-sirena-dorado"
  descripcion:     string
  tipo:            string          // "vestido" | "traje de danza" | "pantalón" | "falda" | ...
  categoria:       "noche" | "civil" | "quinceañera" | "casual" | "playa"
  destacado:       boolean         // aparece en el hero / home
  disponible:      boolean         // visible en el catálogo público
  imagenes: [
    {
      url:         string          // URL de Cloudflare R2
      publicId:    string          // ID en R2 para poder eliminarlo
      alt:         string
      orden:       number
    }
  ]
  colores: [
    {
      nombre:      string          // "Champagne"
      hex:         string          // "#F7E7CE"
    }
  ]
  telas:           string[]        // ["chifón", "encaje", "satín"]
  caracteristicas: string[]        // ["escote corazón", "cola catedral"]
  tiempoEntrega:   string          // "4-6 semanas"
  creadoEn:        Date
  actualizadoEn:   Date
}
```

### configuracion
Un único documento con la información de la modista (datos de contacto, texto del hero, etc.).

```ts
{
  _id:             ObjectId
  nombre:          string          // nombre de la marca / modista
  tagline:         string          // frase del hero
  heroImagenUrl:   string
  whatsapp:        string
  instagram:       string
  email:           string
  facebook:        string          // opcional
  tiktok:          string          // opcional
}
```

## API Endpoints

| Método | Ruta | Descripción | Protegido |
|---|---|---|---|
| POST | /api/auth/login | Login del administrador | No |
| GET | /api/prendas | Listar todas las prendas | No |
| GET | /api/prendas/:id | Obtener una prenda | No |
| POST | /api/prendas | Crear prenda | Sí |
| PUT | /api/prendas/:id | Editar prenda | Sí |
| DELETE | /api/prendas/:id | Eliminar prenda | Sí |

## Admin

Panel protegido con login de un único usuario. Las credenciales se definen en variables de entorno. Permite crear, editar y eliminar prendas incluyendo la gestión de imágenes en Cloudflare R2.

## Variables de entorno

```env
MONGODB_URI=mongodb://mongodb:27017/a_tu_medida
ADMIN_PASSWORD=...
ADMIN_SECRET=...          # clave para firmar el JWT de sesión
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
R2_PUBLIC_URL=...         # URL pública del bucket con CDN
```

## Páginas públicas

- **Hero** — imagen principal, nombre de la marca y frase
- **Catálogo** — galería de todas las prendas disponibles con filtro por categoría
- **Detalle de prenda** — galería de imágenes, colores, telas, características y tiempo de entrega
- **Contacto** — WhatsApp, Instagram, email y redes sociales
