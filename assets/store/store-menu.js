// Renderiza las categorias en el menu desplegable de Catalogo
// Mega menu: renderiza categorias y subcategorias
let megaMenuActiveCat = null;

function renderCatalogoMenu() {
  const menu = document.getElementById('catalogo-menu');
  if (!menu) return;

  const cats = (window.STORE_PRODUCT_CATEGORIES || []).filter(cat => {
    if (cat.value === 'all') return false;
    return PRODUCTS.some(product => !isProductDeleted(product) && productHasCategory(product, cat.value));
  });

  if (!cats.length) {
    menu.innerHTML = '';
    return;
  }

  if (!megaMenuActiveCat || !cats.some(c => c.value === megaMenuActiveCat)) {
    megaMenuActiveCat = cats[0].value;
  }

  const left = cats.map(cat =>
    `<button class='catalogo-mega-menu-cat${cat.value === megaMenuActiveCat ? ' active' : ''}' onmouseenter='megaMenuSetActive("${cat.value}")'>
      <span class='catalogo-mega-menu-cat-icon'>${cat.icon || '•'}</span>${cat.label}
    </button>`
  ).join('');

  const activeCat = cats.find(c => c.value === megaMenuActiveCat);
  const activeSubs = activeCat && activeCat.subs
    ? activeCat.subs.filter(sub => {
        const key = sub.value || sub.filter || sub.label;
        return PRODUCTS.some(product => !isProductDeleted(product) && productMatchesSubcategory(product, key));
      })
    : [];

  const right = activeSubs.length
    ? `<div class='catalogo-mega-menu-title'>${activeCat.label}</div>` +
       activeSubs.map(sub =>
         `<button class='catalogo-mega-menu-sub' onclick='openCatalogCategory("${activeCat.value}","${sub.value || sub.filter || sub.label}");hideCatalogoMenu()'>${sub.label}</button>`
       ).join('')
    : `<div style='color:var(--txt3);font-size:13px'>Sin subcategorias</div>`;

  menu.innerHTML = `<div class='catalogo-mega-menu'>
    <div class='catalogo-mega-menu-cats'>${left}</div>
    <div class='catalogo-mega-menu-subs'>${right}</div>
  </div>`;
}

function megaMenuSetActive(val) {
  megaMenuActiveCat = val;
  renderCatalogoMenu();
}

function showCatalogoMenu() {
  if (window.innerWidth <= 900) return;
  const menu = document.getElementById('catalogo-menu');
  const parent = document.querySelector('.catalogo-menu-parent');
  if (menu) menu.classList.add('show');
  if (parent) parent.classList.add('open');
  renderCatalogoMenu();
}

function hideCatalogoMenu() {
  const menu = document.getElementById('catalogo-menu');
  const parent = document.querySelector('.catalogo-menu-parent');
  if (menu) menu.classList.remove('show');
  if (parent) parent.classList.remove('open');
}

function toggleCatalogoMenu(e) {
  if (window.innerWidth <= 900) return;
  e.preventDefault();
  const menu = document.getElementById('catalogo-menu');
  const parent = document.querySelector('.catalogo-menu-parent');
  if (menu) {
    if (menu.classList.contains('show')) {
      menu.classList.remove('show');
      if (parent) parent.classList.remove('open');
    } else {
      renderCatalogoMenu();
      menu.classList.add('show');
      if (parent) parent.classList.add('open');
    }
  }
}

document.addEventListener('click', function(e) {
  const menu = document.getElementById('catalogo-menu');
  const btn = document.getElementById('catalogo-menu-btn');
  const parent = document.querySelector('.catalogo-menu-parent');
  if (!menu || !btn) return;
  if (!menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.remove('show');
    if (parent) parent.classList.remove('open');
  }
});
