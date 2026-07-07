// ============================================================
// AVOID Store - pw_fast.js
// Smoke test rapido - SERVIDOR HTTP INTEGRADO
// NO necesita Live Server ni nada externo
// Uso: node pw_fast.js
// ============================================================
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 7890;
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
      const ext = path.extname(filePath).toLowerCase();
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not found: ' + req.url);
          return;
        }
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
        res.end(data);
      });
    });
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

const CHECKS = [
  {
    name: 'index.html - carga productos',
    url: BASE + '/index.html',
    selector: '.product-card',
    check: async (page) => {
      const n = await page.locator('.product-card').count();
      if (n < 1) throw new Error('Sin product-cards (n=' + n + ')');
      const wf = await page.evaluate(() => (window.WF_PRODUCTS || []).length);
      if (wf < 1) throw new Error('window.WF_PRODUCTS vacio');
      const badge = await page.locator('#cart-badge').count();
      if (badge < 1) throw new Error('#cart-badge no encontrado');
    }
  },
  {
    name: 'index.html - filtros ALL/TEES/HOODIES/PANTS/ACCESSORIES',
    url: BASE + '/index.html',
    selector: '.filter-btn',
    check: async (page) => {
      const filters = ['tees', 'hoodies', 'pants', 'accessories'];
      for (const f of filters) {
        const btn = await page.locator('[data-filter="' + f + '"]').count();
        if (btn < 1) throw new Error('Filtro [data-filter="' + f + '"] no encontrado');
      }
    }
  },
  {
    name: 'index.html - drawer del carrito se abre',
    url: BASE + '/index.html',
    selector: '#nav-cart-btn',
    check: async (page) => {
      await page.click('#nav-cart-btn');
      await page.waitForTimeout(300);
      const open = await page.locator('#cart-drawer.open').count();
      if (open < 1) throw new Error('#cart-drawer no abrio');
    }
  },
  {
    name: 'product.html - carga p001 con titulo y tallas',
    url: BASE + '/product.html?id=p001',
    selector: '.product-title',
    check: async (page) => {
      const title = await page.locator('.product-title').textContent();
      if (!title || title.trim().length === 0) throw new Error('Titulo vacio');
      const sizes = await page.locator('.size-btn').count();
      if (sizes < 1) throw new Error('Sin botones de talla');
      const btn = await page.locator('#add-to-cart-btn').count();
      if (btn < 1) throw new Error('#add-to-cart-btn no encontrado');
    }
  },
  {
    name: 'product.html - add to cart actualiza badge',
    url: BASE + '/product.html?id=p001',
    selector: '.size-btn',
    check: async (page) => {
      await page.locator('.size-btn').first().click();
      await page.click('#add-to-cart-btn');
      await page.waitForTimeout(200);
      const badge = await page.locator('#cart-badge').textContent();
      if (parseInt(badge) < 1) throw new Error('Badge no incremento: ' + badge);
    }
  },
  {
    name: 'checkout.html - todos los campos del formulario presentes',
    url: BASE + '/checkout.html',
    selector: '#checkout-form',
    check: async (page) => {
      const fields = ['#first-name','#last-name','#email','#address','#city','#zip','#country','#card-number','#expiry','#cvv','#place-order-btn'];
      for (const f of fields) {
        const n = await page.locator(f).count();
        if (n < 1) throw new Error(f + ' no encontrado');
      }
    }
  },
  {
    name: 'checkout.html - completar pedido muestra confirmacion',
    url: null,
    selector: null,
    check: async (page) => {
      await page.goto(BASE + '/index.html');
      await page.evaluate(() => {
        localStorage.setItem('wf_cart_v3', JSON.stringify([
          { uid:'fast_1', id:'p001', brand:'AVOID', name:'TEE', price:39.99, img:'', meta:'M', qty:1 }
        ]));
      });
      await page.goto(BASE + '/checkout.html');
      await page.waitForSelector('#checkout-form');
      await page.fill('#first-name', 'Dario');
      await page.fill('#last-name', 'CS');
      await page.fill('#email', 'dario@avoid.store');
      await page.fill('#address', 'Calle Mayor 1');
      await page.fill('#city', 'Madrid');
      await page.fill('#zip', '28001');
      await page.selectOption('#country', 'Spain');
      await page.fill('#card-number', '4111111111111111');
      await page.fill('#expiry', '12/27');
      await page.fill('#cvv', '123');
      await page.click('#place-order-btn');
      await page.waitForSelector('#order-confirmation', { timeout: 5000 });
      const visible = await page.locator('#order-confirmation').isVisible();
      if (!visible) throw new Error('#order-confirmation no visible');
    }
  }
];

(async () => {
  console.log('\n=== AVOID Store - pw_fast.js ===');
  console.log('Iniciando servidor en ' + BASE + '...\n');

  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  let passed = 0;
  let failed = 0;
  const start = Date.now();

  for (const c of CHECKS) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    try {
      if (c.url) {
        await page.goto(c.url);
        if (c.selector) await page.waitForSelector(c.selector, { timeout: 5000 });
      }
      await c.check(page);
      console.log('  PASS  ' + c.name);
      passed++;
    } catch (e) {
      console.error('  FAIL  ' + c.name);
      console.error('         ' + e.message);
      failed++;
    }
    await ctx.close();
  }

  await browser.close();
  server.close();

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log('\n=== Resultado: ' + passed + ' PASS / ' + failed + ' FAIL en ' + elapsed + 's ===\n');
  if (failed > 0) process.exit(1);
})();
