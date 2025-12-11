const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://www.ejemplo-ministeriomana.org", "SSR": true};
function resolveBaseUrl(request) {
  const configured = Object.assign(__vite_import_meta_env__, { _: process.env._ })?.PUBLIC_SITE_URL ?? process.env.PUBLIC_SITE_URL;
  if (configured) {
    return configured.replace(/\/+$/, "");
  }
  const requestUrl = new URL(request.url);
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host") || requestUrl.host;
  const protocol = forwardedProto || (requestUrl.protocol ? requestUrl.protocol.replace(":", "") : "https");
  return `${protocol}://${host}`;
}

export { resolveBaseUrl as r };
