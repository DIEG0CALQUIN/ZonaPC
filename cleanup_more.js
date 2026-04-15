const fs = require('fs');

function replaceBlock(text, startMarker, endMarker, replacement) {
  const start = text.indexOf(startMarker);
  if (start === -1) return text;
  const end = text.indexOf(endMarker, start);
  if (end === -1) return text;
  return text.slice(0, start) + replacement + text.slice(end);
}

let cart = fs.readFileSync('assets/store/store-cart-checkout.js', 'utf8');
cart = replaceBlock(
  cart,
  'function openCheckout() {',
  '\nfunction closeCheckout() {',
`function openCheckout() {
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
  document.getElementById('co-summary-1').innerHTML = \`
    \${cart.map(p=>\`<div class="co-sum-item"><span>\${p.icon} \${p.name.slice(0,26)}… ×\${p.qty}</span><span style="font-weight:600">\${fmt(p.price*p.qty)}</span></div>\`).join('')}
    <div class="co-sum-total"><span>Total</span><span class="co-sum-total-val">\${fmt(total)}</span></div>\`;
  goPaso1();
  document.getElementById('co-modal').classList.add('open');
  history.pushState({modal: 'checkout'}, '');
  setupChileAddressAutocomplete();
}
`
);

cart = replaceBlock(
  cart,
  'function goPaso1() {',
  '\nasync function launchWebpay() {',
`function goPaso1() {
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
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(e)) { err.textContent = '⚠️ Email inválido.'; err.style.display = 'block'; return; }
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
`
);

cart = replaceBlock(
  cart,
  'async function confirmPago() {',
  '\n// """""""""""""""""""""""""""""""""""""""""""""""""""""""""\n//  COUNTDOWN',
`async function confirmPago() {
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
    document.getElementById('res-icon').textContent = '⚠️';
    document.getElementById('res-title').textContent = 'No se pudo registrar el pedido';
    document.getElementById('res-title').style.color = 'var(--c4)';
    document.getElementById('res-sub').textContent = error.message;
    document.getElementById('res-box').innerHTML = '<div class="result-row"><span class="result-row-k">Estado</span><span class="result-row-v">El backend no confirmó la compra.</span></div>';
    document.getElementById('result-overlay').classList.add('open');
    return;
  }
  paying = false;
  document.getElementById('co-close').style.opacity = '1';
  document.getElementById('res-icon').textContent = '✅';
  document.getElementById('res-title').textContent = '¡Pago aprobado!';
  document.getElementById('res-title').style.color = 'var(--c5)';
  document.getElementById('res-sub').textContent = \`Gracias, \${document.getElementById('f-nombre').value}. Tu pedido fue confirmado.\`;
  document.getElementById('res-box').innerHTML = \`
    <div class="result-row"><span class="result-row-k">N° de orden</span><span class="result-row-v" style="color:var(--c1)">\${orden}</span></div>
    <div class="result-row"><span class="result-row-k">Autorización</span><span class="result-row-v">\${auth}</span></div>
    <div class="result-row"><span class="result-row-k">Medio de pago</span><span class="result-row-v">Webpay Plus</span></div>
    <div class="result-row"><span class="result-row-k">Total</span><span class="result-row-v" style="color:var(--c5);font-size:15px">\${fmt(total)}</span></div>\`;
  document.getElementById('result-overlay').classList.add('open');
  if (document.getElementById('view-product').classList.contains('active') && _currentParam) {
    renderProductPage(_currentParam);
    const currentProduct = PRODUCTS.find(x => x.id === _currentParam);
    if (currentProduct) initProductPageStock(currentProduct);
  }
  cart = [];
  renderCart();
}

// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""
//  COUNTDOWN`
);
fs.writeFileSync('assets/store/store-cart-checkout.js', cart, 'utf8');

