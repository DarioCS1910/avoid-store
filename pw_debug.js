// ============================================================
// AVOID Store - pw_debug.js
// Herramienta de depuracion: imprime estado DOM y carrito
// Uso: node pw_debug.js  (requiere: npm i playwright)
// ============================================================
const { chromium } = require('playwright');

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5500';

(async () => {
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

  // --- DEBUG index.html
  console.log('\n--- DEBUG: index.html');
  await page.goto(BASE + '/index.html');
  await page.waitForTimeout(1000);

  const wfLen = await page.evaluate(() => {
    return typeof window.WF_PRODUCTS !== 'undefined' ? window.WF_PRODUCTS.length : -1;
  });
  console.log('  window.WF_PRODUCTS.length = ' + wfLen);

  const cartLen = await page.evaluate(() => {
    return typeof window.WFCart !== 'undefined' ? window.WFCart.length : -1;
  });
  console.log('  window.WFCart.length      = ' + cartLen);

  const productCards = await page.locator('.product-card').count();
  console.log('  .product-card renderizadas = ' + productCards);

  const filterBtns = await page.locator('.filter-btn').count();
  console.log('  .filter-btn encontrados    = ' + filterBtns);

  const cartDrawer = await page.locator('#cart-drawer').count();
  console.log('  #cart-drawer existe        = ' + (cartDrawer > 0 ? 'Si' : 'No'));

  // --- DEBUG product.html?id=p001
  console.log('\n--- DEBUG: product.html?id=p001');
  await page.goto(BASE + '/product.html?id=p001');
  await page.waitForTimeout(1000);

  const prodTitle = await page.locator('.product-title').count();
  console.log('  .product-title existe      = ' + (prodTitle > 0 ? 'Si' : 'No'));

  if (prodTitle > 0) {
    const titleText = await page.locator('.product-title').textContent();
    console.log('  Contenido de .product-title = "' + titleText.trim() + '"');
  }

  const sizeBtns = await page.locator('.size-btn').count();
  console.log('  .size-btn encontrados      = ' + sizeBtns);

  const addBtn = await page.locator('#add-to-cart-btn').count();
  console.log('  #add-to-cart-btn existe    = ' + (addBtn > 0 ? 'Si' : 'No'));

  // --- DEBUG checkout.html
  console.log('\n--- DEBUG: checkout.html');
  await page.goto(BASE + '/checkout.html');
  await page.waitForTimeout(1000);

  const form = await page.locator('#checkout-form').count();
  console.log('  #checkout-form existe      = ' + (form > 0 ? 'Si' : 'No'));

  const summary = await page.locator('.summary-section').count();
  console.log('  .summary-section existe    = ' + (summary > 0 ? 'Si' : 'No'));

  const placeBtn = await page.locator('#place-order-btn').count();
  console.log('  #place-order-btn existe    = ' + (placeBtn > 0 ? 'Si' : 'No'));

  console.log('\n--- IDs clave en checkout.html:');
  const ids = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[id]')).map(el => el.id);
  });
  ids.forEach(id => console.log('  #' + id));

  await browser.close();
  console.log('\n[pw_debug.js] Depuracion completa.');
})();
