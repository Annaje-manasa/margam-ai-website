/**
 * server/index.js
 * 
 * Standalone Node.js HTTP Server for Whop Webhook.
 * Runs with zero extra dependencies using native node:http.
 */

import http from 'node:http';
import { handleWhopWebhook } from './whopWebhook.js';

const PORT = process.env.PORT || 3001;

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, webhook-id, webhook-timestamp, webhook-signature');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check endpoint
  if (req.method === 'GET' && (req.url === '/health' || req.url === '/')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'margam-whop-webhook' }));
    return;
  }

  // Whop Webhook endpoint
  if (req.method === 'POST' && (req.url === '/api/whop-webhook' || req.url === '/whop-webhook')) {
    let bodyChunks = [];
    req.on('data', chunk => bodyChunks.push(chunk));
    req.on('end', async () => {
      try {
        const rawBody = Buffer.concat(bodyChunks).toString('utf8');
        const result = await handleWhopWebhook(rawBody, req.headers);
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.body));
      } catch (err) {
        console.error('[Whop Webhook Server Error]', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`[Whop Webhook Server] Listening on http://localhost:${PORT}/api/whop-webhook`);
  });
}

export default server;
