const http = require('http');
const formidable = require('formidable');
const https = require('https');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const GOOGLE_CLIENT_ID = '183373903027-ct7n06nrfa7jhls3sr9kicamobll13kk.apps.googleusercontent.com';

function verifyGoogleToken(idToken) {
  return new Promise((resolve, reject) => {
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const payload = JSON.parse(data);
          if (payload.error) return reject(new Error('Token de Google inválido'));
          if (payload.aud !== GOOGLE_CLIENT_ID) return reject(new Error('Token no pertenece a esta app'));
          resolve(payload);
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

function json(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(payload));
}

async function readDb() {
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

async function writeDb(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      if (!body) return resolve({});
      try { resolve(JSON.parse(body)); }
      catch (error) { reject(error); }
    });
    req.on('error', reject);
  });
}

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: true,
      uploadDir: UPLOADS_DIR,
      keepExtensions: true
    });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    createdAt: user.createdAt,
  };
}

function getTokenUser(req, db) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return null;
  const session = db.sessions.find(item => item.token === token);
  if (!session) return null;
  return db.users.find(user => user.id === session.userId) || null;
}

function formatOrderId() {
  return '#ZPC-' + Date.now().toString().slice(-8);
}

function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function initializeResetTokens(db) {
  if (!db.resetTokens) {
    db.resetTokens = [];
  }
  return db.resetTokens;
}

function addResetToken(db, email, code) {
  const tokens = initializeResetTokens(db);
  tokens.push({
    email: email.toLowerCase(),
    code: code,
    createdAt: Date.now(),
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutos
  });
  return tokens;
}

function findResetToken(db, email, code) {
  const tokens = initializeResetTokens(db);
  const now = Date.now();
  return tokens.find(t => 
    t.email === email.toLowerCase() && 
    t.code === code && 
    t.expiresAt > now
  );
}

function removeResetToken(db, email, code) {
  const tokens = initializeResetTokens(db);
  db.resetTokens = tokens.filter(t => 
    !(t.email === email.toLowerCase() && t.code === code)
  );
}

// Función para obtener noticias de HardZone
function getHardZoneNews(res) {
  const options = {
    hostname: 'hardzone.es',
    path: '/feed/',
    method: 'GET',
    headers: {
      'User-Agent': 'Node.js'
    }
  };

  const req = https.request(options, (response) => {
    let data = '';
    response.on('data', chunk => { data += chunk; });
    response.on('end', () => {
      try {
        // Parsear RSS/XML y extraer noticias
        const news = parseRSSFeed(data);
        json(res, 200, { news });
      } catch (e) {
        json(res, 500, { error: 'Error al procesar noticias', detail: e.message });
      }
    });
  });

  req.on('error', (e) => {
    json(res, 500, { error: 'Error al obtener noticias', detail: e.message });
  });

  req.end();
}

