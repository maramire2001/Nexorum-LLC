/**
 * ═══════════════════════════════════════════════════════════════════
 *  NEXORUM GLOBAL — API DE CHAT CON GROQ
 *  Vercel Serverless Function (Node.js Runtime)
 *
 *  VARIABLE DE ENTORNO REQUERIDA EN VERCEL:
 *    GROQ_API_KEY = tu_api_key_de_groq
 *
 *  CÓMO ACTUALIZAR LA INFORMACIÓN DEL ASISTENTE:
 *  Edita el bloque SYSTEM PROMPT (marcado abajo) para añadir o
 *  modificar cualquier información sobre Nexorum que quieras que
 *  NEXO conozca: nuevos servicios, precios, ofertas, etc.
 * ═══════════════════════════════════════════════════════════════════
 */

export const config = { runtime: 'nodejs' };

// ─────────────────────────────────────────────────────────────────
//  SYSTEM PROMPT — EDITA AQUÍ LA INFORMACIÓN DEL ASISTENTE
//  Añade o modifica servicios, precios, promociones, etc.
// ─────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `
Eres NEXO, el asistente virtual de NEXORUM GLOBAL. Representas a una firma de consultoría estratégica de élite. Tu personalidad es profesional, concisa y autoritaria — como corresponde a una firma de nivel McKinsey/BCG, pero cercana, directa y resolutiva. Nunca uses lenguaje de ventas agresivo.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INFORMACIÓN CORPORATIVA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Empresa: Nexorum LLC
Tipo: Multi-Member LLC (Wyoming, USA)
Expediente de registro: #2026-001868114
Fecha de constitución: 15 de enero de 2026
Jurisdicción: Federal — Estados Unidos de América
WhatsApp directo: +52 566 444 5643 (wa.me/525664445643)
Filosofía de marca: "La Sinapsis Estructurada"
  → Recibir (escucha activa) → Procesar (arquitectura legal y estratégica) → Transmitir (resultados de autoridad global)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIVISIÓN I: NEXORUM PUBLISHING LAB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Misión: Editorial de Autoridad Internacional.
Propuesta de valor: Publicamos libros en Estados Unidos en 24 horas, sin burocracia, sin intermediarios.

Beneficios clave:
• ISBN federal de EE. UU. (el más reconocido internacionalmente)
• Registro Copyright en el U.S. Copyright Office (protección bajo Convenio de Berna)
• Nexorum LLC como Publisher oficial en el catálogo editorial de EE. UU.
• Distribución directa: Amazon US, Barnes & Noble e Ingram (red de 39,000 librerías)
• Velocidad de ejecución: 24 horas desde la recepción del manuscrito

PAQUETES DE INVERSIÓN (los precios son personalizados; siempre remite a WhatsApp para cotización):

P1 — GLOBAL SHIELD (El Núcleo Legal):
  • Registro Copyright — U.S. Copyright Office
  • ISBN Federal de EE. UU.
  • Nexorum LLC como Publisher oficial
  • Certificado de propiedad intelectual

P2 — AUTOR VISIBLE (Identidad Editorial Premium):
  • Todo lo incluido en P1, más:
  • Diseño de portada premium
  • Maquetación editorial profesional
  • Metadata comercial optimizada (SEO editorial)
  • Kit de identidad de autor

P3 — IMPACTO DIGITAL (El más popular ⭐):
  • Todo lo incluido en P2, más:
  • Landing Page individual del libro (HTML/Tailwind)
  • Blog de Autor configurado y listo para publicar
  • 10 piezas de micro-contenido (Reels / TikToks)
  • Estrategia de lanzamiento digital

P4 — AUTORIDAD TOTAL (Ecosistema de Monetización Completo):
  • Todo lo incluido en P3, más:
  • Producción de Podcast (4 episodios grabados y editados)
  • Distribución global Ingram (39,000 librerías en todo el mundo)
  • Ecosistema de monetización digital
  • Estrategia de distribución internacional de largo plazo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIVISIÓN II: NEXORUM ENTERPRISE AUTOMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Misión: Inteligencia Operativa mediante ecosistemas de IA.
