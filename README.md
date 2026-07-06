# ΛVØID Store

E-commerce streetwear brand built with vanilla HTML, CSS and JavaScript. No frameworks, no dependencies.

## Live Site

**https://dariocs1910.github.io/avoid-store/**

## Project Structure

```
avoid-store/
├── index.html       # Main collection page with product grid + filters
├── product.html     # Product detail page (size selector, add to cart)
├── checkout.html    # Checkout page (shipping form + order summary)
├── cart.js          # Cart v3 (dual persistence: window.name + localStorage)
├── products.js      # Product catalog (exposes window.WF_PRODUCTS)
└── assets/
    └── img/            # Product images
```

## Cart API (cart.js)

| Function | Description |
|---|---|
| `loadCart()` | Returns cart array from storage |
| `saveCart(arr)` | Saves cart array to storage |
| `window.addToCart(item)` | Adds item to cart |
| `window.clearCart()` | Empties the cart |
| `window.WFCart` | Current cart array |
| `window.openCart()` | Opens cart drawer (if present) |
| `window.goToCheckout()` | Navigates to checkout.html |

### Item Object Structure
```js
{
  id: 'p001',        // product id
  brand: 'ΛVØID',
  name: 'ΛVØID TEE BLACK',
  price: 39.99,
  img: 'assets/img/tee-black.jpg',
  meta: 'M',         // size selected
  qty: 1
}
```

## Products API (products.js)

Exposes `window.WF_PRODUCTS` — array of product objects:
```js
{ id, name, price, category, img, sizes }
```

Categories: `tees`, `hoodies`, `pants`, `accessories`

## Local Development

```bash
git clone https://github.com/DarioCS1910/avoid-store.git
cd avoid-store
# Open with Live Server in VS Code
# or: python -m http.server 8080
```

Then open `http://localhost:8080` (or Live Server URL).

## User Flow

1. `index.html` → Browse collection, filter by category
2. Click product → `product.html?id=p001`
3. Select size → ADD TO CART
4. CART button → `checkout.html`
5. Fill form → PLACE ORDER → Confirmation screen

## Shipping Logic

- Orders ≥ €150 → **Free shipping**
- Orders < €150 → Shows amount needed for free shipping

---

ΛVØID &copy; 2025 — All rights reserved
