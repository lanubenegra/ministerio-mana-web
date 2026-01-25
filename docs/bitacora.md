# Bitacora de trabajo - Ministerio Mana Web

## Roles clave
- Antigravity: UI/UX Lead
- Codex: Backend/Security Lead
- Cloud/Claude: Copywriting

## Formato de entrada
- Fecha:
- Responsable:
- Cambios:
- Pruebas:
- Pendientes:

## Entradas
### 2026-01-25 (Cumbre Mundial 2026 - backend)
- Responsable: Delta (Codex)
- Cambios:
  - Se agrego esquema SQL para cumbre: bookings, participants, payments.
  - Se creo backend base de cumbre (booking create/get, registration submit, status).
  - Se creo endpoint unificado de pagos (/api/payments/create).
  - Se agrego endpoint para eventos Wompi reenviados con HMAC interno.
  - Se extendio webhook Stripe para registrar pagos cumbre.
  - Se agrego mailer con SendGrid/Resend (segun env).
  - Se actualizo .env.example con variables de cumbre y webhook interno.
- Pruebas: N/A (pendiente)
- Pendientes:
  - Crear paginas /eventos/cumbre-mundial-2026 (UI).
  - Ejecutar SQL en Supabase.
  - Configurar env vars en Vercel (CUMBRE_*, INTERNAL_WEBHOOK_SECRET, SENDGRID_API_KEY).

### 2026-01-24 (Sesión completa)

#### Parte 1 - Intento de Cosmic Design (REVERTIDO)
- Responsable: Nova (Antigravity)
- Cambios:
  - Se implementó sistema de diseño "Cosmic Storytelling" con paleta Deep Space (negro/azul oscuro)
  - Se crearon componentes nuevos: `Hero.astro`, `ChapterPinned.astro`, `Panorama.astro`
  - Se modificó completamente `index.astro` con nueva estructura narrativa
  - Se cambió paleta de colores en `theme.css` de beige/navy a cosmic-void/starlight
  - Se agregaron Lenis y GSAP para animaciones parallax
  - **Commit**: `c0e75ca` - "feat: Add Ayocin-style smooth scroll animations with Lenis and GSAP"
- Problema detectado:
  - El cambio fue demasiado drástico: eliminó contenido original, cambió colores completamente
  - Usuario reportó que "no se veía bien" y se perdió el azul original
  - Faltaban banners y contenido que existía antes
- Acción: **REVERT completo del commit**

#### Parte 2 - Corrección: Solo Animaciones (IMPLEMENTADO)
- Responsable: Nova (Antigravity)
- Cambios:
  - Se ejecutó `git revert c0e75ca` para restaurar contenido y colores originales
  - Se volvieron a agregar Lenis y GSAP a `package.json` (solo librerías)
  - Se crearon scripts de animación que trabajan con componentes existentes:
    - `src/scripts/lenis.ts` - Smooth scroll con física
    - `src/scripts/home-animations.ts` - Parallax via data attributes
  - Se integraron scripts en `BaseLayout.astro`
  - Se agregaron data attributes a componentes existentes:
    - `HeroChapter.astro`: `data-hero` para parallax del título
    - `HistoryChapter.astro`: `data-parallax-bg` y `data-bg` para fondo parallax
  - **Commit**: `f4799a7` - "feat: Add Ayocin parallax animations to existing content"
- Archivos modificados:
  - `package.json` (+2 dependencias: Lenis, GSAP)
  - `src/layouts/BaseLayout.astro` (+2 script tags)
  - `src/components/home/HeroChapter.astro` (+1 data attribute)
  - `src/components/home/HistoryChapter.astro` (+2 data attributes)
  - `src/scripts/lenis.ts` (nuevo)
  - `src/scripts/home-animations.ts` (nuevo)
- Pruebas: Smooth scroll + parallax en hero y backgrounds
- Pendientes:
  - Instalar dependencias: `npm install`
  - Agregar más data attributes (`data-fade`, `data-stagger`, `data-scale`) a otros componentes si se requiere
  - Verificar que animaciones funcionen correctamente en producción

