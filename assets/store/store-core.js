//  STATE
// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const API_BASE = 'http://localhost:3000/api';
const AUTH_TOKEN_KEY = 'zonapc_auth_token';
const CART_STORAGE_KEY = 'zonapc_cart';
const fmt = n => '$' + parseInt(n || 0, 10).toLocaleString('es-CL');

let authToken = '';
let currentUser = null;
let currentCat = 'all';
let currentSubcat = null;
let cart = [];
let pendingCheckoutAfterAuth = false;
let paying = false;
let ppQty = 1;
const STORE_CATEGORY_PARENT_BY_VALUE = (window.STORE_PRODUCT_CATEGORIES || []).reduce((map, category) => {
  map[category.value] = category.value;
  (category.subs || []).forEach(sub => {
    const key = String(sub.value || sub.filter || '').trim();
    if (key && !map[key]) map[key] = category.value;
  });
  return map;
}, {});

function loadAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY) || '';
  } catch (_) {
    return '';
  }
}

function saveAuthToken(token) {
  try {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (_) {}
}

function getUserInitials(name) {
  return String(name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('') || 'U';
}

function setAuthError(message) {
  const el = document.getElementById('auth-error');
  if (!el) return false;
  el.textContent = message || '';
  el.style.display = message ? 'block' : 'none';
  return false;
}

function clearAuthError() {
  setAuthError('');
}

function loadCart(userId = null) {
  try {
    const key = userId ? `${CART_STORAGE_KEY}_u${userId}` : CART_STORAGE_KEY;
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function isProductDeleted(product) {
  if (!product) return true;
  const deletedFlag = product.deleted === true;
  const status = String(product.status || '').trim().toLowerCase();
  return deletedFlag || status === 'borrado' || status === 'eliminado';
}

function saveCart() {
  try {
    const key = currentUser ? `${CART_STORAGE_KEY}_u${currentUser.id}` : CART_STORAGE_KEY;
    localStorage.setItem(key, JSON.stringify(cart));
    if (currentUser) localStorage.removeItem(CART_STORAGE_KEY);
  } catch (_) {}
}

async function api(path, options = {}) {
  const headers = {...(options.headers || {})};
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json; charset=UTF-8';
  }
  const response = await fetch(API_BASE + path, {...options, headers});
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Error de servidor');
  return data;
}

function renderCategoryPills() {}

function getProductCategories(product) {
  if (!product) return [];

  const values = [];
  const push = value => {
    const key = String(value || '').trim();
    if (!key || values.includes(key)) return;
    values.push(key);
    const parent = STORE_CATEGORY_PARENT_BY_VALUE[key];
    if (parent && !values.includes(parent)) values.push(parent);
  };

  const rawCategories = Array.isArray(product.categories) ? product.categories : [];
  rawCategories.forEach(push);
  push(product.cat);
  inferStoreCategories(product).forEach(push);

  if (!values.length) push('pc');
  return values;
}

function inferStoreCategories(product) {
  const text = [
    product.name,
    product.brand,
    product.desc,
    product.cat,
    ...(Array.isArray(product.categories) ? product.categories : [])
  ].join(' ').toLowerCase();

  const inferred = [];
  const add = (...values) => values.forEach(value => {
    if (value && !inferred.includes(value)) inferred.push(value);
  });

  if (/laptop|notebook|ultrabook/.test(text)) add('laptops');
  if (/monitor|display/.test(text) || (/pantalla/.test(text) && !/laptop|notebook|ultrabook/.test(text))) add('monitores');
  if (/mousepad/.test(text)) add('mousepads');
  if (/\bmouse\b/.test(text) && !/mousepad/.test(text)) add('mouse');
  if (/teclado|keyboard/.test(text)) add('teclados');
  if (/headset|auriculares|audifonos|audífonos/.test(text)) add('audio');
  if (/microfono|micrófono/.test(text)) add('microfonos');
  if (/webcam/.test(text)) add('webcams', 'streaming');
  if (/stream|streaming|capture|captura/.test(text)) add('streaming');
  if (/\bgpu\b|rtx|gtx|radeon|tarjeta grafica|tarjeta gráfica/.test(text)) add('gpu');
  if (/\bcpu\b|procesador/.test(text)) add('cpu');
  if (/ram|ddr4|ddr5|memoria/.test(text)) add('memorias');
  if (/ssd|hdd|nvme|m\.2|almacenamiento/.test(text)) add('almacenamiento');
  if (/fuente|psu|power supply/.test(text)) add('fuentes-poder');
  if (/gabinete|case|tower/.test(text)) add('gabinetes');
  if (/cooler|refrigeracion|refrigeración|fan/.test(text)) add('refrigeracion');
  if (/cable|adaptador|adapter/.test(text)) add('cables');
  if (/router|wifi|wi-fi|ethernet|red/.test(text)) add('redes');
  if (/impresora|scanner|escaner|escáner/.test(text)) add('impresoras');
  if (/silla/.test(text)) add('sillas-gaming');
  if (/iluminacion|iluminación|rgb/.test(text)) add('iluminacion');
  if (/windows|office|licencia|software|antivirus/.test(text)) add('software');

  return inferred;
}

function normalizeStoreProduct(product) {
  const categories = getProductCategories(product);
  return {
    ...product,
    categories,
    cat: categories[0] || product.cat || 'pc'
  };
}

function productHasCategory(product, category) {
  if (!category || category === 'all') return true;
  return getProductCategories(product).includes(category);
}

function populateStoreCategoryFilter() {
  const select = document.getElementById('cat-select');
  if (!select) return;
  // SOLO categorías que tienen productos
  const categoriesWithProducts = (window.STORE_PRODUCT_CATEGORIES || []).filter(cat => {
    if (cat.value === 'all') return true;
    return PRODUCTS.some(p => p.cat === cat.value && !isProductDeleted(p));
  });
  select.innerHTML = categoriesWithProducts.map(cat => `<option value="${cat.value}">${cat.label}</option>`).join('');
  if (!categoriesWithProducts.some(cat => cat.value === currentCat)) currentCat = 'all';
  select.value = currentCat;
}

function syncCategoryFilterUI() {
  const select = document.getElementById('cat-select');
  if (select && select.value !== currentCat) select.value = currentCat;
}

function productMatchesSubcategory(product, subcategory) {
  if (!subcategory) return true;
  const needle = String(subcategory).trim().toLowerCase();
  const haystack = [
    product.name,
    product.brand,
    product.cat,
    Object.keys(product.specs || {}).join(' '),
    Object.values(product.specs || {}).join(' '),
    product.desc
  ].join(' ').toLowerCase();
  return haystack.includes(needle);
}

function openCatalogCategory(cat, subcat = null) {
  currentCat = cat || 'all';
  currentSubcat = subcat || null;
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.value = 'default';
  syncCategoryFilterUI();
  renderProducts();
  navigate('home', 'catalogo');
}

async function fetchCurrentUser() {
  authToken = loadAuthToken();
  if (!authToken) {
    currentUser = null;
    cart = loadCart(null);
    renderCart();
    renderAuthState();
    return null;
  }

  try {
    const data = await api('/auth/me', {
      headers: {Authorization: `Bearer ${authToken}`}
    });
    currentUser = data.user || null;
    cart = loadCart(currentUser ? currentUser.id : null);
  } catch (_) {
    authToken = '';
    saveAuthToken('');
    currentUser = null;
    cart = loadCart(null);
  }

  renderCart();
  renderAuthState();
  return currentUser;
}

async function fetchProducts() {
  const items = await api('/products');
  const list = (Array.isArray(items) ? items : []).filter(p => !isProductDeleted(p));
  PRODUCTS.length = 0;
  PRODUCTS.push(...list);
  renderShowcase();
  renderProducts();
  validateCartStock();
  if (document.getElementById('view-product').classList.contains('active') && _currentParam) {
    renderProductPage(_currentParam);
  }
  return PRODUCTS;
}

function populateStoreCategoryFilter() {
  const select = document.getElementById('cat-select');
  if (!select) return;
  const baseOptions = [{value: 'all', label: 'Todas las categorias'}];
  const availableOptions = (window.STORE_PRODUCT_CATEGORIES || [])
    .filter(cat => cat.value !== 'all')
    .flatMap(cat => {
      const items = [{value: cat.value, label: cat.label}].concat(
        (cat.subs || []).map(sub => ({
          value: sub.value || sub.filter || '',
          label: sub.label
        }))
      );
      return items.filter(item => item.value && PRODUCTS.some(p => !isProductDeleted(p) && productHasCategory(p, item.value)));
    });
  const seen = new Set();
  const categoriesWithProducts = baseOptions.concat(
    availableOptions.filter(option => {
      if (seen.has(option.value)) return false;
      seen.add(option.value);
      return true;
    })
  );
  select.innerHTML = categoriesWithProducts.map(cat => `<option value="${cat.value}">${cat.label}</option>`).join('');
  if (!categoriesWithProducts.some(cat => cat.value === currentCat)) currentCat = 'all';
  select.value = currentCat;
}

function productMatchesSubcategory(product, subcategory) {
  if (!subcategory) return true;
  const needle = String(subcategory).trim().toLowerCase();
  if (productHasCategory(product, needle)) return true;
  const haystack = [
    product.name,
    product.brand,
    product.cat,
    (product.categories || []).join(' '),
    Object.keys(product.specs || {}).join(' '),
    Object.values(product.specs || {}).join(' '),
    product.desc
  ].join(' ').toLowerCase();
  return haystack.includes(needle);
}

async function fetchProducts() {
  const items = await api('/products');
  const list = (Array.isArray(items) ? items : [])
    .map(normalizeStoreProduct)
    .filter(p => !isProductDeleted(p));
  PRODUCTS.length = 0;
  PRODUCTS.push(...list);
  renderShowcase();
  populateStoreCategoryFilter();
  renderProducts();
  validateCartStock();
  if (document.getElementById('view-product').classList.contains('active') && _currentParam) {
    renderProductPage(_currentParam);
  }
  return PRODUCTS;
}

async function persistOrderFromCart(orderId, total) {
  if (!currentUser) return null;
  const addressParts = [
    document.getElementById('f-dir').value.trim(),
    document.getElementById('f-city').value.trim(),
    document.getElementById('f-region').value.trim()
  ].filter(Boolean);
  return api('/orders', {
    method: 'POST',
    headers: {Authorization: `Bearer ${authToken}`},
    body: JSON.stringify({
      id: orderId,
      client: document.getElementById('f-nombre').value.trim() || currentUser.name || '',
      email: document.getElementById('f-email').value.trim() || currentUser.email || '',
      addr: addressParts.join(', '),
      items: cart.map(({id, name, price, qty, icon, image}) => ({id, name, price, qty, icon, image})),
      total,
      status: 'Pendiente',
      date: new Date().toLocaleDateString('es-CL'),
      userId: currentUser.id
    })
  });
}

function updateAddressHelperText(message, isError = false) {
  const help = document.getElementById('f-dir-help');
  if (!help) return;
  help.textContent = message;
  help.style.color = isError ? '#fca5a5' : 'var(--txt3)';
}

function normalizeRegionName(value) {
  if (!value) return '';
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/region\s+metropolitana\s+de\s+santiago/g, 'metropolitana')
    .replace(/region\s+de\s+/g, '')
    .replace(/region\s+/g, '')
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function setRegionFromGoogle(regionLongName) {
  const select = document.getElementById('f-region');
  if (!select || !regionLongName) return;
  const normalized = normalizeRegionName(regionLongName);
  const options = Array.from(select.options);
  const direct = options.find(opt => normalizeRegionName(opt.textContent || opt.value) === normalized);
  if (direct) {
    select.value = direct.value;
    return;
  }
  const partial = options.find(opt => normalizeRegionName(opt.textContent || opt.value).includes(normalized) || normalized.includes(normalizeRegionName(opt.textContent || opt.value)));
  if (partial) select.value = partial.value;
}

async function setupChileAddressAutocomplete() {
  updateAddressHelperText('Ingresa la direccion manualmente.');
  return false;
}

async function validateAddressWithGoogle() {
  return {ok: true, skipped: true};
}

function renderAuthState() {
  const authTrigger = document.getElementById('auth-trigger');
  const registerTrigger = document.getElementById('register-trigger');
  const accountTrigger = document.getElementById('account-trigger');
  const navLogoutBtn = document.getElementById('nav-logout-btn');
  const accountAvatar = document.getElementById('account-avatar');
  const accountName = document.getElementById('account-name');
  const profileAvatar = document.getElementById('profile-avatar');
  const profileName = document.getElementById('profile-name');
  const profileEmail = document.getElementById('profile-email');
  const profilePhone = document.getElementById('profile-phone');
  const authShell = document.getElementById('auth-shell');
  const profileShell = document.getElementById('profile-shell');
  if (!authTrigger || !registerTrigger || !accountTrigger || !navLogoutBtn) return;

  if (currentUser) {
    authTrigger.style.display = 'none';
    registerTrigger.style.display = 'none';
    accountTrigger.style.display = 'flex';
    navLogoutBtn.style.display = 'inline-flex';
    accountAvatar.textContent = getUserInitials(currentUser.name);
    accountName.textContent = currentUser.name.split(' ')[0] || 'Mi cuenta';
    if (profileAvatar) profileAvatar.textContent = getUserInitials(currentUser.name);
    if (profileName) profileName.textContent = currentUser.name;
    if (profileEmail) profileEmail.textContent = currentUser.email;
    if (profilePhone) profilePhone.textContent = currentUser.phone || 'No registrado';
    populateProfileEditFields();
    if (authShell) authShell.style.display = 'none';
    if (profileShell) profileShell.style.display = 'block';
    // Update mobile menu drawer
    const mmGreeting = document.getElementById('mobile-menu-greeting');
    const mmSubtext = document.getElementById('mobile-menu-subtext');
    const mmLoginWrap = document.getElementById('mobile-menu-login-wrap');
    if (mmGreeting) mmGreeting.textContent = '¡Hola, ' + (currentUser.name.split(' ')[0] || '') + '!';
    if (mmSubtext) mmSubtext.textContent = currentUser.email;
    if (mmLoginWrap) mmLoginWrap.style.display = 'none';
    loadUserOrders();
    loadUserTickets();
  } else {
    authTrigger.style.display = 'flex';
    registerTrigger.style.display = 'inline-flex';
    accountTrigger.style.display = 'none';
    navLogoutBtn.style.display = 'none';
    if (authShell) authShell.style.display = 'block';
    if (profileShell) profileShell.style.display = 'none';
    // Reset mobile menu drawer
    const mmGreeting = document.getElementById('mobile-menu-greeting');
    const mmSubtext = document.getElementById('mobile-menu-subtext');
    const mmLoginWrap = document.getElementById('mobile-menu-login-wrap');
    if (mmGreeting) mmGreeting.textContent = '¡Hola!';
    if (mmSubtext) mmSubtext.textContent = 'Ingresa a tu cuenta';
    if (mmLoginWrap) mmLoginWrap.style.display = 'block';
  }
}

function switchAuthTab(tab) {
  clearAuthError();
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');
  document.getElementById('panel-login').classList.toggle('active', tab === 'login');
  document.getElementById('panel-register').classList.toggle('active', tab === 'register');
  document.getElementById('panel-forgot').classList.toggle('active', tab === 'forgot');
  document.getElementById('panel-reset').classList.toggle('active', tab === 'reset');
}


function toggleMobileMenu() {
  document.getElementById('mobile-menu-drawer').classList.toggle('open');
  document.getElementById('mobile-menu-overlay').classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('mobile-menu-drawer').classList.remove('open');
  document.getElementById('mobile-menu-overlay').classList.remove('open');
}
function openLightbox(src, alt) {
  const el = document.getElementById('lightbox-img');
  el.src = src;
  el.alt = alt || '';
  document.getElementById('lightbox-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox-overlay').classList.remove('open');
  document.body.style.overflow = '';
}
function resetAllFilters() {
  currentCat = 'all';
  currentSubcat = null;
  
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  const catSelect = document.getElementById('cat-select');
  
  if (searchInput) searchInput.value = '';
  if (sortSelect) sortSelect.value = 'default';
  if (catSelect) catSelect.value = 'all';
  
  syncCategoryFilterUI();
  renderProducts();
}

function filterCat(cat) {
  // Reinicia completamente el filtro cada vez que cambias categoría
  currentCat = cat;
  currentSubcat = null;
  
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  const catSelect = document.getElementById('cat-select');
  
  if (searchInput) searchInput.value = '';
  if (sortSelect) sortSelect.value = 'default';
  
  syncCategoryFilterUI();
  renderProducts();
  navigate('home', 'catalogo');
}

function goHomeResetCatalog() {
  currentCat = 'all';
  currentSubcat = null;
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  const catSelect = document.getElementById('cat-select');
  if (searchInput) searchInput.value = '';
  if (sortSelect) sortSelect.value = 'default';
  if (catSelect) catSelect.value = 'all';
  syncCategoryFilterUI();
  renderProducts();
  navigate('home');
}

function toggleAuthMenu(e) {
  e.stopPropagation();
  const wrap = document.getElementById('auth-menu-wrap');
  const dropdown = document.getElementById('auth-dropdown');
  if (!wrap || !dropdown) return;
  // En desktop, abrir directo el modal de login
  if (window.innerWidth > 768) { openAuthModal('login'); return; }
  const isOpen = dropdown.classList.contains('open');
  dropdown.classList.toggle('open', !isOpen);
  wrap.classList.toggle('open', !isOpen);
}
function closeAuthMenu() {
  const wrap = document.getElementById('auth-menu-wrap');
  const dropdown = document.getElementById('auth-dropdown');
  if (wrap) wrap.classList.remove('open');
  if (dropdown) dropdown.classList.remove('open');
}
document.addEventListener('click', () => closeAuthMenu());

function openAuthModal(mode = 'login', fromCheckout = false) {
  pendingCheckoutAfterAuth = fromCheckout;
  const overlay = document.getElementById('auth-overlay');
  if (!overlay) return;
  const showProfileMode = mode === 'profile' && !!currentUser;
  overlay.classList.toggle('profile-mode', showProfileMode);
  clearAuthError();
  if (currentUser || mode === 'profile') {
    renderAuthState();
  } else {
    renderAuthState();
    switchAuthTab(mode === 'register' ? 'register' : 'login');
  }
  overlay.classList.add('open');
  history.pushState({modal: 'auth'}, '');
}

function closeAuthModal(preserveIntent = false) {
  const overlay = document.getElementById('auth-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    overlay.classList.remove('profile-mode');
  }
  if (!preserveIntent) pendingCheckoutAfterAuth = false;
  clearAuthError();
}

function prefillCheckoutFromUser() {
  if (!currentUser) return;
  const map = {
    'f-nombre': currentUser.name || '',
    'f-email': currentUser.email || '',
    'f-tel': currentUser.phone || '',
  };
  Object.entries(map).forEach(([id, value]) => {
    const field = document.getElementById(id);
    if (field && !field.value) field.value = value;
  });
}

function splitUserName(fullName) {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return {firstName: '', lastName: ''};
  if (parts.length === 1) return {firstName: parts[0], lastName: ''};
  return {firstName: parts.slice(0, -1).join(' '), lastName: parts.slice(-1).join('')};
}

function populateProfileEditFields() {
  if (!currentUser) return;
  const nameParts = splitUserName(currentUser.name);
  const firstNameInput = document.getElementById('profile-edit-name');
  const lastNameInput = document.getElementById('profile-edit-lastname');
  const phoneInput = document.getElementById('profile-edit-phone');
  const emailInput = document.getElementById('profile-edit-email');
  if (firstNameInput) firstNameInput.value = nameParts.firstName;
  if (lastNameInput) lastNameInput.value = nameParts.lastName;
  if (phoneInput) phoneInput.value = String(currentUser.phone || '').replace(/\D/g, '').slice(0, 8);
  if (emailInput) emailInput.value = currentUser.email || '';
}

function openProfileEdit() {
  const box = document.getElementById('profile-edit-box');
  if (!box || !currentUser) return;
  populateProfileEditFields();
  box.style.display = 'block';
}

function closeProfileEdit() {
  const box = document.getElementById('profile-edit-box');
  if (box) box.style.display = 'none';
}

async function saveProfileData() {
  if (!currentUser) return;
  const firstName = (document.getElementById('profile-edit-name').value || '').trim();
  const lastName = (document.getElementById('profile-edit-lastname').value || '').trim();
  const phone = (document.getElementById('profile-edit-phone').value || '').replace(/\D/g, '').slice(0, 8);
  const name = [firstName, lastName].filter(Boolean).join(' ').trim();
  if (!firstName || !lastName) {
    showToast('Completa nombre y apellido');
    return;
  }
  if (phone && !/^[0-9]{8}$/.test(phone)) {
    showToast('Telefono invalido. Debe tener 8 digitos');
    return;
  }
  try {
    const data = await api('/auth/profile', {
      method: 'PUT',
      headers: {Authorization: `Bearer ${authToken}`},
      body: JSON.stringify({name, phone})
    });
    currentUser = data.user || currentUser;
    renderAuthState();
    prefillCheckoutFromUser();
    closeProfileEdit();
    showToast('Datos actualizados');
  } catch (error) {
    showToast(error.message || 'No se pudieron actualizar los datos');
  }
}

function completeAuth(user, message) {
  currentUser = user;
  // Guardar usuario en localStorage para sincronización con otras páginas
  localStorage.setItem('zonapc_user', JSON.stringify(user));
  // Cargar el carrito del usuario que acaba de iniciar sesión
  cart = loadCart(user.id);
  renderCart();
  renderAuthState();
  prefillCheckoutFromUser();
  closeAuthModal(true);
  showToast(message);
  if (pendingCheckoutAfterAuth && cart.length) {
    pendingCheckoutAfterAuth = false;
    openCheckout();
  }
}

async function registerUser() {
  const firstName = document.getElementById('register-name').value.trim();
  const lastName = document.getElementById('register-lastname').value.trim();
  const name = [firstName, lastName].filter(Boolean).join(' ');
  const phone = document.getElementById('register-phone').value.trim();
  const email = document.getElementById('register-email').value.trim().toLowerCase();
  const password = document.getElementById('register-password').value;
  if (!firstName || !lastName || !email || !password) return setAuthError('Completa nombre, apellido, email y contraseña.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setAuthError('Ingresa un email válido.');
  if (password.length < 6) return setAuthError('La contraseña debe tener al menos 6 caracteres.');

  try {
    const data = await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify({name, phone, email, password})
    });
    authToken = data.token;
    saveAuthToken(authToken);
    completeAuth(data.user, 'Cuenta creada y sesión iniciada');
  } catch (error) {
    setAuthError(error.message);
  }
}

async function loginUser() {
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  if (!email || !password) return setAuthError('Ingresa email y contraseña.');
  try {
    const data = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({email, password})
    });
    authToken = data.token;
    saveAuthToken(authToken);
    completeAuth(data.user, 'Sesión iniciada');
  } catch (error) {
    setAuthError(error.message);
  }
}

