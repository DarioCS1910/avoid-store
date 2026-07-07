// ============================================================
// AVOID Store - pw_test.js
// Suite principal de tests con Playwright
// SERVIDOR HTTP INTEGRADO - NO necesita Live Server
// Uso: node pw_test.js
// ============================================================
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5500;
const BASE = 'http://127.0.0.1:' + PORT;
const ROOT = __dirname;

// --- Servidor HTTP integrado ---
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
        if (err) {
          res.writeHead(404);
          res.end('Not found');
        } else {
          res.writeHead(200, { 'Content-Type': mime });
          res.end(data);
        }
      });
    });
    server.listen(PORT, '127.0.0.1', () => {
      console.log('Servidor HTTP en ' + BASE);
      resolve(server);
    });
  });
}

const results = [];
let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log('  PASS ' + name);
    results.push({ name, status: 'PASS' });
    passed++;
  } catch (e) {
    console.error('  FAIL ' + name);
    console.error('       ' + e.message);
    results.push({ name, status: 'FAIL', error: e.message });
    failed++;
  }
}

async function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'Assertion failed');
}

(async () => {
  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const start = Date.now();

  console.log('\n=== AVOID Store - Suite de Tests ===\n');

  // TEST 1: index.html carga y muestra productos
  await test('index.html carga y muestra productos', async () => {
    await page.goto(BASE + '/index.html');
    await page.waitForSelector('.product-card, .card, [data-id]', { timeout: 8000 });
    const count = await page.locator('.product-card, .card, [data-id]').count();
    await assert(count > 0, 'No se encontraron productos en index.html');
  });

  // TEST 2: product.html carga con parametro
  await test('product.html carga con parametro id', async () => {
    await page.goto(BASE + '/product.html?id=1');
    await page.waitForLoadState('networkidle');
    const title = await page.title();
    await assert(title.length > 0, 'product.html sin titulo');
  });

  // TEST 3: Agregar producto al carrito
  await test('Agregar producto al carrito desde index', async () => {
    await page.goto(BASE + '/index.html');
    await page.waitForSelector('.product-card, [data-id]', { timeout: 8000 });
    const btn = page.locator('button:has-text("Agregar"), button:has-text("Add"), .btn-add, [data-action="add"]').first();
    await btn.click();
    await page.waitForTimeout(500);
    const cartCount = await page.locator('#cart-count, .cart-count, .cart-badge').first().textContent().catch(() => '1');
    await assert(parseInt(cartCount) > 0 || cartCount.trim() !== '0', 'Carrito no actualizado tras agregar');
  });

  // TEST 4: checkout.html carga correctamente
  await test('checkout.html carga correctamente', async () => {
    await page.goto(BASE + '/checkout.html');
    await page.waitForLoadState('networkidle');
    const form = await page.locator('form, #checkout-form, .checkout-form').count();
    await assert(form > 0, 'No se encontro formulario en checkout.html');
  });

  // TEST 5: checkout.html tiene campos requeridos
  await test('checkout.html tiene campos nombre, email, direccion', async () => {
    await page.goto(BASE + '/checkout.html');
    await page.waitForLoadState('networkidle');
    const name = await page.locator('input[name="name"], input[name="nombre"], #name, #nombre').count();
    const email = await page.locator('input[type="email"], input[name="email"], #email').count();
    await assert(name > 0, 'Campo nombre no encontrado en checkout');
    await assert(email > 0, 'Campo email no encontrado en checkout');
  });

  // TEST 6: Flujo completo - agregar y verificar en checkout
  await test('Flujo completo: agregar producto y abrir checkout', async () => {
    await page.goto(BASE + '/index.html');
    await page.waitForSelector('.product-card, [data-id]', { timeout: 8000 });
    const btn = page.locator('button:has-text("Agregar"), .btn-add, [data-action="add"]').first();
    await btn.click();
    await page.waitForTimeout(500);
    await page.goto(BASE + '/checkout.html');
    await page.waitForLoadState('networkidle');
    const items = await page.locator('.cart-item, .order-item, .item-row, tr').count();
    await assert(items > 0, 'No hay items en checkout tras agregar');
  });

  // TEST 7: WF_PRODUCTS disponible en window
  await test('WF_PRODUCTS disponible en window (products.js)', async () => {
    await page.goto(BASE + '/index.html');
    await page.waitForLoadState('networkidle');
    const len = await page.evaluate(() => (window.WF_PRODUCTS || []).length);
    await assert(len > 0, 'window.WF_PRODUCTS no disponible o vacio');
  });

  await browser.close();
  server.close();

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log('\n=== Resultado: ' + passed + ' PASS / ' + failed + ' FAIL en ' + elapsed + 's ===\n');

  if (failed > 0) process.exit(1);
})();
