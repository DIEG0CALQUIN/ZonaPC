const fs = require('fs');

function edit(file, transform) {
  const before = fs.readFileSync(file, 'utf8');
  const after = transform(before);
  fs.writeFileSync(file, after, 'utf8');
  console.log('updated', file);
}

edit('zonapc-tienda.html', (text) => text
  .replace(/<title>[\s\S]*?<\/title>/, '<title>ZonaPC — Tecnología al límite</title>')
  .replace(/<button class="mobile-menu-close"[\s\S]*?<\/button>/, '<button class="mobile-menu-close" onclick="closeMobileMenu()">✕</button>')
  .replace(/<span class="fc-icon">[\s\S]*?<\/span>/, '<span class="fc-icon">🛒</span>')
  .replace(/<h1>DOMINA[\s\S]*?<\/h1>/, '<h1>DOMINA<span class="grad">EL HARDWARE.</span><span class="sub">PCs, periféricos y accesorios — todo lo que necesitas.</span></h1>')
  .replace(/<div class="marquee-track">[\s\S]*?<\/div>/, `<div class="marquee-track">
      <span class="marquee-item"><em>🖥️</em> PCs Gaming</span><span class="marquee-item"><em>💻</em> Laptops</span><span class="marquee-item"><em>🔧</em> GPUs RTX</span><span class="marquee-item"><em>⌨️</em> Teclados</span><span class="marquee-item"><em>🖱️</em> Mouses</span><span class="marquee-item"><em>🎧</em> Audio</span><span class="marquee-item"><em>💾</em> SSDs NVMe</span><span class="marquee-item"><em>🔩</em> RAM DDR5</span><span class="marquee-item"><em>📷</em> Webcams</span><span class="marquee-item"><em>🎮</em> Accesorios</span>
      <span class="marquee-item"><em>🖥️</em> PCs Gaming</span><span class="marquee-item"><em>💻</em> Laptops</span><span class="marquee-item"><em>🔧</em> GPUs RTX</span><span class="marquee-item"><em>⌨️</em> Teclados</span><span class="marquee-item"><em>🖱️</em> Mouses</span><span class="marquee-item"><em>🎧</em> Audio</span><span class="marquee-item"><em>💾</em> SSDs NVMe</span><span class="marquee-item"><em>🔩</em> RAM DDR5</span><span class="marquee-item"><em>📷</em> Webcams</span><span class="marquee-item"><em>🎮</em> Accesorios</span>
    </div>`)
  .replace(/<option value="name">[\s\S]*?<\/option>/, '<option value="name">Nombre A–Z</option>')
  .replace(/<button class="feat-cta"[\s\S]*?<\/button>/, '<button class="feat-cta" onclick="setCat(\'all\',document.querySelector(\'.cat-pill\'));document.getElementById(\'catalogo\').scrollIntoView({behavior:\'smooth\'})">Ver todas las ofertas →</button>')
  .replace(/<div class="feat-visual">[\s\S]*?<\/div>/, '<div class="feat-visual">🔥</div>')
  .replace(/<div class="trust-strip">[\s\S]*?<\/section>/, `<div class="trust-strip">
        <div class="trust-item"><div class="trust-icon t1">🚚</div><div><div class="trust-title">Envío gratis</div><div class="trust-sub">En compras sobre $50.000</div></div></div>
        <div class="trust-item"><div class="trust-icon t2">🔒</div><div><div class="trust-title">Pago seguro</div><div class="trust-sub">Webpay Plus / Transbank</div></div></div>
        <div class="trust-item"><div class="trust-icon t3">↩️</div><div><div class="trust-title">30 días garantía</div><div class="trust-sub">Devolución sin preguntas</div></div></div>
        <div class="trust-item"><div class="trust-icon t4">💬</div><div><div class="trust-title">Soporte 24/7</div><div class="trust-sub">Chat, email y teléfono</div></div></div>
      </div>
    </div>
  </section>`)
  .replace(/<option value="\?uble">\?uble<\/option>/g, '<option value="Ñuble">Ñuble</option>')
  .replace(/<script src="assets\/store\/store-categories\.js"><\/script>\s*<script src="assets\/store\/store-menu\.js"><\/script>\s*<script src="assets\/store\/store-checkout-validation\.js"><\/script>\s*System\.Object\[\]/g, '')
  .replace(/D0BITO/g, 'DÉBITO')
  .replace(/>\s+Volver a datos de envío</g, '>← Volver a datos de envío<')
  .replace(/Transbank \? Portal de Pago Seguro/g, 'Transbank — Portal de Pago Seguro')
  .replace(/Número de tarjeta \(prueba integración\)/g, 'Número de tarjeta (prueba integración)')
  .replace(/>ℹ️? ?Tarjetas de prueba del ambiente de integración Transbank\./g, '>ℹ️ Tarjetas de prueba del ambiente de integración Transbank.')
  .replace(/Confirmar pago \? Simulación/g, 'Confirmar pago — Simulación')
  .replace(/>\s+Cancelar y volver</g, '>← Cancelar y volver<')
  .replace(/<div class="profile-section-title">x\? Mis Compras<\/div>/g, '<div class="profile-section-title">📦 Mis Compras</div>')
  .replace(/<div class="profile-section-title">x Mis Tickets<\/div>/g, '<div class="profile-section-title">🎫 Mis Tickets</div>')
);

