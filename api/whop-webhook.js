/**
 * api/whop-webhook.js
 * 
 * Serverless Function Handler for Whop Webhooks (Vercel / Netlify / Node.js).
 */

import { handleWhopWebhook } from '../server/whopWebhook.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let rawBody = req.body;
    if (typeof rawBody === 'object' && rawBody !== null) {
      rawBody = JSON.stringify(rawBody);
    } else if (typeof rawBody !== 'string') {
      rawBody = String(rawBody || '');
    }

    const result = await handleWhopWebhook(rawBody, req.headers);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[Whop Webhook Handler Error]', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