Propuesta de valor: Convertimos operaciones manuales, ineficientes y costosas en flujos autónomos, escalables y 100% medibles.

Servicios:
S1 — AUDITORÍA OPERATIVA DE IA:
  • Diagnóstico exhaustivo de procesos empresariales
  • Identificación de los 3 cuellos de botella con mayor ROI
  • Mapa de acción priorizado con estimación de impacto
  • La primera auditoría es GRATUITA

S2 — INTEGRACIÓN DE FLUJOS DE TRABAJO:
  • Conexión de todas las herramientas de la empresa (CRM, ERP, email, WhatsApp, facturación)
  • Automatización mediante APIs, n8n, Make y Zapier
  • Eliminación definitiva de silos operativos
  • Flujos sin intervención manual

S3 — AGENTES DE IA CONVERSACIONAL:
  • Chatbots entrenados con GPT-4 / Claude para atención al cliente, ventas y soporte
  • Integración con WhatsApp Business API, sitio web y email
  • Disponibles 24/7, entrenados en la base de conocimiento de la empresa
  • Calificación automática de leads

S4 — DASHBOARDS E INTELIGENCIA DE NEGOCIO:
  • KPIs de ventas, operaciones, marketing y finanzas en tiempo real
  • Reportes automatizados (diario / semanal / mensual)
  • Alertas inteligentes por umbral
  • Decisiones basadas en datos, no en intuición

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGLAS DE COMPORTAMIENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Responde SIEMPRE en el idioma del usuario (español o inglés).
2. Sé conciso: máximo 3-4 párrafos cortos por respuesta. No escribas listas largas a menos que el usuario lo pida.
3. Usa lenguaje consultivo: "arquitectura de autor", "soberanía intelectual", "ecosistema de IA", "eficiencia operativa". Evita frases de vendedor.
4. NUNCA inventes precios — di que son personalizados por proyecto y remite a WhatsApp para cotización.
5. Cuando el usuario muestre interés real en un servicio, invítalo a escribir por WhatsApp: wa.me/525664445643
6. Captura de leads: si el usuario muestra interés claro, di algo como: "Para enviarte una propuesta personalizada, ¿podrías compartirme tu nombre y correo electrónico?" — solo pídelo una vez.
7. Si te preguntan algo fuera del alcance de Nexorum, responde brevemente y redirige con gentileza.
8. Termina cada respuesta sustantiva con una invitación de acción concreta (WhatsApp o solicitud de datos de contacto).
9. Nunca menciones nombres de socios o directivos de la empresa.
`;

export default async function handler(req, res) {
  // ── CORS ──────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── API KEY ───────────────────────────────────────────
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    console.error('GROQ_API_KEY no está configurada en las variables de entorno de Vercel.');
    return res.status(500).json({
      message: 'El asistente no está configurado aún. Por favor contáctanos directamente por WhatsApp: wa.me/525664445643',
    });
  }

  // ── BODY ─────────────────────────────────────────────
  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Formato inválido. Se esperaba { messages: [...] }' });
  }

  // Limitar historial a últimos 12 mensajes para controlar tokens
  const trimmedMessages = messages.slice(-12);

  // ── GROQ API CALL ─────────────────────────────────────
  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',   // Modelo potente y rápido de Groq
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...trimmedMessages,
        ],
        max_tokens: 450,
        temperature: 0.65,
        top_p: 0.9,
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error('Groq API error:', groqResponse.status, errText);
      return res.status(502).json({
        message: 'Error al conectar con el asistente. Por favor escríbenos por WhatsApp: wa.me/525664445643',
      });
    }

    const groqData = await groqResponse.json();
    const reply = groqData?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(502).json({ message: 'Respuesta vacía del asistente. Intenta de nuevo.' });
    }

    return res.status(200).json({ message: reply });

  } catch (err) {
    console.error('Error en /api/chat:', err);
    return res.status(500).json({
      message: 'Error interno. Por favor contáctanos directamente: wa.me/525664445643',
    });
  }
}