function triggerGoogleSignIn() {
  if (!window.google || !window.google.accounts) {
    return setAuthError('El servicio de Google no está disponible. Revisa tu conexión.');
  }
  
  // Crear un contenedor invisible para el botón de Google
  const container = document.createElement('div');
  container.id = 'google-signin-container';
  container.style.display = 'none';
  document.body.appendChild(container);
  
  // Inicializar GSI y renderizar botón
  window.google.accounts.id.initialize({
    client_id: '183373903027-ct7n06nrfa7jhls3sr9kicamobll13kk.apps.googleusercontent.com',
    callback: handleGoogleCredential,
    auto_select: false,
  });
  
  window.google.accounts.id.renderButton(container, {
    type: 'standard',
    size: 'large',
    theme: 'dark',
  });
  
  // Simular click en el botón renderizado para abrir el popup
  setTimeout(() => {
    const btn = container.querySelector('div[role="button"]');
    if (btn) {
      btn.click();
    } else {
      setAuthError('No se pudo abrir Google Sign-In. Intenta nuevamente.');
    }
  }, 100);
  
  // Limpiar después de un tiempo
  setTimeout(() => {
    const el = document.getElementById('google-signin-container');
    if (el) el.remove();
  }, 3000);
}

async function handleGoogleCredential(response) {
  try {
    const data = await api('/auth/google', {
      method: 'POST',
      body: JSON.stringify({credential: response.credential})
    });
    authToken = data.token;
    saveAuthToken(authToken);
    completeAuth(data.user, 'Sesión iniciada con Google');
  } catch (error) {
    setAuthError(error.message || 'No se pudo iniciar sesión con Google');
  }
}

