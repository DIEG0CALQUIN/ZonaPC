// ZonaPC Shared Navigation Functions
// Este archivo contiene las funciones compartidas para la navegación

// Verificar sesión y actualizar UI
function checkSessionAndUpdateUI() {
  // En Tecno TV, usar la sesión guardada igual que en la tienda
  const token = localStorage.getItem('zonapc_auth_token');
  const user = JSON.parse(localStorage.getItem('zonapc_user') || 'null');
  
  const authTrigger = document.getElementById('auth-trigger');
  const registerTrigger = document.getElementById('register-trigger');
  const accountTrigger = document.getElementById('account-trigger');
  const logoutTrigger = document.getElementById('nav-logout-btn');
  const accountAvatar = document.getElementById('account-avatar');
  const accountName = document.getElementById('account-name');
  
  if (token && user) {
    if (authTrigger) authTrigger.style.display = 'none';
    if (registerTrigger) registerTrigger.style.display = 'none';
    if (accountTrigger) accountTrigger.style.display = 'flex';
    if (logoutTrigger) logoutTrigger.style.display = 'flex';
    if (accountAvatar) accountAvatar.textContent = (user.name || 'U')[0].toUpperCase();
    if (accountName) accountName.textContent = user.name || 'Mi cuenta';
  } else {
    if (authTrigger) authTrigger.style.display = 'flex';
    if (registerTrigger) registerTrigger.style.display = 'flex';
    if (accountTrigger) accountTrigger.style.display = 'none';
    if (logoutTrigger) logoutTrigger.style.display = 'none';
  }
}

// Actualizar contador del carrito
function updateCartCount() {
  // Obtener el usuario actual para saber qué carrito leer
  const user = JSON.parse(localStorage.getItem('zonapc_user') || 'null');
  const cartKey = user ? `zonapc_cart_u${user.id}` : 'zonapc_cart';
  const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const countEl = document.getElementById('cart-count');
  const cartTrigger = document.querySelector('.cart-trigger');
  if (countEl) countEl.textContent = totalItems;
  // Agregar efecto visual cuando hay items en el carrito
  if (cartTrigger) {
    cartTrigger.classList.toggle('with-items', totalItems > 0);
  }
}

// Renderizar menú de categorías
function renderCatalogoMenu() {
  const menu = document.getElementById('catalogo-menu');
  if (!menu) return;
  
  const cats = window.STORE_PRODUCT_CATEGORIES || [
    { value: 'pc', label: 'PCs de escritorio', icon: '🖥️', subs: [{ label: 'PC Gamer' }, { label: 'PC Oficina' }, { label: 'Mini PC' }] },
    { value: 'laptops', label: 'Laptops y notebooks', icon: '💻', subs: [{ label: 'Laptops Gamer' }, { label: 'Ultralivianas' }, { label: 'Notebooks' }] },
    { value: 'componentes', label: 'Componentes', icon: '🔧', subs: [{ label: 'Procesadores' }, { label: 'Placas madre' }, { label: 'Memorias RAM' }, { label: 'Tarjetas gráficas' }, { label: 'Almacenamiento SSD/HDD' }] },
    { value: 'perifericos', label: 'Periféricos', icon: '🎮', subs: [{ label: 'Teclados' }, { label: 'Mouse' }, { label: 'Mousepads' }, { label: 'Audio y headsets' }] },
    { value: 'accesorios', label: 'Accesorios', icon: '🧰', subs: [{ label: 'Cables y adaptadores' }, { label: 'Iluminación RGB' }, { label: 'Sillas gaming' }] },
    { value: 'software', label: 'Software y licencias', icon: '💿', subs: [{ label: 'Windows' }, { label: 'Office' }, { label: 'Antivirus' }] },
  ];
  
  let megaMenuActiveCat = 'pc';
  
  const left = cats.map(cat =>
    `<button class='catalogo-mega-menu-cat${cat.value === megaMenuActiveCat ? ' active' : ''}' onmouseenter='setActiveCat("${cat.value}")'>
      <span class='catalogo-mega-menu-cat-icon'>${cat.icon || '📦'}</span>${cat.label}
    </button>`
  ).join('');
  
  const activeCat = cats.find(c => c.value === megaMenuActiveCat);
  const right = activeCat && activeCat.subs && activeCat.subs.length
    ? `<div class='catalogo-mega-menu-title'>${activeCat.label}</div>` +
      activeCat.subs.map(sub =>
        `<button class='catalogo-mega-menu-sub' onclick='window.location.href="zonapc-tienda.html#catalogo"'>${sub.label}</button>`
      ).join('')
    : `<div style='color:var(--txt3);font-size:13px'>Selecciona una categoría</div>`;
  
  menu.innerHTML = `<div class='catalogo-mega-menu'>
    <div class='catalogo-mega-menu-cats'>${left}</div>
    <div class='catalogo-mega-menu-subs'>${right}</div>
  </div>`;
}

