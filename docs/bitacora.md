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
### 2026-01-24
- Responsable: Delta
- Cambios:
  - Se agrega contrato de equipo, apodos, regla de no referencias a herramientas internas.
  - Se crea bitacora y prompts de trabajo para Delta/Nova/Atlas.
  - Se aplica parallax tipo Ayocin sobre el home (manteniendo SEO).
  - Se intento Lenis/GSAP y se revirtio por estabilidad.
- Pruebas: N/A
- Pendientes: Mantener bitacora por cada PR/merge.

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
