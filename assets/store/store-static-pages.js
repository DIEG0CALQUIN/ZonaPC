//  STATIC PAGES
// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""
async function loadHardZoneNews() {
  const grid = document.getElementById('hardzone-news-grid');
  if (!grid) return;
  try {
    const response = await fetch('/api/news/hardzone');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la respuesta');
    }
    const data = await response.json();
    if (data.news && data.news.length > 0) {
      grid.innerHTML = data.news.map(item => {
        const img = item.image ? `<img src="${item.image}" alt="" style="width:100%;height:150px;object-fit:cover;border-radius:12px;margin-bottom:10px;">` : '';
        const date = item.pubDate ? `<p style="color:var(--txt3);font-size:0.8rem;margin-top:8px">${new Date(item.pubDate).toLocaleDateString('es-ES')}</p>` : '';
        return `<div style="background:var(--bg3);border-radius:18px;padding:18px;cursor:pointer;transition:transform 0.2s;box-shadow:0 4px 24px rgba(108,99,255,0.08)" onclick="window.open('${item.link}','_blank')">${img}<div style="font-weight:700;font-size:1rem;line-height:1.4;color:var(--txt);margin-bottom:8px">${item.title}</div><p style="color:var(--txt3);font-size:0.9rem;margin-top:8px">${item.description}</p>${date}</div>`;
      }).join('');
    } else {
      grid.innerHTML = `<div style="background:var(--bg3);border-radius:18px;padding:40px;text-align:center"><p style="color:var(--txt3)">No se encontraron noticias. <a href="https://hardzone.es/" target="_blank" style="color:var(--c1)">Visita HardZone</a></p></div>`;
    }
  } catch (error) {
    console.error('Error cargando noticias:', error);
    grid.innerHTML = `<div style="background:var(--bg3);border-radius:18px;padding:40px;text-align:center"><p style="color:var(--txt3)">Error cargando noticias. <a href="https://hardzone.es/" target="_blank" style="color:var(--c1)">Visita HardZone</a></p></div>`;
  }
}

function renderStaticPage(slug) {
  const pg = STATIC_PAGES[slug];
  if (!pg) return;
  document.getElementById('sp-content').innerHTML = `
    <div class="sp-wrap">
      <button class="back-btn" onclick="navigate('home')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Volver al inicio
      </button>
      <div class="sp-tag">${pg.tag}</div>
      <h1 class="sp-title">${pg.title}</h1>
      <p class="sp-lead">${pg.lead}</p>
      <div class="sp-divider"></div>
      ${pg.body}
    </div>`;
  if (slug === 'tecnotv') {
    setTimeout(loadHardZoneNews, 50);
  }
}

function toggleFaq(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('open');
}

function submitContact(e) {
  e.preventDefault();
  const ok = document.getElementById('contact-ok');
  if (ok) ok.classList.add('show');
  e.target.reset();
  showToast('✅ Mensaje enviado. Te respondemos pronto.');
}

async function submitHomeTicket() {
  const name = (document.getElementById('tk-name').value || '').trim();
  const email = (document.getElementById('tk-email').value || '').trim();
  const subject = (document.getElementById('tk-subject').value || '').trim();
  const priority = document.getElementById('tk-priority').value || 'Media';
  const message = (document.getElementById('tk-message').value || '').trim();
  const fileInput = document.getElementById('tk-file');
  const files = fileInput && fileInput.files ? fileInput.files : null;

  if (!subject || !message) {
    showToast('Completa asunto y mensaje del ticket');
    return;
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Email inválido');
    return;
  }

  try {
    let body, headers;
    if (files && files.length > 0) {
      body = new FormData();
      body.append('name', name || (currentUser ? currentUser.name : ''));
      body.append('email', email || (currentUser ? currentUser.email : ''));
      body.append('subject', subject);
      body.append('message', message);
      body.append('priority', priority);
      for (let i = 0; i < files.length; i++) {
        body.append('files', files[i]);
      }
      headers = undefined; // Let browser set multipart/form-data
    } else {
      body = JSON.stringify({
        name: name || (currentUser ? currentUser.name : ''),
        email: email || (currentUser ? currentUser.email : ''),
        subject,
        message,
        priority
      });
      headers = { 'Content-Type': 'application/json' };
    }
    await api('/tickets', {
      method: 'POST',
      body,
      headers
    });
    ['tk-name','tk-email','tk-subject','tk-message','tk-file'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const pr = document.getElementById('tk-priority');
    if (pr) pr.value = 'Media';
    showToast('✅ Ticket enviado correctamente');
  } catch (error) {
    showToast(error.message || 'No se pudo enviar el ticket');
  }
}

// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""

