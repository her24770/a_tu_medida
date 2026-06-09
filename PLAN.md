# Plan de desarrollo

## Ramas

### `setup`
Base del proyecto. Todo lo necesario para que la app corra localmente con Docker.

- Inicializar proyecto Astro SSR con adaptador Node.js
- `docker-compose.yml` con contenedores `app` y `mongodb`
- `Dockerfile` para la app Astro
- Conexión a MongoDB (`src/lib/db.ts`)
- Cliente Cloudflare R2 (`src/lib/r2.ts`)
- `.env.example` con todas las variables necesarias
- Layout base (header, footer)

---

### `catalogo`
Todo lo que ve el usuario final. Sin admin, sin auth.

- Schema y modelo de `prendas` con Mongoose
- `GET /api/prendas` — listar todas las prendas
- `GET /api/prendas/:id` — detalle de una prenda
- Página Hero (`/`) — imagen principal, nombre de marca, frase y destacados
- Página Catálogo (`/catalogo`) — galería con filtro por tipo y categoría
- Página Detalle (`/prendas/[slug]`) — galería de imágenes, colores, telas, características
- Sección Contacto — WhatsApp, Instagram, email y redes sociales
- Componentes: `CardPrenda`, `GaleriaImagenes`, `FiltroCategoria`

---

### `admin-auth`
Acceso protegido al panel. Un solo usuario.

- Página de login (`/admin/login`)
- `POST /api/auth/login` — valida password y genera JWT
- `src/lib/auth.ts` — firma y verificación del JWT
- Middleware de protección para todas las rutas `/admin/*`
- Redirección automática si no hay sesión válida
- Logout

---

### `admin-crud`
Panel de administración completo para gestionar prendas.

- Panel principal (`/admin`) — tabla con todas las prendas
- Formulario crear prenda (`/admin/nueva`) — incluye subida de imágenes a R2
- Formulario editar prenda (`/admin/editar/[id]`) — edición de todos los campos e imágenes
- Eliminación de prenda con confirmación — borra también las imágenes de R2
- `POST /api/prendas` — crear
- `PUT /api/prendas/:id` — editar
- `DELETE /api/prendas/:id` — eliminar

---

### `ui`
Pulido visual final antes de producción.

- Estilos finales y sistema de diseño consistente
- Diseño responsive (móvil, tablet, escritorio)
- Transiciones y animaciones sutiles
- SEO: meta tags, og:image, sitemap
- Optimización de imágenes con `<Image>` de Astro
- Revisión de accesibilidad (alt texts, contraste, navegación por teclado)
