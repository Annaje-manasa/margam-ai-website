import https from 'node:https';

https.get('https://motion.blizmatt.com/', res => {
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    // Find c571121 and its parent container(s)
    const idx = html.indexOf('c571121');
    console.log('c571121 index:', idx);
    // Print 1000 chars before and 2000 chars after
    console.log('=== SURROUNDING HTML ===');
    console.log(html.slice(Math.max(0, idx - 800), idx + 2500));
  });
}).on('error', err => console.error(err));

