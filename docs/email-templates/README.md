# Plantillas de Correo para Supabase

Este directorio contiene las plantillas HTML diseñadas para los correos transaccionales de Supabase, siguiendo la identidad visual de "Ministerio Maná" (Navy, Teal, Gold, Beige).

## Instrucciones de Instalación

1.  Ve a tu **Supabase Dashboard**.
2.  Navega a **Authentication** > **Configuration** > **Email Templates**.
3.  Para cada tipo de correo, copia el contenido del archivo HTML correspondiente y pégalo en el editor de Supabase.

### Correos de Acción (Action Required)

| Tipo de Correo | Archivo | Asunto Sugerido |
| :--- | :--- | :--- |
| **Confirm Signup** | `confirmation.html` | Confirma tu registro en Ministerio Maná |
| **Invite User** | `invite.html` | Has sido invitado a Ministerio Maná |
| **Magic Link** | `magic_link.html` | Inicia sesión en Ministerio Maná |
| **Reset Password** | `reset_password.html` | Restablecer tu contraseña |
| **Change Email Address** | `email_change.html` | Confirma el cambio de correo |
| **Reauthentication** | `reauthentication.html` | Código de paso: {{ .Token }} |

### Correos de Notificación (Notification Only)

Estos correos se envían automáticamente cuando ocurren cambios en la cuenta. Asegúrate de activarlos en la configuración de Supabase.

| Evento | Archivo | Asunto Sugerido |
| :--- | :--- | :--- |
| **Password Changed** | `password_changed.html` | Tu contraseña ha sido actualizada |
| **Email Changed** | `email_changed_notice.html` | Tu correo ha sido actualizado |
| **Phone Changed** | `phone_changed.html` | Tu teléfono ha sido actualizado |
| **Identity Linked** | `identity_linked.html` | Nueva cuenta vinculada |
| **Identity Unlinked** | `identity_unlinked.html` | Cuenta desvinculada |
| **MFA Added** | `mfa_added.html` | Autenticación de dos pasos activada |
| **MFA Removed** | `mfa_removed.html` | Autenticación de dos pasos desactivada |

## Notas Importantes

*   **Logo**: Las plantillas asumen que tu logo está disponible en `{{ .SiteURL }}/logo.svg`. Asegúrate de que `Site URL` en Supabase (Authentication > URL Configuration) apunte a tu dominio principal (ej. `https://ministeriomana.com` o `http://localhost:4321` para pruebas).
*   **Variables**: Se utilizan las variables estándar de Go template que soporta Supabase (`{{ .ConfirmationURL }}`, `{{ .Token }}`, etc.).
*   **Compatibilidad**: El diseño utiliza HTML/CSS en línea y tablas/divs simples para asegurar compatibilidad con la mayoría de clientes de correo (Gmail, Outlook, Apple Mail).

## Si usas SendGrid (API propia)

El proyecto ahora puede enviar correos de autenticación vía **SendGrid API**. En ese caso:

- Los templates de Supabase quedan como **fallback** (o para uso manual).
- Puedes usar estos HTML como base en SendGrid.
- Variables sugeridas en SendGrid (dynamic templates):
  - `action_url`
  - `cta_label`
  - `subject`
  - `app_name`
  - `support_email`

### SendGrid · Auth (Portal Maná)

Plantillas recomendadas (dynamic templates):

| Tipo | Archivo | Env esperado |
| --- | --- | --- |
| Invite | `sendgrid/auth_invite.html` | `SENDGRID_TEMPLATE_INVITE` |
| Magic Link | `sendgrid/auth_magiclink.html` | `SENDGRID_TEMPLATE_MAGICLINK` |
| Recovery | `sendgrid/auth_recovery.html` | `SENDGRID_TEMPLATE_RECOVERY` |

Variables dinámicas usadas:

- `subject`
- `app_name`
- `action_url`
- `cta_label`
- `support_email`

### SendGrid · Cumbre Mundial 2026

Plantillas recomendadas (dynamic templates):

| Tipo | Archivo | Env esperado |
| --- | --- | --- |
| Booking recibido | `sendgrid/cumbre_booking_received.html` | `SENDGRID_TEMPLATE_CUMBRE_BOOKING` |
| Pago recibido | `sendgrid/cumbre_payment_received.html` | `SENDGRID_TEMPLATE_CUMBRE_PAYMENT_RECEIVED` |
| Depósito >= 50% | `sendgrid/cumbre_deposit_ok.html` | `SENDGRID_TEMPLATE_CUMBRE_DEPOSIT_OK` |
| Pago completo | `sendgrid/cumbre_paid.html` | `SENDGRID_TEMPLATE_CUMBRE_PAID` |
| Pago fallido | `sendgrid/cumbre_payment_failed.html` | `SENDGRID_TEMPLATE_CUMBRE_PAYMENT_FAILED` |
| Recordatorio cuota | `sendgrid/cumbre_installment_reminder.html` | `SENDGRID_TEMPLATE_CUMBRE_INSTALLMENT_REMINDER` |

Variables dinámicas usadas:

- `subject`
- `app_name`
- `full_name`
- `booking_id`
- `amount` (formateado)
- `total_amount` (formateado)
- `total_paid` (formateado)
- `currency`
- `due_date` (formateado)
- `installment_index`
- `installment_count`
- `payment_link`
- `support_email`
- `support_whatsapp`