let data = fs.readFileSync('assets/store/store-data.js', 'utf8');
data = replaceBlock(
  data,
  'const PRODUCTS = [',
  '\n\nconst DESCRIPTIONS = {',
`const PRODUCTS = [
  {id:1,  sku:'ZPC-10438', stock:8,  name:'PC Gaming Ultra RTX 4080', brand:'ZonaPC Build', cat:'pc',           icon:'🖥️', price:1299990, old:null,    badge:'new', rating:4.9, image:'assets/products/p1.jpg',  specs:{CPU:'Intel i9-13900K',GPU:'RTX 4080 16GB',RAM:'32GB DDR5',SSD:'2TB NVMe'}},
  {id:2,  sku:'ZPC-20751', stock:3,  name:'Laptop ProBook 15" OLED',  brand:'ASUS',         cat:'pc',           icon:'💻', price:899990,  old:1099990, badge:'off', rating:4.7, image:'assets/products/p2.jpg',  specs:{CPU:'Ryzen 9 7940HS',GPU:'RTX 4060',RAM:'16GB DDR5',Pantalla:'15.6" OLED 2K'}},
  {id:3,  sku:'ZPC-31924', stock:24, name:'Mouse Gaming Pro 4K DPI',  brand:'Logitech',     cat:'perifericos',  icon:'🖱️', price:64990,   old:79990,   badge:'off', rating:4.8, image:'assets/products/p3.jpg',  specs:{DPI:'100–25600',Botones:'9 prog.','Conexión':'USB/Wireless',RGB:'Sí'}},
  {id:4,  sku:'ZPC-41083', stock:15, name:'Teclado Mecánico RGB TKL', brand:'Keychron',     cat:'perifericos',  icon:'⌨️', price:89990,   old:null,    badge:'hot', rating:4.9, image:'assets/products/p4.jpg',  specs:{Switch:'Red Linear',Layout:'TKL 87 teclas','Conexión':'USB-C/BT',RGB:'Por tecla'}},
  {id:5,  sku:'ZPC-52367', stock:5,  name:'Monitor 27" QHD 165Hz',    brand:'Samsung',      cat:'pc',           icon:'🖥️', price:349990,  old:399990,  badge:'off', rating:4.6, image:'assets/products/p5.jpg',  specs:{'Resolución':'2560×1440',Panel:'IPS',Refresh:'165Hz',Resp:'1ms'}},
  {id:6,  sku:'ZPC-61549', stock:18, name:'Headset 7.1 Surround',     brand:'HyperX',       cat:'audio',        icon:'🎧', price:74990,   old:null,    badge:'new', rating:4.8, image:'assets/products/p6.jpg',  specs:{Audio:'7.1 Surround',Mic:'Desmontable','Conexión':'USB+3.5mm',Peso:'300g'}},
  {id:7,  sku:'ZPC-73821', stock:4,  name:'GPU RTX 4070 Super 12GB',  brand:'NVIDIA',       cat:'componentes',  icon:'🔧', price:589990,  old:649990,  badge:'off', rating:4.7, image:'assets/products/p7.jpg',  specs:{VRAM:'12GB GDDR6X',CUDA:'7168 cores',TDP:'220W',Bus:'PCIe 4.0'}},
  {id:8,  sku:'ZPC-84260', stock:32, name:'SSD NVMe PCIe 4.0 1TB',    brand:'Samsung',      cat:'componentes',  icon:'💾', price:79990,   old:null,    badge:'hot', rating:4.9, image:'assets/products/p8.jpg',  specs:{Cap:'1TB',Lectura:'7000 MB/s',Escritura:'6500 MB/s',Form:'M.2 2280'}},
  {id:9,  sku:'ZPC-90174', stock:20, name:'RAM DDR5 32GB 6000MHz',    brand:'Corsair',      cat:'componentes',  icon:'🔩', price:119990,  old:149990,  badge:'off', rating:4.7, image:'assets/products/p9.jpg',  specs:{Cap:'32GB (2×16)',Vel:'6000MHz',Latencia:'CL36',Volt:'1.35V'}},
  {id:10, sku:'ZPC-05832', stock:45, name:'Mousepad XL RGB 900mm',    brand:'SteelSeries',  cat:'accesorios',   icon:'🎮', price:39990,   old:null,    badge:null,  rating:4.5, image:'assets/products/p10.jpg', specs:{Dim:'900×400mm',Sup:'Tela premium',Base:'Antideslizante',RGB:'Borde LED'}},
  {id:11, sku:'ZPC-16470', stock:7,  name:'Webcam 4K 60fps',          brand:'Logitech',     cat:'accesorios',   icon:'📷', price:129990,  old:159990,  badge:'off', rating:4.6, image:'assets/products/p11.jpg', specs:{Res:'4K 30/1080p 60fps',HDR:'Sí',Mic:'Dual estéreo',FOV:'90°'}},
  {id:12, sku:'ZPC-12093', stock:12, name:'Auriculares Studio Pro',   brand:'Sony',         cat:'audio',        icon:'🎵', price:159990,  old:null,    badge:'new', rating:4.8, image:'assets/products/p12.jpg', specs:{Driver:'40mm',Resp:'5Hz–40kHz',Imp:'24 Ohm',ANC:'Sí'}},
];

const DESCRIPTIONS = {`
);
data = data.replace('2?16GB', '2×16GB');
fs.writeFileSync('assets/store/store-data.js', data, 'utf8');

