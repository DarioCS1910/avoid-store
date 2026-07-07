// ============================================================
// AVOID Store - pw_fast.js
// Tests rapidos (5 checks esenciales) con Playwright
// SERVIDOR HTTP INTEGRADO - NO necesita Live Server
// Uso: node pw_fast.js
// ============================================================
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5502;
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
      console.log('Servidor en ' + BASE);
      resolve(server);
    });
  });
}

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log('  PASS ' + name);
    passed++;
  } catch (e) {
    console.error('  FAIL ' + name + ' -> ' + e.message);
    failed++;
  }
}

async function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'Assertion failed');
}

(async () => {
  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const start = Date.now();

  console.log('\n=== AVOID Store - Tests Rapidos ===\n');

  // CHECK 1: index.html carga con productos
  await test('index.html carga con productos', async () => {
    await page.goto(BASE + '/index.html');
    await page.waitForFunction(() => {
      const grid = document.getElementById('products-grid');
      return grid && grid.children.length > 0;
    }, { timeout: 8000 });
    const count = await page.locator('#products-grid .product-card').count();
    await assert(count > 0, 'Sin product-cards en #products-grid');
  });

  // CHECK 2: WF_PRODUCTS en window
  await test('WF_PRODUCTS en window', async () => {
    await page.goto(BASE + '/index.html');
    await page.waitForLoadState('networkidle');
    const len = await page.evaluate(() => (window.WF_PRODUCTS || []).length);
    await assert(len > 0, 'window.WF_PRODUCTS vacio o no existe');
  });

  // CHECK 3: product.html carga
  await test('product.html carga', async () => {
    await page.goto(BASE + '/product.html?id=p001');
    await page.waitForSelector('#btn-add-cart', { timeout: 8000 });
    const btn = await page.locator('#btn-add-cart').count();
    await assert(btn > 0, 'No existe #btn-add-cart en product.html');
  });

  // CHECK 4: checkout.html tiene formulario
  await test('checkout.html tiene formulario', async () => {
    await page.goto(BASE + '/checkout.html');
    await page.waitForLoadState('networkidle');
    const form = await page.locator('#checkout-form').count();
    await assert(form > 0, 'No existe #checkout-form en checkout.html');
  });

  // CHECK 5: boton carrito abre drawer
  await test('Boton carrito abre drawer en index', async () => {
    await page.goto(BASE + '/index.html');
    await page.waitForLoadState('networkidle');
    await page.locator('#nav-cart-btn').click();
    await page.waitForTimeout(500);
    const open = await page.locator('#cart-drawer.open').count();
    await assert(open > 0, '#cart-drawer no tiene clase .open');
  });

  await browser.close();
  server.close();

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log('\n=== ' + passed + ' PASS / ' + failed + ' FAIL en ' + elapsed + 's ===\n');

  if (failed > 0) process.exit(1);
})();
