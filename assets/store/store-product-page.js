//  PRODUCT PAGE
// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""
function renderProductPage(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p || isProductDeleted(p)) {
    navigate('home', 'catalogo');
    return;
  }
  ppQty = 1;
  const desc = p.desc || DESCRIPTIONS[id] || 'Producto de alta calidad con garantía ZonaPC.';
  const relatedCategories = getProductCategories(p);
  const related = PRODUCTS.filter(x => x.id !== id && getProductCategories(x).some(cat => relatedCategories.includes(cat))).slice(0, 4);
  const badgeHTML = () => {
    if (!p.badge) return '';
    const m = {new:['pb-new','NUEVO'],hot:['pb-hot','🔥 HOT'],off:['pb-off','-'+Math.round((1-p.price/p.old)*100)+'%']};
    const [cls,lbl] = m[p.badge]; return `<span class="pb ${cls}">${lbl}</span>`;
  };

  document.getElementById('pp-content').innerHTML = `
    <div class="pp-wrap">
      <div class="breadcrumb">
        <a onclick="navigate('home')">Inicio</a> /
        <a onclick="navigate('home','catalogo')">Catálogo</a> /
        <span style="color:var(--txt)">${p.name}</span>
      </div>
      <div class="pp-grid">
        <div class="pp-visual">
          <div class="pp-img-main" id="pp-main-img" style="background:${getVariants(p.id)[0].bg}" ${p.image ? `onclick="openLightbox('${p.image}','${p.name.replace(/'/g,"\\'")}')"` : ''}>
            <div id="pp-main-tint" style="position:absolute;inset:0;background:${getVariants(p.id)[0].tint};border-radius:18px;pointer-events:none"></div>
            ${p.image
              ? `<img src="${p.image}" style="position:relative;z-index:1;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 8px 32px rgba(108,99,255,0.3))" id="pp-main-emoji" alt="${p.name}"><span id="pp-main-emoji-fallback" style="display:none;position:relative;z-index:1;font-size:110px;filter:drop-shadow(0 8px 32px rgba(108,99,255,0.4))">${p.icon}</span>`
              : `<span id="pp-main-emoji" style="position:relative;z-index:1;font-size:110px;filter:drop-shadow(0 8px 32px rgba(108,99,255,0.4))">${p.icon}</span>`}
            <div style="position:absolute;top:12px;right:12px;z-index:2;display:flex;flex-direction:column;gap:4px;align-items:flex-end">${badgeHTML()}${p.rating >= 4.8 ? '<span class="pb pb-new" style="background:rgba(6,255,165,0.1);color:var(--c5);border-color:rgba(6,255,165,0.28)">TOP RATED</span>' : ''}</div>
          </div>
          <div class="pp-thumbs" id="pp-thumbs-row">
            ${p.image ? `
              <div class="pp-thumb active"
                   id="pp-thumb-0"
                   style="background:${getVariants(p.id)[0].bg};position:relative;overflow:hidden"
                   title="Imagen principal">
                <div style="position:absolute;inset:0;background:${getVariants(p.id)[0].tint}"></div>
                <img src="${p.image}" style="position:relative;z-index:1;width:36px;height:36px;object-fit:contain" alt="">
                <div style="position:absolute;bottom:3px;left:0;right:0;text-align:center;font-size:8px;color:rgba(255,255,255,0.6);font-weight:600;letter-spacing:0.3px">Imagen</div>
              </div>
            ` : ''}
          </div>
        </div>
        <div>
          <div class="pp-brand">${p.brand}</div>
          <h1 class="pp-title">${p.name}</h1>
          <div class="pp-rating-row">
            <span class="pp-stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5-Math.floor(p.rating))}</span>
            <span class="pp-rating-val">${p.rating}</span>
            <span class="pp-rating-cnt">(${Math.floor(p.rating*23+14)} reseñas)</span>
          </div>
          <div class="pp-price-block" style="margin-bottom:8px">
            <div style="display:flex;justify-content:flex-end;margin-bottom:4px">
              <span id="pp-stock-badge"></span>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
              <div>
                <div class="pp-price">${fmt(p.price)}</div>
                ${p.old ? `<div class="pp-price-old">${fmt(p.old)}</div><div class="pp-price-save">✓ Ahorras ${fmt(p.old-p.price)}</div>` : ''}
              </div>
              <div class="pp-qty-ctrl">
                <button class="pp-qty-btn" onclick="changePpQty(-1)">−</button>
                <span class="pp-qty-num" id="pp-qty-disp">1</span>
                <button class="pp-qty-btn" onclick="changePpQty(1)">+</button>
              </div>
            </div>
          </div>
          <button class="pp-add-btn" id="pp-add-btn" onclick="addToCartQty(${p.id})">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Agregar al carrito
          </button>
          <button class="pp-buy-now-btn" id="pp-buy-btn" onclick="buyNow(${p.id})">
            ⚡ Comprar ahora
          </button>
          <div class="pp-trust">
            <div class="pp-trust-item">🚚 Despacho gratis +$50.000</div>
            <div class="pp-trust-item">🔒 Webpay seguro</div>
            <div class="pp-trust-item">↩️ 30 días para devolver</div>
          </div>
        </div>
      </div>

      <div class="pp-section">
        <p class="pp-desc" style="margin-bottom:0">${desc}</p>
      </div>

      <div class="pp-section">
        <div class="pp-sec-title">Especificaciones técnicas</div>
        <table class="pp-specs-table">
          ${Object.entries(p.specs).map(([k,v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
          <tr><td>Garantía</td><td>12 meses ZonaPC</td></tr>
          <tr><td>SKU</td><td>${p.sku || `ZPC-${String(p.id).padStart(5,'0')}`}</td></tr>
          <tr><td>Disponibilidad</td><td>En stock  despacho 2448h</td></tr>
        </table>
      </div>

      <div class="pp-section">
        <div class="pp-sec-title">Reseñas de clientes</div>
        <div class="pp-reviews-grid">
          ${REVIEWS.map(r => `
            <div class="pp-review">
              <div class="pp-review-head">
                <div class="pp-review-avatar" style="background:${r.bg};color:${r.tc}">${r.av}</div>
                <div><div class="pp-review-name">${r.name}</div><div class="pp-review-date">${r.date}</div></div>
              </div>
              <div class="pp-review-stars">${'&'.repeat(r.r)}</div>
              <div class="pp-review-text">${r.txt}</div>
            </div>`).join('')}
        </div>
      </div>

      ${related.length ? `
      <div class="pp-section">
        <div class="pp-sec-title">Productos relacionados</div>
        <div class="pp-related-grid">
          ${related.map(rp => `
            <div class="prod-card" onclick="navigate('product',${rp.id})">
              <div class="prod-img-wrap" style="height:120px">
                ${rp.image
                  ? `<img src="${rp.image}" style="width:100%;height:100%;object-fit:contain;position:absolute;inset:0;padding:8px" alt="${rp.name}">`
                  : `<span class="prod-emoji" style="font-size:44px">${rp.icon}</span>`}
              </div>
              <div class="prod-body">
                <div class="prod-brand">${rp.brand}</div>
                <div class="prod-name">${rp.name}</div>
                <div class="prod-foot">
                  <span class="prod-price" style="font-size:14px">${fmt(rp.price)}</span>
                  <button class="add-btn" onclick="event.stopPropagation();addToCart(${rp.id})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                </div>
              </div>
            </div>`).join('')}
        </div>
      </div>` : ''}
    </div>`;
  setupProductImageZoom();
}

function setupProductImageZoom() {
  const frame = document.getElementById('pp-main-img');
  const media = document.getElementById('pp-main-emoji');
  if (!frame || !media) return;

  const zoomScale = 1.8;
  const updateZoom = (event) => {
    const rect = frame.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    media.style.transformOrigin = `${x}% ${y}%`;
    media.style.transform = `scale(${zoomScale})`;
  };

  const resetZoom = () => {
    media.style.transformOrigin = '50% 50%';
    media.style.transform = 'scale(1)';
  };

  frame.onmouseenter = updateZoom;
  frame.onmousemove = updateZoom;
  frame.onmouseleave = resetZoom;
}

function changePpQty(d) {
  const p = PRODUCTS.find(x => x.id === _currentParam);
  const maxQty = p ? Math.max(1, p.stock || 1) : 99;
  ppQty = Math.max(1, Math.min(maxQty, ppQty + d));
  const el = document.getElementById('pp-qty-disp');
  if (el) el.textContent = ppQty;
}

function addToCartQty(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p || p.stock <= 0) { showToast('Sin stock disponible'); return; }
  const ex = cart.find(x => x.id === id);
  const inCart = ex ? ex.qty : 0;
  const availableToAdd = Math.max(0, p.stock - inCart);
  if (availableToAdd <= 0) { showToast(`Stock máximo en carrito: ${p.stock}`); return; }
  const qtyToAdd = Math.min(ppQty, availableToAdd);
  if (ex) ex.qty += qtyToAdd; else cart.push({...p, qty: qtyToAdd});
  renderCart();
  showCartNotif(p.name);
}

// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""

