// ============================================================
// AVOID Store - pw_screenshots.js
// Toma capturas de pantalla de todas las paginas
// Uso: node pw_screenshots.js  (requiere: npm i playwright)
// Capturas guardadas en: screenshots/
// ============================================================
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5500';
const OUT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log('Directorio creado: ' + OUT_DIR);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  async function snap(name, setup) {
    try {
      await setup(page);
      await page.waitForTimeout(600);
      const file = path.join(OUT_DIR, name + '.png');
      await page.screenshot({ path: file, fullPage: true });
      console.log('  OK  screenshots/' + name + '.png');
    } catch (e) {
      console.error('  ERR [' + name + '] ' + e.message);
    }
  }

  console.log('\n=== AVOID Store - Capturas de pantalla ===\n');

  // 1. index.html - vista inicial
  await snap('01_index', async p => {
    await p.goto(BASE + '/index.html');
    await p.waitForSelector('.product-card');
  });

  // 2. index.html - filtro TEES
  await snap('02_index_filter_tees', async p => {
    await p.goto(BASE + '/index.html');
    await p.waitForSelector('.filter-btn');
    await p.click('[data-filter="tees"]');
  });

  // 3. index.html - filtro HOODIES
  await snap('03_index_filter_hoodies', async p => {
    await p.goto(BASE + '/index.html');
    await p.waitForSelector('.filter-btn');
    await p.click('[data-filter="hoodies"]');
  });

  // 4. index.html - filtro PANTS
  await snap('04_index_filter_pants', async p => {
    await p.goto(BASE + '/index.html');
    await p.waitForSelector('.filter-btn');
    await p.click('[data-filter="pants"]');
  });

  // 5. index.html - filtro ACCESSORIES
  await snap('05_index_filter_accessories', async p => {
    await p.goto(BASE + '/index.html');
    await p.waitForSelector('.filter-btn');
    await p.click('[data-filter="accessories"]');
  });

  // 6. index.html - carrito drawer abierto (vacio)
  await snap('06_index_cart_drawer_empty', async p => {
    await p.goto(BASE + '/index.html');
    await p.waitForSelector('#nav-cart-btn');
    await p.click('#nav-cart-btn');
    await p.waitForSelector('#cart-drawer.open');
  });

  // 7. index.html - carrito drawer con producto
  await snap('07_index_cart_drawer_with_item', async p => {
    await p.goto(BASE + '/index.html');
    await p.waitForSelector('.product-card');
    await p.locator('.product-card .btn-add').first().click();
    await p.waitForTimeout(300);
    await p.click('#nav-cart-btn');
    await p.waitForSelector('#cart-drawer.open');
  });

  // 8. product.html - producto p001
  await snap('08_product_p001', async p => {
    await p.goto(BASE + '/product.html?id=p001');
    await p.waitForSelector('.product-title');
  });

  // 9. product.html - producto p007 (hoodie)
  await snap('09_product_p007', async p => {
    await p.goto(BASE + '/product.html?id=p007');
    await p.waitForSelector('.product-title');
  });

  // 10. product.html - talla seleccionada
  await snap('10_product_size_selected', async p => {
    await p.goto(BASE + '/product.html?id=p001');
    await p.waitForSelector('.size-btn');
    await p.locator('.size-btn').nth(1).click();
  });

  // 11. checkout.html - carrito vacio
  await snap('11_checkout_empty', async p => {
    await p.goto(BASE + '/checkout.html');
    await p.waitForSelector('#checkout-form');
  });

  // 12. checkout.html - con producto en carrito
  await snap('12_checkout_with_item', async p => {
    await p.goto(BASE + '/index.html');
    await p.evaluate(() => {
      var item = [{ uid:'sc_1', id:'p001', brand:'AVOID', name:'AVOID TEE BLACK', price:39.99, img:'', meta:'M', qty:1 }];
      localStorage.setItem('wf_cart_v3', JSON.stringify(item));
    });
    await p.goto(BASE + '/checkout.html');
    await p.waitForSelector('.summary-section');
  });

  // 13. checkout.html - formulario relleno
  await snap('13_checkout_form_filled', async p => {
    await p.goto(BASE + '/index.html');
    await p.evaluate(() => {
      var item = [{ uid:'sc_2', id:'p002', brand:'AVOID', name:'AVOID TEE WHITE', price:39.99, img:'', meta:'L', qty:2 }];
      localStorage.setItem('wf_cart_v3', JSON.stringify(item));
    });
    await p.goto(BASE + '/checkout.html');
    await p.waitForSelector('#checkout-form');
    await p.fill('#first-name', 'Dario');
    await p.fill('#last-name', 'CS');
    await p.fill('#email', 'dario@avoid.store');
    await p.fill('#address', 'Calle Gran Via 42');
    await p.fill('#city', 'Madrid');
    await p.fill('#zip', '28013');
    await p.selectOption('#country', 'Spain');
    await p.fill('#card-number', '4111111111111111');
    await p.fill('#expiry', '12/27');
    await p.fill('#cvv', '123');
  });

  // 14. checkout.html - confirmacion de pedido
  await snap('14_checkout_confirmation', async p => {
    await p.goto(BASE + '/index.html');
    await p.evaluate(() => {
      var item = [{ uid:'sc_3', id:'p003', brand:'AVOID', name:'TEST PRODUCT', price:49.99, img:'', meta:'S', qty:1 }];
      localStorage.setItem('wf_cart_v3', JSON.stringify(item));
    });
    await p.goto(BASE + '/checkout.html');
    await p.waitForSelector('#checkout-form');
    await p.fill('#first-name', 'Dario');
    await p.fill('#last-name', 'CS');
    await p.fill('#email', 'dario@avoid.store');
    await p.fill('#address', 'Calle Test 1');
    await p.fill('#city', 'Madrid');
    await p.fill('#zip', '28001');
    await p.selectOption('#country', 'Spain');
    await p.fill('#card-number', '4111111111111111');
    await p.fill('#expiry', '12/27');
    await p.fill('#cvv', '123');
    await p.click('#place-order-btn');
    await p.waitForSelector('#order-confirmation');
  });

  await browser.close();

  const files = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.png'));
  console.log('\n=== ' + files.length + ' capturas guardadas en screenshots/ ===');
  files.forEach(f => console.log('  ' + f));
})();
