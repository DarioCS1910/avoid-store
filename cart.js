/* ============================================================
   ΛØID — Cart v3
   Persistencia dual: window.name + localStorage
   Sin DOMContentLoaded — scripts al final del body
============================================================ */

var _WF_CART_KEY = 'wf_cart_v3';

function _tryLS() {
  try { return window['local' + 'Storage']; } catch (e) { return null; }
}

function loadCart() {
  try {
    if (window.name && window.name.indexOf('WF:') === 0) {
      var d = JSON.parse(window.name.slice(3));
      if (Array.isArray(d) && d.length > 0) return d;
    }
  } catch (e) {}
  try {
    var ls = _tryLS();
    if (ls) {
      var v = ls.getItem(_WF_CART_KEY);
      if (v) return JSON.parse(v) || [];
    }
  } catch (e) {}
  return [];
}

function saveCart(cart) {
  try { window.name = 'WF:' + JSON.stringify(cart); } catch (e) {}
  try {
    var ls = _tryLS();
    if (ls) ls.setItem(_WF_CART_KEY, JSON.stringify(cart));
  } catch (e) {}
}

window.WFCart = loadCart();

window.addToCart = function (item) {
  var cart = window.WFCart;
  var existing = cart.find(function (c) {
    return c.id === item.id && c.meta === item.meta;
  });
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      uid:   item.id + '_' + Date.now(),
      id:    item.id,
      brand: item.brand,
      name:  item.name,
      price: item.price,
      img:   item.img,
      meta:  item.meta || '',
      qty:   1
    });
  }
  window.WFCart = cart;
  saveCart(cart);
  renderCartDrawer();
  updateCartBadge();
};

window.changeQty = function (btn, delta) {
  var ci   = btn.closest('.ci');
  var uid  = ci.dataset.uid;
  var cart = window.WFCart;
  var item = cart.find(function (c) { return c.uid === uid; });
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  var numEl   = ci.querySelector('.ci-qty-num');
  var priceEl = ci.querySelector('.ci-price');
  if (numEl)   numEl.textContent   = item.qty;
  if (priceEl) priceEl.textContent = '€' + (item.price * item.qty);
  window.WFCart = cart;
  saveCart(cart);
  updateCartTotal();
  updateCartBadge();
};

window.removeItem = function (span) {
  var ci  = span.closest('.ci');
  var uid = ci.dataset.uid;
  if (window.gsap) {
    gsap.to(ci, { opacity: 0, x: 50, duration: 0.3, ease: 'power2.in',
      onComplete: function () { _removeByUid(uid); }
    });
  } else {
    _removeByUid(uid);
  }
};

function _removeByUid(uid) {
  window.WFCart = window.WFCart.filter(function (c) { return c.uid !== uid; });
  saveCart(window.WFCart);
  renderCartDrawer();
  updateCartBadge();
}

window.clearCart = function () {
  window.WFCart = [];
  saveCart([]);
  renderCartDrawer();
  updateCartBadge();
};

function renderCartDrawer() {
  var listEl = document.getElementById('cart-items-list');
  if (!listEl) return;
  var cart = window.WFCart;
  if (cart.length === 0) {
    listEl.innerHTML = '<div class="cart-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg><p>Tu carrito está vacío</p><a href="index.html#coleccion" class="cart-empty-cta">Ver colección</a></div>';
    updateCartTotal();
    updateHeadCount();
    return;
  }
  listEl.innerHTML = cart.map(function (item) {
    return '<div class="ci" data-uid="' + item.uid + '" data-price="' + item.price + '">' +
      '<img class="ci-img" src="' + item.img + '" alt="' + item.name + '" loading="lazy"/>' +
      '<div class="ci-info">' +
        '<div class="ci-brand">' + item.brand + '</div>' +
        '<div class="ci-name">'  + item.name  + '</div>' +
        '<div class="ci-meta">'  + item.meta  + '</div>' +
        '<div class="ci-row">' +
          '<div class="ci-qty">' +
            '<button onclick="changeQty(this,-1)" aria-label="Reducir cantidad">−</button>' +
            '<span class="ci-qty-num">' + item.qty + '</span>' +
            '<button onclick="changeQty(this,1)" aria-label="Aumentar cantidad">+</button>' +
          '</div>' +
          '<span class="ci-price">€' + (item.price * item.qty) + '</span>' +
        '</div>' +
        '<span class="ci-remove" onclick="removeItem(this)">Eliminar</span>' +
      '</div>' +
    '</div>';
  }).join('');
  updateCartTotal();
  updateHeadCount();
}

