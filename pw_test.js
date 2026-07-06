// ============================================================
// AVØID Store — pw_test.js
// Suite principal de tests con Playwright
// Uso: node pw_test.js  (requiere: npm i playwright)
// ============================================================
const { chromium } = require('playwright');

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5500';

const results = [];
let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log('  PASS  ' + name);
    results.push({ name, status: 'PASS' });
    passed++;
  } catch (e) {
    console.error('  FAIL  ' + name);
    console.error('         ' + e.message);
    results.push({ name, status: 'FAIL', error: e.message });
    failed++;
  }
}

async function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'Assertion failed');
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();

  // ── TEST 1: index.html carga y muestra productos
  await test('index.html — carga productos de WF_PRODUCTS', async () => {
    const page = await ctx.newPage();
    await page.goto(BASE + '/index.html');
    await page.waitForSelector('.product-card');
    const count = await page.locator('.product-card').count();
    await assert(count >= 1, 'No se renderizaron tarjetas de producto (count=' + count + ')');
    await page.close();
  });

  // ── TEST 2: filtro TEES funciona
  await test('index.html — filtro TEES', async () => {
    const page = await ctx.newPage();
    await page.goto(BASE + '/index.html');
    await page.waitForSelector('.filter-btn');
    await page.click('[data-filter="tees"]');
    await page.waitForTimeout(300);
    const cards = await page.locator('.product-card').count();
    await assert(cards >= 1, 'Filtro TEES no muestra productos');
    await page.close();
  });

  // ── TEST 3: filtro HOODIES funciona
  await test('index.html — filtro HOODIES', async () => {
    const page = await ctx.newPage();
    await page.goto(BASE + '/index.html');
    await page.waitForSelector('.filter-btn');
    await page.click('[data-filter="hoodies"]');
    await page.waitForTimeout(300);
    const cards = await page.locator('.product-card').count();
    await assert(cards >= 1, 'Filtro HOODIES no muestra productos');
    await page.close();
  });

  // ── TEST 4: abrir drawer del carrito
  await test('index.html — abrir carrito drawer', async () => {
    const page = await ctx.newPage();
    await page.goto(BASE + '/index.html');
    await page.waitForSelector('#nav-cart-btn');
    await page.click('#nav-cart-btn');
    await page.waitForSelector('#cart-drawer.open');
    const visible = await page.locator('#cart-drawer').evaluate(el => el.classList.contains('open'));
    await assert(visible, 'Drawer del carrito no se abrió');
    await page.close();
  });

  // ── TEST 5: añadir producto al carrito desde index
  await test('index.html — añadir producto al carrito', async () => {
    const page = await ctx.newPage();
    await page.goto(BASE + '/index.html');
    await page.waitForSelector('.product-card');
    await page.locator('.product-card .btn-add').first().click();
    await page.waitForTimeout(300);
    const badge = await page.locator('#cart-badge').textContent();
    await assert(parseInt(badge) >= 1, 'Badge no se actualizó tras añadir al carrito');
    await page.close();
  });

  // ── TEST 6: product.html carga producto por query param
  await test('product.html — carga producto p001', async () => {
    const page = await ctx.newPage();
    await page.goto(BASE + '/product.html?id=p001');
    await page.waitForSelector('.product-title');
    const title = await page.locator('.product-title').textContent();
    await assert(title.length > 0, 'Título del producto vacío');
    await page.close();
  });

  // ── TEST 7: selector de talla existe en product.html
  await test('product.html — selector de talla visible', async () => {
    const page = await ctx.newPage();
    await page.goto(BASE + '/product.html?id=p001');
    await page.waitForSelector('.size-btn');
    const btns = await page.locator('.size-btn').count();
    await assert(btns >= 1, 'No se encontraron botones de talla');
    await page.close();
  });

  // ── TEST 8: añadir al carrito desde product.html
  await test('product.html — botón add-to-cart funciona', async () => {
    const page = await ctx.newPage();
    await page.goto(BASE + '/product.html?id=p001');
    await page.waitForSelector('.size-btn');
    await page.locator('.size-btn').first().click();
    await page.click('#add-to-cart-btn');
    await page.waitForTimeout(300);
    const badge = await page.locator('#cart-badge').textContent();
    await assert(parseInt(badge) >= 1, 'Badge no incrementó desde product.html');
    await page.close();
  });

  // ── TEST 9: checkout.html — resumen de carrito se renderiza
  await test('checkout.html — resumen de carrito visible', async () => {
    const page = await ctx.newPage();
    // Precargar carrito via localStorage
    await page.goto(BASE + '/index.html');
    await page.evaluate(() => {
      var item = [{ uid:'test_1', id:'p001', brand:'AVØID', name:'TEST TEE', price:39.99, img:'', meta:'M', qty:1 }];
      localStorage.setItem('wf_cart_v3', JSON.stringify(item));
    });
    await page.goto(BASE + '/checkout.html');
    await page.waitForSelector('.summary-section');
    const text = await page.locator('.summary-section').textContent();
    await assert(text.includes('€'), 'El resumen no muestra precios en Euro');
    await page.close();
  });

  // ── TEST 10: checkout.html — formulario tiene campos requeridos
  await test('checkout.html — campos de formulario presentes', async () => {
    const page = await ctx.newPage();
    await page.goto(BASE + '/checkout.html');
    await page.waitForSelector('#checkout-form');
    const fields = ['#first-name', '#last-name', '#email', '#address', '#city', '#zip', '#country'];
    for (const f of fields) {
      const exists = await page.locator(f).count();
      await assert(exists > 0, 'Campo no encontrado: ' + f);
    }
    await page.close();
  });

  // ── TEST 11: checkout.html — confirmar pedido
  await test('checkout.html — completar pedido muestra confirmación', async () => {
    const page = await ctx.newPage();
    await page.goto(BASE + '/index.html');
    await page.evaluate(() => {
      var item = [{ uid:'test_2', id:'p002', brand:'AVØID', name:'TEST HOODIE', price:79.99, img:'', meta:'L', qty:1 }];
      localStorage.setItem('wf_cart_v3', JSON.stringify(item));
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
    await page.fill('#expiry', '12/26');
    await page.fill('#cvv', '123');
    await page.click('#place-order-btn');
    await page.waitForSelector('#order-confirmation');
    const visible = await page.locator('#order-confirmation').isVisible();
    await assert(visible, 'La confirmación de pedido no apareció');
    await page.close();
  });

  // ── TEST 12: WF_PRODUCTS existe en window
  await test('products.js — window.WF_PRODUCTS disponible', async () => {
    const page = await ctx.newPage();
    await page.goto(BASE + '/index.html');
    const len = await page.evaluate(() => (window.WF_PRODUCTS || []).length);
    await assert(len >= 1, 'window.WF_PRODUCTS vacío o no disponible (len=' + len + ')');
    await page.close();
  });

  await browser.close();

  console.log('\n══════════════════════════════════');
  console.log(' AVØID — Resultados: ' + passed + ' PASS / ' + failed + ' FAIL');
  console.log('══════════════════════════════════');
  if (failed > 0) process.exit(1);
})();
