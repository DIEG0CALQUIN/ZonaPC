//  DATA
// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const PRODUCTS = [
  {id:1,  sku:'ZPC-10438', stock:8,  name:'PC Gaming Ultra RTX 4080', brand:'ZonaPC Build', cat:'pc',           icon:'\u{1F5A5}\uFE0F', price:1299990, old:null,    badge:'new', rating:4.9, image:'assets/products/p1.jpg',  specs:{CPU:'Intel i9-13900K',GPU:'RTX 4080 16GB',RAM:'32GB DDR5',SSD:'2TB NVMe'}},
  {id:2,  sku:'ZPC-20751', stock:3,  name:'Laptop ProBook 15" OLED',  brand:'ASUS',         cat:'pc',           icon:'\u{1F4BB}', price:899990,  old:1099990, badge:'off', rating:4.7, image:'assets/products/p2.jpg',  specs:{CPU:'Ryzen 9 7940HS',GPU:'RTX 4060',RAM:'16GB DDR5',Pantalla:'15.6" OLED 2K'}},
  {id:3,  sku:'ZPC-31924', stock:24, name:'Mouse Gaming Pro 4K DPI',  brand:'Logitech',     cat:'perifericos',  icon:'\u{1F5B1}\uFE0F', price:64990,   old:79990,   badge:'off', rating:4.8, image:'assets/products/p3.jpg',  specs:{DPI:'100–25600',Botones:'9 prog.','Conexión':'USB/Wireless',RGB:'Sí'}},
  {id:4,  sku:'ZPC-41083', stock:15, name:'Teclado Mecánico RGB TKL', brand:'Keychron',     cat:'perifericos',  icon:'\u2328\uFE0F', price:89990,   old:null,    badge:'hot', rating:4.9, image:'assets/products/p4.jpg',  specs:{Switch:'Red Linear',Layout:'TKL 87 teclas','Conexión':'USB-C/BT',RGB:'Por tecla'}},
  {id:5,  sku:'ZPC-52367', stock:5,  name:'Monitor 27" QHD 165Hz',   brand:'Samsung',      cat:'pc',           icon:'\u{1F5A5}\uFE0F', price:349990,  old:399990,  badge:'off', rating:4.6, image:'assets/products/p5.jpg',  specs:{'Resolución':'2560×1440',Panel:'IPS',Refresh:'165Hz',Resp:'1ms'}},
  {id:6,  sku:'ZPC-61549', stock:18, name:'Headset 7.1 Surround',    brand:'HyperX',       cat:'audio',        icon:'\u{1F3A7}', price:74990,   old:null,    badge:'new', rating:4.8, image:'assets/products/p6.jpg',  specs:{Audio:'7.1 Surround',Mic:'Desmontable','Conexión':'USB+3.5mm',Peso:'300g'}},
  {id:7,  sku:'ZPC-73821', stock:4,  name:'GPU RTX 4070 Super 12GB', brand:'NVIDIA',       cat:'componentes',  icon:'\u{1F527}', price:589990,  old:649990,  badge:'off', rating:4.7, image:'assets/products/p7.jpg',  specs:{VRAM:'12GB GDDR6X',CUDA:'7168 cores',TDP:'220W',Bus:'PCIe 4.0'}},
  {id:8,  sku:'ZPC-84260', stock:32, name:'SSD NVMe PCIe 4.0 1TB',   brand:'Samsung',      cat:'componentes',  icon:'\u{1F4BE}', price:79990,   old:null,    badge:'hot', rating:4.9, image:'assets/products/p8.jpg',  specs:{Cap:'1TB',Lectura:'7000 MB/s',Escritura:'6500 MB/s',Form:'M.2 2280'}},
  {id:9,  sku:'ZPC-90174', stock:20, name:'RAM DDR5 32GB 6000MHz',   brand:'Corsair',      cat:'componentes',  icon:'\u{1F529}', price:119990,  old:149990,  badge:'off', rating:4.7, image:'assets/products/p9.jpg',  specs:{Cap:'32GB (2×16)',Vel:'6000MHz',Latencia:'CL36',Volt:'1.35V'}},
  {id:10, sku:'ZPC-05832', stock:45, name:'Mousepad XL RGB 900mm',   brand:'SteelSeries',  cat:'accesorios',   icon:'\u{1F3AE}', price:39990,   old:null,    badge:null,  rating:4.5, image:'assets/products/p10.jpg', specs:{Dim:'900×400mm',Sup:'Tela premium',Base:'Antideslizante',RGB:'Borde LED'}},
  {id:11, sku:'ZPC-16470', stock:7,  name:'Webcam 4K 60fps',         brand:'Logitech',     cat:'accesorios',   icon:'\u{1F4F7}', price:129990,  old:159990,  badge:'off', rating:4.6, image:'assets/products/p11.jpg', specs:{Res:'4K 30/1080p 60fps',HDR:'Sí',Mic:'Dual estéreo',FOV:'90°'}},
  {id:12, sku:'ZPC-12093', stock:12, name:'Auriculares Studio Pro',  brand:'Sony',         cat:'audio',        icon:'\u{1F3B5}', price:159990,  old:null,    badge:'new', rating:4.8, image:'assets/products/p12.jpg', specs:{Driver:'40mm',Resp:'5Hz–40kHz',Imp:'24 Ohm',ANC:'Sí'}},
];

