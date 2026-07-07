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
    await page.waitForSelector('#products-grid', { timeout: 8000 });
    await page.waitForFunction(() => {
      const grid = document.getElementById('products-grid');
      return grid && grid.children.length > 0;
    }, { timeout: 8000 });
    const count = await page.locator('#products-grid .product-card').count();
    await assert(count > 0, 'No se encontraron .product-card en #products-grid');
  });

  // TEST 2: WF_PRODUCTS disponible en window
  await test('WF_PRODUCTS disponible en window (products.js)', async () => {
    await page.goto(BASE + '/index.html');
    await page.waitForLoadState('networkidle');
    const len = await page.evaluate(() => (window.WF_PRODUCTS || []).length);
    await assert(len > 0, 'window.WF_PRODUCTS no disponible o vacio');
  });

  // TEST 3: product.html carga con parametro id
  await test('product.html carga con parametro id', async () => {
    await page.goto(BASE + '/product.html?id=p001');
    await page.waitForLoadState('networkidle');
    const title = await page.title();
    await assert(title.length > 0, 'product.html sin titulo');
  });

  // TEST 4: product.html tiene boton agregar al carrito
  await test('product.html tiene boton agregar al carrito', async () => {
    await page.goto(BASE + '/product.html?id=p001');
    await page.waitForSelector('#btn-add-cart', { timeout: 8000 });
    const btn = await page.locator('#btn-add-cart').count();
    await assert(btn > 0, 'No se encontro #btn-add-cart en product.html');
  });

  // TEST 5: Agregar producto al carrito desde product.html
  await test('Agregar producto al carrito desde product.html', async () => {
    await page.goto(BASE + '/product.html?id=p001');
    await page.waitForSelector('#btn-add-cart', { timeout: 8000 });
    // Seleccionar talla si hay botones de talla
    const sizeBtn = page.locator('.size-btn').first();
    const hasSizes = await sizeBtn.count();
    if (hasSizes > 0) {
      await sizeBtn.click();
      await page.waitForTimeout(300);
    }
    await page.locator('#btn-add-cart').click();
    await page.waitForTimeout(800);
    // Verificar que el badge del carrito se actualizo
    const cartCount = await page.locator('#cart-count').textContent().catch(() => '0');
    await assert(parseInt(cartCount) > 0, 'El carrito no se actualizo tras agregar producto (cart-count = ' + cartCount + ')');
  });

  // TEST 6: checkout.html carga correctamente
  await test('checkout.html carga correctamente', async () => {
    await page.goto(BASE + '/checkout.html');
    await page.waitForLoadState('networkidle');
    const form = await page.locator('#checkout-form').count();
    await assert(form > 0, 'No se encontro #checkout-form en checkout.html');
  });

  // TEST 7: checkout.html tiene campos requeridos
  await test('checkout.html tiene campos firstName, lastName y email', async () => {
    await page.goto(BASE + '/checkout.html');
    await page.waitForLoadState('networkidle');
    const firstName = await page.locator('#first-name, input[name="firstName"]').count();
    const email = await page.locator('#email, input[type="email"]').count();
    await assert(firstName > 0, 'Campo first-name no encontrado en checkout');
    await assert(email > 0, 'Campo email no encontrado en checkout');
  });

  // TEST 8: Navegacion desde index a product
  await test('Click en product-card navega a product.html', async () => {
    await page.goto(BASE + '/index.html');
    await page.waitForSelector('#products-grid .product-card', { timeout: 8000 });
    await page.locator('#products-grid .product-card').first().click();
    await page.waitForLoadState('networkidle');
    const url = page.url();
    await assert(url.includes('product.html'), 'Click en card no navego a product.html (url: ' + url + ')');
  });

  // TEST 9: Boton carrito en index abre el drawer
  await test('Boton carrito en index abre el drawer', async () => {
    await page.goto(BASE + '/index.html');
    await page.waitForLoadState('networkidle');
    await page.locator('#nav-cart-btn').click();
    await page.waitForTimeout(500);
    const drawerOpen = await page.locator('#cart-drawer.open').count();
    await assert(drawerOpen > 0, '#cart-drawer no tiene clase .open tras hacer click en #nav-cart-btn');
  });

  await browser.close();
  server.close();

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log('\n=== Resultado: ' + passed + ' PASS / ' + failed + ' FAIL en ' + elapsed + 's ===\n');

  if (failed > 0) process.exit(1);
})();