function setActiveCat(val) {
  const menu = document.getElementById('catalogo-menu');
  if (!menu) return;
  const cats = window.STORE_PRODUCT_CATEGORIES || [
    { value: 'pc', label: 'PCs de escritorio', icon: '🖥️', subs: [{ label: 'PC Gamer' }, { label: 'PC Oficina' }, { label: 'Mini PC' }] },
    { value: 'laptops', label: 'Laptops y notebooks', icon: '💻', subs: [{ label: 'Laptops Gamer' }, { label: 'Ultralivianas' }, { label: 'Notebooks' }] },
    { value: 'componentes', label: 'Componentes', icon: '🔧', subs: [{ label: 'Procesadores' }, { label: 'Placas madre' }, { label: 'Memorias RAM' }, { label: 'Tarjetas gráficas' }, { label: 'Almacenamiento SSD/HDD' }] },
    { value: 'perifericos', label: 'Periféricos', icon: '🎮', subs: [{ label: 'Teclados' }, { label: 'Mouse' }, { label: 'Mousepads' }, { label: 'Audio y headsets' }] },
    { value: 'accesorios', label: 'Accesorios', icon: '🧰', subs: [{ label: 'Cables y adaptadores' }, { label: 'Iluminación RGB' }, { label: 'Sillas gaming' }] },
    { value: 'software', label: 'Software y licencias', icon: '💿', subs: [{ label: 'Windows' }, { label: 'Office' }, { label: 'Antivirus' }] },
  ];
  const left = cats.map(cat =>
    `<button class='catalogo-mega-menu-cat${cat.value === val ? ' active' : ''}' onmouseenter='setActiveCat("${cat.value}")'>
      <span class='catalogo-mega-menu-cat-icon'>${cat.icon || '📦'}</span>${cat.label}
    </button>`
  ).join('');
  const activeCat = cats.find(c => c.value === val);
  const right = activeCat && activeCat.subs && activeCat.subs.length
    ? `<div class='catalogo-mega-menu-title'>${activeCat.label}</div>` +
      activeCat.subs.map(sub =>
        `<button class='catalogo-mega-menu-sub' onclick='window.location.href="zonapc-tienda.html#catalogo"'>${sub.label}</button>`
      ).join('')
    : `<div style='color:var(--txt3);font-size:13px'>Sin subcategorías</div>`;
  
  menu.innerHTML = `<div class='catalogo-mega-menu'>
    <div class='catalogo-mega-menu-cats'>${left}</div>
    <div class='catalogo-mega-menu-subs'>${right}</div>
  </div>`;
}

// Toggle menú móvil
function toggleMobileMenu() {
  const existing = document.getElementById('mobile-menu-overlay');
  if (existing) {
    existing.remove();
    return;
  }
  
  const overlay = document.createElement('div');
  overlay.id = 'mobile-menu-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:600;display:flex;align-items:flex-start;justify-content:flex-start;padding:0;';
  overlay.onclick = () => overlay.remove();
  
  const drawer = document.createElement('div');
  drawer.style.cssText = 'width:290px;min-height:100vh;background:var(--bg2);padding:20px;z-index:601;';
  drawer.innerHTML = `
    <button onclick="this.parentElement.parentElement.remove()" style="background:none;border:none;color:var(--txt);font-size:24px;cursor:pointer;margin-bottom:20px;">✕</button>
    <ul style="list-style:none;padding:0;">
      <li style="padding:12px 0;"><a href="zonapc-tienda.html" style="color:var(--txt);text-decoration:none;font-size:16px;">Inicio</a></li>
      <li style="padding:12px 0;"><a href="zonapc-tienda.html#catalogo" style="color:var(--txt);text-decoration:none;font-size:16px;">Catálogo</a></li>
      <li style="padding:12px 0;"><a href="zonapc-tienda.html#contacto" style="color:var(--txt);text-decoration:none;font-size:16px;">Contacto</a></li>
      <li style="padding:12px 0;"><a href="tecno-tv.html" style="color:#ff2fb3;text-decoration:none;font-size:16px;font-weight:700;">Tecno TV</a></li>
    </ul>`;
  
  overlay.appendChild(drawer);
  document.body.appendChild(overlay);
}

// Ir al inicio
function goHomeResetCatalog() {
  window.location.href = 'zonapc-tienda.html';
}

// Mostrar menú de catálogo
function showCatalogoMenu() {
  const menu = document.getElementById('catalogo-menu');
  if (menu) {
    menu.classList.add('show');
    renderCatalogoMenu();
  }
}

// Ocultar menú de catálogo
function hideCatalogoMenu() {
  const menu = document.getElementById('catalogo-menu');
  if (menu) menu.classList.remove('show');
}

// Toggle menú de catálogo
function toggleCatalogoMenu(e) {
  e.preventDefault();
  const menu = document.getElementById('catalogo-menu');
  if (menu) {
    if (menu.classList.contains('show')) {
      menu.classList.remove('show');
    } else {
      renderCatalogoMenu();
      menu.classList.add('show');
    }
  }
}

// Toggle menú de auth
function toggleAuthMenu(e) {
  e.stopPropagation();
  const wrap = document.getElementById('auth-menu-wrap');
  const dropdown = document.getElementById('auth-dropdown');
  if (wrap && dropdown) {
    wrap.classList.toggle('open');
    dropdown.classList.toggle('open');
  }
}

// Cerrar menú de auth
function closeAuthMenu() {
  const wrap = document.getElementById('auth-menu-wrap');
  const dropdown = document.getElementById('auth-dropdown');
  if (wrap) wrap.classList.remove('open');
  if (dropdown) dropdown.classList.remove('open');
}

// Cerrar menús al hacer click fuera
document.addEventListener('click', (e) => {
  if (!e.target.closest('.auth-menu-wrap')) {
    closeAuthMenu();
  }
});