async function sendForgotPasswordCode() {
  const email = document.getElementById('forgot-email').value.trim().toLowerCase();
  if (!email) return setAuthError('Ingresa tu email.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setAuthError('Ingresa un email válido.');

  try {
    const data = await api('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({email})
    });
    // Guardar el email para la siguiente pantalla
    document.getElementById('reset-email').value = email;
    showToast('Código enviado a tu email: ' + decodeURIComponent(data.code || ''));
    switchAuthTab('reset');
  } catch (error) {
    setAuthError(error.message);
  }
}

async function submitResetPassword() {
  const email = document.getElementById('reset-email').value.trim().toLowerCase();
  const code = document.getElementById('reset-code').value.trim();
  const newPassword = document.getElementById('reset-password').value;

  if (!email || !code || !newPassword) return setAuthError('Completa todos los campos.');
  if (code.length !== 6 || !/^\d+$/.test(code)) return setAuthError('El código debe ser 6 dígitos.');
  if (newPassword.length < 6) return setAuthError('La contraseña debe tener al menos 6 caracteres.');

  try {
    await api('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({email, code, newPassword})
    });
    setAuthError(''); // Limpiar errores
    showToast('Contraseña actualizada. Ahora puedes ingresar.');
    // Limpiar campos
    document.getElementById('reset-code').value = '';
    document.getElementById('reset-password').value = '';
    document.getElementById('forgot-email').value = '';
    document.getElementById('reset-email').value = '';
    // Volver al tab de login
    switchAuthTab('login');
  } catch (error) {
    setAuthError(error.message);
  }
}

