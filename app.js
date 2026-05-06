// app.js
const data = [
  { nombre:"Aliviah Fem",     materia:16.40, capsulas:7.8,  envases:4.46, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:220, demanda:0,  retPct:40, errPct:13 },
  { nombre:"NefroCllear",     materia:38.17, capsulas:11.7, envases:4.46, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:200, demanda:34, retPct:40, errPct:13 },
  { nombre:"Curcuflex D3",    materia:5.46,  capsulas:11.7, envases:4.46, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:200, demanda:34, retPct:40, errPct:13 },
  { nombre:"Garleon",         materia:12.47, capsulas:7.8,  envases:4.46, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:150, demanda:26, retPct:40, errPct:13 },
  { nombre:"Calibrum",        materia:38.59, capsulas:7.8,  envases:4.46, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:350, demanda:0,  retPct:40, errPct:13 },
  { nombre:"Nerva Plus",      materia:54.89, capsulas:7.8,  envases:4.46, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:350, demanda:0,  retPct:40, errPct:13 },
  { nombre:"Pulsar Energy",   materia:37.52, capsulas:0,    envases:6.01, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:180, demanda:0,  retPct:40, errPct:13 },
  { nombre:"Elixir Dorado",   materia:38.83, capsulas:0,    envases:6.01, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:180, demanda:0,  retPct:40, errPct:13 },
  { nombre:"Osteofort",       materia:52.24, capsulas:0,    envases:8.01, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:360, demanda:90, retPct:40, errPct:13 },
  { nombre:"Aura Verde Detox",materia:69.18, capsulas:0,    envases:8.01, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:360, demanda:90, retPct:40, errPct:13 },
  { nombre:"Harmonia",        materia:34.89, capsulas:0,    envases:6.01, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:180, demanda:0,  retPct:40, errPct:13 },
  { nombre:"Concentra Pro",   materia:50.63, capsulas:0,    envases:6.01, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:200, demanda:0,  retPct:40, errPct:13 },
  { nombre:"Colagen Premium", materia:44.48, capsulas:0,    envases:8.01, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:360, demanda:40, retPct:40, errPct:13 },
  { nombre:"Café",            materia:3.43,  capsulas:0,    envases:0.5,  etiqueta:0.5,  transporte:0, comision:0, iva:0, pub:18,  demanda:40, retPct:40, errPct:13 },
  { nombre:"Resver Plus",     materia:5.75,  capsulas:0,    envases:13.5, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:190, demanda:0,  retPct:40, errPct:13 },
];

let cur       = 0;
let activeTab = "analisis";

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const bs  = n => "Bs " + (+n).toFixed(2);
const pct = (v,b) => b===0 ? "0.0" : (v/b*100).toFixed(1);
const r2  = n => +n.toFixed(2);
const DIAS_MES = 30;

function calc(p) {
  const sub       = r2(p.materia + p.capsulas + p.envases + p.etiqueta + p.transporte + p.comision);
  const costoFab  = r2(sub + p.iva);
  const retorno   = r2(costoFab * p.retPct/100);
  const base1     = r2(costoFab + retorno);
  const error     = r2(base1 * p.errPct/100);
  const precioMin = r2(base1 + error);
  const margen    = r2(p.pub - precioMin);
  return { sub, costoFab, retorno, base1, error, precioMin, margen };
}

// ─── ESTADO DEL SIMULADOR ────────────────────────────────────────────────────
const simState = {
  numNiveles: 3,
  pcts:       [15, 10, 5, 3, 2],
  vendedores: [3, 9, 27, 81, 243],
  ventasDia:  [1, 1, 1, 1, 1],
};

// ─── TABS (productos) ─────────────────────────────────────────────────────────
function renderTabs() {
  document.getElementById("prod-tabs").innerHTML = data.map((p,i) =>
    `<button class="prod-tab ${i===cur?"active":""}" onclick="sel(${i})">${p.nombre}</button>`
  ).join("");
}
function sel(i) { cur=i; renderTabs(); renderFields(); renderRight(); }

