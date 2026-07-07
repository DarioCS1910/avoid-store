// ============================================================
// AVOID Store - pw_debug2.js
// Herramienta de depuracion avanzada: flujo completo con carrito
// SERVIDOR HTTP INTEGRADO - NO necesita Live Server
// Uso: node pw_debug2.js
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
      console.log('Servidor DEBUG2 en ' + BASE);
      resolve(server);
    });
  });
}

(async () => {
  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') console.error('[BROWSER ERROR] ' + msg.text());
  });
  page.on('pageerror', err => console.error('[PAGE ERROR] ' + err.message));

  console.log('\n=== DEBUG2: Flujo completo de compra ===\n');

  // Paso 1: ir a index.html
  console.log('Paso 1: Cargando index.html...');
  await page.goto(BASE + '/index.html');
  await page.waitForTimeout(1500);

  const products = await page.locator('.product-card, .card, [data-id]').count();
  console.log('  Productos encontrados:', products);

  const wfLen = await page.evaluate(() =>
    typeof window.WF_PRODUCTS !== 'undefined' ? window.WF_PRODUCTS.length : -1
  );
  console.log('  WF_PRODUCTS.length:', wfLen);

  // Paso 2: agregar primer producto
  console.log('\nPaso 2: Agregando primer producto al carrito...');
  const addBtn = page.locator('button:has-text("Agregar"), button:has-text("Add"), .btn-add, [data-action="add"]').first();
  const btnVisible = await addBtn.isVisible().catch(() => false);
  if (btnVisible) {
    await addBtn.click();
    await page.waitForTimeout(500);
    console.log('  Boton de agregar clickeado OK');
  } else {
    console.log('  AVISO: boton agregar no visible, intentando click en tarjeta...');
    await page.locator('.product-card, [data-id]').first().click();
    await page.waitForTimeout(500);
  }

  const cartState = await page.evaluate(() => {
    try {
      return JSON.parse(localStorage.getItem('avoid_cart') || '[]');
    } catch(e) { return []; }
  });
  console.log('  Cart tras agregar:', JSON.stringify(cartState));

  // Paso 3: ir a product.html
  console.log('\nPaso 3: Cargando product.html?id=1...');
  await page.goto(BASE + '/product.html?id=1');
  await page.waitForTimeout(1000);
  const pTitle = await page.locator('h1, h2, .product-title').first().textContent().catch(() => 'N/A');
  console.log('  Titulo de producto:', pTitle.trim());

  // Paso 4: ir a checkout.html
  console.log('\nPaso 4: Cargando checkout.html...');
  await page.goto(BASE + '/checkout.html');
  await page.waitForTimeout(1500);

  const fields = await page.locator('input, select, textarea').count();
  console.log('  Campos del formulario:', fields);

  const orderItems = await page.locator('.cart-item, .order-item, .item-row, tbody tr').count();
  console.log('  Items en orden/tabla:', orderItems);

  const total = await page.locator('.total, .order-total, #total, [class*="total"]').first().textContent().catch(() => 'N/A');
  console.log('  Total mostrado:', total.trim());

  // Paso 5: intentar submit del formulario
  console.log('\nPaso 5: Rellenando y enviando formulario...');
  await page.locator('input[name="name"], input[name="nombre"], #name, #nombre').first().fill('Test Usuario').catch(() => {});
  await page.locator('input[type="email"], #email').first().fill('test@avoid.com').catch(() => {});
  await page.locator('input[name="address"], input[name="direccion"], #address, #direccion').first().fill('Calle Test 123').catch(() => {});

  const submitBtn = page.locator('button[type="submit"], input[type="submit"], .btn-submit, #btn-order').first();
  const submitVisible = await submitBtn.isVisible().catch(() => false);
  if (submitVisible) {
    await submitBtn.click();
    await page.waitForTimeout(1000);
    console.log('  Formulario enviado');
    const confirmation = await page.locator('.confirmation, .success, #confirmation, [class*="confirm"]').count();
    console.log('  Mensaje de confirmacion:', confirmation > 0 ? 'SI' : 'NO');
  } else {
    console.log('  AVISO: boton submit no encontrado');
  }

  await browser.close();
  server.close();
  console.log('\n=== DEBUG2 completado ===');
})();