const DESCRIPTIONS = {
  1:'La bestia definitiva para gaming extremo. Construida con los componentes más potentes del mercado, diseñada para dominar cualquier título en 4K. Ideal para gamers exigentes, streamers y creadores de contenido.',
  2:'Portátil de alto rendimiento con pantalla OLED 2K que transforma cada imagen. Combina potencia de escritorio con movilidad real. Perfecta para diseñadores, editores de video y profesionales en movimiento.',
  3:'Mouse de precisión con sensor óptico de 25.600 DPI para reacciones instantáneas. Diseño ergonómico que se adapta a cualquier tipo de grip.',
  4:'Teclado mecánico TKL con switches Red lineales para tipeo fluido y silencioso. Retroiluminación RGB personalizable por tecla.',
  5:'Monitor IPS de 27" con QHD y 165Hz. Colores precisos y 1ms para gaming y trabajo creativo.',
  6:'Headset gaming con sonido 7.1 que te sumerge en cada partida. Micrófono desmontable de alta claridad.',
  7:'GPU de última generación con 12GB VRAM GDDR6X. Optimizada para ray tracing en tiempo real con DLSS 3.',
  8:'SSD NVMe de alta velocidad que elimina los tiempos de carga. 7.000 MB/s de lectura secuencial.',
  9:'Memoria DDR5 de alto rendimiento para multitarea sin límites. 2×16GB a 6.000MHz.',
  10:'Mousepad XL con superficie de tela premium y RGB en el borde con 14 efectos de luz.',
  11:'Webcam 4K con IA que ajusta enfoque y exposición automáticamente. Perfecta para streaming y videollamadas.',
  12:'Auriculares de estudio con ANC, respuesta extendida y controlación. Para mezcla y masterización.',
};

const REVIEWS = [
  {name:'Carlos M.', av:'CM', bg:'rgba(108,99,255,0.18)', tc:'#a89dff', r:5, txt:'Increíble rendimiento. Lo uso para trabajo y gaming, nunca lo he visto trabarse.', date:'Hace 2 días'},
  {name:'Valentina R.', av:'VR', bg:'rgba(0,212,255,0.14)', tc:'#67e8f9', r:5, txt:'Llegó súper rápido y bien empacado. La calidad supera el precio.', date:'Hace 1 semana'},
  {name:'Felipe H.', av:'FH', bg:'rgba(6,255,165,0.14)', tc:'#6ee7b7', r:4, txt:'Muy buen producto. El único detalle es que el manual viene en inglés.', date:'Hace 2 semanas'},
  {name:'Antonia L.', av:'AL', bg:'rgba(255,209,102,0.14)', tc:'#fcd34d', r:5, txt:'Exactamente lo que buscaba. El envío llegó en menos de 48h a región.', date:'Hace 1 mes'},
];

