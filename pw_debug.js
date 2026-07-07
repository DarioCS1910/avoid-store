// ============================================================
// AVOID Store - pw_debug.js
// Herramienta de depuracion: imprime estado DOM y carrito
// SERVIDOR HTTP INTEGRADO - NO necesita Live Server
// Uso: node pw_debug.js
// ============================================================
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5501;
const BASE = 'http://127.0.0.1:' + PORT;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let filePath = path.join(ROOT, req.url.split('?')[0]);
      if (filePath.endsWith('/') || !path.extname(filePath)) {
        filePath = path.join(ROOT, 'index.html');
      }
      const ext = path.extname(filePath);
      const mime = MIME[ext] || 'text/plain';
      fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end('Not found'); }
        else { res.writeHead(200, { 'Content-Type': mime }); res.end(data); }
      });
    });
    server.listen(PORT, '127.0.0.1', () => {
      console.log('Servidor DEBUG en ' + BASE);
      resolve(server);
    });
  });
}

(async () => {
  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('[BROWSER ERROR] ' + msg.text());
    } else {
      console.log('[BROWSER ' + msg.type().toUpperCase() + '] ' + msg.text());
    }
  });

  page.on('pageerror', err => {
    console.error('[PAGE ERROR] ' + err.message);
  });

  // --- DEBUG index.html ---
  console.log('\n--- DEBUG: index.html ---');
  await page.goto(BASE + '/index.html');
  await page.waitForTimeout(1500);

  const wfLen = await page.evaluate(() => {
    return typeof window.WF_PRODUCTS !== 'undefined' ? window.WF_PRODUCTS.length : -1;
  });
  console.log('WF_PRODUCTS length:', wfLen);

  const cartLen = await page.evaluate(() => {
    try {
      const c = JSON.parse(localStorage.getItem('avoid_cart') || '[]');
      return c.length;
    } catch(e) { return 'ERROR: ' + e.message; }
  });
  console.log('Cart en localStorage:', cartLen);

  const cards = await page.locator('.product-card, .card, [data-id]').count();
  console.log('Tarjetas de producto en DOM:', cards);

  // --- DEBUG product.html ---
  console.log('\n--- DEBUG: product.html?id=1 ---');
  await page.goto(BASE + '/product.html?id=1');
  await page.waitForTimeout(1000);
  const productTitle = await page.locator('h1, h2, .product-title, .product-name').first().textContent().catch(() => 'NO ENCONTRADO');
  console.log('Titulo producto:', productTitle.trim());

  // --- DEBUG checkout.html ---
  console.log('\n--- DEBUG: checkout.html ---');
  await page.goto(BASE + '/checkout.html');
  await page.waitForTimeout(1000);
  const formFields = await page.locator('input, select, textarea').count();
  console.log('Campos de formulario:', formFields);

  const checkoutCart = await page.evaluate(() => {
    try {
      const c = JSON.parse(localStorage.getItem('avoid_cart') || '[]');
      return JSON.stringify(c);
    } catch(e) { return 'ERROR'; }
  });
  console.log('Cart en checkout:', checkoutCart);

  await browser.close();
  server.close();
  console.log('\n--- DEBUG completado ---');
})();