// ─── LEFT FIELDS ─────────────────────────────────────────────────────────────
function renderFields() {
  const p = data[cur];
  const nf = (key, label, unit="Bs", hint="") => `
    <div class="fr">
      <span class="fl">${label}${hint?`<br><span style="font-size:10px;color:var(--text3)">${hint}</span>`:""}</span>
      <input class="fi" type="number" step="0.01" id="fi_${key}" value="${p[key]}" oninput="live()">
      <span class="fu">${unit}</span>
    </div>`;
  const pf = (key, label, bg="") => `
    <div class="fr" style="${bg}">
      <span class="fl">${label}</span>
      <input class="fi" type="number" step="0.1" id="fi_${key}" value="${p[key]}" oninput="live()">
      <span class="fu">%</span>
    </div>`;

  document.getElementById("fields-scroll").innerHTML = `
    <div class="fg">
      <div class="fg-title">Identificación</div>
      <div class="fr">
        <span class="fl">Nombre</span>
        <input class="fi" type="text" id="fi_nombre" value="${p.nombre}" style="width:130px;text-align:left" oninput="live()">
      </div>
      ${nf("demanda","Demanda estimada","unid.")}
      ${nf("pub","Precio público de venta")}
    </div>
    <div class="fg">
      <div class="fg-title">Componentes de costo</div>
      ${nf("materia",   "Materia prima / Bot")}
      ${nf("capsulas",  "Cápsulas / bote")}
      ${nf("envases",   "Envases")}
      ${nf("etiqueta",  "Etiqueta")}
      ${nf("transporte","Transporte","Bs","por defecto 0")}
      ${nf("comision",  "Comisión ventas","Bs","por defecto 0")}
      ${nf("iva",       "Subtotal AL+IVA","Bs","por defecto 0")}
    </div>
    <div class="fg">
      <div class="fg-title">Márgenes</div>
      ${pf("retPct","Retorno empresa s/ costo fab.","background:#f0fdf4")}
      ${pf("errPct","Margen de error s/ (costo+retorno)","background:#fffbeb")}
    </div>
  `;
}

// ─── LIVE UPDATE ─────────────────────────────────────────────────────────────
function live() {
  const p = data[cur];
  ["materia","capsulas","envases","etiqueta","transporte","comision","iva","pub","demanda","retPct","errPct"].forEach(k => {
    const el = document.getElementById("fi_"+k); if(el) p[k] = parseFloat(el.value)||0;
  });
  const n = document.getElementById("fi_nombre"); if(n) p.nombre = n.value;
  renderRight();
}

// ─── SECCIÓN TABS ────────────────────────────────────────────────────────────
function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll(".sec-tab").forEach(el => el.classList.toggle("active", el.dataset.tab === tab));
  document.querySelectorAll(".tab-content").forEach(el => el.classList.toggle("active", el.dataset.tab === tab));
}

// ─── LEER ESTADO SIMULADOR ───────────────────────────────────────────────────
function leerSimState() {
  const n = parseInt(document.getElementById("sim-niveles")?.value || simState.numNiveles);
  simState.numNiveles = n;
  for (let i = 0; i < 5; i++) {
    const pEl = document.getElementById(`sim-pct-${i}`);
    const vEl = document.getElementById(`sim-vend-${i}`);
    const dEl = document.getElementById(`sim-vdia-${i}`);
    if (pEl) simState.pcts[i]       = parseFloat(pEl.value) || 0;
    if (vEl) simState.vendedores[i] = parseInt(vEl.value)   || 0;
    if (dEl) simState.ventasDia[i]  = parseFloat(dEl.value) || 0;
  }
}

function recalcSim() {
  leerSimState();
  const c = calc(data[cur]);
  const zona = document.getElementById("sim-resultados");
  if (zona) zona.innerHTML = buildSimResultados(c);
  for (let i = 0; i < 5; i++) {
    const row = document.getElementById(`sim-row-${i}`);
    if (row) row.style.display = (i < simState.numNiveles) ? "" : "none";
  }
}

// ─── CONSTANTES DE NIVELES ───────────────────────────────────────────────────
const nivelColors = ["#d97706","#1d4ed8","#059669","#7c3aed","#0d9488"];
const nivelNames  = ["Directo","Indirecto","Profundo","Extendido","Red amplia"];
const nivelDescs  = [
  "Personas que tú reclutas directamente.",
  "Los que reclutan tus distribuidores N1.",
  "Red de tus N2. Empieza el ingreso pasivo real.",
  "Red amplia. Gran volumen, % menor.",
  "Máxima profundidad. Alto volumen necesario."
];

// ─────────────────────────────────────────────────────────────────────────────
// BLOQUES DE RESULTADOS (pestaña Planes)
// ─────────────────────────────────────────────────────────────────────────────