function updateCartTotal() {
  var cart   = window.WFCart;
  var subtot = cart.reduce(function (acc, c) { return acc + c.price * c.qty; }, 0);
  var totalEl = document.getElementById('cart-total');
  if (totalEl) totalEl.textContent = '€' + subtot;
  var noteEl = document.getElementById('cart-ship-note');
  if (noteEl) {
    if (subtot === 0) {
      noteEl.textContent = 'Añade productos para continuar';
      noteEl.style.color = 'var(--text-faint)';
    } else if (subtot >= 150) {
      noteEl.textContent = '✓ Envío gratis incluido';
      noteEl.style.color = 'var(--accent)';
    } else {
      var diff = (150 - subtot).toFixed(2);
      noteEl.textContent = 'Añade €' + diff + ' más para envío gratis';
      noteEl.style.color = 'var(--text-muted)';
    }
  }
}

function updateHeadCount() {
  var total  = window.WFCart.reduce(function (acc, c) { return acc + c.qty; }, 0);
  var headEl = document.getElementById('cart-head-count');
  if (headEl) headEl.textContent = total + ' artículo' + (total !== 1 ? 's' : '');
}

function updateCartBadge() {
  var total = window.WFCart.reduce(function (acc, c) { return acc + c.qty; }, 0);
  ['cart-badge', 'nav-cart-badge'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = total;
    if (total > 0) { el.classList.add('has-items'); }
    else { el.classList.remove('has-items'); }
  });
}

window.openCart = function () {
  var d = document.getElementById('cart-drawer');
  var s = document.getElementById('cart-scrim');
  if (d) {
    d.classList.add('open');
    if (window.gsap) {
      gsap.fromTo(d, { x: 60, opacity: 0.6 }, { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out' });
    }
  }
  if (s) s.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCartDrawer();
};

window.closeCart = function () {
  var d = document.getElementById('cart-drawer');
  var s = document.getElementById('cart-scrim');
  if (d) {
    d.classList.remove('open');
    if (window.gsap) { gsap.killTweensOf(d); gsap.set(d, { clearProps: 'all' }); }
  }
  if (s) s.classList.remove('open');
  document.body.style.overflow = '';
};

window.goToCheckout = function () {
  if (!window.WFCart || window.WFCart.length === 0) return;
  saveCart(window.WFCart);
  location.href = 'checkout.html';
};

(function initCart() {
  renderCartDrawer();
  updateCartBadge();
  var navBtn = document.getElementById('nav-cart-btn');
  if (navBtn) navBtn.addEventListener('click', window.openCart);
  document.querySelectorAll('[aria-label^="Bolsa"], [aria-label*="carrito"], [aria-label*="cart"]').forEach(function (btn) {
    if (btn.id !== 'nav-cart-btn' && btn.id !== 'cart-close' && btn.id !== 'cart-drawer') btn.addEventListener('click', window.openCart);
  });
  var closeBtn = document.getElementById('cart-close');
  if (closeBtn) closeBtn.addEventListener('click', window.closeCart);
  var scrim = document.getElementById('cart-scrim');
  if (scrim) scrim.addEventListener('click', window.closeCart);
  var chkBtn = document.getElementById('cart-checkout-btn');
  if (chkBtn) chkBtn.addEventListener('click', window.goToCheckout);
}());
