type CumbreEmailKind =
  | 'booking_received'
  | 'payment_received'
  | 'deposit_ok'
  | 'paid'
  | 'payment_failed';

interface CumbreEmailPayload {
  to: string;
  fullName?: string;
  bookingId: string;
  amount?: number;
  currency?: string;
  totalPaid?: number;
  totalAmount?: number;
}

function env(key: string): string | undefined {
  return import.meta.env?.[key] ?? process.env?.[key];
}

function getFromEmail(): string {
  return env('CUMBRE_EMAIL_FROM') || 'info@ministeriomana.org';
}

function formatAmount(amount?: number, currency?: string): string {
  if (amount == null) return '';
  if (!currency) return `${amount}`;
  if (currency === 'COP') return `$ ${Math.round(amount).toLocaleString('es-CO')} COP`;
  return `$ ${amount.toFixed(2)} ${currency}`;
}

function buildSubject(kind: CumbreEmailKind): string {
  switch (kind) {
    case 'booking_received':
      return 'Inscripcion recibida - Cumbre Mundial 2026';
    case 'payment_received':
      return 'Abono confirmado - Cumbre Mundial 2026';
    case 'deposit_ok':
      return 'Cupo garantizado (>= 50%) - Cumbre Mundial 2026';
    case 'paid':
      return 'Pago completo confirmado - Cumbre Mundial 2026';
    case 'payment_failed':
      return 'Pago no confirmado - Cumbre Mundial 2026';
    default:
      return 'Cumbre Mundial 2026';
  }
}

function buildHtml(kind: CumbreEmailKind, payload: CumbreEmailPayload): string {
  const greeting = payload.fullName ? `Hola ${payload.fullName},` : 'Hola,';
  const total = payload.totalAmount != null ? formatAmount(payload.totalAmount, payload.currency) : '';
  const paid = payload.totalPaid != null ? formatAmount(payload.totalPaid, payload.currency) : '';
  const amount = payload.amount != null ? formatAmount(payload.amount, payload.currency) : '';

  let body = '';
  switch (kind) {
    case 'booking_received':
      body = `Recibimos tu inscripcion para la Cumbre Mundial 2026.`;
      break;
    case 'payment_received':
      body = `Recibimos tu abono por ${amount}.`;
      break;
    case 'deposit_ok':
      body = `Tu cupo quedo garantizado.`;
      break;
    case 'paid':
      body = `Tu pago completo fue confirmado.`;
      break;
    case 'payment_failed':
      body = `No pudimos confirmar tu pago. Puedes intentar de nuevo.`;
      break;
    default:
      body = 'Gracias por ser parte de la Cumbre Mundial 2026.';
      break;
  }

  const totals = total || paid
    ? `<p>Total: <strong>${total || '-'}</strong><br/>Pagado: <strong>${paid || '-'}</strong></p>`
    : '';

  return `
  <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.5;">
    <h2 style="margin:0 0 8px;">Cumbre Mundial 2026</h2>
    <p style="margin:0 0 12px;">${greeting}</p>
    <p style="margin:0 0 12px;">${body}</p>
    ${totals}
    <p style="margin:16px 0 0;">
      Si necesitas ayuda, escribe por WhatsApp al +57 314 829 7534.
    </p>
    <p style="margin:16px 0 0; font-size: 12px; color: #6b7280;">
      Booking ID: ${payload.bookingId}
    </p>
  </div>
  `;
}

async function sendWithSendgrid(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = env('SENDGRID_API_KEY');
  if (!apiKey) return false;
  const from = getFromEmail();
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from },
      subject,
      content: [{ type: 'text/html', value: html }],
    }),
  });
  return res.ok;
}

async function sendWithResend(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = env('RESEND_API_KEY');
  if (!apiKey) return false;
  const from = getFromEmail();
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
    }),
  });
  return res.ok;
}

export async function sendCumbreEmail(kind: CumbreEmailKind, payload: CumbreEmailPayload): Promise<void> {
  if (!payload.to) return;
  const subject = buildSubject(kind);
  const html = buildHtml(kind, payload);
  let ok = false;

  try {
    ok = await sendWithSendgrid(payload.to, subject, html);
  } catch (err) {
    console.error('[cumbre.email] sendgrid failed', err);
  }

  if (!ok) {
    try {
      ok = await sendWithResend(payload.to, subject, html);
    } catch (err) {
      console.error('[cumbre.email] resend failed', err);
    }
  }

  if (!ok && process.env.NODE_ENV !== 'production') {
    console.warn('[cumbre.email] no provider configured');
  }
}

export type { CumbreEmailKind, CumbreEmailPayload };