cart = fs.readFileSync('assets/store/store-cart-checkout.js', 'utf8')
  .replace(/async function launchWebpay\(\) \{\r?\n\r?\nasync function launchWebpay\(\) \{/g, 'async function launchWebpay() {')
  .replace(/Conectandoâ¬¦/g, '\u2026'.replace(/^/, 'Conectando'))
  .replace(/DATOS DE ENVO/g, 'DATOS DE ENV\u00cdO')
  .replace(/textContent = 'a';/g, "textContent = '\\u26A0\\uFE0F';")
  .replace(/textContent = 'S&';/g, "textContent = '\\u2705';")
  .replace(/Â¡Pago aprobado!/g, '\u00a1Pago aprobado!')
  .replace(/NÂ° de orden/g, 'N\u00b0 de orden')
  .replace(/â¬¦ \?/g, '\u2026 \u00d7')
  .replace(/a Completa todos los campos\./g, '\u26A0\uFE0F Completa todos los campos.')
  .replace(/a Email invÃ¡lido\./g, '\u26A0\uFE0F Email inv\u00e1lido.')
  .replace(/a ' \+ validation\.message/g, "'\\u26A0\\uFE0F ' + validation.message");
fs.writeFileSync('assets/store/store-cart-checkout.js', cart, 'utf8');

data = fs.readFileSync('assets/store/store-data.js', 'utf8')
  .replace(/icon:'[^']*', price:1299990/g, "icon:'\\u{1F5A5}\\uFE0F', price:1299990")
  .replace(/icon:'[^']*', price:899990/g, "icon:'\\u{1F4BB}', price:899990")
  .replace(/icon:'[^']*', price:64990/g, "icon:'\\u{1F5B1}\\uFE0F', price:64990")
  .replace(/icon:'[^']*', price:89990/g, "icon:'\\u2328\\uFE0F', price:89990")
  .replace(/icon:'[^']*', price:349990/g, "icon:'\\u{1F5A5}\\uFE0F', price:349990")
  .replace(/icon:'[^']*', price:74990/g, "icon:'\\u{1F3A7}', price:74990")
  .replace(/icon:'[^']*', price:589990/g, "icon:'\\u{1F527}', price:589990")
  .replace(/icon:'[^']*', price:79990/g, "icon:'\\u{1F4BE}', price:79990")
  .replace(/icon:'[^']*', price:119990/g, "icon:'\\u{1F529}', price:119990")
  .replace(/icon:'[^']*', price:39990/g, "icon:'\\u{1F3AE}', price:39990")
  .replace(/icon:'[^']*', price:129990/g, "icon:'\\u{1F4F7}', price:129990")
  .replace(/icon:'[^']*', price:159990/g, "icon:'\\u{1F3B5}', price:159990")
  .replace(/100â€“25600/g, '100\u201325600')
  .replace(/2560Ã—1440/g, '2560\u00d71440')
  .replace(/2Ã—16/g, '2\u00d716')
  .replace(/900Ã—400/g, '900\u00d7400')
  .replace(/5Hzâ€“40kHz/g, '5Hz\u201340kHz');
fs.writeFileSync('assets/store/store-data.js', data, 'utf8');

console.log('cleanup_more done');