// Parsear feed RSS
function parseRSSFeed(xml) {
  const items = [];
  
  // Extraer cada item del feed
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    
    // Extraer título - probar múltiples formatos
    let title = null;
    const titleCdata = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
    const titlePlain = item.match(/<title>(.*?)<\/title>/);
    if (titleCdata) title = titleCdata[1];
    else if (titlePlain) title = titlePlain[1];
    
    // Extraer link
    const linkMatch = item.match(/<link>(.*?)<\/link>/);
    const link = linkMatch ? linkMatch[1] : null;
    
    // Extraer descripción - probar content:encoded primero (más completo)
    let description = '';
    const contentEncoded = item.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/);
    const contentEncodedPlain = item.match(/<content:encoded>(.*?)<\/content:encoded>/);
    const descriptionCdata = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/);
    const descriptionPlain = item.match(/<description>(.*?)<\/description>/);
    
    if (contentEncoded) {
      description = contentEncoded[1];
    } else if (contentEncodedPlain) {
      description = contentEncodedPlain[1];
    } else if (descriptionCdata) {
      description = descriptionCdata[1];
    } else if (descriptionPlain) {
      description = descriptionPlain[1];
    }
    
    // Extraer fecha
    const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
    const pubDate = pubDateMatch ? pubDateMatch[1] : null;
    
    // Extraer imagen de múltiples fuentes
    let image = null;
    const enclosureMatch = item.match(/<media:content[^>]*url="([^"]*)"/);
    const thumbnailMatch = item.match(/<media:thumbnail[^>]*url="([^"]*)"/);
    const contentImgMatch = description.match(/<img[^>]+src="([^"]*)"/);
    const wpImgMatch = item.match(/<wp:featuredmedia><!\[CDATA\[(\d+)\]\]><\/wp:featuredmedia>/);
    
    if (enclosureMatch) {
      image = enclosureMatch[1];
    } else if (thumbnailMatch) {
      image = thumbnailMatch[1];
    } else if (contentImgMatch) {
      image = contentImgMatch[1];
    }
    
    // Solo agregar si tiene título y link
    if (title && link) {
      // Limpiar HTML de la descripción
      let cleanDesc = description.replace(/<[^>]*>/g, '').trim();
      // Decodificar entidades HTML
      cleanDesc = cleanDesc.replace(/&nbsp;/g, ' ')
        .replace(/&/g, '&')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/&#8217;/g, "'")
        .replace(/&#8211;/g, '-')
        .replace(/&#8220;/g, '"')
        .replace(/&#8221;/g, '"')
        .replace(/&#8230;/g, '...');
      
      // Si no hay descripción, usar el título como fallback
      if (!cleanDesc || cleanDesc.length < 10) {
        cleanDesc = 'Haz clic para leer la noticia completa en HardZone.';
      }
      
      // Truncar si es muy larga
      if (cleanDesc.length > 200) {
        cleanDesc = cleanDesc.substring(0, 200) + '...';
      }
      
      items.push({
        title: title.trim(),
        link: link,
        description: cleanDesc,
        image: image,
        pubDate: pubDate
      });
    }
  }
  
  return items.slice(0, 6); // Retornar solo las primeras 6 noticias
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    });
    return res.end();
  }

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    const db = await readDb();

    // --- API carrito usuario autenticado ---
    if (req.method === 'GET' && pathname === '/api/user/cart') {
      const user = getTokenUser(req, db);
      if (!user) return json(res, 401, {error: 'Sesión inválida'});
      return json(res, 200, {cart: user.cart || []});
    }

    if (req.method === 'PUT' && pathname === '/api/user/cart') {
      const user = getTokenUser(req, db);
      if (!user) return json(res, 401, {error: 'Sesión inválida'});
      const body = await parseBody(req);
      if (!Array.isArray(body.cart)) return json(res, 400, {error: 'Formato de carrito inválido'});
      user.cart = body.cart;
      await writeDb(db);
      return json(res, 200, {ok: true});
    }

    if (req.method === 'GET' && pathname === '/api/health') {
      return json(res, 200, {ok: true});
    }

    // API para obtener noticias de HardZone
    if (req.method === 'GET' && pathname === '/api/news/hardzone') {
      return getHardZoneNews(res);
    }

    if (req.method === 'GET' && pathname === '/api/products') {
      return json(res, 200, db.products);
    }

    if (req.method === 'POST' && pathname === '/api/products') {
      const body = await parseBody(req);
      const nextId = Math.max(0, ...db.products.map(item => item.id)) + 1;
      // Convertir 'cat' a 'categories' array si existe 'cat'
      const categories = body.categories || (body.cat ? [body.cat] : []);
      const product = {...body, categories, id: nextId};
      delete product.cat;
      db.products.push(product);
      await writeDb(db);
      return json(res, 201, product);
    }

    if (req.method === 'PUT' && pathname.startsWith('/api/products/')) {
      const id = Number(pathname.split('/').pop());
      const body = await parseBody(req);
      const index = db.products.findIndex(item => item.id === id);
      if (index < 0) return json(res, 404, {error: 'Producto no encontrado'});
      
      const categories = body.categories || (body.cat ? [body.cat] : db.products[index].categories || []);
      const updatedProduct = {...db.products[index], ...body, categories, id};
      delete updatedProduct.cat;
      
      db.products[index] = updatedProduct;
      await writeDb(db);
      return json(res, 200, db.products[index]);
    }

    if (req.method === 'DELETE' && pathname.startsWith('/api/products/')) {
      const id = Number(pathname.split('/').pop());
      db.products = db.products.filter(item => item.id !== id);
      await writeDb(db);
      return json(res, 200, {ok: true});
    }

    if (req.method === 'GET' && pathname === '/api/orders') {
      return json(res, 200, db.orders);
    }

    if (req.method === 'POST' && pathname === '/api/orders') {
      const body = await parseBody(req);
      const order = {
        id: body.id || formatOrderId(),
        client: body.client,
        email: body.email,
        addr: body.addr,
        items: body.items || [],
        total: body.total || 0,
        status: body.status || 'Pendiente',
        date: body.date,
        userId: body.userId || null,
      };

      for (const item of order.items) {
        const product = db.products.find(entry => entry.id === item.id);
        if (product) product.stock = Math.max(0, product.stock - item.qty);
      }

      db.orders.unshift(order);
      await writeDb(db);
      return json(res, 201, order);
    }

    if (req.method === 'PUT' && pathname.startsWith('/api/orders/')) {
      const id = decodeURIComponent(pathname.split('/').pop());
      const body = await parseBody(req);
      const index = db.orders.findIndex(item => item.id === id);
      if (index < 0) return json(res, 404, {error: 'Pedido no encontrado'});
      db.orders[index] = {...db.orders[index], ...body, id};
      await writeDb(db);
      return json(res, 200, db.orders[index]);
    }

    if (req.method === 'GET' && pathname === '/api/users') {
      return json(res, 200, db.users.map(sanitizeUser));
    }


    if (req.method === 'GET' && pathname === '/api/tickets') {
      return json(res, 200, db.tickets || []);
    }

    // Soporte para adjuntar archivos en tickets
    if (req.method === 'POST' && pathname === '/api/tickets') {
      let ticket, filesInfo = [];
      if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
        const { fields, files } = await parseMultipart(req);
        ticket = {
          id: crypto.randomUUID(),
          name: fields.name || '',
          email: fields.email || '',
          subject: fields.subject || '',
          message: fields.message || '',
          priority: fields.priority || 'Media',
          date: new Date().toISOString(),
        };
        // Manejar archivos adjuntos
        if (files && files.files) {
          const arr = Array.isArray(files.files) ? files.files : [files.files];
          filesInfo = arr.map(f => ({
            originalFilename: f.originalFilename,
            savedAs: path.basename(f.filepath),
            size: f.size,
            mimetype: f.mimetype
          }));
          ticket.attachments = filesInfo;
        }
      } else {
        // JSON normal
        const body = await parseBody(req);
        ticket = {
          id: crypto.randomUUID(),
          name: body.name || '',
          email: body.email || '',
          subject: body.subject || '',
          message: body.message || '',
          priority: body.priority || 'Media',
          date: new Date().toISOString(),
          attachments: []
        };
      }
      if (!db.tickets) db.tickets = [];
      db.tickets.unshift(ticket);
      await writeDb(db);
      return json(res, 201, ticket);
    }

    if (req.method === 'PUT' && pathname.startsWith('/api/tickets/')) {
      const id = decodeURIComponent(pathname.split('/').pop());
      const body = await parseBody(req);
      const index = (db.tickets || []).findIndex(item => item.id === id);
      if (index < 0) return json(res, 404, {error: 'Ticket no encontrado'});
      db.tickets[index] = {...db.tickets[index], ...body, id};
      await writeDb(db);
      return json(res, 200, db.tickets[index]);
    }

    if (req.method === 'POST' && pathname === '/api/auth/register') {
      const body = await parseBody(req);
      const email = String(body.email || '').trim().toLowerCase();
      if (!body.name || !email || !body.password) return json(res, 400, {error: 'Datos incompletos'});
      if (db.users.some(user => user.email === email)) return json(res, 409, {error: 'El email ya existe'});

      const user = {
        id: crypto.randomUUID(),
        name: body.name,
        email,
        phone: body.phone || '',
        passwordHash: hashPassword(body.password),
        createdAt: new Date().toISOString(),
      };
      db.users.push(user);

      const token = crypto.randomUUID();
      db.sessions.push({token, userId: user.id, createdAt: new Date().toISOString()});
      await writeDb(db);
      return json(res, 201, {token, user: sanitizeUser(user)});
    }

    if (req.method === 'POST' && pathname === '/api/auth/login') {
      const body = await parseBody(req);
      const email = String(body.email || '').trim().toLowerCase();
      const passwordHash = hashPassword(String(body.password || ''));
      const user = db.users.find(item => item.email === email && item.passwordHash === passwordHash);
      if (!user) return json(res, 401, {error: 'Credenciales inválidas'});
      const token = crypto.randomUUID();
      db.sessions.push({token, userId: user.id, createdAt: new Date().toISOString()});
      await writeDb(db);
      return json(res, 200, {token, user: sanitizeUser(user)});
    }

    if (req.method === 'GET' && pathname === '/api/auth/me') {
      const user = getTokenUser(req, db);
      if (!user) return json(res, 401, {error: 'Sesión inválida'});
      return json(res, 200, {user: sanitizeUser(user)});
    }

    if (req.method === 'PUT' && pathname === '/api/auth/profile') {
      const user = getTokenUser(req, db);
      if (!user) return json(res, 401, {error: 'SesiÃ³n invÃ¡lida'});
      const body = await parseBody(req);
      const name = String(body.name || '').trim();
      const phone = String(body.phone || '').trim();
      if (!name) return json(res, 400, {error: 'El nombre es obligatorio'});
      if (phone && !/^[0-9]{8}$/.test(phone)) return json(res, 400, {error: 'Telefono invalido. Ingresa 8 digitos.'});
      user.name = name;
      user.phone = phone;
      await writeDb(db);
      return json(res, 200, {user: sanitizeUser(user)});
    }

    if (req.method === 'GET' && pathname === '/api/user/orders') {
      const user = getTokenUser(req, db);
      if (!user) return json(res, 401, {error: 'Sesión inválida'});
      const userOrders = db.orders.filter(order => order.userId === user.id);
      return json(res, 200, userOrders);
    }

    if (req.method === 'GET' && pathname === '/api/user/tickets') {
      const user = getTokenUser(req, db);
      if (!user) return json(res, 401, {error: 'Sesión inválida'});
      const userTickets = db.tickets.filter(ticket => ticket.email === user.email);
      return json(res, 200, userTickets);
    }

    if (req.method === 'POST' && pathname === '/api/auth/logout') {
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
      db.sessions = db.sessions.filter(item => item.token !== token);
      await writeDb(db);
      return json(res, 200, {ok: true});
    }

    if (req.method === 'POST' && pathname === '/api/auth/google') {
      const body = await parseBody(req);
      if (!body.credential) return json(res, 400, {error: 'Token de Google requerido'});
      let payload;
      try {
        payload = await verifyGoogleToken(body.credential);
      } catch (e) {
        return json(res, 401, {error: e.message || 'Token de Google inválido'});
      }
      const email = String(payload.email || '').trim().toLowerCase();
      if (!email) return json(res, 400, {error: 'No se obtuvo email de Google'});

      let user = db.users.find(u => u.email === email);
      if (!user) {
        user = {
          id: crypto.randomUUID(),
          name: payload.name || email.split('@')[0],
          email,
          phone: '',
          googleId: payload.sub,
          createdAt: new Date().toISOString(),
        };
        db.users.push(user);
      } else if (!user.googleId) {
        user.googleId = payload.sub;
      }
      const token = crypto.randomUUID();
      db.sessions.push({token, userId: user.id, createdAt: new Date().toISOString()});
      await writeDb(db);
      return json(res, 200, {token, user: sanitizeUser(user)});
    }

    if (req.method === 'POST' && pathname === '/api/auth/forgot-password') {
      const body = await parseBody(req);
      const email = String(body.email || '').trim().toLowerCase();
      if (!email) return json(res, 400, {error: 'Email requerido'});
      
      const user = db.users.find(u => u.email === email);
      if (!user) return json(res, 404, {error: 'Email no encontrado en el sistema'});
      
      const code = generateResetCode();
      addResetToken(db, email, code);
      await writeDb(db);
      
      return json(res, 200, {
        message: 'Código de recuperación enviado',
        code: code, // En producción esto iría por email, aquí lo mostramos para desarrollo
      });
    }

    if (req.method === 'POST' && pathname === '/api/auth/reset-password') {
      const body = await parseBody(req);
      const email = String(body.email || '').trim().toLowerCase();
      const code = String(body.code || '').trim();
      const newPassword = body.newPassword;
      
      if (!email || !code || !newPassword) return json(res, 400, {error: 'Datos incompletos'});
      if (newPassword.length < 6) return json(res, 400, {error: 'La contraseña debe tener al menos 6 caracteres'});
      
      const token = findResetToken(db, email, code);
      if (!token) return json(res, 401, {error: 'Código inválido o expirado'});
      
      const user = db.users.find(u => u.email === email);
      if (!user) return json(res, 404, {error: 'Usuario no encontrado'});
      
      user.passwordHash = hashPassword(newPassword);
      removeResetToken(db, email, code);
      await writeDb(db);
      
      return json(res, 200, {message: 'Contraseña actualizada correctamente'});
    }

    // Servir archivos estáticos desde la carpeta raíz del proyecto
    if (req.method === 'GET') {
      const ROOT = path.join(__dirname, '..');
      const MIME = {
        '.html':'text/html;charset=utf-8', '.js':'application/javascript',
        '.css':'text/css', '.json':'application/json',
        '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png',
        '.webp':'image/webp', '.svg':'image/svg+xml', '.ico':'image/x-icon'
      };
      let filePath = path.join(ROOT, pathname === '/' ? '/zonapc-tienda.html' : pathname);
      // Evitar path traversal fuera del directorio raíz
      if (!filePath.startsWith(ROOT)) return json(res, 403, {error: 'Prohibido'});
      try {
        const data = await fs.readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {'Content-Type': MIME[ext] || 'application/octet-stream'});
        return res.end(data);
      } catch {
        // Si la ruta no es API ni archivo estático, servir SPA (zonapc-tienda.html)
        if (!pathname.startsWith('/api') && !path.extname(pathname)) {
          try {
            const spa = await fs.readFile(path.join(ROOT, 'zonapc-tienda.html'));
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            return res.end(spa);
          } catch {
            return json(res, 404, {error: 'Archivo no encontrado'});
          }
        }
        return json(res, 404, {error: 'Archivo no encontrado'});
      }
    }

    return json(res, 404, {error: 'Ruta no encontrada'});
  } catch (error) {
    return json(res, 500, {error: 'Error interno', detail: error.message});
  }
});

server.listen(PORT, () => {
  console.log(`ZonaPC backend escuchando en http://localhost:${PORT}`);
});