edit('assets/store/store-product-page.js', (text) => text
  .replace(/hot:\['pb-hot','[^']* HOT'\]/, "hot:['pb-hot','🔥 HOT']")
  .replace(/'\&'\.repeat\(Math\.floor\(p\.rating\)\)\}\$\{' '\.repeat\(5-Math\.floor\(p\.rating\)\)/, "'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5-Math.floor(p.rating))")
  .replace(/S\? Ahorras/g, '✓ Ahorras')
  .replace(/<button class="pp-qty-btn" onclick="changePpQty\(-1\)"><\/button>/, '<button class="pp-qty-btn" onclick="changePpQty(-1)">−</button>')
  .replace(/a Comprar ahora/g, '⚡ Comprar ahora')
  .replace(/xaa Despacho gratis/g, '🚚 Despacho gratis')
  .replace(/x\? Webpay seguro/g, '🔒 Webpay seguro')
  .replace(/  30 días para devolver/g, '↩️ 30 días para devolver')
);

edit('assets/store/store-cart-checkout.js', (text) => text
  .replace(/<button class="ci-qty-btn" onclick="changeQty\(\$\{p\.id\},-1\)"><\/button>/g, '<button class="ci-qty-btn" onclick="changeQty(${p.id},-1)">−</button>')
  .replace(/>S"</g, '>✕<')
  .replace(/⬦ ×/g, '… ×')
  .replace(/DATOS DE ENVÃO/g, 'DATOS DE ENVÍO')
  .replace(/Conectando…|Conectandoâ¬¦/g, 'Conectando…')
  .replace(/>x\?</g, '>⚠️<')
  .replace(/>S&</g, '>✅<')
  .replace(/¡Pago aprobado!|Â¡Pago aprobado!/g, '¡Pago aprobado!')
  .replace(/N° de orden|NÂ° de orden/g, 'N° de orden')
);

edit('assets/store/store-data.js', (text) => text
  .replace(/icon:'x\}'/g, "icon:'🎧'")
  .replace(/icon:'x\?'/g, "icon:'🔧'")
  .replace(/icon:'R'/g, "icon:'⌨️'")
  .replace(/icon:'x'/g, "icon:'🖥️'")
  .replace(/name:'Laptop ProBook 15\" OLED'[^\\n]*icon:'🖥️'/, (m) => m.replace("icon:'🖥️'", "icon:'💻'"))
  .replace(/name:'Mouse Gaming Pro 4K DPI'[^\\n]*icon:'🖥️'/, (m) => m.replace("icon:'🖥️'", "icon:'🖱️'"))
  .replace(/name:'SSD NVMe PCIe 4\.0 1TB'[^\\n]*icon:'🖥️'/, (m) => m.replace("icon:'🖥️'", "icon:'💾'"))
  .replace(/name:'RAM DDR5 32GB 6000MHz'[^\\n]*icon:'🔧'/, (m) => m.replace("icon:'🔧'", "icon:'🔩'"))
  .replace(/name:'Mousepad XL RGB 900mm'[^\\n]*icon:'🎧'/, (m) => m.replace("icon:'🎧'", "icon:'🎮'"))
  .replace(/name:'Webcam 4K 60fps'[^\\n]*icon:'🔧'/, (m) => m.replace("icon:'🔧'", "icon:'📷'"))
  .replace(/name:'Auriculares Studio Pro'[^\\n]*icon:'🎧'/, (m) => m.replace("icon:'🎧'", "icon:'🎵'"))
  .replace(/100\?25600/g, '100–25600')
  .replace(/2560\?1440/g, '2560×1440')
  .replace(/2\?16GB/g, '2×16GB')
  .replace(/2\?16/g, '2×16')
  .replace(/900\?400/g, '900×400')
  .replace(/5Hz\?40kHz/g, '5Hz–40kHz')
  .replace(/24\?48h/g, '24–48h')
);