// ── BLOQUE ①: Flujo de red ───────────────────────────────────────────────────
function buildFlujoRed(n, pcts, bonoPorVenta) {
  const nodos = ["Tú", ...Array.from({length:n}, (_,i) => `N${i+1}`)];
  const cadena = nodos.map((nodo, idx, arr) => `
    <div class="sim-nodo ${idx===0?"sim-nodo-yo":""}">
      <div class="sim-nodo-dot" style="background:${idx===0?"var(--accent)":nivelColors[idx-1]}"></div>
      <div class="sim-nodo-name">${nodo}</div>
      ${idx>0 ? `<div class="sim-nodo-bono">${pcts[idx-1]}% → ${bs(bonoPorVenta[idx-1])}</div>` : `<div class="sim-nodo-bono">origen</div>`}
    </div>
    ${idx < arr.length-1 ? `<div class="sim-arrow">→</div>` : ""}
  `).join("");

  return `
    <div class="sim-bloque">
      <div class="sim-bloque-hdr">
        <span class="sim-bloque-num">①</span>
        <div>
          <div class="sim-bloque-title">Flujo de red</div>
          <div class="sim-bloque-desc">Ruta del bono desde la venta hasta ti. Cada nivel representa un grado de distancia entre tú y quien vende.</div>
        </div>
      </div>
      <div class="sim-cadena-wrap">
        <div class="sim-cadena">${cadena}</div>
      </div>
    </div>`;
}

// ── BLOQUE ②: Detalle por nivel ──────────────────────────────────────────────
function buildDetallePorNivel(n, pcts, bonoPorVenta, vend, ventasDia) {
  const tarjetas = bonoPorVenta.map((bono, i) => {
    const vMes       = r2(ventasDia[i] * DIAS_MES);
    const totalNivel = r2(bono * vend[i] * vMes);
    return `
    <div class="sim-nivel-card">
      <div class="sim-nivel-card-hdr" style="border-left:3px solid ${nivelColors[i]}">
        <div class="sim-nivel-card-toprow">
          <span class="sim-nivel-card-title" style="color:${nivelColors[i]}">Nivel ${i+1} · ${nivelNames[i]}</span>
          <span class="sim-nivel-pct-badge" style="background:${nivelColors[i]}20;color:${nivelColors[i]}">${pcts[i]}%</span>
        </div>
        <div class="sim-nivel-card-desc">${nivelDescs[i]}</div>
      </div>
      <div class="sim-nivel-card-body">
        <div class="sim-nivel-stat">
          <span class="sim-nivel-stat-label">Bono por venta</span>
          <span class="sim-nivel-stat-val" style="color:${nivelColors[i]}">${bs(bono)}</span>
        </div>
        <div class="sim-nivel-stat">
          <span class="sim-nivel-stat-label">Distribuidores activos</span>
          <span class="sim-nivel-stat-val">${vend[i]}</span>
        </div>
        <div class="sim-nivel-stat">
          <span class="sim-nivel-stat-label">Ventas/dist./día</span>
          <span class="sim-nivel-stat-val">${ventasDia[i]}</span>
        </div>
        <div class="sim-nivel-stat">
          <span class="sim-nivel-stat-label">→ Ventas/dist./mes</span>
          <span class="sim-nivel-stat-val">${vMes} unid.</span>
        </div>
        <div class="sim-nivel-stat sim-nivel-stat-total">
          <span class="sim-nivel-stat-label">Total mensual nivel</span>
          <span class="sim-nivel-stat-val" style="color:var(--green)">${bs(totalNivel)}</span>
        </div>
      </div>
    </div>`;
  }).join("");

  return `
    <div class="sim-bloque">
      <div class="sim-bloque-hdr">
        <span class="sim-bloque-num">②</span>
        <div>
          <div class="sim-bloque-title">Detalle por nivel</div>
          <div class="sim-bloque-desc">Cuánto recibes tú de cada nivel según sus distribuidores, ventas por día y el bono configurado. El total mensual ya incluye los ${DIAS_MES} días del mes.</div>
        </div>
      </div>
      <div class="sim-niveles-grid">${tarjetas}</div>
    </div>`;
}

