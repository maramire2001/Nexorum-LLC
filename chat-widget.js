/**
 * ═══════════════════════════════════════════════════════════════════
 *  NEXORUM GLOBAL — CHAT WIDGET (NEXO)
 *  Widget de chat IA con captura de leads
 *  Conecta con /api/chat (Groq via Vercel)
 * ═══════════════════════════════════════════════════════════════════
 */
(function () {
  'use strict';

  const WA = '525664445643';
  const API = '/api/chat';

  /* ── STRINGS ───────────────────────────────────────────────────── */
  const T = {
    es: {
      title: 'NEXO — Asistente',
      online: 'En línea ahora',
      placeholder: 'Escribe tu pregunta...',
      welcome: '¡Hola! Soy **NEXO**, el asistente de **Nexorum Global**.\n\nPuedo orientarte sobre nuestros servicios de publicación internacional y automatización empresarial con IA.\n\n¿En qué puedo ayudarte hoy?',
      bubble: '¿Tienes preguntas sobre Nexorum?\n<strong style="color:#e9c176">Chatea con NEXO ahora →</strong>',
      error: 'Error al conectar. Escríbenos por **WhatsApp** y te atendemos de inmediato.',
      waBtn: 'Abrir WhatsApp',
    },
    en: {
      title: 'NEXO — Assistant',
      online: 'Online now',
      placeholder: 'Type your question...',
      welcome: 'Hi! I\'m **NEXO**, the **Nexorum Global** virtual assistant.\n\nI can guide you on our international publishing and AI enterprise automation services.\n\nHow can I help you today?',
      bubble: 'Questions about Nexorum?\n<strong style="color:#e9c176">Chat with NEXO now →</strong>',
      error: 'Connection error. Message us on **WhatsApp** and we\'ll assist you right away.',
      waBtn: 'Open WhatsApp',
    },
  };

  function t(k) {
    const lang = document.documentElement.lang || 'es';
    return (T[lang] || T.es)[k];
  }

  /* ── STATE ─────────────────────────────────────────────────────── */
  let open = false;
  let loading = false;
  let history = [];      // {role, content}[]
  let msgCount = 0;
  let leadAsked = false;

  /* ── CSS ───────────────────────────────────────────────────────── */
  function injectCSS() {
    const s = document.createElement('style');
    s.textContent = `
/* ── BUTTON ── */
#nx-btn{position:fixed;bottom:26px;right:26px;z-index:10000;width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#000413,#0a192f);border:2px solid #e9c176;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 28px rgba(0,4,19,.55);transition:transform .2s,box-shadow .2s;animation:nx-pulse 3s ease-in-out infinite}
#nx-btn:hover{transform:scale(1.1);box-shadow:0 12px 36px rgba(0,4,19,.65)}
@keyframes nx-pulse{0%,100%{box-shadow:0 8px 28px rgba(0,4,19,.55),0 0 0 0 rgba(233,193,118,.35)}60%{box-shadow:0 8px 28px rgba(0,4,19,.55),0 0 0 10px rgba(233,193,118,0)}}
#nx-badge{position:absolute;top:-4px;right:-4px;width:18px;height:18px;background:#e9c176;border-radius:50%;border:2px solid #000413;font-family:'Plus Jakarta Sans',sans-serif;font-size:10px;font-weight:900;color:#000413;display:flex;align-items:center;justify-content:center}

/* ── BUBBLE ── */
#nx-bubble{position:fixed;bottom:94px;right:26px;z-index:9999;background:#000413;border:1px solid rgba(233,193,118,.45);color:#e2e8f0;font-family:'Work Sans',sans-serif;font-size:13px;line-height:1.5;padding:11px 15px;max-width:210px;cursor:pointer;opacity:0;transform:translateY(10px) scale(.96);transition:opacity .3s,transform .3s;pointer-events:none}
#nx-bubble.nx-show{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}
#nx-bubble::after{content:'';position:absolute;bottom:-7px;right:22px;width:12px;height:12px;background:#000413;border-right:1px solid rgba(233,193,118,.45);border-bottom:1px solid rgba(233,193,118,.45);transform:rotate(45deg)}

/* ── PANEL ── */
#nx-panel{position:fixed;bottom:98px;right:26px;z-index:9999;width:375px;max-height:540px;display:flex;flex-direction:column;background:#000413;border:1px solid rgba(54,93,165,.4);box-shadow:0 20px 60px rgba(0,0,0,.6);opacity:0;transform:translateY(18px) scale(.95);transform-origin:bottom right;transition:opacity .22s ease,transform .22s ease;pointer-events:none}
#nx-panel.nx-open{opacity:1;transform:translateY(0) scale(1);pointer-events:all}

/* ── HEADER ── */
.nx-hd{display:flex;align-items:center;gap:11px;padding:13px 15px;background:linear-gradient(135deg,#0a192f,#112240);border-bottom:1px solid rgba(54,93,165,.3);flex-shrink:0}
.nx-hd-icon{width:38px;height:38px;border-radius:50%;background:rgba(233,193,118,.1);border:1px solid rgba(233,193,118,.35);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.nx-hd-info{flex:1}
.nx-hd-title{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:12px;color:#fff;letter-spacing:.08em;text-transform:uppercase}
.nx-hd-sub{display:flex;align-items:center;gap:5px;font-family:'Work Sans',sans-serif;font-size:11px;color:#e9c176;margin-top:2px}
.nx-dot{width:6px;height:6px;border-radius:50%;background:#25D366;animation:nx-blink 2s infinite}
@keyframes nx-blink{0%,100%{opacity:1}50%{opacity:.3}}
.nx-x{background:none;border:none;color:rgba(255,255,255,.4);cursor:pointer;padding:4px;display:flex;transition:color .15s;flex-shrink:0}
.nx-x:hover{color:#fff}

/* ── MESSAGES ── */
#nx-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;min-height:0}
#nx-msgs::-webkit-scrollbar{width:3px}
#nx-msgs::-webkit-scrollbar-track{background:transparent}
#nx-msgs::-webkit-scrollbar-thumb{background:rgba(54,93,165,.4)}

.nx-msg{display:flex;flex-direction:column;max-width:87%;animation:nx-in .2s ease}
@keyframes nx-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.nx-msg.nx-user{align-self:flex-end;align-items:flex-end}
.nx-msg.nx-bot{align-self:flex-start;align-items:flex-start}
.nx-bbl{padding:9px 13px;font-family:'Work Sans',sans-serif;font-size:13px;line-height:1.55;word-break:break-word;white-space:pre-wrap}
.nx-msg.nx-user .nx-bbl{background:#365da5;color:#fff}
.nx-msg.nx-bot .nx-bbl{background:#0a192f;color:#e2e8f0;border:1px solid rgba(54,93,165,.3)}
.nx-ts{font-size:10px;color:rgba(255,255,255,.22);font-family:'Work Sans',sans-serif;margin-top:3px;padding:0 2px}

/* ── TYPING ── */
.nx-typing{display:flex;align-items:center;gap:4px;padding:10px 13px;background:#0a192f;border:1px solid rgba(54,93,165,.3);align-self:flex-start;animation:nx-in .2s ease}
.nx-d{width:6px;height:6px;border-radius:50%;background:#e9c176;animation:nx-bounce 1.3s infinite}
.nx-d:nth-child(2){animation-delay:.18s}
.nx-d:nth-child(3){animation-delay:.36s}
@keyframes nx-bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}

/* ── WA BUTTON ── */
.nx-wa{display:inline-flex;align-items:center;gap:6px;background:#25D366;color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:11px;letter-spacing:.05em;text-transform:uppercase;text-decoration:none;padding:7px 12px;margin-top:7px;transition:background .15s;border:none;cursor:pointer}
.nx-wa:hover{background:#128C7E}

/* ── LEAD FORM ── */
#nx-lead{flex-shrink:0;background:#0a192f;border-top:1px solid rgba(54,93,165,.3);padding:12px 14px;display:none;flex-direction:column;gap:8px}
#nx-lead.nx-show{display:flex}
#nx-lead p{font-family:'Work Sans',sans-serif;font-size:12px;color:#e9c176;margin:0;letter-spacing:.03em}
.nx-fi{background:#000413;border:1px solid rgba(54,93,165,.4);color:#fff;font-family:'Work Sans',sans-serif;font-size:12px;padding:8px 10px;outline:none;width:100%;transition:border-color .15s}
.nx-fi:focus{border-color:#e9c176}
.nx-fi::placeholder{color:rgba(255,255,255,.3)}
#nx-lead-send{background:#e9c176;border:none;color:#000413;font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:11px;letter-spacing:.07em;text-transform:uppercase;padding:9px 14px;cursor:pointer;transition:background .15s;align-self:flex-end}
#nx-lead-send:hover{background:#f5d080}

/* ── INPUT ── */
.nx-inp-row{display:flex;gap:7px;padding:11px 13px;border-top:1px solid rgba(54,93,165,.25);background:#000413;flex-shrink:0}
#nx-inp{flex:1;background:#0a192f;border:1px solid rgba(54,93,165,.35);color:#fff;font-family:'Work Sans',sans-serif;font-size:13px;padding:9px 11px;outline:none;transition:border-color .15s}
#nx-inp:focus{border-color:#e9c176}
#nx-inp::placeholder{color:rgba(255,255,255,.3)}
#nx-go{background:#365da5;border:none;color:#fff;padding:9px 13px;cursor:pointer;display:flex;align-items:center;transition:background .15s;flex-shrink:0}
#nx-go:hover{background:#4a7fd4}
#nx-go:disabled{background:rgba(54,93,165,.3);cursor:not-allowed}

/* ── MOBILE ── */
@media(max-width:430px){
  #nx-panel{right:0;bottom:80px;width:100vw;max-height:72vh}
  #nx-btn{bottom:16px;right:16px}
  #nx-bubble{right:16px}
}
    `;
    document.head.appendChild(s);
  }

  /* ── SVG LOGO (HEAD + NEURAL NET) ─────────────────────────────── */
  const LOGO_SVG = `<svg width="20" height="20" viewBox="0 0 44 44" fill="none">
    <path d="M10 38L10 32C6 30 3 25.5 3 20C3 11.2 9.7 4 18 4C26.3 4 33 11.2 33 20C33 25.5 30 30 26 32L26 38Z" stroke="#e9c176" stroke-width="1.8" fill="none" stroke-linejoin="round"/>
    <circle cx="15" cy="15" r="2.2" fill="#e9c176"/>
    <circle cx="23" cy="11" r="1.5" fill="#4a7fd4" opacity=".9"/>
    <circle cx="28" cy="19" r="1.8" fill="#4a7fd4" opacity=".9"/>
    <circle cx="22" cy="26" r="1.4" fill="#4a7fd4" opacity=".9"/>
    <circle cx="14" cy="24" r="1.8" fill="#e9c176" opacity=".75"/>
    <line x1="15" y1="15" x2="23" y2="11" stroke="#4a7fd4" stroke-width=".9" opacity=".6"/>
    <line x1="23" y1="11" x2="28" y2="19" stroke="#4a7fd4" stroke-width=".9" opacity=".6"/>
    <line x1="28" y1="19" x2="22" y2="26" stroke="#4a7fd4" stroke-width=".9" opacity=".6"/>
    <line x1="22" y1="26" x2="14" y2="24" stroke="#4a7fd4" stroke-width=".9" opacity=".6"/>
    <line x1="15" y1="15" x2="14" y2="24" stroke="#4a7fd4" stroke-width=".9" opacity=".6"/>
  </svg>`;

  const CHAT_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e9c176" stroke-width="1.8">
    <path stroke-linecap="square" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
  </svg>`;

  const CLOSE_ICON = `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="square" d="M6 18L18 6M6 6l12 12"/></svg>`;

  const SEND_ICON = `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="square" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>`;

  const WA_ICON = `<svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

  /* ── BUILD DOM ─────────────────────────────────────────────────── */
  function buildDOM() {
    // Floating button
    const btn = document.createElement('button');
    btn.id = 'nx-btn';
    btn.setAttribute('aria-label', 'Abrir chat Nexorum');
    btn.innerHTML = `<span id="nx-badge">1</span>${CHAT_ICON}`;
    btn.onclick = toggle;
    document.body.appendChild(btn);

    // Bubble tooltip
    const bubble = document.createElement('div');
    bubble.id = 'nx-bubble';
    bubble.innerHTML = t('bubble');
    bubble.onclick = () => { openPanel(); bubble.classList.remove('nx-show'); };
    document.body.appendChild(bubble);

    // Chat panel
    const panel = document.createElement('div');
    panel.id = 'nx-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Chat Nexorum');
    panel.innerHTML = `
      <div class="nx-hd">
        <div class="nx-hd-icon">${LOGO_SVG}</div>
        <div class="nx-hd-info">
          <div class="nx-hd-title">${t('title')}</div>
          <div class="nx-hd-sub"><span class="nx-dot"></span>${t('online')}</div>
        </div>
        <button class="nx-x" id="nx-close" aria-label="Cerrar">${CLOSE_ICON}</button>
      </div>

      <div id="nx-msgs"></div>

      <div id="nx-lead">
        <p>📋 Para enviarte una propuesta personalizada:</p>
        <input class="nx-fi" id="nx-lead-name" type="text" placeholder="Tu nombre completo" autocomplete="name"/>
        <input class="nx-fi" id="nx-lead-email" type="email" placeholder="Tu correo electrónico" autocomplete="email"/>
        <button id="nx-lead-send">Enviar →</button>
      </div>

      <div class="nx-inp-row">
        <input type="text" id="nx-inp" placeholder="${t('placeholder')}" autocomplete="off" maxlength="500"/>
        <button id="nx-go" aria-label="Enviar">${SEND_ICON}</button>
      </div>
    `;
    document.body.appendChild(panel);

    // Events
    document.getElementById('nx-close').onclick = closePanel;
    document.getElementById('nx-inp').addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    });
    document.getElementById('nx-go').onclick = send;
    document.getElementById('nx-lead-send').onclick = submitLead;

    // Welcome message after short delay
    setTimeout(() => addBot(t('welcome')), 400);
  }

  /* ── PANEL OPEN/CLOSE ──────────────────────────────────────────── */
  function toggle() { open ? closePanel() : openPanel(); }

  function openPanel() {
    open = true;
    document.getElementById('nx-panel').classList.add('nx-open');
    document.getElementById('nx-badge')?.remove();
    document.getElementById('nx-bubble').classList.remove('nx-show');
    document.getElementById('nx-btn').innerHTML = CLOSE_ICON;
    document.getElementById('nx-btn').style.borderColor = 'rgba(233,193,118,.5)';
    setTimeout(() => document.getElementById('nx-inp')?.focus(), 250);
    scrollBottom();
  }

  function closePanel() {
    open = false;
    document.getElementById('nx-panel').classList.remove('nx-open');
    document.getElementById('nx-btn').innerHTML = CHAT_ICON;
    document.getElementById('nx-btn').style.borderColor = '#e9c176';
  }

  /* ── MESSAGES ──────────────────────────────────────────────────── */
  function now() {
    return new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function parseMd(s) {
    // Bold: **text**
    return escHtml(s).replace(/\*\*(.*?)\*\*/g, '<strong style="color:#e9c176">$1</strong>');
  }

  function addBot(text) {
    const msgs = document.getElementById('nx-msgs');
    const hasWA = /whatsapp|wa\.me/i.test(text);

    const div = document.createElement('div');
    div.className = 'nx-msg nx-bot';

    let html = `<div class="nx-bbl">${parseMd(text)}</div><div class="nx-ts">${now()}</div>`;

    if (hasWA) {
      html += `<a href="https://wa.me/${WA}?text=Hola%20Nexorum%2C%20vengo%20del%20chat%20de%20la%20p%C3%A1gina%20web." target="_blank" class="nx-wa">${WA_ICON} ${t('waBtn')}</a>`;
    }

    div.innerHTML = html;
    msgs.appendChild(div);
    scrollBottom();
  }

  function addUser(text) {
    const msgs = document.getElementById('nx-msgs');
    const div = document.createElement('div');
    div.className = 'nx-msg nx-user';
    div.innerHTML = `<div class="nx-bbl">${escHtml(text)}</div><div class="nx-ts">${now()}</div>`;
    msgs.appendChild(div);
    scrollBottom();
  }

  function showTyping() {
    const msgs = document.getElementById('nx-msgs');
    const div = document.createElement('div');
    div.id = 'nx-typing';
    div.className = 'nx-msg nx-bot';
    div.innerHTML = `<div class="nx-typing"><div class="nx-d"></div><div class="nx-d"></div><div class="nx-d"></div></div>`;
    msgs.appendChild(div);
    scrollBottom();
  }

  function hideTyping() { document.getElementById('nx-typing')?.remove(); }

  function scrollBottom() {
    const m = document.getElementById('nx-msgs');
    if (m) m.scrollTop = m.scrollHeight;
  }

  /* ── LEAD CAPTURE ──────────────────────────────────────────────── */
  function maybeShowLead() {
    if (leadAsked || msgCount < 3) return;
    leadAsked = true;
    // Show the compact lead form
    const form = document.getElementById('nx-lead');
    if (form) form.classList.add('nx-show');
  }

  function submitLead() {
    const name  = document.getElementById('nx-lead-name')?.value.trim();
    const email = document.getElementById('nx-lead-email')?.value.trim();

    if (!name && !email) {
      document.getElementById('nx-lead-name').focus();
      return;
    }

    // Hide form
    document.getElementById('nx-lead').classList.remove('nx-show');

    // Add lead info to chat history so the AI knows about it
    const leadMsg = `Mi nombre es ${name || '(no proporcionado)'} y mi correo es ${email || '(no proporcionado)'}.`;
    addUser(leadMsg);
    history.push({ role: 'user', content: leadMsg });

    // Send to AI so it can acknowledge
    callAPI();
  }

  /* ── API CALL ──────────────────────────────────────────────────── */
  async function send() {
    const inp = document.getElementById('nx-inp');
    const text = inp.value.trim();
    if (!text || loading) return;

    inp.value = '';
    addUser(text);
    history.push({ role: 'user', content: text });
    msgCount++;

    await callAPI();
    maybeShowLead();
  }

  async function callAPI() {
    loading = true;
    const goBtn = document.getElementById('nx-go');
    if (goBtn) goBtn.disabled = true;
    showTyping();

    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      const reply = data.message || t('error');

      history.push({ role: 'assistant', content: reply });
      hideTyping();
      addBot(reply);

    } catch (_) {
      hideTyping();
      addBot(t('error'));
    } finally {
      loading = false;
      const goBtn = document.getElementById('nx-go');
      if (goBtn) goBtn.disabled = false;
      document.getElementById('nx-inp')?.focus();
    }
  }

  /* ── INIT ──────────────────────────────────────────────────────── */
  function init() {
    injectCSS();
    buildDOM();

    // Show bubble after 2.5s if panel not opened
    setTimeout(() => {
      if (!open) document.getElementById('nx-bubble')?.classList.add('nx-show');
    }, 2500);

    // Auto-hide bubble after 8s
    setTimeout(() => {
      document.getElementById('nx-bubble')?.classList.remove('nx-show');
    }, 10500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
