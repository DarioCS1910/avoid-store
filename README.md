# ΛVØID Store

Tienda de streetwear con carrito de compra, pagina de producto y checkout.

## Estructura de archivos

```
avoid-store/
├── index.html          # Pagina principal con catalogo y filtros
├── product.html        # Pagina de detalle de producto
├── checkout.html       # Pagina de checkout y confirmacion
├── cart.js             # Cart v3 - logica oficial del carrito
├── products.js         # Catalogo WF_PRODUCTS (expuesto en window)
├── package.json        # Dependencias Node.js
├── playwright.config.js
├── playwright_avoid.js # Tests Playwright oficiales
├── pw_fast.js          # Test rapido con servidor HTTP integrado
├── pw_test.js          # Suite completa de tests (7 tests)
├── pw_debug.js         # Debug: imprime estado DOM y carrito
├── pw_debug2.js        # Debug avanzado: flujo completo de compra
└── pw_screenshots.js   # Captura pantallas de todas las paginas
```

## Instalacion

```bash
git clone https://github.com/DarioCS1910/avoid-store.git
cd avoid-store
npm install
npx playwright install chromium
```

## Ejecucion - SIN Live Server (servidor HTTP integrado)

Todos los scripts arrancan su propio servidor HTTP. No necesitas Live Server ni ninguna extension.

### Test rapido (recomendado para verificar rapido)
```bash
node pw_fast.js
```
Ejecuta un smoke test completo en ~10 segundos. Usa puerto 7890.

### Suite completa de tests (7 tests)
```bash
node pw_test.js
```
Verifica: carga de productos, carrito, checkout, WF_PRODUCTS, flujo completo. Usa puerto 5500.

### Debug - estado del DOM y carrito
```bash
node pw_debug.js
```
Imprime WF_PRODUCTS.length, items del carrito, campos del formulario. Usa puerto 5501.

### Debug avanzado - flujo completo paso a paso
```bash
node pw_debug2.js
```
Simula todo el flujo: index -> agregar -> product -> checkout -> submit. Usa puerto 5502.

### Capturas de pantalla
```bash
node pw_screenshots.js
```
Genera capturas PNG en `./screenshots/`. Usa puerto 5503.

## Ejecucion - CON Live Server (opcional)

Si prefieres usar Live Server de VS Code:
1. Abre la carpeta en VS Code
2. Click derecho en `index.html` > "Open with Live Server"
3. Live Server arranca en `http://127.0.0.1:5500`
4. Para los tests Playwright en modo Live Server:
   ```bash
   npx playwright test
   ```

## Resumen de comandos

| Comando | Descripcion | Puerto |
|---------|-------------|--------|
| `node pw_fast.js` | Smoke test rapido | 7890 |
| `node pw_test.js` | Suite 7 tests | 5500 |
| `node pw_debug.js` | Debug DOM/carrito | 5501 |
| `node pw_debug2.js` | Debug flujo completo | 5502 |
| `node pw_screenshots.js` | Capturas PNG | 5503 |
| `npx playwright test` | Tests con config (Live Server) | 5500 |

## Tecnologia

- HTML5, CSS3, JavaScript vanilla
- Cart v3 con localStorage y window.name
- WF_PRODUCTS como catalogo global en window
- Playwright para testing E2E
- Servidor HTTP integrado (Node.js http module)

## Notas

- `cart.js` es el carrito oficial (Cart v3). No crear versiones alternativas.
- `products.js` expone `window.WF_PRODUCTS` para todas las paginas.
- Cada script pw_*.js usa un puerto diferente para evitar conflictos si se ejecutan en paralelo.
- Las capturas de pantalla se guardan en `./screenshots/` (ignorada en .gitignore).
