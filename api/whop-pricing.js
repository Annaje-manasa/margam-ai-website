/**
 * api/whop-pricing.js
 * 
 * Serverless API endpoint that fetches the live price directly from Whop.
 * Enables the frontend UI to automatically reflect whatever price or plan is set in Whop
 * without needing to modify the codebase every time.
 */

let cachedPricing = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // Cache for 60 seconds

export async function getWhopPricing() {
  const now = Date.now();
  if (cachedPricing && (now - lastFetchTime < CACHE_TTL_MS)) {
    return cachedPricing;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('https://whop.com/margam360/ai-reel-system/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const html = await res.text();
      const priceMatch = html.match(/"price":\s*(\d+(?:\.\d+)?)/i) || 
                         html.match(/"initial_price":\s*(\d+(?:\.\d+)?)/i) ||
                         html.match(/Price:\s*"\\?\$?(\d+(?:\.\d+)?)"/i);
      const currencyMatch = html.match(/"currency":\s*"([^"]+)"/i);

      if (priceMatch) {
        const price = parseFloat(priceMatch[1]);
        const currency = (currencyMatch ? currencyMatch[1] : 'USD').toUpperCase();
        cachedPricing = {
          price,
          currency,
          formattedPrice: `$${price.toFixed(2)}`,
          updatedAt: new Date().toISOString()
        };
        lastFetchTime = now;
        return cachedPricing;
      }
    }
  } catch (err) {
    console.warn('[Whop Pricing Fetch Warning]', err.message);
  }

  // Graceful fallback if network is slow or offline
  return cachedPricing || {
    price: 149.00,
    currency: 'USD',
    formattedPrice: '$149.00',
    fallback: true
  };
}

export default async function handler(req, res) {
  const pricing = await getWhopPricing();
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  return res.status(200).json(pricing);
}
