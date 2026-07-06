// ============================================================
// AVOID Store - playwright_avoid.js
// Suite completa con describe/test blocks estilo Jest
// Compatible con @playwright/test runner
// Uso: npx playwright test playwright_avoid.js
// ============================================================
const { test, expect } = require('@playwright/test');

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5500';

// Helper para precargar carrito via localStorage
async function preloadCart(page, items) {
  await page.goto(BASE + '/index.html');
  await page.evaluate((cartItems) => {
    localStorage.setItem('wf_cart_v3', JSON.stringify(cartItems));
  }, items);
}

const SAMPLE_ITEM = [
  { uid: 'test_uid_1', id: 'p001', brand: 'AVOID', name: 'AVOID TEE BLACK', price: 39.99, img: '', meta: 'M', qty: 1 }
];

// ============================================================
// BLOQUE 1: INDEX.HTML
// ============================================================
test.describe('index.html', () => {

  test('carga y muestra tarjetas de producto', async ({ page }) => {
    await page.goto(BASE + '/index.html');
    await page.waitForSelector('.product-card');
    const count = await page.locator('.product-card').count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('window.WF_PRODUCTS disponible y no vacio', async ({ page }) => {
    await page.goto(BASE + '/index.html');
    const len = await page.evaluate(() => (window.WF_PRODUCTS || []).length);
    expect(len).toBeGreaterThanOrEqual(1);
  });

  test('filtro ALL muestra todos los productos', async ({ page }) => {
    await page.goto(BASE + '/index.html');
    await page.waitForSelector('[data-filter="all"]');
    await page.click('[data-filter="all"]');
    await page.waitForTimeout(300);
    const total = await page.locator('.product-card').count();
    expect(total).toBeGreaterThanOrEqual(1);
  });

  test('filtro TEES filtra correctamente', async ({ page }) => {
    await page.goto(BASE + '/index.html');
    await page.waitForSelector('[data-filter="tees"]');
    await page.click('[data-filter="tees"]');
    await page.waitForTimeout(300);
    const count = await page.locator('.product-card').count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('filtro HOODIES filtra correctamente', async ({ page }) => {
    await page.goto(BASE + '/index.html');
    await page.click('[data-filter="hoodies"]');
    await page.waitForTimeout(300);
    const count = await page.locator('.product-card').count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('filtro PANTS filtra correctamente', async ({ page }) => {
    await page.goto(BASE + '/index.html');
    await page.click('[data-filter="pants"]');
    await page.waitForTimeout(300);
    const count = await page.locator('.product-card').count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('filtro ACCESSORIES filtra correctamente', async ({ page }) => {
    await page.goto(BASE + '/index.html');
    await page.click('[data-filter="accessories"]');
    await page.waitForTimeout(300);
    const count = await page.locator('.product-card').count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('boton carrito abre drawer', async ({ page }) => {
    await page.goto(BASE + '/index.html');
    await page.waitForSelector('#nav-cart-btn');
    await page.click('#nav-cart-btn');
    await expect(page.locator('#cart-drawer')).toHaveClass(/open/);
  });

  test('badge del carrito se actualiza al anadir producto', async ({ page }) => {
    await page.goto(BASE + '/index.html');
    await page.waitForSelector('.product-card .btn-add');
    await page.locator('.product-card .btn-add').first().click();
    await page.waitForTimeout(300);
    const badge = await page.locator('#cart-badge').textContent();
    expect(parseInt(badge)).toBeGreaterThanOrEqual(1);
  });

  test('carrito drawer muestra item tras anadir', async ({ page }) => {
    await page.goto(BASE + '/index.html');
    await page.waitForSelector('.product-card .btn-add');
    await page.locator('.product-card .btn-add').first().click();
    await page.waitForTimeout(300);
    await page.click('#nav-cart-btn');
    await page.waitForSelector('#cart-drawer.open');
    const items = await page.locator('.ci').count();
    expect(items).toBeGreaterThanOrEqual(1);
  });

});

// ============================================================
// BLOQUE 2: PRODUCT.HTML
// ============================================================
test.describe('product.html', () => {

  test('carga producto p001 con titulo', async ({ page }) => {
    await page.goto(BASE + '/product.html?id=p001');
    await page.waitForSelector('.product-title');
    const title = await page.locator('.product-title').textContent();
    expect(title.trim().length).toBeGreaterThan(0);
  });

  test('muestra imagen del producto', async ({ page }) => {
    await page.goto(BASE + '/product.html?id=p001');
    const imgSrc = await page.locator('.product-img').getAttribute('src').catch(() => '');
    expect(imgSrc).not.toBe('');
  });

  test('muestra precio en formato Euro', async ({ page }) => {
    await page.goto(BASE + '/product.html?id=p001');
    const priceText = await page.locator('.product-price').textContent().catch(() => '');
    expect(priceText).toContain('EUR');
  });

  test('botones de talla visibles', async ({ page }) => {
    await page.goto(BASE + '/product.html?id=p001');
    await page.waitForSelector('.size-btn');
    const btns = await page.locator('.size-btn').count();
    expect(btns).toBeGreaterThanOrEqual(1);
  });

  test('boton add-to-cart existe', async ({ page }) => {
    await page.goto(BASE + '/product.html?id=p001');
    await expect(page.locator('#add-to-cart-btn')).toBeVisible();
  });

  test('seleccionar talla y anadir al carrito', async ({ page }) => {
    await page.goto(BASE + '/product.html?id=p001');
    await page.waitForSelector('.size-btn');
    await page.locator('.size-btn').first().click();
    await page.click('#add-to-cart-btn');
    await page.waitForTimeout(300);
    const badge = await page.locator('#cart-badge').textContent();
    expect(parseInt(badge)).toBeGreaterThanOrEqual(1);
  });

  test('breadcrumb tiene link a coleccion', async ({ page }) => {
    await page.goto(BASE + '/product.html?id=p001');
    const breadcrumb = await page.locator('.breadcrumb a').count();
    expect(breadcrumb).toBeGreaterThanOrEqual(1);
  });

  test('producto p001 tiene descripcion', async ({ page }) => {
    await page.goto(BASE + '/product.html?id=p001');
    const desc = await page.locator('.product-desc').textContent().catch(() => '');
    expect(desc.length).toBeGreaterThan(0);
  });

});

// ============================================================
// BLOQUE 3: CHECKOUT.HTML
// ============================================================
test.describe('checkout.html', () => {

  test('campos de formulario presentes', async ({ page }) => {
    await page.goto(BASE + '/checkout.html');
    await page.waitForSelector('#checkout-form');
    for (const sel of ['#first-name', '#last-name', '#email', '#address', '#city', '#zip', '#country']) {
      await expect(page.locator(sel)).toBeVisible();
    }
  });

  test('campos de pago presentes', async ({ page }) => {
    await page.goto(BASE + '/checkout.html');
    for (const sel of ['#card-number', '#expiry', '#cvv']) {
      await expect(page.locator(sel)).toBeVisible();
    }
  });

  test('resumen muestra items del carrito', async ({ page }) => {
    await preloadCart(page, SAMPLE_ITEM);
    await page.goto(BASE + '/checkout.html');
    await page.waitForSelector('.summary-section');
    const text = await page.locator('.summary-section').textContent();
    expect(text).toContain('EUR');
  });

  test('total del carrito correcto', async ({ page }) => {
    await preloadCart(page, SAMPLE_ITEM);
    await page.goto(BASE + '/checkout.html');
    await page.waitForSelector('#cart-total');
    const total = await page.locator('#cart-total').textContent();
    expect(total).toContain('39');
  });

  test('#place-order-btn existe', async ({ page }) => {
    await preloadCart(page, SAMPLE_ITEM);
    await page.goto(BASE + '/checkout.html');
    await expect(page.locator('#place-order-btn')).toBeVisible();
  });

  test('completar pedido muestra confirmacion', async ({ page }) => {
    await preloadCart(page, SAMPLE_ITEM);
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
    await expect(page.locator('#order-confirmation')).toBeVisible();
  });

  test('nota de envio gratis aparece con >= 150 EUR', async ({ page }) => {
    const bigCart = [
      { uid: 'big_1', id: 'p007', brand: 'AVOID', name: 'HOODIE', price: 79.99, img: '', meta: 'M', qty: 2 }
    ];
    await preloadCart(page, bigCart);
    await page.goto(BASE + '/checkout.html');
    const note = await page.locator('#cart-ship-note').textContent().catch(() => '');
    expect(note).toContain('gratis');
  });

});

// ============================================================
// BLOQUE 4: CARRITO - PERSISTENCIA
// ============================================================
test.describe('Cart - persistencia', () => {

  test('carrito persiste entre paginas via localStorage', async ({ page }) => {
    await page.goto(BASE + '/index.html');
    await page.waitForSelector('.product-card .btn-add');
    await page.locator('.product-card .btn-add').first().click();
    await page.waitForTimeout(300);
    const cartBefore = await page.evaluate(() => JSON.parse(localStorage.getItem('wf_cart_v3') || '[]'));
    expect(cartBefore.length).toBeGreaterThanOrEqual(1);

    await page.goto(BASE + '/checkout.html');
    const cartAfter = await page.evaluate(() => (window.WFCart || []).length);
    expect(cartAfter).toBeGreaterThanOrEqual(1);
  });

  test('clearCart vacia el carrito', async ({ page }) => {
    await preloadCart(page, SAMPLE_ITEM);
    await page.goto(BASE + '/index.html');
    await page.evaluate(() => window.clearCart());
    const cart = await page.evaluate(() => (window.WFCart || []).length);
    expect(cart).toBe(0);
  });

});
