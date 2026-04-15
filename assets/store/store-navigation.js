//  ROUTER  stack-based + History API (browser back button)
// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""
let navStack = [];  // history stack: [{type, param}]

function navigate(type, param, anchor) {
  // Push current view onto stack before leaving (unless going home from home)
  const currentView = document.querySelector('.view.active');
  const currentId   = currentView ? currentView.id.replace('view-','') : 'home';
  if (!(type === 'home' && currentId === 'home')) {
    navStack.push({type: currentId, param: _currentParam});
  }
  _currentParam = param;
  if (type === 'product') {
    // Buscar el producto por ID si es número, o por slug si es string
    let p = null;
    if (typeof param === 'number' || /^[0-9]+$/.test(param)) {
      p = PRODUCTS.find(x => x.id == param);
    } else if (typeof param === 'string') {
      p = PRODUCTS.find(x => (x.brand + '-' + x.name).toLowerCase().replace(/\s+/g,'-') === param);
    }
    let slug = param;
    if (p) {
      slug = (p.brand + '-' + p.name).toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9\-]/g,'');
    }
    history.pushState({view: type, param: p ? p.id : param}, '', `/producto/${slug}`);
    param = p ? p.id : param;
  } else if (type === 'home') {
    history.pushState({view: type, param: param || null}, '', '/');
  } else {
    history.pushState({view: type, param: param || null}, '');
  }

  if (type === 'home') {
    const _anchor = anchor || param;
    if (currentId === 'home') {
      // Already on home  skip view switch and scroll-to-top, just scroll to anchor
      if (_anchor) {
        const el = document.getElementById(_anchor);
        if (el) el.scrollIntoView({behavior: 'smooth'});
      } else {
        window.scrollTo({top: 0, behavior: 'smooth'});
      }
    } else {
      showView('home');
      if (_anchor) setTimeout(() => {
        const el = document.getElementById(_anchor);
        if (el) el.scrollIntoView({behavior: 'smooth'});
      }, 60);
    }
  } else if (type === 'product') {
    renderProductPage(param);
    showView('product');
    const _sp = PRODUCTS.find(x => x.id === param);
    if (_sp) initProductPageStock(_sp);
  } else if (type === 'page') {
    renderStaticPage(param);
    showView('page');
  }
  updateBackBtn();
}

let _currentParam = null;

function goBack() {
  history.back();
}

function updateBackBtn() {
  // Show/hide the floating back button
  const btn = document.getElementById('floating-back');
  if (btn) btn.style.display = navStack.length ? 'flex' : 'none';
}

function showView(name) {
  // Deshabilitar scroll suave e ir al tope ANTES de cambiar la vista
  document.documentElement.style.scrollBehavior = 'auto';
  document.body.style.scrollBehavior = 'auto';
  window.scrollTo({top: 0, left: 0, behavior: 'instant'});
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  ['home','product','page'].forEach(v => {
    document.getElementById('view-'+v).classList.toggle('active', v === name);
  });
  setTimeout(() => {
    document.documentElement.style.scrollBehavior = '';
    document.body.style.scrollBehavior = '';
  }, 150);
  updateFloatingCart();
  updateBackBtn();
}

// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""