async function logoutUser() {
  if (authToken) {
    try {
      await api('/auth/logout', {
        method: 'POST',
        headers: {Authorization: `Bearer ${authToken}`}
      });
    } catch (error) {}
  }
  // Copiar carrito del usuario al carrito de invitado antes de cerrar sesión
  try {
    if (currentUser) {
      const userCartKey = `zonapc_cart_u${currentUser.id}`;
      const userCartRaw = localStorage.getItem(userCartKey);
      if (userCartRaw) {
        localStorage.setItem('zonapc_cart', userCartRaw);
      }
    }
  } catch(e) {}
  authToken = '';
  saveAuthToken('');
  currentUser = null;
  cart = loadCart(null);
  renderCart();
  renderAuthState();
  closeAuthModal();
  pendingCheckoutAfterAuth = false;
  showToast('Sesión cerrada');
}

async function loadUserOrders() {
  const container = document.getElementById('user-orders-list');
  if (!container) return;
  container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--txt3);font-size:13px">Cargando compras...</div>';
  
  try {
    const orders = await api('/user/orders', {
      headers: {Authorization: `Bearer ${authToken}`}
    });
    
    if (!orders || orders.length === 0) {
      container.innerHTML = '<div class="empty-orders">No tienes compras registradas</div>';
      return;
    }
    
    container.innerHTML = orders.map(order => {
      const userStatus = getUserFacingOrderStatus(order.status);
      const statusClass = {
        'Pendiente': 'pendiente',
        'En proceso': 'proceso',
        'Enviado': 'enviado',
        'Entregado': 'entregado',
        'Cancelado': 'cancelado'
      }[order.status] || 'pendiente';
      
      return `
        <div class="user-order-card" onclick="openOrderDetail('${order.id}')">
          <div class="user-order-header">
            <span class="user-order-id">${order.id}</span>
            <span class="user-order-status user-order-status-${statusClass}">${userStatus}</span>
          </div>
          <div class="user-order-items">
            ${order.items.map(item => `${item.icon} ${item.name} (${item.qty})`).join(', ')}
          </div>
          <div class="user-order-total">${fmt(order.total)}</div>
          <div class="user-order-date">${order.date}</div>
        </div>`;
    }).join('');
  } catch (error) {
    container.innerHTML = '<div class="empty-orders">No se pudieron cargar las compras</div>';
  }
}