// ── BLOQUE ③: Resumen del margen ─────────────────────────────────────────────
function buildResumenMargen(c, totalBonos1, resta, restaOk, margenUsadoPct) {
  return `
    <div class="sim-bloque">
      <div class="sim-bloque-hdr">
        <span class="sim-bloque-num">③</span>
        <div>
          <div class="sim-bloque-title">Resumen del margen</div>
          <div class="sim-bloque-desc">De cada unidad vendida al precio público, así queda distribuido el margen de ${bs(c.margen)}.</div>
        </div>
      </div>
      <div class="sim-margen-strip">
        <div class="sim-ms-item">
          <div class="sim-ms-label">Margen disponible</div>
          <div class="sim-ms-val">${bs(c.margen)}</div>
          <div class="sim-ms-sub">precio público − precio socio</div>
        </div>
        <div class="sim-ms-item">
          <div class="sim-ms-label">Bonos de red (${margenUsadoPct}%)</div>
          <div class="sim-ms-val" style="color:var(--amber)">${bs(totalBonos1)}</div>
          <div class="sim-ms-sub">suma de todos los niveles</div>
        </div>
        <div class="sim-ms-item">
          <div class="sim-ms-label">Resta para operación</div>
          <div class="sim-ms-val" style="color:${restaOk?"var(--green)":"var(--red)"}">${bs(resta)}</div>
          <div class="sim-ms-sub">${restaOk?"margen operativo OK":"⚠ muy ajustado"}</div>
        </div>
      </div>
      ${!restaOk ? `<div class="notice amber" style="margin-top:4px">⚠ Los bonos consumen más del 55% del margen. Considera reducir algunos porcentajes.</div>` : ""}
    </div>`;
}

// ── BLOQUE ④: Proyección mensual consolidada ─────────────────────────────────
function buildProyeccionMensual(c, bonoPorVenta, vend, ventasDia, totalMes) {
  const filas = bonoPorVenta.map((bono, i) => {
    const vMes       = r2(ventasDia[i] * DIAS_MES);
    const totalNivel = r2(bono * vend[i] * vMes);
    return `
    <tr>
      <td>
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${nivelColors[i]};margin-right:6px;vertical-align:middle"></span>
        Nivel ${i+1}
      </td>
      <td style="text-align:center">${vend[i]}</td>
      <td style="text-align:center">${ventasDia[i]}</td>
      <td style="text-align:center;color:var(--text2)">${vMes}</td>
      <td>${bs(bono)}</td>
      <td style="color:var(--green);font-weight:600">${bs(totalNivel)}</td>
    </tr>`;
  }).join("");

  return `
    <div class="sim-bloque">
      <div class="sim-bloque-hdr">
        <span class="sim-bloque-num">④</span>
        <div>
          <div class="sim-bloque-title">Proyección mensual consolidada</div>
          <div class="sim-bloque-desc">Ingreso pasivo total del mes según la actividad de tu red. La columna <em>Ventas/mes</em> es automática: ventas/día × ${DIAS_MES} días.</div>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nivel</th>
              <th>Dist.</th>
              <th>Ventas/día</th>
              <th>Ventas/mes</th>
              <th>Bono/venta</th>
              <th>Total mes</th>
            </tr>
          </thead>
          <tbody>
            ${filas}
            <tr class="tabla-total-row">
              <td style="font-weight:600;color:var(--text)">Total</td>
              <td style="text-align:center">${vend.reduce((a,b)=>a+b,0)}</td>
              <td style="text-align:center">—</td>
              <td style="text-align:center">—</td>
              <td>—</td>
              <td style="color:var(--green);font-weight:700">${bs(totalMes)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="notice blue" style="margin-top:10px">
        <strong>Bs ${totalMes.toFixed(2)}</strong> es tu ingreso pasivo estimado al mes. A esto se suma lo que vendas tú directamente: cada venta propia te genera adicionalmente <strong>${bs(c.margen)}</strong> de margen.
      </div>
    </div>`;
}

// ─── CONSTRUCTOR PRINCIPAL DE RESULTADOS ─────────────────────────────────────
function buildSimResultados(c) {
  if (c.margen <= 0) return `<div class="notice amber">⚠ Margen negativo. Ajusta el precio público antes de simular.</div>`;

  const n         = simState.numNiveles;
  const pcts      = simState.pcts.slice(0, n);
  const vend      = simState.vendedores.slice(0, n);
  const ventasDia = simState.ventasDia.slice(0, n);

  const bonoPorVenta   = pcts.map(p => r2(c.margen * p / 100));
  const totalBonos1    = r2(bonoPorVenta.reduce((a,b) => a+b, 0));
  const resta          = r2(c.margen - totalBonos1);
  const restaOk        = resta >= c.margen * 0.45;
  const margenUsadoPct = (totalBonos1 / c.margen * 100).toFixed(1);

  const totalMes = r2(bonoPorVenta.reduce((sum, bono, i) =>
    sum + bono * vend[i] * r2(ventasDia[i] * DIAS_MES), 0));

  return [
    buildFlujoRed(n, pcts, bonoPorVenta),
    buildDetallePorNivel(n, pcts, bonoPorVenta, vend, ventasDia),
    buildResumenMargen(c, totalBonos1, resta, restaOk, margenUsadoPct),
    buildProyeccionMensual(c, bonoPorVenta, vend, ventasDia, totalMes),
  ].join("");
}

