export function resolveBaseUrl(request: Request): string {
  const configured = import.meta.env?.PUBLIC_SITE_URL ?? process.env.PUBLIC_SITE_URL;
  if (configured) {
    return configured.replace(/\/+$/, '');
  }
  const requestUrl = new URL(request.url);
  const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
  const host = forwardedHost || request.headers.get('host') || requestUrl.host;
  const protocol = forwardedProto || (requestUrl.protocol ? requestUrl.protocol.replace(':', '') : 'https');
  return `${protocol}://${host}`;
}
