// ============================================================
// AVOID Store - pw_debug2.js
// Debug avanzado: valida flujo completo add-to-cart -> checkout
// Uso: node pw_debug2.js  (requiere: npm i playwright)
// ============================================================
const { chromium } = require('playwright');

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5500';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('[console.error] ' + msg.text());
  });

  console.log('=== pw_debug2.js: Flujo completo AVOID Store ===\n');

  // PASO 1: Cargar index.html y verificar productos
  console.log('[1] Cargando index.html...');
  await page.goto(BASE + '/index.html');
  await page.waitForTimeout(800);
  const numProds = await page.locator('.product-card').count();
  console.log('    Productos renderizados: ' + numProds);

  // PASO 2: Aplicar filtro ACCESSORIES
  console.log('[2] Aplicando filtro ACCESSORIES...');
  const accBtn = page.locator('[data-filter="accessories"]');
  const accCount = await accBtn.count();
  if (accCount > 0) {
    await accBtn.click();
    await page.waitForTimeout(400);
    const filtered = await page.locator('.product-card').count();
    console.log('    Productos en ACCESSORIES: ' + filtered);
  } else {
    console.log('    WARN: no se encontro filtro [data-filter="accessories"]');
  }

  // PASO 3: Restaurar filtro ALL y anadir producto al carrito
  console.log('[3] Volviendo a ALL y anadiendo primer producto...');
  await page.locator('[data-filter="all"]').click();
  await page.waitForTimeout(400);

  const addBtns = page.locator('.product-card .btn-add');
  const addCount = await addBtns.count();
  console.log('    Botones .btn-add disponibles: ' + addCount);

  if (addCount > 0) {
    await addBtns.first().click();
    await page.waitForTimeout(300);
    const badge = await page.locator('#cart-badge').textContent().catch(() => '?');
    console.log('    Badge carrito tras anadir: ' + badge);
  } else {
    console.log('    WARN: no hay botones .btn-add en index.html');
  }

  // PASO 4: Abrir y cerrar drawer del carrito
  console.log('[4] Abriendo drawer del carrito...');
  await page.locator('#nav-cart-btn').click().catch(() => console.log('    WARN: #nav-cart-btn no encontrado'));
  await page.waitForTimeout(300);
  const drawerOpen = await page.locator('#cart-drawer.open').count();
  console.log('    Drawer abierto: ' + (drawerOpen > 0 ? 'SI' : 'NO'));
  if (drawerOpen > 0) {
    await page.locator('#cart-close').click().catch(() => {});
    await page.waitForTimeout(200);
    console.log('    Drawer cerrado.');
  }

  // PASO 5: Navegar a product.html?id=p002
  console.log('[5] Navegando a product.html?id=p002...');
  await page.goto(BASE + '/product.html?id=p002');
  await page.waitForTimeout(800);

  const ptitle = await page.locator('.product-title').textContent().catch(() => '(no encontrado)');
  console.log('    Titulo producto: ' + ptitle.trim());

  const pimg = await page.locator('.product-img').getAttribute('src').catch(() => '(sin img)');
  console.log('    Imagen src: ' + pimg);

  const pSizes = await page.locator('.size-btn').count();
  console.log('    Tallas disponibles: ' + pSizes);

  if (pSizes > 0) {
    await page.locator('.size-btn').nth(1).click().catch(() => {});
    console.log('    Talla seleccionada (index 1).');
  }

  const addToCartBtn = await page.locator('#add-to-cart-btn').count();
  if (addToCartBtn > 0) {
    await page.locator('#add-to-cart-btn').click();
    await page.waitForTimeout(300);
    const badge2 = await page.locator('#cart-badge').textContent().catch(() => '?');
    console.log('    Badge tras anadir desde product.html: ' + badge2);
  } else {
    console.log('    WARN: #add-to-cart-btn no encontrado en product.html');
  }

  // PASO 6: Ir a checkout.html via goToCheckout
  console.log('[6] Navegando a checkout.html...');
  await page.goto(BASE + '/checkout.html');
  await page.waitForTimeout(800);

  const cartWFLen = await page.evaluate(() => (window.WFCart || []).length);
  console.log('    window.WFCart.length en checkout: ' + cartWFLen);

  const summaryText = await page.locator('.summary-section').textContent().catch(() => '');
  const hasEuro = summaryText.includes('EUR') || summaryText.includes('\u20ac');
  console.log('    Resumen contiene precio Euro: ' + (hasEuro ? 'SI' : 'NO'));

  // PASO 7: Rellenar y enviar formulario
  console.log('[7] Rellenando formulario de checkout...');
  await page.fill('#first-name', 'Test').catch(() => console.log('    WARN: #first-name no encontrado'));
  await page.fill('#last-name', 'User').catch(() => {});
  await page.fill('#email', 'test@avoid.store').catch(() => {});
  await page.fill('#address', 'Calle Test 42').catch(() => {});
  await page.fill('#city', 'Barcelona').catch(() => {});
  await page.fill('#zip', '08001').catch(() => {});
  await page.selectOption('#country', 'Spain').catch(() => {});
  await page.fill('#card-number', '4111111111111111').catch(() => {});
  await page.fill('#expiry', '11/27').catch(() => {});
  await page.fill('#cvv', '456').catch(() => {});

  const placeBtn = await page.locator('#place-order-btn').count();
  console.log('    #place-order-btn disponible: ' + (placeBtn > 0 ? 'SI' : 'NO'));

  if (placeBtn > 0) {
    const isDisabled = await page.locator('#place-order-btn').getAttribute('disabled');
    console.log('    Boton deshabilitado: ' + (isDisabled !== null ? 'SI' : 'NO'));
    await page.locator('#place-order-btn').click({ force: true });
    await page.waitForTimeout(500);
    const confirmed = await page.locator('#order-confirmation').isVisible().catch(() => false);
    console.log('    Confirmacion de pedido visible: ' + (confirmed ? 'SI' : 'NO'));
  }

  // Resumen de errores de consola/JS
  console.log('\n=== Errores de consola/JS detectados: ' + errors.length + ' ===');
  errors.forEach((e, i) => console.error('  [' + (i + 1) + '] ' + e));

  await browser.close();
  console.log('\n[pw_debug2.js] Completado.');
})();