async function loadUserTickets() {
  const container = document.getElementById('user-tickets-list');
  if (!container) return;
  container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--txt3);font-size:13px">Cargando tickets...</div>';
  
  try {
    const tickets = await api('/user/tickets', {
      headers: {Authorization: `Bearer ${authToken}`}
    });
    
    if (!tickets || tickets.length === 0) {
      container.innerHTML = '<div class="empty-tickets">No tienes tickets activos</div>';
      return;
    }
    
    container.innerHTML = tickets.map(ticket => {
      const statusClass = {
        'Abierto': 'abierto',
        'En progreso': 'progreso',
        'Resuelto': 'resuelto'
      }[ticket.status] || 'abierto';
      
      return `
        <div class="user-ticket-card" onclick="openTicketDetail('${ticket.id}')">
          <div class="user-ticket-header">
            <span class="user-ticket-subject">${ticket.subject}</span>
            <span class="user-ticket-status user-ticket-status-${statusClass}">${ticket.status}</span>
          </div>
          <div class="user-ticket-message">${ticket.message}</div>
          <div class="user-ticket-date">${ticket.createdAt}</div>
        </div>`;
    }).join('');
  } catch (error) {
    container.innerHTML = '<div class="empty-tickets">No se pudieron cargar los tickets</div>';
  }
}

