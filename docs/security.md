# Ministerio Maná · Security checklist

Este repositorio ya incluye varias defensas (Turnstile + rate limit, CSP estricta, validación de firmas, logs en Supabase). Completar los siguientes pasos garantiza que cada ambiente quede protegido.

## 1. Configurar Cloudflare / cabeceras

1. Mantén el proxy de Cloudflare activo para el dominio y habilita **HTTPS Only**.
2. Entra a *SSL/TLS → Edge Certificates* y activa:
   - `Always Use HTTPS`
   - `Minimum TLS Version` en 1.2 o superior
   - `HSTS` (HTTP Strict Transport Security) con `max-age` ≥ 31536000, `includeSubDomains` y `preload`.
3. Añade una regla de seguridad (Firewall Rules) que limite `POST` a `/api/*` si necesitas permitir solo ciertos países/IP.
4. Si Cloudflare gestiona la CSP, copia la cabecera generada por el middleware (puedes obtenerla desde las DevTools) para replicarla en *Transform Rules → Response Headers*.

## 2. Respaldo y auditoría en Supabase

1. Entra a [Supabase](https://supabase.com/dashboard) → proyecto → **Settings → Backups** y asegurate de que el plan tenga respaldo automático diario. Si usas el free tier, programa un `pg_dump` manual (se sugiere un cron externo). 
2. Crea una alerta (por correo o Slack) sobre la tabla `security_events`:
   - Evento `webhook_invalid` repetido
   - Evento `captcha_failed` o `rate_limited` > 10 en 5 minutos
   Puedes usar **Supabase Edge Functions** o un cron externo que consulte `security_events`.
3. Revisa mensualmente la tabla `donation_events` para verificar que todos los webhooks están firmados (`provider`, `kind`, `reference`).
4. Usa el script `npm run security:scan` para listar rápidamente los eventos de seguridad de los últimos 15 minutos. Puedes automatizarlo con un cron (ej. `*/15 * * * * SECURITY_MONITOR_LOOKBACK=15 npm run security:scan >> logs/security.log`).
5. Para recibir alertas automáticas, configura las variables `SECURITY_ALERT_LOOKBACK`, `SECURITY_ALERT_THRESHOLDS` y define al menos un destino (`SECURITY_ALERT_TO` para correo con Resend o `SECURITY_ALERT_WEBHOOK` para Slack/Teams). Luego ejecuta `npm run security:alert`. Ejemplo de cron cada 5 minutos: `*/5 * * * * SECURITY_ALERT_LOOKBACK=5 npm run security:alert`.

## 3. Validaciones en formularios

Las APIs ya aplican sanitización adicional:

- Evangeliza y Oración eliminan links y caracteres especiales gracias a `sanitizePlainText`.
- Newsletter ignora correos que contienen URLs. 
- Descripciones de donación (`sanitizeDescription`) descartan cadenas con `http://` o `https://`.

Para el front-end se recomienda:

- Añadir atributos HTML (`pattern`, `maxlength`) equivalentes a los límites del backend.
- Desplegar mensajes de error claros cuando Turnstile falle o se exceda el rate limit.
- En formularios nuevos, reutilizar `sanitizePlainText` en el servidor antes de escribir en Supabase.

## 4. Webhooks y llaves

- Stripe y Wompi deben usar llaves exclusivas por entorno (Sandbox vs Producción). Mantén los secrets fuera del repo (`.env` / variables del servicio).
- Cada vez que registres una URL de webhook nueva, copia el secret en `.env` y realiza una prueba de firma para confirmar que llega a `donation_events`.
- Prefijos de referencia (`MINISTERIO-...`) permiten diferenciar múltiples sitios: respétalos en el webhook central.

## 5. Monitorización rápida

- Activa `npm run dev -- --host` solo en redes de confianza; en producción, deploya con un adapter Node/Vercel/Netlify conforme al hosting elegido.
- Usa las tablas `security_events` y `security_throttle` como fuente para dashboards (por ejemplo, Supabase + Metabase o Tinybird).
- Documenta los incidentes: cualquier entrada `payment_error` debería abrir un ticket interno con fecha, IP y meta adjunta.