// Abrir modal de auth - Ahora funciona en cualquier página
function openAuthModal(mode) {
  closeAuthMenu();
  
  // Si ya existe un modal, lo mostramos
  const existingModal = document.getElementById('auth-overlay');
  if (existingModal) {
    existingModal.classList.add('open');
    if (mode === 'profile') {
      existingModal.classList.add('profile-mode');
    }
    return;
  }
  
  // Creamos el modal dinámicamente
  const overlay = document.createElement('div');
  overlay.id = 'auth-overlay';
  overlay.className = 'auth-overlay' + (mode === 'profile' ? ' profile-mode' : '');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(6,5,20,0.82);z-index:650;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(10px);';
  
  const modal = document.createElement('div');
  modal.className = 'auth-modal';
  modal.style.cssText = 'width:460px;max-width:100%;background:linear-gradient(180deg,#16123a,#0d0a2a);border:1px solid var(--border2);border-radius:24px;box-shadow:0 26px 60px rgba(9,6,30,0.5);overflow:hidden;';
  
  if (mode === 'login' || mode === 'register') {
    modal.innerHTML = `
      <div class="auth-head" style="padding:20px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
        <div class="auth-title-wrap">
          <span class="auth-kicker" style="font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:var(--c4);font-weight:800;">${mode === 'login' ? 'BIENVENIDO' : 'ÚNETE'}</span>
          <h2 class="auth-title" style="font-family:var(--font-head);font-size:18px;letter-spacing:0.8px;">${mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
        </div>
        <button class="auth-close" onclick="document.getElementById('auth-overlay').remove()" style="width:32px;height:32px;border-radius:10px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.04);color:var(--txt2);cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;">✕</button>
      </div>
      <div class="auth-body" style="padding:24px;">
        <div class="auth-tabs" style="display:grid;grid-template-columns:1fr 1fr;gap:6px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:4px;margin-bottom:18px;">
          <button class="auth-tab${mode === 'login' ? ' active' : ''}" onclick="switchAuthTab('login', this)" style="border:none;background:transparent;color:${mode === 'login' ? '#fff' : 'var(--txt3)'};padding:10px 12px;border-radius:10px;font-size:12px;font-weight:800;letter-spacing:0.7px;text-transform:uppercase;cursor:pointer;${mode === 'login' ? 'background:linear-gradient(135deg,var(--c1),var(--c2));' : ''}">Iniciar Sesión</button>
          <button class="auth-tab${mode === 'register' ? ' active' : ''}" onclick="switchAuthTab('register', this)" style="border:none;background:transparent;color:${mode === 'register' ? '#fff' : 'var(--txt3)'};padding:10px 12px;border-radius:10px;font-size:12px;font-weight:800;letter-spacing:0.7px;text-transform:uppercase;cursor:pointer;${mode === 'register' ? 'background:linear-gradient(135deg,var(--c1),var(--c2));' : ''}">Registrarse</button>
        </div>
        <form id="auth-form" onsubmit="handleAuth(event, '${mode}')" style="display:flex;flex-direction:column;gap:12px;">
          ${mode === 'register' ? `
            <div class="auth-field">
              <label class="auth-label" style="display:block;font-size:11px;color:var(--txt2);text-transform:uppercase;letter-spacing:0.7px;margin-bottom:6px;">Nombre</label>
              <input type="text" name="name" class="auth-input" required style="width:100%;background:rgba(255,255,255,0.035);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:11px 12px;color:var(--txt);font-family:var(--font-body);font-size:13px;transition:border-color 0.2s,box-shadow 0.2s;" placeholder="Tu nombre">
            </div>
          ` : ''}
          <div class="auth-field">
            <label class="auth-label" style="display:block;font-size:11px;color:var(--txt2);text-transform:uppercase;letter-spacing:0.7px;margin-bottom:6px;">Email</label>
            <input type="email" name="email" class="auth-input" required style="width:100%;background:rgba(255,255,255,0.035);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:11px 12px;color:var(--txt);font-family:var(--font-body);font-size:13px;transition:border-color 0.2s,box-shadow 0.2s;" placeholder="tu@email.com">
          </div>
          <div class="auth-field">
            <label class="auth-label" style="display:block;font-size:11px;color:var(--txt2);text-transform:uppercase;letter-spacing:0.7px;margin-bottom:6px;">Contraseña</label>
            <input type="password" name="password" class="auth-input" required minlength="6" style="width:100%;background:rgba(255,255,255,0.035);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:11px 12px;color:var(--txt);font-family:var(--font-body);font-size:13px;transition:border-color 0.2s,box-shadow 0.2s;" placeholder="••••••••">
          </div>
          <button type="submit" class="auth-submit" style="width:100%;border:none;border-radius:14px;background:linear-gradient(135deg,var(--c1),var(--c2));color:#ffffff;padding:13px 14px;font-family:var(--font-head);font-size:13px;font-weight:800;letter-spacing:0.8px;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s,filter 0.2s;margin-top:8px;">${mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</button>
        </form>
        <div class="auth-divider" style="display:flex;align-items:center;gap:10px;margin:14px 0;color:var(--txt3);font-size:11px;letter-spacing:0.5px;text-transform:uppercase;">
          <span style="flex:1;height:1px;background:rgba(255,255,255,0.08);"></span>
          o continúa con
          <span style="flex:1;height:1px;background:rgba(255,255,255,0.08);"></span>
        </div>
        <button class="auth-google-btn" onclick="handleGoogleAuth()" style="width:100%;display:flex;align-items:center;justify-content:center;gap:10px;border:1px solid rgba(255,255,255,0.12);border-radius:14px;background:rgba(255,255,255,0.04);color:var(--txt);padding:11px 14px;font-family:var(--font-body);font-size:13px;font-weight:600;cursor:pointer;transition:background 0.2s,border-color 0.2s,transform 0.15s;">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google
        </button>
      </div>
    `;
  } else if (mode === 'profile') {
    const user = JSON.parse(localStorage.getItem('zonapc_user') || 'null');
    modal.innerHTML = `
      <div class="auth-head" style="padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
        <div>
          <span class="auth-kicker" style="font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:var(--c4);font-weight:800;">PERFIL</span>
          <h2 class="auth-title" style="font-family:var(--font-head);font-size:18px;letter-spacing:0.8px;">Mi Cuenta</h2>
        </div>
        <button class="auth-close" onclick="document.getElementById('auth-overlay').remove()" style="width:32px;height:32px;border-radius:10px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.04);color:var(--txt2);cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;">✕</button>
      </div>
      <div class="auth-body" style="flex:1;overflow:auto;padding:18px 20px;">
        <div class="profile-shell" style="display:flex;flex-direction:column;gap:20px;">
          <div class="profile-card" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:18px;">
            <div class="profile-top" style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
              <div class="profile-avatar" style="width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--c2),#29e3d9);color:#081012;font-weight:800;font-size:16px;flex-shrink:0;">${user ? (user.name || 'U')[0].toUpperCase() : 'U'}</div>
              <div>
                <div class="profile-name" style="font-size:16px;font-weight:800;">${user ? user.name : 'Usuario'}</div>
                <div class="profile-mail" style="font-size:12px;color:var(--txt2);margin-top:3px;">${user ? user.email : ''}</div>
              </div>
            </div>
            <div class="profile-actions" style="display:flex;gap:10px;">
              <button class="profile-btn danger" onclick="logoutUser()" style="flex:1;border-radius:14px;padding:11px 12px;font-size:12px;font-weight:800;cursor:pointer;font-family:var(--font-body);border:1px solid rgba(255,255,255,0.08);background:rgba(255,90,79,0.08);color:#ff9a91;">Cerrar sesión</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Cerrar al hacer click fuera
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}

// Cambiar pestaña de auth
function switchAuthTab(mode, btn) {
  const tabs = btn.parentElement.querySelectorAll('.auth-tab');
  tabs.forEach(t => {
    t.style.background = 'transparent';
    t.style.color = 'var(--txt3)';
  });
  btn.style.background = 'linear-gradient(135deg,var(--c1),var(--c2))';
  btn.style.color = '#fff';
  
  const form = document.getElementById('auth-form');
  if (form) {
    form.setAttribute('onsubmit', `handleAuth(event, '${mode}')`);
    const submitBtn = form.querySelector('.auth-submit');
    if (submitBtn) {
      submitBtn.textContent = mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta';
    }
    const nameField = form.querySelector('input[name="name"]');
    if (nameField) {
      nameField.parentElement.style.display = mode === 'register' ? 'block' : 'none';
    }
  }
}

// Manejar autenticación
async function handleAuth(event, mode) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const data = {
    name: formData.get('name') || '',
    email: formData.get('email'),
    password: formData.get('password')
  };
  
  const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      // Guardar en localStorage (persiste entre páginas)
      localStorage.setItem('zonapc_auth_token', result.token);
      localStorage.setItem('zonapc_user', JSON.stringify(result.user));
      
      // Actualizar UI en esta página
      checkSessionAndUpdateUI();
      updateCartCount();
      
      // Cerrar modal
      const overlay = document.getElementById('auth-overlay');
      if (overlay) overlay.remove();
      
      // Si estamos en tecno-tv.html, redirigir a la tienda para que también se actualice ahí
      if (window.location.pathname.includes('tecno-tv')) {
        // La sesión ya está guardada en localStorage, así que al ir a la tienda
        // debería reconocerse automáticamente
        window.location.href = 'zonapc-tienda.html';
      }
    } else {
      alert(result.error || 'Error en la autenticación');
    }
  } catch (error) {
    alert('Error de conexión');
  }
}

// Manejar Google Auth
function handleGoogleAuth() {
  alert('Google Sign-In requiere configuración adicional. Por favor usa email y contraseña.');
}

// Cerrar sesión
function logoutUser() {
  localStorage.removeItem('zonapc_auth_token');
  localStorage.removeItem('zonapc_user');
  fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  window.location.href = 'zonapc-tienda.html';
}

// Navegar
function navigate(page, section) {
  if (page === 'page' && section === 'contacto') {
    window.location.href = 'zonapc-tienda.html#contacto';
  }
}

// Toggle carrito - abre el drawer en tecno-tv.html o redirige a tienda
function toggleCart() {
  // Si estamos en tecno-tv.html, abrir el drawer local
  if (window.location.pathname.includes('tecno-tv')) {
    toggleCartDrawer();
  } else {
    // En la tienda, redirigir al checkout
    window.location.href = 'zonapc-tienda.html#checkout';
  }
}

// Toggle drawer de carrito (para tecno-tv.html)
function toggleCartDrawer() {
  const overlay = document.getElementById('cart-overlay');
  const drawer = document.getElementById('cart-drawer');
  if (overlay && drawer) {
    overlay.classList.toggle('open');
    drawer.classList.toggle('open');
    renderCartDrawer();
  }
}

// Obtener la clave del carrito según el usuario
function getCartKey() {
  const user = JSON.parse(localStorage.getItem('zonapc_user') || 'null');
  return user ? `zonapc_cart_u${user.id}` : 'zonapc_cart';
}

// Renderizar contenido del drawer de carrito
function renderCartDrawer() {
  const cartKey = getCartKey();
  const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
  const body = document.getElementById('cart-body');
  const foot = document.getElementById('cart-foot');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  
  if (!body) return;
  
  if (!cart.length) {
    body.innerHTML = '<div class="cart-empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg><p>Tu carrito está vacío</p></div>';
    if (foot) foot.style.display = 'none';
    return;
  }
  
  body.innerHTML = cart.map(p => `
    <div class="cart-item">
      <div class="ci-icon">${p.icon || '📦'}</div>
      <div class="ci-info">
        <div class="ci-name">${p.name}</div>
        <div class="ci-price">${'$' + (p.price || 0).toLocaleString('es-CL')}</div>
        <div class="ci-controls">
          <button class="ci-qty-btn" onclick="changeCartQty(${p.id}, -1)">−</button>
          <span class="ci-qty">${p.qty || 1}</span>
          <button class="ci-qty-btn" onclick="changeCartQty(${p.id}, 1)">+</button>
          <button class="ci-del" onclick="removeCartItem(${p.id})">✕</button>
        </div>
      </div>
    </div>`).join('');
  
  const total = cart.reduce((s, p) => s + (p.price || 0) * (p.qty || 1), 0);
  if (subtotalEl) subtotalEl.textContent = '$' + total.toLocaleString('es-CL');
  if (totalEl) totalEl.textContent = '$' + total.toLocaleString('es-CL');
  if (foot) foot.style.display = 'block';
}

// Ir al checkout - redirige a zonapc-tienda.html con flag para abrir checkout
function goToCheckout() {
  // Guardar que queremos abrir el checkout al llegar a la tienda
  sessionStorage.setItem('zonapc_open_checkout', 'true');
  window.location.href = 'zonapc-tienda.html';
}

// ═══════════════════════════════════════════════════════════
//  API & AUTH (para tecno-tv.html)
// ═══════════════════════════════════════════════════════════
const API_BASE = 'http://localhost:3000/api';
const AUTH_TOKEN_KEY = 'zonapc_auth_token';
const CART_STORAGE_KEY = 'zonapc_cart';

let authToken = '';
let currentUser = null;
let cart = [];

function loadAuthToken() {
  try { return localStorage.getItem(AUTH_TOKEN_KEY) || ''; } catch (_) { return ''; }
}
function saveAuthToken(token) {
  try { if (token) localStorage.setItem(AUTH_TOKEN_KEY, token); else localStorage.removeItem(AUTH_TOKEN_KEY); } catch (_) {}
}
function getUserInitials(name) {
  return String(name || '').trim().split(/\s+/).slice(0, 2).map(p => p.charAt(0).toUpperCase()).join('') || 'U';
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

async function fetchCurrentUser() {
  authToken = loadAuthToken();
  if (!authToken) {
    currentUser = null;
    cart = loadCart(null);
    renderAuthState();
    return null;
  }
  try {
    const data = await api('/auth/me', { headers: {Authorization: `Bearer ${authToken}`} });
    currentUser = data.user || null;
    cart = loadCart(currentUser ? currentUser.id : null);
  } catch (_) {
    authToken = ''; saveAuthToken(''); currentUser = null; cart = loadCart(null);
  }
  renderCart(); renderAuthState(); return currentUser;
}

function loadCart(userId = null) {
  try { const key = userId ? `${CART_STORAGE_KEY}_u${userId}` : CART_STORAGE_KEY; const raw = localStorage.getItem(key); const parsed = raw ? JSON.parse(raw) : []; return Array.isArray(parsed) ? parsed : []; } catch (_) { return []; }
}
function saveCart() {
  try { const key = currentUser ? `${CART_STORAGE_KEY}_u${currentUser.id}` : CART_STORAGE_KEY; localStorage.setItem(key, JSON.stringify(cart)); if (currentUser) localStorage.removeItem(CART_STORAGE_KEY); } catch (_) {}
}
function fmt(n) { return '$' + parseInt(n || 0, 10).toLocaleString('es-CL'); }

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
    loadUserOrders();
    loadUserTickets();
  } else {
    authTrigger.style.display = 'flex';
    registerTrigger.style.display = 'inline-flex';
    accountTrigger.style.display = 'none';
    navLogoutBtn.style.display = 'none';
    if (authShell) authShell.style.display = 'block';
    if (profileShell) profileShell.style.display = 'none';
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

function clearAuthError() {
  const el = document.getElementById('auth-error');
  if (el) { el.textContent = ''; el.style.display = 'none'; }
}
function setAuthError(message) {
  const el = document.getElementById('auth-error');
  if (el) { el.textContent = message || ''; el.style.display = message ? 'block' : 'none'; }
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
    const data = await api('/auth/register', { method: 'POST', body: JSON.stringify({name, phone, email, password}) });
    authToken = data.token; saveAuthToken(authToken);
    completeAuth(data.user, 'Cuenta creada y sesión iniciada');
  } catch (error) { setAuthError(error.message); }
}

async function loginUser() {
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  if (!email || !password) return setAuthError('Ingresa email y contraseña.');
  try {
    const data = await api('/auth/login', { method: 'POST', body: JSON.stringify({email, password}) });
    authToken = data.token; saveAuthToken(authToken);
    completeAuth(data.user, 'Sesión iniciada');
  } catch (error) { setAuthError(error.message); }
}

function completeAuth(user, message) {
  currentUser = user;
  localStorage.setItem('zonapc_user', JSON.stringify(user));
  cart = loadCart(user.id);
  renderCart(); renderAuthState();
  closeAuthModal(true);
  showToast(message || 'Bienvenido');
}

async function sendForgotPasswordCode() {
  const email = document.getElementById('forgot-email').value.trim().toLowerCase();
  if (!email) return setAuthError('Ingresa tu email.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setAuthError('Ingresa un email válido.');
  try {
    const data = await api('/auth/forgot-password', { method: 'POST', body: JSON.stringify({email}) });
    document.getElementById('reset-email').value = email;
    showToast('Código enviado a tu email: ' + decodeURIComponent(data.code || ''));
    switchAuthTab('reset');
  } catch (error) { setAuthError(error.message); }
}

async function submitResetPassword() {
  const email = document.getElementById('reset-email').value.trim().toLowerCase();
  const code = document.getElementById('reset-code').value.trim();
  const newPassword = document.getElementById('reset-password').value;
  if (!email || !code || !newPassword) return setAuthError('Completa todos los campos.');
  if (code.length !== 6 || !/^\d+$/.test(code)) return setAuthError('El código debe ser 6 dígitos.');
  if (newPassword.length < 6) return setAuthError('La contraseña debe tener al menos 6 caracteres.');
  try {
    await api('/auth/reset-password', { method: 'POST', body: JSON.stringify({email, code, newPassword}) });
    setAuthError(''); showToast('Contraseña actualizada. Ahora puedes ingresar.');
    document.getElementById('reset-code').value = '';
    document.getElementById('reset-password').value = '';
    document.getElementById('forgot-email').value = '';
    document.getElementById('reset-email').value = '';
    switchAuthTab('login');
  } catch (error) { setAuthError(error.message); }
}

function triggerGoogleSignIn() {
  if (!window.google || !window.google.accounts) return setAuthError('El servicio de Google no está disponible.');
  const container = document.createElement('div');
  container.id = 'google-signin-container';
  container.style.display = 'none';
  document.body.appendChild(container);
  window.google.accounts.id.initialize({ client_id: '183373903027-ct7n06nrfa7jhls3sr9kicamobll13kk.apps.googleusercontent.com', callback: handleGoogleCredential, auto_select: false });
  window.google.accounts.id.renderButton(container, { type: 'standard', size: 'large', theme: 'dark' });
  setTimeout(() => { const btn = container.querySelector('div[role="button"]'); if (btn) btn.click(); else setAuthError('No se pudo abrir Google Sign-In.'); }, 100);
  setTimeout(() => { const el = document.getElementById('google-signin-container'); if (el) el.remove(); }, 3000);
}

async function handleGoogleCredential(response) {
  try {
    const data = await api('/auth/google', { method: 'POST', body: JSON.stringify({credential: response.credential}) });
    authToken = data.token; saveAuthToken(authToken);
    completeAuth(data.user, 'Sesión iniciada con Google');
  } catch (error) { setAuthError(error.message || 'No se pudo iniciar sesión con Google'); }
}

function logoutUser() {
  if (authToken) { try { api('/auth/logout', { method: 'POST', headers: {Authorization: `Bearer ${authToken}`} }); } catch (_) {} }
  authToken = ''; saveAuthToken(''); currentUser = null;
  try { if (currentUser) { const userCartKey = `zonapc_cart_u${currentUser.id}`; const userCartRaw = localStorage.getItem(userCartKey); if (userCartRaw) localStorage.setItem('zonapc_cart', userCartRaw); } } catch(e) {}
  cart = loadCart(null); renderCart(); renderAuthState(); closeAuthModal();
  showToast('Sesión cerrada');
}

function openAuthModal(mode = 'login') {
  const overlay = document.getElementById('auth-overlay');
  if (!overlay) return;
  clearAuthError();
  if (currentUser || mode === 'profile') {
    renderAuthState();
  } else {
    renderAuthState();
    switchAuthTab(mode === 'register' ? 'register' : mode === 'forgot' ? 'forgot' : 'login');
  }
  overlay.classList.add('open');
}

function closeAuthModal(preserveIntent = false) {
  const overlay = document.getElementById('auth-overlay');
  if (overlay) { overlay.classList.remove('open'); }
  clearAuthError();
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

function splitUserName(fullName) {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return {firstName: '', lastName: ''};
  if (parts.length === 1) return {firstName: parts[0], lastName: ''};
  return {firstName: parts.slice(0, -1).join(' '), lastName: parts.slice(-1).join('')};
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
  const firstName = (document.getElementById('profile-edit-name')?.value || '').trim();
  const lastName = (document.getElementById('profile-edit-lastname')?.value || '').trim();
  const phone = (document.getElementById('profile-edit-phone')?.value || '').replace(/\D/g, '').slice(0, 8);
  const name = [firstName, lastName].filter(Boolean).join(' ').trim();
  if (!firstName || !lastName) { showToast('Completa nombre y apellido'); return; }
  if (phone && !/^[0-9]{8}$/.test(phone)) { showToast('Telefono invalido. Debe tener 8 digitos'); return; }
  try {
    const data = await api('/auth/profile', { method: 'PUT', headers: {Authorization: `Bearer ${authToken}`}, body: JSON.stringify({name, phone}) });
    currentUser = data.user || currentUser;
    renderAuthState();
    closeProfileEdit();
    showToast('Datos actualizados');
  } catch (error) { showToast(error.message || 'No se pudieron actualizar los datos'); }
}

async function loadUserOrders() {
  const container = document.getElementById('user-orders-list');
  if (!container) return;
  container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--txt3);font-size:13px">Cargando compras...</div>';
  try {
    const orders = await api('/user/orders', { headers: {Authorization: `Bearer ${authToken}`} });
    if (!orders || orders.length === 0) { container.innerHTML = '<div class="empty-orders">No tienes compras registradas</div>'; return; }
    container.innerHTML = orders.map(order => {
      const statusClass = { 'Pendiente': 'pendiente', 'En proceso': 'proceso', 'Enviado': 'enviado', 'Entregado': 'entregado', 'Cancelado': 'cancelado' }[order.status] || 'pendiente';
      const userStatus = order.status === 'Enviado' ? 'Recibido' : order.status;
      return `<div class="user-order-card" onclick="openOrderDetail('${order.id}')">
        <div class="user-order-header"><span class="user-order-id">${order.id}</span><span class="user-order-status user-order-status-${statusClass}">${userStatus}</span></div>
        <div class="user-order-items">${order.items.map(item => `${item.icon} ${item.name} (${item.qty})`).join(', ')}</div>
        <div class="user-order-total">${fmt(order.total)}</div>
        <div class="user-order-date">${order.date}</div>
      </div>`;
    }).join('');
  } catch (error) { container.innerHTML = '<div class="empty-orders">No se pudieron cargar las compras</div>'; }
}

async function loadUserTickets() {
  const container = document.getElementById('user-tickets-list');
  if (!container) return;
  container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--txt3);font-size:13px">Cargando tickets...</div>';
  try {
    const tickets = await api('/user/tickets', { headers: {Authorization: `Bearer ${authToken}`} });
    if (!tickets || tickets.length === 0) { container.innerHTML = '<div class="empty-tickets">No tienes tickets activos</div>'; return; }
    container.innerHTML = tickets.map(ticket => {
      const statusClass = { 'Abierto': 'abierto', 'En progreso': 'progreso', 'Resuelto': 'resuelto' }[ticket.status] || 'abierto';
      return `<div class="user-ticket-card" onclick="openTicketDetail('${ticket.id}')">
        <div class="user-ticket-header"><span class="user-ticket-subject">${ticket.subject}</span><span class="user-ticket-status user-ticket-status-${statusClass}">${ticket.status}</span></div>
        <div class="user-ticket-message">${ticket.message}</div>
        <div class="user-ticket-date">${ticket.createdAt}</div>
      </div>`;
    }).join('');
  } catch (error) { container.innerHTML = '<div class="empty-tickets">No se pudieron cargar los tickets</div>'; }
}

function closeDetailModal() { document.getElementById('detail-modal-overlay').classList.remove('open'); }

function openOrderDetail(orderId) {
  const modal = document.getElementById('detail-modal-overlay');
  const title = document.getElementById('detail-modal-title');
  const body = document.getElementById('detail-modal-body');
  title.textContent = `Pedido ${orderId}`;
  body.innerHTML = '<div style="text-align:center;padding:30px;color:var(--txt3)">Cargando...</div>';
  modal.classList.add('open');
  api('/orders', { headers: {Authorization: `Bearer ${authToken}`} })
    .then(orders => {
      const order = orders.find(o => o.id === orderId);
      if (!order) { body.innerHTML = '<div style="text-align:center;padding:30px;color:var(--txt3)">Pedido no encontrado</div>'; return; }
      const statusClass = { 'Pendiente': 'pendiente', 'En proceso': 'proceso', 'Enviado': 'enviado', 'Entregado': 'entregado', 'Cancelado': 'cancelado' }[order.status] || 'pendiente';
      const userStatus = order.status === 'Enviado' ? 'Recibido' : order.status;
      body.innerHTML = `<div class="detail-section"><div class="detail-section-title">Información del pedido</div>
        <div class="detail-info-grid">
          <div class="detail-info-item"><div class="detail-info-label">ID Pedido</div><div class="detail-info-value highlight">${order.id}</div></div>
          <div class="detail-info-item"><div class="detail-info-label">Estado</div><span class="detail-status-badge detail-status-${statusClass}">${userStatus}</span></div>
          <div class="detail-info-item"><div class="detail-info-label">Fecha</div><div class="detail-info-value">${order.date}</div></div>
          <div class="detail-info-item"><div class="detail-info-label">Cliente</div><div class="detail-info-value">${order.client}</div></div>
          <div class="detail-info-item" style="grid-column:1/-1"><div class="detail-info-label">Dirección de envío</div><div class="detail-info-value">${order.addr}</div></div>
        </div></div>
        <div class="detail-section"><div class="detail-section-title">Productos</div>
        <div class="detail-items-list">${order.items.map(item => `<div class="detail-item-row">
          <span class="detail-item-icon">${item.icon}</span><div class="detail-item-info"><div class="detail-item-name">${item.name}</div><div class="detail-item-meta">Código: PROD-${item.id}</div></div>
          <span class="detail-item-qty">×${item.qty}</span><span class="detail-item-price">${fmt(item.price)}</span></div>`).join('')}
        </div><div class="detail-total-row"><span class="detail-total-label">Total del pedido</span><span class="detail-total-value">${fmt(order.total)}</span></div></div>
        ${order.notes ? `<div class="detail-section"><div class="detail-section-title">Notas del pedido</div><div class="detail-ticket-message">${order.notes}</div></div>` : ''}`;
    })
    .catch(() => { body.innerHTML = '<div style="text-align:center;padding:30px;color:var(--txt3)">No se pudo cargar el detalle</div>'; });
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
      if (!ticket) { body.innerHTML = '<div style="text-align:center;padding:30px;color:var(--txt3)">Ticket no encontrado</div>'; return; }
      const statusClass = { 'Abierto': 'abierto', 'En progreso': 'progreso', 'Resuelto': 'resuelto' }[ticket.status] || 'abierto';
      const priorityClass = { 'Baja': 'baja', 'Media': 'media', 'Alta': 'alta' }[ticket.priority] || 'media';
      body.innerHTML = `<div class="detail-section"><div class="detail-section-title">Información del ticket</div>
        <div class="detail-info-grid">
          <div class="detail-info-item"><div class="detail-info-label">ID Ticket</div><div class="detail-info-value highlight">${ticket.id}</div></div>
          <div class="detail-info-item"><div class="detail-info-label">Estado</div><span class="detail-status-badge detail-status-${statusClass}">${ticket.status}</span></div>
          <div class="detail-info-item"><div class="detail-info-label">Prioridad</div><span class="detail-ticket-priority detail-priority-${priorityClass}">${ticket.priority}</span></div>
          <div class="detail-info-item"><div class="detail-info-label">Fecha de creación</div><div class="detail-info-value">${ticket.createdAt}</div></div>
          <div class="detail-info-item"><div class="detail-info-label">Cliente</div><div class="detail-info-value">${ticket.name}</div></div>
          <div class="detail-info-item"><div class="detail-info-label">Email</div><div class="detail-info-value">${ticket.email}</div></div>
        </div></div>
        <div class="detail-section"><div class="detail-section-title">Asunto</div><div class="detail-info-value">${ticket.subject}</div></div>
        <div class="detail-section"><div class="detail-section-title">Mensaje</div><div class="detail-ticket-message">${ticket.message}</div></div>
        ${ticket.notes ? `<div class="detail-section"><div class="detail-section-title">Respuesta del soporte</div><div class="detail-ticket-message" style="border-color:rgba(0,209,199,0.2);background:rgba(0,209,199,0.03)">${ticket.notes}</div></div>` : ''}`;
    })
    .catch(() => { body.innerHTML = '<div style="text-align:center;padding:30px;color:var(--txt3)">No se pudo cargar el detalle</div>'; });
}

function sanitizeChilePhoneInput(input) {
  if (!input) return;
  input.value = String(input.value || '').replace(/\D/g, '').slice(0, 8);
}

let toastT;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 2500);
}

// ═══════════════════════════════════════════════════════════
//  MOBILE MENU
// ═══════════════════════════════════════════════════════════
function toggleMobileMenu() {
  const existing = document.getElementById('mobile-menu-overlay');
  if (existing) { existing.remove(); return; }
  const overlay = document.createElement('div');
  overlay.id = 'mobile-menu-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:600;display:flex;align-items:flex-start;justify-content:flex-start;padding:0;';
  overlay.onclick = () => overlay.remove();
  const drawer = document.createElement('div');
  drawer.style.cssText = 'width:290px;min-height:100vh;background:var(--bg2);padding:20px;z-index:601;';
  drawer.innerHTML = `
    <button onclick="this.parentElement.parentElement.remove()" style="background:none;border:none;color:var(--txt);font-size:24px;cursor:pointer;margin-bottom:20px;">✕</button>
    <ul style="list-style:none;padding:0;">
      <li style="padding:12px 0;"><a href="zonapc-tienda.html" style="color:var(--txt);text-decoration:none;font-size:16px;">Inicio</a></li>
      <li style="padding:12px 0;"><a href="zonapc-tienda.html#catalogo" style="color:var(--txt);text-decoration:none;font-size:16px;">Catálogo</a></li>
      <li style="padding:12px 0;"><a href="zonapc-tienda.html#contacto" style="color:var(--txt);text-decoration:none;font-size:16px;">Contacto</a></li>
      <li style="padding:12px 0;"><a href="tecno-tv.html" style="color:#ff2fb3;text-decoration:none;font-size:16px;font-weight:700;">Tecno TV</a></li>
    </ul>`;
  overlay.appendChild(drawer);
  document.body.appendChild(overlay);
}

function goHomeResetCatalog() {
  window.location.href = 'zonapc-tienda.html';
}

// ═══════════════════════════════════════════════════════════
//  INITIALIZATION
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  checkSessionAndUpdateUI();
  updateCartCount();
  // Also load user data if on tecno-tv page
  if (window.location.pathname.includes('tecno-tv')) {
    fetchCurrentUser();
  }
});

window.addEventListener('storage', () => {
  checkSessionAndUpdateUI();
  updateCartCount();
});

// Cambiar cantidad en carrito
function changeCartQty(id, delta) {
  const cartKey = getCartKey();
  let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
  const item = cart.find(x => x.id === id);
  if (item) {
    item.qty = Math.max(1, (item.qty || 1) + delta);
    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCartCount();
    renderCartDrawer();
  }
}

// Eliminar item del carrito
function removeCartItem(id) {
  const cartKey = getCartKey();
  let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
  cart = cart.filter(x => x.id !== id);
  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartCount();
  renderCartDrawer();
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
  checkSessionAndUpdateUI();
  updateCartCount();
});

// Escuchar cambios en localStorage para actualizar cuando se inicie sesión/cierre sesión
window.addEventListener('storage', () => {
  checkSessionAndUpdateUI();
  updateCartCount();
});