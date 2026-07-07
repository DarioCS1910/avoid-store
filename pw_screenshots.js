// ============================================================
// AVOID Store - pw_screenshots.js
// Captura pantallas de todas las paginas para revision visual
// SERVIDOR HTTP INTEGRADO - NO necesita Live Server
// Uso: node pw_screenshots.js
// Las capturas se guardan en ./screenshots/
// ============================================================
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5503;
const BASE = 'http://127.0.0.1:' + PORT;
const ROOT = __dirname;
const SHOTS_DIR = path.join(ROOT, 'screenshots');

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
      console.log('Servidor SCREENSHOTS en ' + BASE);
      resolve(server);
    });
  });
}

(async () => {
  // Crear carpeta screenshots si no existe
  if (!fs.existsSync(SHOTS_DIR)) {
    fs.mkdirSync(SHOTS_DIR, { recursive: true });
    console.log('Carpeta screenshots/ creada');
  }

  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  console.log('\n=== Capturando pantallas AVOID Store ===\n');

  // 1. index.html
  console.log('Capturando index.html...');
  await page.goto(BASE + '/index.html');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SHOTS_DIR, '01-index.png'), fullPage: true });
  console.log('  Guardado: screenshots/01-index.png');

  // 2. index.html con filtro (si existe)
  const filterBtn = page.locator('[data-filter], .filter-btn, .btn-filter').first();
  const filterVisible = await filterBtn.isVisible().catch(() => false);
  if (filterVisible) {
    await filterBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(SHOTS_DIR, '02-index-filtered.png'), fullPage: true });
    console.log('  Guardado: screenshots/02-index-filtered.png');
  }

  // 3. product.html
  console.log('Capturando product.html?id=1...');
  await page.goto(BASE + '/product.html?id=1');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SHOTS_DIR, '03-product.png'), fullPage: true });
  console.log('  Guardado: screenshots/03-product.png');

  // 4. Agregar producto y capturar carrito
  console.log('Agregando producto al carrito...');
  await page.goto(BASE + '/index.html');
  await page.waitForTimeout(1000);
  const addBtn = page.locator('button:has-text("Agregar"), .btn-add, [data-action="add"]').first();
  const addVisible = await addBtn.isVisible().catch(() => false);
  if (addVisible) {
    await addBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SHOTS_DIR, '04-index-with-cart.png'), fullPage: true });
    console.log('  Guardado: screenshots/04-index-with-cart.png');
  }

  // 5. checkout.html
  console.log('Capturando checkout.html...');
  await page.goto(BASE + '/checkout.html');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SHOTS_DIR, '05-checkout.png'), fullPage: true });
  console.log('  Guardado: screenshots/05-checkout.png');

  // 6. checkout.html con formulario relleno
  await page.locator('input[name="name"], input[name="nombre"], #name, #nombre').first().fill('Test Usuario').catch(() => {});
  await page.locator('input[type="email"], #email').first().fill('test@avoid.com').catch(() => {});
  await page.locator('input[name="address"], input[name="direccion"], #address, #direccion').first().fill('Calle Test 123').catch(() => {});
  await page.screenshot({ path: path.join(SHOTS_DIR, '06-checkout-filled.png'), fullPage: true });
  console.log('  Guardado: screenshots/06-checkout-filled.png');

  await browser.close();
  server.close();

  // Listar archivos generados
  const files = fs.readdirSync(SHOTS_DIR).filter(f => f.endsWith('.png'));
  console.log('\n=== Capturas generadas (' + files.length + ') ===');
  files.forEach(f => console.log('  screenshots/' + f));
  console.log('\nListo.');
})();
