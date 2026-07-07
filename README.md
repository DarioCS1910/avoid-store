# ΛVØID Store

Tienda de streetwear urbano. Estructura multi-pagina con carrito persistente.

---

## COMO EJECUTAR LOS TESTS

> Node.js y las dependencias ya estan instaladas. Solo hace falta hacer esto:

### PASO 1 — Descargar los cambios del repositorio

Abre CMD en tu carpeta `avoid-store` y ejecuta:

```
git pull
```

### PASO 2 — Ejecutar los tests

Tests rapidos (5 checks, ~15 segundos):

```
node pw_fast.js
```

Tests completos (9 tests, ~30 segundos):

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

## ABRIR CMD EN LA CARPETA DEL PROYECTO

1. Abre el Explorador de archivos
2. Ve a la carpeta `avoid-store`
3. Haz clic en la barra de direcciones arriba
4. Escribe `cmd` y pulsa Enter

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
