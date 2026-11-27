import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleWhopWebhook } from './server/whopWebhook.js';
import { getWhopPricing } from './api/whop-pricing.js';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'whop-dev-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/api/whop-pricing' || req.url === '/api/pricing') {
            try {
              const pricing = await getWhopPricing();
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(pricing));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }

          if (req.method === 'POST' && (req.url === '/api/whop-webhook' || req.url === '/whop-webhook')) {
            let chunks = [];
            req.on('data', chunk => chunks.push(chunk));
            req.on('end', async () => {
              try {
                const rawBody = Buffer.concat(chunks).toString('utf8');
                const result = await handleWhopWebhook(rawBody, req.headers);
                res.statusCode = result.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result.body));
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
          next();
        });
      }
    }
  ],
  server: {
    port: 3000,
    open: false
  }
});