//  PRODUCT VARIANTS (visual color/version per product) 
const VARIANTS = {
  1:  [{label:'Negro',    bg:'linear-gradient(135deg,#1a1a2a,#0a0a14)', tint:'rgba(108,99,255,0.15)'},
       {label:'Blanco',   bg:'linear-gradient(135deg,#2a2a3a,#15151f)', tint:'rgba(0,212,255,0.12)'},
       {label:'RGB',      bg:'linear-gradient(135deg,#1a0a2a,#0a1a0a)', tint:'rgba(6,255,165,0.12)'}],
  2:  [{label:'Space Gray', bg:'linear-gradient(135deg,#1a1a20,#0d0d14)', tint:'rgba(148,163,184,0.1)'},
       {label:'Plata',      bg:'linear-gradient(135deg,#202028,#141420)', tint:'rgba(200,200,220,0.1)'},
       {label:'Midnight',   bg:'linear-gradient(135deg,#0a0a1a,#050510)', tint:'rgba(108,99,255,0.18)'}],
  3:  [{label:'Negro',   bg:'linear-gradient(135deg,#0f0f14,#1a1a20)', tint:'rgba(0,212,255,0.1)'},
       {label:'Blanco',  bg:'linear-gradient(135deg,#1f1f26,#141418)', tint:'rgba(240,240,255,0.08)'},
       {label:'Rosa',    bg:'linear-gradient(135deg,#1a0f14,#0f0a10)', tint:'rgba(255,107,150,0.12)'}],
  4:  [{label:'Negro/Gris', bg:'linear-gradient(135deg,#121218,#0c0c12)', tint:'rgba(108,99,255,0.1)'},
       {label:'Blanco',     bg:'linear-gradient(135deg,#1e1e26,#141419)', tint:'rgba(220,220,240,0.08)'},
       {label:'Verde',      bg:'linear-gradient(135deg,#0a140a,#060c06)', tint:'rgba(6,255,165,0.12)'}],
  5:  [{label:'Negro',  bg:'linear-gradient(135deg,#0a0a10,#14141c)', tint:'rgba(0,212,255,0.08)'},
       {label:'Blanco', bg:'linear-gradient(135deg,#1a1a22,#12121a)', tint:'rgba(200,200,255,0.06)'},
       {label:'Curvo',  bg:'linear-gradient(135deg,#100a14,#0a0810)', tint:'rgba(108,99,255,0.14)'}],
  6:  [{label:'Negro',  bg:'linear-gradient(135deg,#0f0f14,#0a0a10)', tint:'rgba(255,107,107,0.1)'},
       {label:'Blanco', bg:'linear-gradient(135deg,#1c1c24,#141418)', tint:'rgba(220,220,240,0.08)'},
       {label:'Azul',   bg:'linear-gradient(135deg,#0a0f1a,#050a14)', tint:'rgba(0,100,255,0.12)'}],
  7:  [{label:'Blower',  bg:'linear-gradient(135deg,#100814,#0a0510)', tint:'rgba(108,99,255,0.15)'},
       {label:'Triple',  bg:'linear-gradient(135deg,#0a0a14,#06060c)', tint:'rgba(0,212,255,0.12)'},
       {label:'Compact', bg:'linear-gradient(135deg,#14100a,#0c0806)', tint:'rgba(245,158,11,0.12)'}],
  8:  [{label:'1TB',  bg:'linear-gradient(135deg,#0a0f14,#060a0f)', tint:'rgba(0,212,255,0.12)'},
       {label:'2TB',  bg:'linear-gradient(135deg,#0f0a14,#0a060f)', tint:'rgba(108,99,255,0.14)'},
       {label:'4TB',  bg:'linear-gradient(135deg,#0a140f,#060f0a)', tint:'rgba(6,255,165,0.12)'}],
  9:  [{label:'32GB',  bg:'linear-gradient(135deg,#0a0a14,#060610)', tint:'rgba(108,99,255,0.14)'},
       {label:'64GB',  bg:'linear-gradient(135deg,#0f0a0a,#100606)', tint:'rgba(255,107,107,0.1)'},
       {label:'96GB',  bg:'linear-gradient(135deg,#0a140a,#060c06)', tint:'rgba(6,255,165,0.12)'}],
  10: [{label:'Negro',   bg:'linear-gradient(135deg,#0a0a0f,#060609)', tint:'rgba(108,99,255,0.1)'},
       {label:'Gris',    bg:'linear-gradient(135deg,#141418,#0e0e12)', tint:'rgba(148,163,184,0.1)'},
       {label:'Blanco',  bg:'linear-gradient(135deg,#1a1a20,#12121a)', tint:'rgba(200,200,220,0.08)'}],
  11: [{label:'Negro',  bg:'linear-gradient(135deg,#0a0a12,#050510)', tint:'rgba(0,212,255,0.1)'},
       {label:'Blanco', bg:'linear-gradient(135deg,#18181f,#10101a)', tint:'rgba(220,220,255,0.08)'},
       {label:'Gris',   bg:'linear-gradient(135deg,#101014,#0c0c10)', tint:'rgba(148,163,184,0.1)'}],
  12: [{label:'Negro',  bg:'linear-gradient(135deg,#0a0a0f,#05050a)', tint:'rgba(255,107,107,0.1)'},
       {label:'Rojo',   bg:'linear-gradient(135deg,#140a0a,#0f0505)', tint:'rgba(255,60,60,0.12)'},
       {label:'Azul',   bg:'linear-gradient(135deg,#0a0a14,#05050f)', tint:'rgba(0,100,255,0.12)'}],
};