function closeDetailModal() {
  document.getElementById('detail-modal-overlay').classList.remove('open');
}

function getUserFacingOrderStatus(status) {
  return status === 'Enviado' ? 'Recibido' : status;
}

function openOrderDetail(orderId) {
  const modal = document.getElementById('detail-modal-overlay');
  const title = document.getElementById('detail-modal-title');
  const body = document.getElementById('detail-modal-body');
  
  title.textContent = `Pedido ${orderId}`;
  body.innerHTML = '<div style="text-align:center;padding:30px;color:var(--txt3)">Cargando...</div>';
  modal.classList.add('open');
  
  // Fetch order details (using the orders endpoint and filtering)
  api('/orders', { headers: {Authorization: `Bearer ${authToken}`} })
    .then(orders => {
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        body.innerHTML = '<div style="text-align:center;padding:30px;color:var(--txt3)">Pedido no encontrado</div>';
        return;
      }
      
      const statusClass = {
        'Pendiente': 'pendiente', 'En proceso': 'proceso',
        'Enviado': 'enviado', 'Entregado': 'entregado', 'Cancelado': 'cancelado'
      }[order.status] || 'pendiente';
      const userStatus = getUserFacingOrderStatus(order.status);
      
      body.innerHTML = `
        <div class="detail-section">
          <div class="detail-section-title">Información del pedido</div>
          <div class="detail-info-grid">
            <div class="detail-info-item">
              <div class="detail-info-label">ID Pedido</div>
              <div class="detail-info-value highlight">${order.id}</div>
            </div>
            <div class="detail-info-item">
              <div class="detail-info-label">Estado</div>
              <span class="detail-status-badge detail-status-${statusClass}">${userStatus}</span>
            </div>
            <div class="detail-info-item">
              <div class="detail-info-label">Fecha</div>
              <div class="detail-info-value">${order.date}</div>
            </div>
            <div class="detail-info-item">
              <div class="detail-info-label">Cliente</div>
              <div class="detail-info-value">${order.client}</div>
            </div>
            <div class="detail-info-item" style="grid-column:1/-1">
              <div class="detail-info-label">Dirección de envío</div>
              <div class="detail-info-value">${order.addr}</div>
            </div>
          </div>
        </div>
        
        <div class="detail-section">
          <div class="detail-section-title">Productos</div>
          <div class="detail-items-list">
            ${order.items.map(item => `
              <div class="detail-item-row">
                <span class="detail-item-icon">${item.icon}</span>
                <div class="detail-item-info">
                  <div class="detail-item-name">${item.name}</div>
                  <div class="detail-item-meta">Código: PROD-${item.id}</div>
                </div>
                <span class="detail-item-qty">${item.qty}</span>
                <span class="detail-item-price">${fmt(item.price)}</span>
              </div>`).join('')}
          </div>
          <div class="detail-total-row">
            <span class="detail-total-label">Total del pedido</span>
            <span class="detail-total-value">${fmt(order.total)}</span>
          </div>
        </div>
        
        ${order.notes ? `
        <div class="detail-section">
          <div class="detail-section-title">Notas del pedido</div>
          <div class="detail-ticket-message">${order.notes}</div>
        </div>` : ''}
      `;
    })
    .catch(() => {
      body.innerHTML = '<div style="text-align:center;padding:30px;color:var(--txt3)">No se pudo cargar el detalle</div>';
    });
}

