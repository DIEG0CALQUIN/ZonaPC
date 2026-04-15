//  CART
// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p || p.stock <= 0) { showToast('Sin stock disponible'); return; }
  const ex = cart.find(x => x.id === id);
  if (ex && ex.qty >= p.stock) { showToast(`Stock máximo en carrito: ${p.stock}`); return; }
  if (ex) ex.qty++; else cart.push({...p, qty:1});
  renderCart();
  showCartNotif(p.name);
}

function validateCartStock(showToastOnAdjust = false) {
  let changed = false;
  cart = cart.filter(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    if (!p || p.stock <= 0) { changed = true; return false; }
    if (item.qty > p.stock) {
      item.qty = p.stock;
      changed = true;
    }
    return item.qty > 0;
  });
  if (changed) {
    renderCart();
    if (showToastOnAdjust) showToast('Actualizamos el carrito según stock disponible');
  }
  return cart.length > 0;
}

function renderCart() {
  const count = cart.reduce((s,x) => s+x.qty, 0);
  document.getElementById('cart-count').textContent = count;
  const cartBtn = document.querySelector('.cart-trigger');
  if (cartBtn) cartBtn.classList.toggle('with-items', count > 0);
  saveCart();
  const body = document.getElementById('cart-body');
  if (!cart.length) {
    body.innerHTML = `<div class="cart-empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg><p>Tu carrito está vacío</p></div>`;
    document.getElementById('cart-foot').style.display = 'none';
    updateFloatingCart();
    return;
  }
  body.innerHTML = cart.map(p => `
    <div class="cart-item" style="align-items:center;">
      <div class="ci-icon" style="overflow:hidden">
        ${p.image
          ? `<img src="${p.image}" style="width:44px;height:44px;object-fit:contain;display:block;background:#fff;border-radius:8px;" onerror="this.style.display='none';this.parentNode.innerHTML='${p.icon}'" alt="">`
          : p.icon}
      </div>
      <div class="ci-info" style="display:flex;flex-direction:column;flex:1;min-width:0;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
          <div>
            <div class="ci-name">${p.name}</div>
            <div class="ci-price">${fmt(p.price)} <span style="color:var(--txt3);font-size:12px;font-weight:400">c/u</span></div>
          </div>
          <div class="ci-subtotal" style="font-size:13px;color:var(--c1);text-align:right;min-width:90px;">Subtotal: <b>${fmt(p.price * p.qty)}</b></div>
        </div>
        <div class="ci-controls">
          <button class="ci-qty-btn" onclick="changeQty(${p.id},-1)">−</button>
          <span class="ci-qty">${p.qty}</span>
          <button class="ci-qty-btn" onclick="changeQty(${p.id},1)">+</button>
          <button class="ci-del" onclick="removeItem(${p.id})">✕</button>
        </div>
      </div>
    </div>`).join('');
  const total = cart.reduce((s,x) => s+x.price*x.qty, 0);
  document.getElementById('cart-subtotal').textContent = fmt(total);
  document.getElementById('cart-total').textContent = fmt(total);
  document.getElementById('cart-foot').style.display = 'block';
  updateFloatingCart();
}

function changeQty(id, d) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  const p = PRODUCTS.find(x => x.id === id);
  const maxStock = p ? p.stock : 0;
  if (d > 0 && item.qty >= maxStock) { showToast(`Stock máximo en carrito: ${maxStock}`); return; }
  item.qty += d;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  renderCart();
}

function removeItem(id) { cart = cart.filter(x => x.id !== id); renderCart(); }

function toggleCart() {
  document.getElementById('cart-overlay').classList.toggle('open');
  document.getElementById('cart-drawer').classList.toggle('open');
}

// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""
//  CHECKOUT
// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""
function openCheckout() {
  if (!currentUser) {
    openAuthModal('login', true);
    showToast('Inicia sesión para continuar con tu compra');
    return;
  }
  if (!cart.length) return;
  if (!validateCartStock(true)) return;
  prefillCheckoutFromUser();
  toggleCart();
  const total = cart.reduce((s,x) => s+x.qty*x.price, 0);
  document.getElementById('co-summary-1').innerHTML = `
    ${cart.map(p=>`<div class="co-sum-item"><span>${p.icon} ${p.name.slice(0,26)}… ×${p.qty}</span><span style="font-weight:600">${fmt(p.price*p.qty)}</span></div>`).join('')}
    <div class="co-sum-total"><span>Total</span><span class="co-sum-total-val">${fmt(total)}</span></div>`;
  goPaso1();
  document.getElementById('co-modal').classList.add('open');
  history.pushState({modal: 'checkout'}, '');
  setupChileAddressAutocomplete();
}

function closeCheckout() {
  document.getElementById('co-modal').classList.remove('open');
  paying = false;
  document.getElementById('co-close').style.opacity = '1';
}

function setStep(n) {
  [1,2,3].forEach(i => {
    document.getElementById('co-p'+i).style.display = i===n ? 'block' : 'none';
    const t = document.getElementById('st'+i);
    t.className = 'co-step' + (i===n ? ' active' : i<n ? ' done' : '');
  });
}

function goPaso1() {
  setStep(1);
  document.getElementById('co-title').textContent = 'DATOS DE ENVÍO';
  document.getElementById('co-err').style.display = 'none';
}