// ─── RENDER PLANES ────────────────────────────────────────────────────────────
function renderPlanes(p, c) {
  if (c.margen <= 0) {
    return `<div class="notice amber">⚠ El margen actual es negativo (${bs(c.margen)}). Corrije el precio público antes de simular planes.</div>`;
  }

  const n = simState.numNiveles;
  const optsNiveles = [1,2,3,4,5].map(v =>
    `<option value="${v}" ${v===n?"selected":""}>${v} nivel${v>1?"es":""}</option>`
  ).join("");

  const filasConfig = Array.from({length:5}, (_, i) => {
    const visible = i < n;
    return `
      <div class="sim-config-row" id="sim-row-${i}" style="display:${visible?"":"none"}">
        <div class="sim-config-label">
          <span class="sim-nivel-dot" style="background:${nivelColors[i]}"></span>
          <div>
            <div style="font-weight:600;font-size:12px;color:var(--text)">Nivel ${i+1} — ${nivelNames[i]}</div>
            <div style="font-size:11px;color:var(--text3)">${nivelDescs[i]}</div>
          </div>
        </div>
        <div class="sim-config-fields">
          <div class="sim-field-group">
            <span class="sim-field-label">% margen</span>
            <input class="fi" type="number" step="0.5" min="0" max="50"
              id="sim-pct-${i}" value="${simState.pcts[i]}"
              oninput="recalcSim()" style="width:52px">
            <span class="fu">%</span>
          </div>
          <div class="sim-field-group">
            <span class="sim-field-label">Distribuidores</span>
            <input class="fi" type="number" step="1" min="0"
              id="sim-vend-${i}" value="${simState.vendedores[i]}"
              oninput="recalcSim()" style="width:52px">
          </div>
          <div class="sim-field-group">
            <span class="sim-field-label">Ventas/día</span>
            <input class="fi" type="number" step="0.5" min="0"
              id="sim-vdia-${i}" value="${simState.ventasDia[i]}"
              oninput="recalcSim()" style="width:52px">
          </div>
        </div>
      </div>`;
  }).join("");

  return `
    <!-- ══ BLOQUE A: Producto ══ -->
    <div class="planes-bloque">
      <div class="planes-bloque-title">Producto seleccionado</div>
      <div class="notice teal">
        <strong>${p.nombre}</strong> — Margen por unidad: <strong>${bs(c.margen)}</strong> ·
        Precio socio: <strong>${bs(c.precioMin)}</strong> · Precio público: <strong>${bs(p.pub)}</strong>
      </div>
    </div>

    <!-- ══ BLOQUE B: Cómo funciona ══ -->
    <div class="planes-bloque">
      <div class="planes-bloque-title">¿Cómo funciona este plan?</div>
      <div class="planes-explainer">
        <div class="planes-exp-grid">
          <div class="planes-exp-item">
            <div class="planes-exp-icon">①</div>
            <div><strong>Precio socio</strong> — El distribuidor compra a ${bs(c.precioMin)}. Es su costo de adquisición, no puede vender por debajo de este valor.</div>
          </div>
          <div class="planes-exp-item">
            <div class="planes-exp-icon">②</div>
            <div><strong>Precio público</strong> — El cliente final paga ${bs(p.pub)}. La diferencia de ${bs(c.margen)} es el margen disponible para repartir.</div>
          </div>
          <div class="planes-exp-item">
            <div class="planes-exp-icon">③</div>
            <div><strong>Bonos de red</strong> — Cuando alguien en tu red vende, tú cobras automáticamente el % configurado del margen de ${bs(c.margen)} por cada unidad.</div>
          </div>
          <div class="planes-exp-item">
            <div class="planes-exp-icon">④</div>
            <div><strong>Ingreso pasivo</strong> — A más distribuidores activos y más ventas por día, mayor tu ingreso sin necesidad de vender tú directamente.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ BLOQUE C: Configurador ══ -->
    <div class="planes-bloque">
      <div class="planes-bloque-title">Configuración del plan</div>
      <div class="sim-configurador">
        <div class="sim-cfg-hdr">
          <div style="font-size:12px;color:var(--text2);line-height:1.5">
            Ajusta los porcentajes, distribuidores y ventas por día. Los resultados se actualizan automáticamente.
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
            <span style="font-size:11.5px;color:var(--text3);font-family:var(--font-mono)">Niveles:</span>
            <select id="sim-niveles" class="fi" style="width:90px;text-align:left;cursor:pointer" onchange="recalcSim()">
              ${optsNiveles}
            </select>
          </div>
        </div>
        <div class="sim-config-explain">
          <strong>Nivel 1</strong> = distribuidores que tú reclutas directamente ·
          <strong>Nivel 2</strong> = quienes ellos reclutan · y así sucesivamente.<br>
          Los % se aplican sobre el margen de <strong>${bs(c.margen)}</strong> por cada unidad vendida en ese nivel.
          El campo <strong>Ventas/día</strong> se multiplica por ${DIAS_MES} días automáticamente.
        </div>
        ${filasConfig}
      </div>
    </div>

    <!-- ══ BLOQUE D: Resultados ══ -->
    <div class="planes-bloque">
      <div class="planes-bloque-title">Resultados del simulador</div>
      <div id="sim-resultados">
        ${buildSimResultados(c)}
      </div>
    </div>`;
}

