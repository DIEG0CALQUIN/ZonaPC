//  HERO SHOWCASE
// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""
function renderShowcase() {
  const el = document.getElementById('hero-showcase');
  if (!el) return;
  const visibleProducts = PRODUCTS.filter(p => !isProductDeleted(p));
  const p = visibleProducts.find(x => x.badge === 'hot') || visibleProducts[0];
  if (!p) { el.innerHTML = ''; return; }
  const specs = Object.entries(p.specs || {}).slice(0, 4);
  el.innerHTML = `
    <div class="showcase-card" style="cursor:pointer" onclick="navigate('product',${p.id})">
      <span class="showcase-badge">BESTSELLER</span>
      ${p.image
        ? `<img src="${p.image}" onerror="this.style.display='none';this.nextElementSibling.style.display=''" style="width:100%;max-height:140px;object-fit:contain;margin-bottom:14px;display:block" alt="${p.name}"><span class="showcase-icon" style="display:none">${p.icon}</span>`
        : `<span class="showcase-icon">${p.icon}</span>`}
      <div class="showcase-brand">${p.brand}</div>
      <div class="showcase-name">${p.name}</div>
      <div class="showcase-specs">
        ${specs.map(([k,v]) => `<div class="sc-spec"><span class="sc-spec-k">${k}</span><span class="sc-spec-v">${v}</span></div>`).join('')}
      </div>
      <div class="showcase-foot">
        <div class="showcase-price">${fmt(p.price)}</div>
        <button class="showcase-btn" onclick="event.stopPropagation();navigate('product',${p.id})">Ver producto  </button>
      </div>
    </div>`;
}

// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""
//  PRODUCTS
// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""
function renderProducts() {
  const q = (document.getElementById('search-input').value || '').toLowerCase();
  const sort = document.getElementById('sort-select').value;
  syncCategoryFilterUI();
  let list = PRODUCTS.filter(p => {
    if (isProductDeleted(p)) return false;
    const mc = productHasCategory(p, currentCat);
    const msc = productMatchesSubcategory(p, currentSubcat);
    const ms = p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    return mc && msc && ms;
  });
  if (sort === 'price-asc')  list.sort((a,b) => a.price - b.price);
  else if (sort === 'price-desc') list.sort((a,b) => b.price - a.price);
  else if (sort === 'name')  list.sort((a,b) => a.name.localeCompare(b.name));

  document.getElementById('result-count').textContent = list.length + ' productos';

  const badgeHTML = p => {
    if (!p.badge) return '';
    const m = {new:['pb-new','NUEVO'],hot:['pb-hot','x HOT'],off:['pb-off','-'+Math.round((1-p.price/p.old)*100)+'%']};
    const [cls,lbl] = m[p.badge];
    return `<span class="pb ${cls}">${lbl}</span>`;
  };

  // Per-card qty state
  if (!window._cardQty) window._cardQty = {};

  document.getElementById('prod-grid').innerHTML = list.map(p => {
    if (!window._cardQty[p.id]) window._cardQty[p.id] = 1;
    const sq = stockQty(p.stock);
    return `
    <div class="prod-card ${p.badge === 'hot' ? 'hot-product' : ''}" onclick="navigate('product',${p.id})">
      <div class="prod-img-wrap">
        ${p.image
          ? `<img src="${p.image}" onerror="this.style.display='none';this.nextElementSibling.style.display=''" style="width:100%;height:100%;object-fit:contain;position:absolute;inset:0;padding:12px" alt="${p.name}"><span class="prod-emoji" style="display:none">${p.icon}</span>`
          : `<span class="prod-emoji">${p.icon}</span>`}
      </div>
      <div class="prod-body">
        <div class="prod-brand-row">
          <span class="prod-brand">${p.brand}</span>
          <span class="prod-rating">${'&'.repeat(Math.floor(p.rating))} ${p.rating}</span>
        </div>
        <div class="prod-name">${p.name}</div>
        <div class="prod-sku-row">
          <span class="prod-sku">${p.sku || `ZPC-${String(p.id).padStart(5,'0')}`}</span>
          <span class="stock-badge ${sq.cls}"><span class="stock-dot ${sq.dot}"></span>${sq.label}</span>
        </div>
        <div class="prod-foot">
          <div>
            <span class="prod-price">${fmt(p.price)}</span>
            ${p.old ? `<span class="prod-old-price">${fmt(p.old)}</span>` : ''}
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

function setCat(cat, el) {
  currentCat = cat;
  currentSubcat = null;
  if (el && el.classList) {
    document.querySelectorAll('.cat-pill').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
  }
  syncCategoryFilterUI();
  renderProducts();
}

// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""

