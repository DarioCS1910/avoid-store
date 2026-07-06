# AVOID Store

E-commerce streetwear brand. Vanilla HTML, CSS y JavaScript. Sin frameworks, sin dependencias de produccion.

**Live Site:** https://dariocs1910.github.io/avoid-store/

---

## Estructura del proyecto

```
avoid-store/
├── index.html          # Coleccion principal con grid de productos + filtros
├── product.html        # Detalle de producto (selector de talla, add to cart)
├── checkout.html       # Checkout (formulario de envio + resumen del pedido)
├── cart.js             # Cart v3 (persistencia dual: window.name + localStorage)
├── products.js         # Catalogo de productos (expone window.WF_PRODUCTS)
├── package.json        # Dependencias Playwright y scripts npm
├── playwright.config.js # Configuracion de @playwright/test
├── playwright_avoid.js  # Suite completa (22 tests, describe/test blocks)
├── pw_test.js          # Suite principal (12 tests, runner propio)
├── pw_fast.js          # Smoke test rapido para CI/CD (7 checks)
├── pw_debug.js         # Debug: imprime estado DOM y carrito
├── pw_debug2.js        # Debug avanzado: flujo completo add-to-cart -> checkout
├── pw_screenshots.js   # Genera 14 capturas de pantalla
├── .gitignore          # Excluye node_modules, screenshots, test-results
└── assets/
    └── img/            # Imagenes de productos
```

---

## Instalacion rapida (1 vez)

```bash
# 1. Clonar el repositorio
git clone https://github.com/DarioCS1910/avoid-store.git
cd avoid-store

# 2. Instalar Playwright
npm install

# 3. Instalar navegador Chromium
npm run install:browsers
```

---

## Ejecutar con Live Server + Playwright

### Paso 1 - Abrir con Live Server en VS Code

1. Abrir la carpeta `avoid-store/` en **VS Code**
2. Click derecho en `index.html` > **"Open with Live Server"**
3. El navegador se abre en `http://127.0.0.1:5500/index.html`
4. **Dejar Live Server activo** mientras corres los tests

### Paso 2 - Ejecutar tests (nueva terminal)

```bash
# Smoke test rapido (~10s) - recomendado para verificar todo funciona
npm run test:fast

# Suite principal completa (12 tests)
npm test

# Suite completa con @playwright/test runner (22 tests)
npm run test:suite
```

---

## Comandos disponibles

| Comando | Descripcion | Tests |
|---|---|---|
| `npm run test:fast` | Smoke test rapido, ideal para CI/CD | 7 checks |
| `npm test` | Suite principal completa | 12 tests |
| `npm run test:suite` | Suite con @playwright/test (reportes HTML) | 22 tests |
| `npm run debug` | Imprime estado DOM/carrito de las 3 paginas | - |
| `npm run debug2` | Simula flujo completo con log detallado | - |
| `npm run screenshots` | Genera 14 capturas en `screenshots/` | - |

---

## Si Live Server usa un puerto diferente al 5500

Por defecto todos los scripts apuntan a `http://127.0.0.1:5500`.
Si tu Live Server usa otro puerto (ej: 5501), pasa la variable `BASE_URL`:

```bash
BASE_URL=http://127.0.0.1:5501 npm test
BASE_URL=http://127.0.0.1:5501 npm run test:fast
```

---

## Tests cubiertos

### index.html
- Carga productos de `window.WF_PRODUCTS`
- Filtros: ALL, TEES, HOODIES, PANTS, ACCESSORIES
- Abrir/cerrar drawer del carrito
- Badge del carrito se actualiza al anadir producto
- Drawer muestra items anadidos

### product.html
- Carga producto por `?id=` query param
- Muestra titulo, imagen, precio, descripcion
- Selector de talla (`.size-btn`)
- Boton `#add-to-cart-btn` funciona
- Breadcrumb con link a coleccion

### checkout.html
- Campos de formulario: nombre, email, direccion, ciudad, zip, pais
- Campos de pago: numero de tarjeta, expiry, CVV
- Resumen del pedido con precios en Euro
- Total del carrito correcto
- Completar pedido muestra `#order-confirmation`
- Nota de envio gratis con >= 150 EUR

### Cart - Persistencia
- Carrito persiste entre paginas via `localStorage`
- `clearCart()` vacia el carrito correctamente

---

## Tecnologias

- **HTML/CSS/JS** puro — sin frameworks
- **Playwright** — testing E2E
- **GitHub Pages** — despliegue automatico
- **Live Server** (VS Code) — desarrollo local