// ─── RENDER PANEL DERECHO ─────────────────────────────────────────────────────
function renderRight() {
  const p = data[cur];
  const c = calc(p);
  const margenPct   = p.pub===0 ? 0 : c.margen/p.pub*100;
  const precioSocio = r2(c.precioMin * 1.10);
  const margenSocio = r2(precioSocio - c.precioMin);
  const bonoPcts    = [0.05, 0.10, 0.15];
  const bonosAbs    = bonoPcts.map(b => r2(c.margen*b));
  const totalBonos  = r2(bonosAbs.reduce((a,b)=>a+b,0));
  const quedaPub    = r2(c.margen - totalBonos);
  const bonosSocio  = bonoPcts.map(b => r2(margenSocio*b));
  const quedaSocio  = r2(margenSocio - bonosSocio.reduce((a,b)=>a+b,0));
  const tagCls      = v => v>=40?"tg":v>=20?"ta":"tr2";
  const viable      = c.margen >= 50;
  const margenOk    = c.margen >= 0;

  const analisisHTML = `
    <div class="sec-label">Estructura de precio</div>
    <div class="price-strip" style="margin-bottom:20px">
      <div class="pc">
        <div class="pc-label">Costo fabricación</div>
        <div class="pc-val">${bs(c.costoFab)}</div>
        <div class="pc-sub">materia + envases + IVA</div>
      </div>
      <div class="pc hl-amber">
        <div class="pc-label">Retorno empresa (${p.retPct}%)</div>
        <div class="pc-val amber">+ ${bs(c.retorno)}</div>
        <div class="pc-sub">+ error ${p.errPct}%: ${bs(c.error)}</div>
      </div>
      <div class="pc hl-purple">
        <div class="pc-label">Precio socio</div>
        <div class="pc-val purple">${bs(c.precioMin)}</div>
        <div class="pc-sub">costo+ret+error</div>
      </div>
      <div class="pc hl-${margenOk?"green":"amber"}">
        <div class="pc-label">Precio público</div>
        <div class="pc-val ${margenOk?"green":"red"}">${bs(p.pub)}</div>
        <div class="pc-sub">margen: ${bs(c.margen)} (${margenPct.toFixed(1)}%)</div>
      </div>
    </div>

    <div class="sec-label">Construcción del precio</div>
    <div class="build-wrap" style="margin-bottom:20px">
      <div class="build-row">
        <span class="build-idx">①</span>
        <span class="build-label">Subtotal componentes (sin IVA)</span>
        <span class="build-pct"></span>
        <span class="build-val def">${bs(c.sub)}</span>
      </div>
      ${p.iva>0?`<div class="build-row">
        <span class="build-idx">②</span>
        <span class="build-label">IVA / Arancel</span>
        <span class="build-pct">${pct(p.iva,c.costoFab)}% del costo</span>
        <span class="build-val def">+ ${bs(p.iva)}</span>
      </div>`:""}
      <div class="build-row build-sep">
        <span class="build-idx" style="color:var(--text2)">→</span>
        <span class="build-label"><strong>Costo fabricación c/IVA</strong></span>
        <span class="build-pct"></span>
        <span class="build-val def"><strong>${bs(c.costoFab)}</strong></span>
      </div>
      <div class="build-row" style="background:#f0fdf4">
        <span class="build-idx">③</span>
        <span class="build-label">Retorno empresa</span>
        <span class="build-pct">${p.retPct}% × costo fab.</span>
        <span class="build-val amber">+ ${bs(c.retorno)}</span>
      </div>
      <div class="build-row" style="background:#fffbeb">
        <span class="build-idx">④</span>
        <span class="build-label">Margen de error</span>
        <span class="build-pct">${p.errPct}% × (costo+ret.)</span>
        <span class="build-val amber">+ ${bs(c.error)}</span>
      </div>
      <div class="build-row build-total">
        <span class="build-idx" style="color:var(--purple)">→</span>
        <span class="build-label"><strong>Precio socio</strong></span>
        <span class="build-pct"></span>
        <span class="build-val purple"><strong>${bs(c.precioMin)}</strong></span>
      </div>
      <div class="build-row ${margenOk?"build-margin-pos":"build-margin-neg"}">
        <span class="build-idx" style="color:${margenOk?"var(--green)":"var(--red)"}">⑤</span>
        <span class="build-label"><strong>Precio público − Precio socio</strong></span>
        <span class="build-pct">${bs(p.pub)} − ${bs(c.precioMin)}</span>
        <span class="build-val ${margenOk?"green":"red"}"><strong>${bs(c.margen)}</strong></span>
      </div>
    </div>

    ${!margenOk?`<div class="notice red" style="margin-bottom:20px">⚠ El precio público <strong>${bs(p.pub)}</strong> es menor al precio socio <strong>${bs(c.precioMin)}</strong>. Pérdida de <strong>${bs(Math.abs(c.margen))}</strong> por unidad.</div>`:""}
    ${p.demanda>0?`<div class="notice blue" style="margin-bottom:20px">Proyección mensual · <strong>${p.demanda} unid.</strong> → margen bruto: <strong>Bs ${(c.margen*p.demanda).toFixed(2)}</strong> · retorno empresa: <strong>Bs ${(c.retorno*p.demanda).toFixed(2)}</strong></div>`:""}

    <div class="sec-label">Escenarios de venta</div>
    <div class="table-wrap" style="margin-bottom:12px">
      <table>
        <thead><tr><th>Escenario</th><th>Precio</th><th>Precio mín.</th><th>Margen</th><th>%</th><th>Viabilidad</th></tr></thead>
        <tbody>
          <tr>
            <td>Precio público</td><td>${bs(p.pub)}</td><td>${bs(c.precioMin)}</td>
            <td style="color:var(--${margenOk?"green":"red"});font-weight:600">${bs(c.margen)}</td>
            <td>${margenPct.toFixed(1)}%</td>
            <td><span class="tag ${tagCls(margenPct)}">${margenPct>=40?"Buena":margenPct>=20?"Ajustada":!margenOk?"⚠ Negativo":"Difícil"}</span></td>
          </tr>
          <tr>
            <td>Precio socio / red</td><td>${bs(precioSocio)}</td><td>${bs(c.precioMin)}</td>
            <td style="color:var(--amber);font-weight:600">${bs(margenSocio)}</td>
            <td>${pct(margenSocio,precioSocio)}%</td>
            <td><span class="tag ta">Entrada red</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="notice blue" style="margin-bottom:20px">Los bonos se calculan sobre el margen del precio <strong>público</strong> (${bs(c.margen)}). El precio socio (${bs(precioSocio)}) es el punto de entrada al negocio.</div>

    <div class="sec-label">Simulación de niveles — precio público</div>
    <p style="font-size:11px;color:var(--text3);margin-bottom:9px;font-family:var(--font-mono)">Margen disponible: ${bs(c.margen)}</p>
    <div class="nivel-grid" style="margin-bottom:9px">
      ${bonoPcts.map((b,i)=>`
        <div class="nivel-card ${i===1?"best":""}">
          <div class="nivel-n">Nivel ${i+1} · ${(b*100).toFixed(0)}%</div>
          <div class="nivel-amt">${bs(c.margen*b)}</div>
          <div class="nivel-bs">por unidad vendida</div>
        </div>`).join("")}
    </div>
    <div class="notice ${quedaPub>=40?"green":"amber"}" style="margin-bottom:20px">
      Bonos 3 niveles: <strong>${bs(totalBonos)}</strong> (30% del margen) · Para operación: <strong>${bs(quedaPub)}</strong>
    </div>

    <div class="sec-label">Simulación de niveles — precio socio</div>
    <p style="font-size:11px;color:var(--text3);margin-bottom:9px;font-family:var(--font-mono)">Margen disponible: ${bs(margenSocio)}</p>
    <div class="nivel-grid" style="margin-bottom:9px">
      ${bonoPcts.map((b,i)=>`
        <div class="nivel-card">
          <div class="nivel-n">Nivel ${i+1} · ${(b*100).toFixed(0)}%</div>
          <div class="nivel-amt amber">${bs(margenSocio*b)}</div>
          <div class="nivel-bs">del margen socio</div>
        </div>`).join("")}
    </div>
    <div class="notice ${quedaSocio<15?"amber":"green"}" style="margin-bottom:20px">
      Después de 3 niveles: <strong>${bs(quedaSocio)}</strong>${quedaSocio<15?" ⚠ Muy ajustado para gastos operativos.":""}
    </div>

    <div class="sec-label">Desglose de costos</div>
    <div class="table-wrap" style="margin-bottom:20px">
      <table>
        <thead><tr><th>Concepto</th><th>Monto</th><th>% s/ precio mín.</th></tr></thead>
        <tbody>
          ${[["Materia prima",p.materia],["Cápsulas",p.capsulas],["Envases",p.envases],["Etiqueta",p.etiqueta],["Transporte",p.transporte],["Comisión",p.comision]]
            .filter(([,v])=>v>0).map(([l,v])=>`<tr><td>${l}</td><td>${bs(v)}</td><td>${pct(v,c.precioMin)}%</td></tr>`).join("")}
          <tr style="background:var(--bg3)"><td>Subtotal sin IVA</td><td>${bs(c.sub)}</td><td>—</td></tr>
          ${p.iva>0?`<tr><td>IVA / Arancel</td><td>${bs(p.iva)}</td><td>${pct(p.iva,c.precioMin)}%</td></tr>`:""}
          <tr style="background:var(--bg3)"><td style="font-weight:600;color:var(--text)">Costo fabricación</td><td style="font-weight:600">${bs(c.costoFab)}</td><td>${pct(c.costoFab,c.precioMin)}%</td></tr>
          <tr style="background:#fff8f0"><td style="color:var(--amber)">Retorno empresa (${p.retPct}%)</td><td style="color:var(--amber);font-weight:600">+ ${bs(c.retorno)}</td><td>${pct(c.retorno,c.precioMin)}%</td></tr>
          <tr style="background:#fffbeb"><td style="color:var(--amber)">Margen error (${p.errPct}%)</td><td style="color:var(--amber);font-weight:600">+ ${bs(c.error)}</td><td>${pct(c.error,c.precioMin)}%</td></tr>
          <tr style="background:var(--purple-dim)"><td style="color:var(--purple);font-weight:600">Precio socio</td><td style="color:var(--purple);font-weight:600">${bs(c.precioMin)}</td><td>100%</td></tr>
        </tbody>
      </table>
    </div>

    <div class="sec-label">Conclusión</div>
    <div class="notice ${viable?"green":"amber"}">
      <strong>${p.nombre}</strong> — Precio socio: ${bs(c.precioMin)} · precio público: ${bs(p.pub)} · margen: ${bs(c.margen)} (${margenPct.toFixed(1)}%)<br><br>
      ${!margenOk
        ? `⚠ Opera con pérdida. Ajusta el precio público por encima de ${bs(c.precioMin)}.`
        : viable
          ? `✓ Margen suficiente para bonos en 3 niveles. Destinar máx. 30–35% del margen a bonos: Bs ${(c.margen*0.30).toFixed(2)} – Bs ${(c.margen*0.35).toFixed(2)}.`
          : `⚠ Margen ajustado. Bonos posibles pero limitados. Considera subir el precio público.`}
    </div>
  `;

  document.getElementById("right-panel").innerHTML = `
    <div>
      <div class="prod-name-header">
        → <span>${p.nombre}</span>
        <span class="badge ${margenOk?"green":"red"}">${margenPct>=0?"+":""}${margenPct.toFixed(1)}% margen</span>
      </div>
      <div class="sec-tabs">
        <div class="sec-tab ${activeTab==="analisis"?"active":""}" data-tab="analisis" onclick="switchTab('analisis')">Análisis de costos</div>
        <div class="sec-tab ${activeTab==="planes"?"active":""}" data-tab="planes" onclick="switchTab('planes')">Planes de compensación</div>
      </div>
      <div class="tab-content ${activeTab==="analisis"?"active":""}" data-tab="analisis">
        ${analisisHTML}
      </div>
      <div class="tab-content ${activeTab==="planes"?"active":""}" data-tab="planes">
        ${renderPlanes(p, c)}
      </div>
    </div>`;
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
renderTabs(); renderFields(); renderRight();