function getVariants(id) {
  return VARIANTS[id] || [
    {label:'Estándar', bg:'linear-gradient(135deg,var(--bg4),var(--bg2))', tint:'rgba(108,99,255,0.07)'},
    {label:'Variante 2', bg:'linear-gradient(135deg,var(--bg3),var(--bg))', tint:'rgba(0,212,255,0.07)'},
    {label:'Variante 3', bg:'linear-gradient(135deg,var(--bg5),var(--bg3))', tint:'rgba(6,255,165,0.07)'},
  ];
}


const STATIC_PAGES = {
  envios:{
    tag:'Soporte', title:'Envíos y <em>despachos</em>',
    lead:'Despachamos a todo Chile con los mejores servicios de courier. Tiempos, tarifas y políticas de entrega.',
    body:`
      <div class="sp-cards">
        <div class="sp-card"><div class="sp-card-icon">xa</div><div class="sp-card-title">Express RM</div><div class="sp-card-text">Región Metropolitana en 24 horas hábiles. Lunes a viernes.</div></div>
        <div class="sp-card"><div class="sp-card-icon">x</div><div class="sp-card-title">Todo Chile</div><div class="sp-card-text">24 días hábiles vía Starken o Chilexpress a todo el país.</div></div>
        <div class="sp-card"><div class="sp-card-icon">x </div><div class="sp-card-title">Envío Gratis</div><div class="sp-card-text">En compras sobre $50.000, sin costo adicional.</div></div>
      </div>
      <div class="sp-divider"></div>
      <div class="sp-section">
        <div class="sp-section-title"><span class="sp-icon sp-icon-blue">x</span>Tarifas por región</div>
        <table class="sp-table"><thead><tr><th>Región</th><th>Courier</th><th>Tiempo</th><th>Costo</th></tr></thead><tbody>
          <tr><td>Metropolitana</td><td>Chilexpress / Starken</td><td>24 horas hábiles</td><td>$3.990</td></tr>
          <tr><td>V, VI, VII Región</td><td>Starken</td><td>12 días hábiles</td><td>$4.990</td></tr>
          <tr><td>VIII, IX, X Región</td><td>Starken / Chilexpress</td><td>23 días hábiles</td><td>$5.990</td></tr>
          <tr><td>Norte Grande (I, II, III)</td><td>Chilexpress</td><td>34 días hábiles</td><td>$6.990</td></tr>
          <tr><td>Zonas Extremas (XI, XII)</td><td>Starken</td><td>47 días hábiles</td><td>$9.990</td></tr>
        </tbody></table>
        <p class="sp-text">Pedidos antes de las <strong style="color:var(--txt)">14:00 hrs</strong> de lunes a viernes se despachan el mismo día.</p>
      </div>
      <div class="sp-section">
        <div class="sp-section-title"><span class="sp-icon sp-icon-cyan">x</span>Seguimiento</div>
        <div class="sp-steps">
          <div class="sp-step"><div class="sp-step-num">1</div><div><div class="sp-step-title">Confirmación</div><div class="sp-step-text">Recibirás un email con tu número de orden al completar la compra.</div></div></div>
          <div class="sp-step"><div class="sp-step-num">2</div><div><div class="sp-step-title">Preparación</div><div class="sp-step-text">El equipo de bodega prepara y empaqueta tu pedido.</div></div></div>
          <div class="sp-step"><div class="sp-step-num">3</div><div><div class="sp-step-title">Despacho</div><div class="sp-step-text">Recibirás el número de seguimiento para rastrear tu paquete.</div></div></div>
          <div class="sp-step"><div class="sp-step-num">4</div><div><div class="sp-step-title">Entrega</div><div class="sp-step-text">El courier entrega en la dirección indicada. Si no hay nadie, te contactan.</div></div></div>
        </div>
      </div>`
  },
  garantia:{
    tag:'Soporte', title:'Política de <em>garantía</em>',
    lead:'Todos nuestros productos cuentan con garantía oficial ZonaPC. Tu tranquilidad es nuestra prioridad.',
    body:`
      <div class="sp-badge-row"><span class="sp-badge">S& 12 meses garantía</span><span class="sp-badge">x Servicio técnico</span><span class="sp-badge">x~ Soporte 24/7</span></div>
      <div class="sp-divider"></div>
      <div class="sp-section">
        <div class="sp-section-title"><span class="sp-icon sp-icon-green">x:</span>Cobertura</div>
        <table class="sp-table"><thead><tr><th>Categoría</th><th>Plazo</th><th>Cobertura</th></tr></thead><tbody>
          <tr><td>PCs y Laptops</td><td>12 meses</td><td>Hardware, pantalla, batería</td></tr>
          <tr><td>Componentes</td><td>12 meses</td><td>Defectos de fabricación</td></tr>
          <tr><td>Periféricos</td><td>6 meses</td><td>Switches, conectores, iluminación</td></tr>
          <tr><td>Audio</td><td>6 meses</td><td>Drivers, micrófono, cable</td></tr>
          <tr><td>Accesorios</td><td>3 meses</td><td>Defectos de fabricación</td></tr>
        </tbody></table>
      </div>
      <div class="sp-section">
        <div class="sp-section-title"><span class="sp-icon sp-icon-cyan">x9</span>Cómo hacer válida tu garantía</div>
        <div class="sp-steps">
          <div class="sp-step"><div class="sp-step-num">1</div><div><div class="sp-step-title">Contacta soporte</div><div class="sp-step-text">Escríbenos a garantia@zonapc.cl con tu número de orden.</div></div></div>
          <div class="sp-step"><div class="sp-step-num">2</div><div><div class="sp-step-title">Diagnóstico remoto</div><div class="sp-step-text">Un técnico te guiará. En muchos casos lo resolvemos sin enviar el equipo.</div></div></div>
          <div class="sp-step"><div class="sp-step-num">3</div><div><div class="sp-step-title">Envío al servicio técnico</div><div class="sp-step-text">Si es necesario, te enviamos una guía de despacho prepagada.</div></div></div>
          <div class="sp-step"><div class="sp-step-num">4</div><div><div class="sp-step-title">Reparación o reemplazo</div><div class="sp-step-text">Devolvemos el producto reparado o reemplazado en 10 días hábiles.</div></div></div>
        </div>
      </div>
      <div class="sp-section">
        <div class="sp-section-title"><span class="sp-icon sp-icon-amber"></span>Preguntas frecuentes</div>
        ${[['¿Puedo hacer válida la garantía sin boleta','Sí, con el número de orden de tu email de confirmación de compra.'],['¿Qué pasa si el producto ya no está disponible','Te ofrecemos crédito o un producto equivalente.'],['¿Cuánto demora la reparación','510 días hábiles desde que recibimos el producto.']].map(([q,a],i)=>`<div class="sp-faq" id="fg${i}"><div class="sp-faq-q" onclick="toggleFaq('fg${i}')">${q}<span class="sp-faq-arrow"></span></div><div class="sp-faq-a">${a}</div></div>`).join('')}
      </div>`
  },
  devoluciones:{
    tag:'Soporte', title:'Cambios y <em>devoluciones</em>',
    lead:'Tienes 30 días desde la compra para devolver o cambiar cualquier producto. Sin preguntas.',
    body:`
      <div class="sp-cards">
        <div class="sp-card"><div class="sp-card-icon">x&</div><div class="sp-card-title">30 días</div><div class="sp-card-text">Desde la fecha de compra. Producto sin uso y en embalaje original.</div></div>
        <div class="sp-card"><div class="sp-card-icon">x</div><div class="sp-card-title">Reembolso completo</div><div class="sp-card-text">100% del valor pagado al mismo medio de pago, en 5 días hábiles.</div></div>
        <div class="sp-card"><div class="sp-card-icon">x</div><div class="sp-card-title">Cambio de producto</div><div class="sp-card-text">Puedes cambiar por otro modelo pagando la diferencia si aplica.</div></div>
      </div>
      <div class="sp-divider"></div>
      <div class="sp-section">
        <div class="sp-section-title"><span class="sp-icon sp-icon-cyan">x9</span>Proceso de devolución</div>
        <div class="sp-steps">
          <div class="sp-step"><div class="sp-step-num">1</div><div><div class="sp-step-title">Solicita la devolución</div><div class="sp-step-text">Completa el formulario de contacto con tu número de orden.</div></div></div>
          <div class="sp-step"><div class="sp-step-num">2</div><div><div class="sp-step-title">Aprobación en 24h</div><div class="sp-step-text">Te enviamos una guía de despacho prepagada por email.</div></div></div>
          <div class="sp-step"><div class="sp-step-num">3</div><div><div class="sp-step-title">Envío del producto</div><div class="sp-step-text">Llévalo al courier con la guía. Sin costo para ti.</div></div></div>
          <div class="sp-step"><div class="sp-step-num">4</div><div><div class="sp-step-title">Reembolso o cambio</div><div class="sp-step-text">Procesamos el reembolso o enviamos el cambio en 5 días hábiles.</div></div></div>
        </div>
      </div>
      <div class="sp-section">
        <div class="sp-section-title"><span class="sp-icon sp-icon-amber"></span>Preguntas frecuentes</div>
        ${[['¿Puedo devolver un producto si no me gustó','Sí, dentro de 30 días sin uso y con embalaje completo.'],['¿Cuánto demora el reembolso en mi tarjeta','13 días hábiles desde que recibimos el producto.'],['¿Qué pasa si llegó dañado','Contáctanos dentro de 48h con fotos. Lo reemplazamos sin costo.']].map(([q,a],i)=>`<div class="sp-faq" id="fd${i}"><div class="sp-faq-q" onclick="toggleFaq('fd${i}')">${q}<span class="sp-faq-arrow"></span></div><div class="sp-faq-a">${a}</div></div>`).join('')}
      </div>`
  },
  contacto:{
    tag:'Contacto', title:'Estamos para <em>ayudarte</em>',
    lead:'¿Tienes dudas? Nuestro equipo responde en menos de 2 horas hábiles.',
    body:`
      <div class="sp-contact-grid">
        <div class="sp-contact-card"><div class="sp-contact-card-icon">✉️</div><div class="sp-contact-card-title">Email</div><div class="sp-contact-card-val">contacto@zonapc.cl</div><div class="sp-contact-card-sub">Respuesta en menos de 2 horas hábiles</div></div>
        <div class="sp-contact-card"><div class="sp-contact-card-icon">📞</div><div class="sp-contact-card-title">Teléfono</div><div class="sp-contact-card-val">+56 2 2345 6789</div><div class="sp-contact-card-sub">Lun-Vie 9:00-19:00 hrs</div></div>
        <div class="sp-contact-card"><div class="sp-contact-card-icon">💬</div><div class="sp-contact-card-title">WhatsApp</div><div class="sp-contact-card-val">+56 9 8765 4321</div><div class="sp-contact-card-sub">Respuesta inmediata</div></div>
        <div class="sp-contact-card"><div class="sp-contact-card-icon">📍</div><div class="sp-contact-card-title">Oficina</div><div class="sp-contact-card-val">Av. Providencia 1234</div><div class="sp-contact-card-sub">Solo retiro con cita previa</div></div>
      </div>
      <div class="sp-divider"></div>
      <div class="sp-section">
        <div class="sp-section-title"><span class="sp-icon sp-icon-blue">✉️</span>Envíanos un mensaje</div>
        <div class="sp-alert" id="contact-ok">✅ Mensaje enviado. Te respondemos pronto.</div>
        <form class="sp-form" onsubmit="submitContact(event)">
          <div class="sp-form-row"><div class="sp-field"><label>Nombre</label><input type="text" placeholder="Tu nombre completo" required></div><div class="sp-field"><label>Email</label><input type="email" placeholder="tu@email.com" required></div></div>
          <div class="sp-form-row"><div class="sp-field"><label>Teléfono</label><input type="text" placeholder="+56 9 ..."></div><div class="sp-field"><label>Asunto</label><select><option>Consulta de producto</option><option>Estado de mi pedido</option><option>Garantía / Soporte</option><option>Devolución / Cambio</option><option>Otro</option></select></div></div>
          <div class="sp-field"><label>Mensaje</label><textarea rows="5" placeholder="Describe tu consulta..." required></textarea></div>
          <button type="submit" class="sp-submit">Enviar mensaje →</button>
        </form>
      </div>`
  },
  nosotros:{
    tag:'Empresa', title:'Sobre <em>ZonaPC</em>',
    lead:'Empresa chilena especializada en tecnología de alto rendimiento, con más de 8 años ayudando a gamers, creadores y profesionales.',
    body:`
      <div class="sp-cards">
        <div class="sp-card"><div class="sp-card-icon">x</div><div class="sp-card-title">Fundada en 2016</div><div class="sp-card-text">De tienda pequeña en Santiago a despachar a todo Chile.</div></div>
        <div class="sp-card"><div class="sp-card-icon">x</div><div class="sp-card-title">+12.000 clientes</div><div class="sp-card-text">Clientes activos que confían en nosotros para sus equipos.</div></div>
        <div class="sp-card"><div class="sp-card-icon"></div><div class="sp-card-title">4.9/5 estrellas</div><div class="sp-card-text">Calificación basada en +3.400 reseñas verificadas.</div></div>
      </div>
      <div class="sp-divider"></div>
      <div class="sp-section">
        <div class="sp-section-title"><span class="sp-icon sp-icon-blue">x}</span>Nuestra misión</div>
        <p class="sp-text">Creemos que el acceso a tecnología de calidad no debería ser un privilegio. Trabajamos directamente con distribuidores oficiales para ofrecerte los mejores productos al precio más justo, con asesoría real y soporte post-venta de verdad.</p>
      </div>
      <div class="sp-section">
        <div class="sp-section-title"><span class="sp-icon sp-icon-cyan">x</span>Nuestros valores</div>
        <div class="sp-steps">
          <div class="sp-step"><div class="sp-step-num" style="border-radius:8px">S</div><div><div class="sp-step-title">Transparencia</div><div class="sp-step-text">Precios reales, sin letra chica.</div></div></div>
          <div class="sp-step"><div class="sp-step-num" style="border-radius:8px">S</div><div><div class="sp-step-title">Asesoría honesta</div><div class="sp-step-text">Si un producto no es lo que necesitas, te lo decimos.</div></div></div>
          <div class="sp-step"><div class="sp-step-num" style="border-radius:8px">S</div><div><div class="sp-step-title">Soporte real</div><div class="sp-step-text">Respondemos rápido y resolvemos de verdad.</div></div></div>
        </div>
      </div>`
  },
  blog:{
    tag:'Blog', title:'Noticias y <em>guías tech</em>',
    lead:'Tutoriales, comparativas y las últimas novedades del mundo PC.',
    body:`
      ${[{e:'x',tag:'Guía',t:'Cómo armar un PC gaming en 2026',d:'Todo lo que necesitas saber para armar tu primer PC desde cero.',date:'8 Abr 2026',read:'12 min'},{e:'x',tag:'Comparativa',t:'RTX 4070 vs RTX 4080: ¿Cuál elegir',d:'Rendimiento, consumo y precio de las dos GPUs más vendidas.',date:'3 Abr 2026',read:'8 min'},{e:'x',tag:'Tutorial',t:'SSD NVMe vs SATA: diferencias reales',d:'¿Se nota la diferencia Pruebas concretas en juegos y apps.',date:'28 Mar 2026',read:'6 min'},{e:'R',tag:'Review',t:'Keychron K8 Pro  el mejor teclado under $100',d:'Lo probamos 3 semanas. Calidad, sonido y experiencia.',date:'20 Mar 2026',read:'10 min'}].map(p=>`<div class="sp-card" style="margin-bottom:12px"><div style="display:flex;gap:10px;align-items:flex-start"><div style="font-size:26px;margin-top:2px">${p.e}</div><div><div style="display:flex;gap:7px;align-items:center;margin-bottom:5px"><span class="pb pb-new" style="font-size:9px">${p.tag}</span><span style="font-size:11px;color:var(--txt3)">${p.date} · ${p.read}</span></div><div style="font-weight:600;font-size:14px;margin-bottom:5px">${p.t}</div><div style="font-size:12px;color:var(--txt3)">${p.d}</div></div></div></div>`).join('')}`
  },
  tecnotv:{
    tag:'ZonaPC TV', title:'Tecno <em>TV</em>',
    lead:'Videos, reviews y las últimas noticias del mundo tech. Todo el contenido de tus canales favoritos en un solo lugar.',
    body:`
      <div class="sp-section">
        <h2 style="font-family:var(--font-head);font-size:1.5rem;font-weight:700;color:var(--c1);margin-bottom:18px">Últimos videos de tecnología</h2>
        <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:20px">
          <div style="background:var(--bg3);border-radius:16px;padding:16px;box-shadow:0 4px 20px rgba(66,232,255,0.06);border:1px solid rgba(66,232,255,0.1)">
            <div style="font-weight:700;font-size:0.95rem;margin-bottom:10px;color:var(--c4)">Tecnonauta</div>
            <iframe src="https://www.youtube.com/embed/videoseries?list=UUFOSg71CRAJ58IPuV_-jMbw" title="Tecnonauta YouTube" allowfullscreen loading="lazy" style="width:100%;height:180px;border-radius:10px;border:none"></iframe>
          </div>
          <div style="background:var(--bg3);border-radius:16px;padding:16px;box-shadow:0 4px 20px rgba(66,232,255,0.06);border:1px solid rgba(66,232,255,0.1)">
            <div style="font-weight:700;font-size:0.95rem;margin-bottom:10px;color:var(--c4)">Nate Gentile</div>
            <iframe src="https://www.youtube.com/embed/videoseries?list=UU36xmz34q02JYaZYKrMwXng" title="Nate Gentile YouTube" allowfullscreen loading="lazy" style="width:100%;height:180px;border-radius:10px;border:none"></iframe>
          </div>
          <div style="background:var(--bg3);border-radius:16px;padding:16px;box-shadow:0 4px 20px rgba(66,232,255,0.06);border:1px solid rgba(66,232,255,0.1)">
            <div style="font-weight:700;font-size:0.95rem;margin-bottom:10px;color:var(--c4)">Topes de Gama</div>
            <iframe src="https://www.youtube.com/embed/videoseries?list=UUok_yhjwg4WSx3s_2Yh8ZjQ" title="Topes de Gama YouTube" allowfullscreen loading="lazy" style="width:100%;height:180px;border-radius:10px;border:none"></iframe>
          </div>
        </div>
      </div>
      <div class="sp-section">
        <h2 style="font-family:var(--font-head);font-size:1.5rem;font-weight:700;color:var(--c1);margin-bottom:18px">Últimas noticias de HardZone</h2>
        <div id="hardzone-news-grid" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(340px, 1fr));gap:32px">
          <div style="background:var(--bg3);border-radius:18px;padding:40px;text-align:center">
            <p style="color:var(--txt3)">Cargando noticias...</p>
          </div>
        </div>
      </div>
      </div>`
  },
  carreras:{
    tag:'Empresa', title:'Trabaja con <em>nosotros</em>',
    lead:'Equipo pequeño, apasionado por la tecnología. Si compartes nuestra energía, queremos conocerte.',
    body:`
      <div class="sp-section">
        <div class="sp-section-title"><span class="sp-icon sp-icon-blue">x</span>Posiciones abiertas</div>
        ${[{t:'Asesor de ventas técnico',tipo:'Full-time · Santiago',d:'Buscamos a alguien que ame los componentes PC. Debes poder recomendar productos con criterio técnico real.'},{t:'Community Manager',tipo:'Part-time · Remoto',d:'Gestión de Instagram, TikTok y Twitter. Conocimiento de hardware es un plus.'},{t:'Técnico soporte postventa',tipo:'Full-time · Santiago',d:'Diagnóstico de garantías y atención técnica a clientes. Experiencia en hardware requerida.'}].map(j=>`<div class="sp-card" style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:flex-start;gap:14px"><div><div style="font-weight:600;font-size:14px;margin-bottom:3px">${j.t}</div><div style="font-size:11px;color:var(--c1);margin-bottom:7px">${j.tipo}</div><div style="font-size:13px;color:var(--txt3)">${j.d}</div></div><button onclick="showToast('x Envía tu CV a jobs@zonapc.cl')" style="white-space:nowrap;background:var(--c1);color:#fff;border:none;border-radius:7px;padding:7px 13px;font-size:12px;cursor:pointer">Postular</button></div>`).join('')}
      </div>
      <div class="sp-divider"></div>
      <div class="sp-section">
        <div class="sp-section-title"><span class="sp-icon sp-icon-green">S0</span>Candidatura espontánea</div>
        <p class="sp-text">Mándanos tu CV a <span style="color:var(--c1)">jobs@zonapc.cl</span> con el asunto "Candidatura espontánea" y cuéntanos qué harías por ZonaPC.</p>
      </div>`
  },
};

// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""