function openTicketDetail(ticketId) {
  const modal = document.getElementById('detail-modal-overlay');
  const title = document.getElementById('detail-modal-title');
  const body = document.getElementById('detail-modal-body');
  
  title.textContent = `Ticket ${ticketId}`;
  body.innerHTML = '<div style="text-align:center;padding:30px;color:var(--txt3)">Cargando...</div>';
  modal.classList.add('open');
  
  api('/tickets', { headers: {Authorization: `Bearer ${authToken}`} })
    .then(tickets => {
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) {
        body.innerHTML = '<div style="text-align:center;padding:30px;color:var(--txt3)">Ticket no encontrado</div>';
        return;
      }
      
      const statusClass = {
        'Abierto': 'abierto', 'En progreso': 'progreso', 'Resuelto': 'resuelto'
      }[ticket.status] || 'abierto';
      
      const priorityClass = {
        'Baja': 'baja', 'Media': 'media', 'Alta': 'alta'
      }[ticket.priority] || 'media';
      
      body.innerHTML = `
        <div class="detail-section">
          <div class="detail-section-title">Información del ticket</div>
          <div class="detail-info-grid">
            <div class="detail-info-item">
              <div class="detail-info-label">ID Ticket</div>
              <div class="detail-info-value highlight">${ticket.id}</div>
            </div>
            <div class="detail-info-item">
              <div class="detail-info-label">Estado</div>
              <span class="detail-status-badge detail-status-${statusClass}">${ticket.status}</span>
            </div>
            <div class="detail-info-item">
              <div class="detail-info-label">Prioridad</div>
              <span class="detail-ticket-priority detail-priority-${priorityClass}">${ticket.priority}</span>
            </div>
            <div class="detail-info-item">
              <div class="detail-info-label">Fecha de creación</div>
              <div class="detail-info-value">${ticket.createdAt}</div>
            </div>
            <div class="detail-info-item">
              <div class="detail-info-label">Cliente</div>
              <div class="detail-info-value">${ticket.name}</div>
            </div>
            <div class="detail-info-item">
              <div class="detail-info-label">Email</div>
              <div class="detail-info-value">${ticket.email}</div>
            </div>
          </div>
        </div>
        
        <div class="detail-section">
          <div class="detail-section-title">Asunto</div>
          <div class="detail-info-value">${ticket.subject}</div>
        </div>
        
        <div class="detail-section">
          <div class="detail-section-title">Mensaje</div>
          <div class="detail-ticket-message">${ticket.message}</div>
        </div>
        
        ${ticket.notes ? `
        <div class="detail-section">
          <div class="detail-section-title">Respuesta del soporte</div>
          <div class="detail-ticket-message" style="border-color:rgba(0,209,199,0.2);background:rgba(0,209,199,0.03)">${ticket.notes}</div>
        </div>` : ''}
      `;
    })
    .catch(() => {
      body.innerHTML = '<div style="text-align:center;padding:30px;color:var(--txt3)">No se pudo cargar el detalle</div>';
    });
}

// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""

