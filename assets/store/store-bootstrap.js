// """ BOOT """"""""""""""""""""""""""""""""""""""""""""""""
// Handle browser back/forward buttons
window.addEventListener('popstate', (event) => {
  if (event.state?.view) {
    const {view, param} = event.state;
    _currentParam = param;
    
    if (view === 'home') {
      showView('home');
      window.scrollTo(0, 0);
    } else if (view === 'product') {
      renderProductPage(param);
      showView('product');
      window.scrollTo(0, 0);
    } else if (view === 'page') {
      renderStaticPage(param);
      showView('page');
      window.scrollTo(0, 0);
    }
    updateBackBtn();
  } else {
    // No state, go to home
    showView('home');
    window.scrollTo(0, 0);
    updateBackBtn();
  }
});

// Initialize state on first load
history.replaceState({view: 'home', param: null}, '');

function clearStoreSearchMemory() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  searchInput.value = '';
  searchInput.defaultValue = '';
  searchInput.setAttribute('value', '');
  searchInput.setAttribute('autocomplete', 'new-password');

  // Some browsers restore autofill after paint; clear again once the page settles.
  searchInput.readOnly = true;
  requestAnimationFrame(() => {
    searchInput.readOnly = false;
    searchInput.value = '';
  });
}

async function initializeStore() {
  clearStoreSearchMemory();
  renderAuthState();
  buildCountdown();
  renderCategoryPills();
  populateStoreCategoryFilter();
  syncCategoryFilterUI();
  // Activate WhatsApp button pulse animation
  const whatsappBtn = document.getElementById('floating-whatsapp');
  if (whatsappBtn) whatsappBtn.classList.add('pulse');
  try {
    await Promise.all([fetchCurrentUser(), fetchProducts()]);
  } catch (error) {
    renderShowcase();
    renderProducts();
    showToast('No se pudo conectar con el backend');
  }

  clearStoreSearchMemory();
  setTimeout(clearStoreSearchMemory, 150);
  setTimeout(clearStoreSearchMemory, 500);

  // Check if we need to open checkout (coming from tecno-tv.html)
  if (sessionStorage.getItem('zonapc_open_checkout') === 'true') {
    sessionStorage.removeItem('zonapc_open_checkout');
    setTimeout(() => {
      if (cart.length > 0) {
        openCheckout();
      }
    }, 500);
  }
}

initializeStore();