#### Parte 3 - Documentación y Reglas
- Responsable: Delta (Codex)
- Cambios:
  - Se creó `docs/contrato-equipo.md` con roles y reglas de trabajo
  - Se creó `docs/bitacora.md` con formato de registro
  - Se definieron apodos: Nova (Antigravity), Delta (Codex), Atlas (Cloud)
  - Se estableció regla de no incluir referencias a herramientas internas en código
- Pruebas: N/A
- Pendientes: Mantener bitácora actualizada por cada PR/merge

### 2026-01-23
- Responsable: Delta (registro historico)
- Cambios:
  - Redisenos de Home Storytelling y ajustes de componentes.
  - Fix de tailwind.config para evitar error de PostCSS.
- Pruebas: N/A
- Pendientes: Validar build en CI.

### 2026-01-22
- Responsable: Delta (registro historico)
- Cambios:
  - Iteraciones de hero/header/nav (espaciado, legibilidad, tamanos).
  - Seccion historia con timeline + globo y luego storytelling completo.
- Pruebas: N/A
- Pendientes: Ajustar estilo final a referencia visual.

### 2026-01-21
- Responsable: Delta (registro historico)
- Cambios:
  - Ajuste adapter Vercel y limpieza de .vercel/output en repo.
- Pruebas: N/A
- Pendientes: Validar deploy en Vercel.

### 2025-12-22
- Responsable: Delta (registro historico)
- Cambios:
  - Home storytelling + tema Mana (chapters sticky, chips, glass).
- Pruebas: N/A
- Pendientes: Refinar narrativa y animaciones.

### 2025-12-20
- Responsable: Delta (registro historico)
- Cambios:
  - Evangeliza: geocode con ciudad canonica, fallback de Supabase, mapa agrega puntos.
  - Se agrega NOMINATIM_USER_AGENT a .env.example.
- Pruebas: N/A
- Pendientes: Normalizar ciudades y paises.

### 2025-12-19
- Responsable: Delta (registro historico)
- Cambios:
  - Evangeliza heatmap arreglado + mapa actualiza al enviar.
  - Se crea pagina Escuela Biblica.
- Pruebas: N/A
- Pendientes: Pulir copy y assets.

### 2025-12-12
- Responsable: Delta (registro historico)
- Cambios:
  - Stripe checkout fixes + thanks page + bypass captcha en dev.
  - Wompi checkout ajuste + heatmap evangeliza.
  - Landing Mujeres que creen y .env.example de pagos/seguridad.
- Pruebas: N/A
- Pendientes: Webhooks reales con llaves prod.

### 2025-12-10
- Responsable: Delta (registro historico)
- Cambios:
  - Biblia en linea, iglesias, evangeliza y adapter Vercel.
- Pruebas: N/A
- Pendientes: Mejorar UI del visor y CSP.

### 2025-12-09
- Responsable: Delta (registro historico)
- Cambios:
  - Fix churches map con Leaflet y simplificacion de donaciones.
  - Mejora directorio de iglesias y evangeliza map.
- Pruebas: N/A
- Pendientes: QA en mobile.

### 2025-12-08
- Responsable: Delta (registro historico)
- Cambios:
  - Update config.ts de colecciones.
- Pruebas: N/A
- Pendientes: Crear contenido base de news/events.

### 2025-12-07
- Responsable: Delta (registro historico)
- Cambios:
  - Geo-payments, seguridad base y nuevas APIs (merge de feature/geo-payments).
- Pruebas: N/A
- Pendientes: Endpoints de pagos con llaves reales.

### 2025-11-02
- Responsable: Delta (registro historico)
- Cambios:
  - Setup CI workflow, ajuste CI a astro check.
  - Integracion de fuentes Intro.
  - Proyecto Astro inicial.
- Pruebas: N/A
- Pendientes: Definir estructura de contenido.
