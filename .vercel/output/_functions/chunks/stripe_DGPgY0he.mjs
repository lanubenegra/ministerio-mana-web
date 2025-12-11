import Stripe from 'stripe';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://www.ejemplo-ministeriomana.org", "SSR": true};
const API_VERSION = "2023-10-16";
function getSecret() {
  const secret = Object.assign(__vite_import_meta_env__, { _: process.env._ })?.STRIPE_SECRET_KEY ?? process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error("STRIPE_SECRET_KEY no está configurado");
  }
  return secret;
}
function getWebhookSecret() {
  const secret = Object.assign(__vite_import_meta_env__, { _: process.env._ })?.STRIPE_WEBHOOK_SECRET ?? process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET no está configurado");
  }
  return secret;
}
let client = null;
function getStripeClient() {
  if (!client) {
    client = new Stripe(getSecret(), { apiVersion: API_VERSION });
  }
  return client;
}
async function createStripeDonationSession(params) {
  const stripe = getStripeClient();
  const amountInMinor = Math.round(params.amountUsd * 100);
  return stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    currency: params.currency.toLowerCase(),
    allow_promotion_codes: true,
    metadata: params.metadata,
    customer_email: params.customerEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: params.currency.toLowerCase(),
          unit_amount: amountInMinor,
          product_data: {
            name: params.description
          }
        }
      }
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl
  });
}
function verifyStripeWebhook(payload, signature) {
  if (!signature) {
    throw new Error("Stripe-Signature ausente");
  }
  const webhookSecret = getWebhookSecret();
  const stripe = getStripeClient();
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

export { createStripeDonationSession as c, getStripeClient as g, verifyStripeWebhook as v };
