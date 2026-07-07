# ΛVØID Store

Tienda de streetwear urbano. Estructura multi-pagina con carrito persistente.

---

## PASOS PARA EJECUTAR LOS TESTS (solo la primera vez)

### PASO 1 — Instalar Node.js

1. Ve a: **https://nodejs.org**
2. Descarga la version **LTS** (boton verde grande)
3. Ejecuta el instalador y haz clic en **Next** en todo
4. Cuando termine, cierra el instalador

### PASO 2 — Abrir CMD en la carpeta del proyecto

1. Abre el Explorador de archivos
2. Ve a la carpeta `avoid-store` (donde tienes los archivos)
3. Haz clic en la barra de direcciones arriba
4. Escribe `cmd` y pulsa Enter

### PASO 3 — Instalar dependencias (solo la primera vez)

Escribe estos comandos uno por uno y pulsa Enter despues de cada uno:

```
npm install
```

```
npx playwright install chromium
```

### PASO 4 — Ejecutar los tests

Para los **tests rapidos** (recomendado, ~15 segundos):
```
node pw_fast.js
```

Para los **tests completos** (9 tests, ~30 segundos):
```
node pw_test.js
```

---

## RESULTADO ESPERADO

```
=== AVOID Store - Tests Rapidos ===

  PASS index.html carga con productos
  PASS WF_PRODUCTS en window
  PASS product.html carga
  PASS checkout.html tiene formulario
  PASS Boton carrito abre drawer en index

=== 5 PASS / 0 FAIL en 14.2s ===
```

---

## ARCHIVOS DEL PROYECTO

| Archivo | Descripcion |
|---|---|
| `index.html` | Pagina principal - catalogo de productos |
| `product.html` | Pagina de producto individual |
| `checkout.html` | Pagina de pago / formulario |
| `products.js` | Catalogo de productos (window.WF_PRODUCTS) |
| `cart.js` | Carrito v3 - logica unificada |
| `pw_fast.js` | Tests rapidos (5 checks) |
| `pw_test.js` | Suite completa (9 tests) |

---

## ESTRUCTURA DE PAGINAS

- **index.html** → Grid de productos con filtros por categoria
- **product.html** → Detalle de producto, selector de talla, boton agregar al carrito
- **checkout.html** → Formulario de envio y resumen del pedido

---

## REQUISITOS

- Node.js 18 o superior
- npm (incluido con Node.js)
- Playwright (se instala con `npm install`)