async function goPaso2() {
  if (document.getElementById('co-p1').style.display !== 'none') {
    const n = document.getElementById('f-nombre').value.trim();
    const e = document.getElementById('f-email').value.trim();
    const t = document.getElementById('f-tel').value.trim();
    const d = document.getElementById('f-dir').value.trim();
    const c = document.getElementById('f-city').value.trim();
    const reg = document.getElementById('f-region').value.trim();
    const r = document.getElementById('f-rut').value.trim();
    const err = document.getElementById('co-err');
    if (!n || !e || !d || !r) { err.textContent = '⚠️ Completa todos los campos.'; err.style.display = 'block'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { err.textContent = '⚠️ Email inválido.'; err.style.display = 'block'; return; }
    if (t && !/^[0-9]{8}$/.test(t)) { err.textContent = 'Teléfono inválido. Ingresa 8 dígitos.'; err.style.display = 'block'; return; }

    const validation = await validateAddressWithGoogle({ addressLine: d, city: c, region: reg });
    if (!validation.ok) {
      err.textContent = '⚠️ ' + validation.message;
      err.style.display = 'block';
      return;
    }

    if (validation.normalized) {
      const dirInput = document.getElementById('f-dir');
      const cityInput = document.getElementById('f-city');
      if (dirInput && validation.normalized.addressLine) dirInput.value = validation.normalized.addressLine;
      if (cityInput && validation.normalized.city) cityInput.value = validation.normalized.city;
      if (validation.normalized.region) setRegionFromGoogle(validation.normalized.region);
    }

    if (validation.warning) showToast(validation.warning);
    err.style.display = 'none';
  }
  const total = cart.reduce((s,x) => s+x.price*x.qty, 0);
  const orden = 'ZPC-' + Date.now().toString().slice(-8);
  document.getElementById('wp-orden').textContent = '#' + orden;
  document.getElementById('wp-total').textContent = fmt(total);
  setStep(2);
  document.getElementById('co-title').textContent = 'PAGO WEBPAY';
}

async function launchWebpay() {
  // Producción: fetch('http://localhost:3000/webpay/iniciar', {...})
  const btn = document.getElementById('wp-pay-btn');
  const loading = document.getElementById('wp-loading');
  btn.disabled = true; btn.textContent = 'Conectando…';
  loading.style.display = 'block';
  paying = true;
  document.getElementById('co-close').style.opacity = '0.3';
  await new Promise(r => setTimeout(r, 1600));
  loading.style.display = 'none';
  setStep(3);
  document.getElementById('co-title').textContent = 'PORTAL TRANSBANK';
  btn.disabled = false;
  btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Pagar con Webpay';
}

async function confirmPago() {
  document.getElementById('co-modal').classList.remove('open');
  await new Promise(r => setTimeout(r, 800));
  const total = cart.reduce((s,x) => s+x.price*x.qty, 0);
  const orden = document.getElementById('wp-orden').textContent;
  const auth  = Math.floor(1000000 + Math.random()*9000000);
  try {
    await persistOrderFromCart(orden, total);
    await fetchProducts();
  } catch (error) {
    paying = false;
    document.getElementById('co-close').style.opacity = '1';
    document.getElementById('res-icon').textContent = '\u26A0\uFE0F';
    document.getElementById('res-title').textContent = 'No se pudo registrar el pedido';
    document.getElementById('res-title').style.color = 'var(--c4)';
    document.getElementById('res-sub').textContent = error.message;
    document.getElementById('res-box').innerHTML = '<div class="result-row"><span class="result-row-k">Estado</span><span class="result-row-v">El backend no confirmó la compra.</span></div>';
    document.getElementById('result-overlay').classList.add('open');
    return;
  }
  paying = false;
  document.getElementById('co-close').style.opacity = '1';
  document.getElementById('res-icon').textContent = '\u2705';
  document.getElementById('res-title').textContent = '¡Pago aprobado!';
  document.getElementById('res-title').style.color = 'var(--c5)';
  document.getElementById('res-sub').textContent = `Gracias, ${document.getElementById('f-nombre').value}. Tu pedido fue confirmado.`;
  document.getElementById('res-box').innerHTML = `
    <div class="result-row"><span class="result-row-k">N° de orden</span><span class="result-row-v" style="color:var(--c1)">${orden}</span></div>
    <div class="result-row"><span class="result-row-k">Autorización</span><span class="result-row-v">${auth}</span></div>
    <div class="result-row"><span class="result-row-k">Medio de pago</span><span class="result-row-v">Webpay Plus</span></div>
    <div class="result-row"><span class="result-row-k">Total</span><span class="result-row-v" style="color:var(--c5);font-size:15px">${fmt(total)}</span></div>`;
  document.getElementById('result-overlay').classList.add('open');
  if (document.getElementById('view-product').classList.contains('active') && _currentParam) {
    renderProductPage(_currentParam);
    const currentProduct = PRODUCTS.find(x => x.id === _currentParam);
    if (currentProduct) initProductPageStock(currentProduct);
  }
  cart = []; renderCart();
}

// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""
//  COUNTDOWN
// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""
function buildCountdown() {
  const end = new Date(); end.setHours(end.getHours()+47,59,59,0);
  const pad = n => String(n).padStart(2,'0');
  function tick() {
    const diff = end - new Date();
    if (diff <= 0) return;
    const h = Math.floor(diff/3600000), m = Math.floor((diff%3600000)/60000), s = Math.floor((diff%60000)/1000);
    document.getElementById('countdown').innerHTML = `
      <div class="cd-unit"><span class="cd-num">${pad(h)}</span><span class="cd-lbl">Hrs</span></div>
      <div class="cd-unit"><span class="cd-num">${pad(m)}</span><span class="cd-lbl">Min</span></div>
      <div class="cd-unit"><span class="cd-num">${pad(s)}</span><span class="cd-lbl">Seg</span></div>`;
  }
  tick(); setInterval(tick, 1000);
}

// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""
//  TOAST
// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""
let toastT;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 2500);
}

let cartNotifT;
function showCartNotif(productName) {
  const el = document.getElementById('cart-notif');
  const msg = document.getElementById('cart-notif-msg');
  if (!el || !msg) return;
  msg.textContent = 'Producto agregado al carrito';
  el.classList.add('show');
  clearTimeout(cartNotifT);
  cartNotifT = setTimeout(() => el.classList.remove('show'), 5000);
}
function dismissCartNotif() {
  const el = document.getElementById('cart-notif');
  if (el) el.classList.remove('show');
  clearTimeout(cartNotifT);
}


// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""
//  STOCK HELPERS
// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""
function stockQty(stock) {
  if (stock === 0) return {cls:'stock-out', dot:'stock-dot-out', label:'Sin stock'};
  if (stock <= 5)  return {cls:'stock-low', dot:'stock-dot-low', label:`¡Solo ${stock}!`};
  return {cls:'stock-ok', dot:'stock-dot-ok', label:`${stock} en stock`};
}

function initProductPageStock(p) {
  const badge = document.getElementById('pp-stock-badge');
  if (badge) {
    const sq = stockQty(p.stock);
    badge.innerHTML = `<span class="stock-badge ${sq.cls}"><span class="stock-dot ${sq.dot}"></span>${sq.label}</span>`;
  }
  const addBtn = document.getElementById('pp-add-btn');
  const buyBtn = document.getElementById('pp-buy-btn');
  if (addBtn) addBtn.disabled = p.stock === 0;
  if (buyBtn) buyBtn.disabled = p.stock === 0;
  if (p.stock === 0 && addBtn) addBtn.textContent = 'Sin stock';
  if (p.stock === 0 && buyBtn) buyBtn.textContent = 'Sin stock';
}

// Per-card quantity management
window._cardQty = window._cardQty || {};
function cardQtyChange(id, delta) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const current = window._cardQty[id] || 1;
  const next = Math.max(1, Math.min(p.stock || 99, current + delta));
  window._cardQty[id] = next;
  const el = document.getElementById('cq-' + id);
  if (el) el.textContent = next;
}

function addToCartCard(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p || p.stock <= 0) { showToast('Sin stock disponible'); return; }
  const qty = window._cardQty[id] || 1;
  const ex = cart.find(x => x.id === id);
  const inCart = ex ? ex.qty : 0;
  const availableToAdd = Math.max(0, p.stock - inCart);
  if (availableToAdd <= 0) { showToast(`Stock máximo en carrito: ${p.stock}`); return; }
  const qtyToAdd = Math.min(qty, availableToAdd);
  if (ex) ex.qty += qtyToAdd; else cart.push({...p, qty: qtyToAdd});
  renderCart();
  showCartNotif(p.name);
  window._cardQty[id] = 1;
  const el = document.getElementById('cq-' + id);
  if (el) el.textContent = 1;
}

// Buy now: add to cart then open checkout
function buyNow(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p || p.stock <= 0) { showToast('Sin stock disponible'); return; }
  // Clear cart and add this product with selected qty
  const qty = Math.min(ppQty, p.stock);
  cart = [{...p, qty}];
  renderCart();
  openCheckout();
}

// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""
//  FLOATING CART  update on view change
// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""
function updateFloatingCart() {
  const btn = document.getElementById('floating-cart');
  if (!btn) return;
  const count = cart.reduce((s,x) => s+x.qty, 0);
  const total = cart.reduce((s,x) => s+x.price*x.qty, 0);
  const fc = document.getElementById('fc-count');
  const ft = document.getElementById('fc-total');
  if (fc) fc.textContent = count;
  if (ft) ft.textContent = count > 0 ? fmt(total) : '';
  // Never show the floating cart button - use the navbar button instead
  btn.classList.remove('show');
  // Add special effects only when cart has items
  btn.classList.toggle('with-items', count > 0);
}


function selectVariant(idx, productId) {
  const variants = getVariants(productId);
  const v = variants[idx];
  if (!v) return;

  // Update main image background
  const mainImg = document.getElementById('pp-main-img');
  const mainTint = document.getElementById('pp-main-tint');
  if (mainImg) mainImg.style.background = v.bg;
  if (mainTint) mainTint.style.background = v.tint;

  // Flash the emoji slightly for visual feedback
  const emoji = document.getElementById('pp-main-emoji');
  if (emoji) {
    emoji.style.transform = 'scale(0.88)';
    emoji.style.transition = 'transform 0.12s ease';
    setTimeout(() => {
      emoji.style.transform = 'scale(1)';
    }, 120);
  }

  // Update active thumbnail
  document.querySelectorAll('.pp-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === idx);
  });
}

