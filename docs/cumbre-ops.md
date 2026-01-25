# Operacion Cumbre 2026

Guia corta para cron de cuotas, export CSV y acceso de cuenta.

## Variables requeridas

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `CUMBRE_CRON_SECRET`
- `CUMBRE_EXPORT_SECRET`

> Nota: puedes reutilizar `SUPABASE_URL` y `SUPABASE_ANON_KEY` como `PUBLIC_*`.

## Cron de cuotas (auto-debito)

Endpoint:
- `POST /api/cumbre2026/installments/run`
- Header requerido: `x-cron-secret: <CUMBRE_CRON_SECRET>`
- Alternativa: `?token=<CUMBRE_CRON_SECRET>`

Ejemplo manual:

```bash
curl -X POST "https://TU-DOMINIO/api/cumbre2026/installments/run" \
  -H "x-cron-secret: TU_SECRETO"
```

Programacion sugerida:
- Diario a las 08:00 America/Bogota (13:00 UTC).
- Si usas un servicio externo, elige un schedule tipo `0 13 * * *` (UTC).

## Export CSV (Excel)

Endpoint:
- `GET /api/cumbre2026/installments/export`
- Header requerido: `x-export-secret: <CUMBRE_EXPORT_SECRET>`
- Alternativa: `?token=<CUMBRE_EXPORT_SECRET>`

Ejemplo:

```bash
curl -L "https://TU-DOMINIO/api/cumbre2026/installments/export?token=TU_SECRETO" \
  -o cumbre_installments.csv
```

Abre el CSV en Excel/Sheets para el control de pagos.

## Supabase Auth (cuentas)

1. En Supabase -> Auth, habilita Email OTP.
2. En Auth -> URL Configuration, agrega el Site URL de produccion.
3. Agrega un Redirect URL valido: `https://TU-DOMINIO/cuenta`.
4. Configura `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY` en el entorno.
