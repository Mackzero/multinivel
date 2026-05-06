// app.js

const data = [
  { nombre:"Aliviah Fem", materia:16.40, capsulas:7.8, envases:4.46, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:220, descRed:30, demanda:0,  retPct:40, errPct:13 },
  { nombre:"NefroCllear", materia:38.17, capsulas:11.7, envases:4.46, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:200, descRed:30, demanda:34, retPct:40, errPct:13 },
  { nombre:"Curcuflex D3", materia:5.46,  capsulas:11.7, envases:4.46, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:200, descRed:30, demanda:34, retPct:40, errPct:13 },
  { nombre:"Garleon", materia:12.47, capsulas:7.8, envases:4.46, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:150, descRed:30, demanda:26, retPct:40, errPct:13 },
  { nombre:"Calibrum", materia:38.59, capsulas:7.8, envases:4.46, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:350, descRed:30, demanda:0,  retPct:40, errPct:13 },
  { nombre:"Nerva Plus", materia:54.89, capsulas:7.8, envases:4.46, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:350, descRed:30, demanda:0, retPct:40, errPct:13 },
  { nombre:"Pulsar Energy", materia:37.52, capsulas:0, envases:6.01, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:180, descRed:30, demanda:0, retPct:40, errPct:13 },
  { nombre:"Elixir Dorado", materia:38.83, capsulas:0, envases:6.01, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:180, descRed:30, demanda:0, retPct:40, errPct:13 },
  { nombre:"Osteofort", materia:52.24, capsulas:0, envases:8.01, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:360, descRed:30, demanda:90, retPct:40, errPct:13 },
  { nombre:"Aura Verde Detox",materia:69.18, capsulas:0, envases:8.01, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:360, descRed:30, demanda:90, retPct:40, errPct:13 },
  { nombre:"Harmonia", materia:34.89, capsulas:0, envases:6.01, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:180, descRed:30, demanda:0,  retPct:40, errPct:13 },
  { nombre:"Concentra Pro", materia:50.63, capsulas:0, envases:6.01, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:200, descRed:30, demanda:0,  retPct:40, errPct:13 },
  { nombre:"Colagen Premium", materia:44.48, capsulas:0, envases:8.01, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:360, descRed:30, demanda:40, retPct:40, errPct:13 },
  { nombre:"Café", materia:3.43,  capsulas:0, envases:0.5, etiqueta:0.5,  transporte:0, comision:0, iva:0, pub:18,  descRed:30, demanda:40, retPct:40, errPct:13 },
  { nombre:"Resver Plus", materia:5.75, capsulas:0, envases:13.5, etiqueta:5.63, transporte:0, comision:0, iva:0, pub:190, descRed:30, demanda:0, retPct:40, errPct:13 },
];

let cur = 0;
let activeTab = "analisis";

const bs = n => "Bs " + (+n).toFixed(2);
const pct = (v,b) => b===0 ? "0.0" : (v/b*100).toFixed(1);
const r2 = n => +n.toFixed(2);
const DIAS_MES = 30;

// CALC
function calc(p) {
  const sub = r2(p.materia + p.capsulas + p.envases + p.etiqueta + p.transporte + p.comision);
  const costoFab = r2(sub + p.iva);

  const retorno = r2(costoFab * p.retPct / 100);
  const base1 = r2(costoFab + retorno);
  const error = r2(base1 * p.errPct / 100);
  const precioSocio = r2(base1 + error);

  const precioRed = r2(p.pub * (1 - p.descRed / 100));

  const margenTuyo = r2(precioRed - precioSocio);
  const margenDistrib = r2(p.pub - precioRed);

  const bonos = simState.bonosFijos;
  const n = simState.numNiveles;
  const totalBonos = r2(bonos.slice(0, n).reduce((s, b) => s + b, 0));
  const utilidadTuya = r2(margenTuyo - totalBonos);
  const pctPayout  = margenTuyo > 0 ? (totalBonos / margenTuyo * 100) : 0;

  return {
    sub, costoFab, retorno, base1, error,
    precioSocio, precioRed,
    margenTuyo, margenDistrib,
    bonos: bonos.slice(),
    totalBonos, utilidadTuya, pctPayout,
  };
}

// ESTADO SIMULADOR
const simState = {
  numNiveles: 3,
  bonosFijos: [3, 2, 1, 0, 0],
  vendedores: [10, 10, 10, 10, 10],
  ventasDia: [1,  1,  1,  1,  1],
  misVentas: 0,
};

function calcIngRed(c) {
  const n = simState.numNiveles;
  const bonos = c.bonos.slice(0, n);
  const vend = simState.vendedores.slice(0, n);
  const ventasDia = simState.ventasDia.slice(0, n);
  const ingRed = bonos.reduce((sum, b, i) => sum + b * vend[i] * ventasDia[i] * DIAS_MES, 0);
  return { bonos, ingRed, vend, ventasDia };
}

// ACTUALIZACIÓN UNIFICADA
let _updateTimer = null;

function updateAll() {
  clearTimeout(_updateTimer);
  _updateTimer = setTimeout(() => {
    _liveParseFields();
    leerSimState();
    renderRight();
  }, 50);
}

// Parsea los campos del panel izquierdo al objeto data[cur]
function _liveParseFields() {
  const p = data[cur];
  ["materia","capsulas","envases","etiqueta","transporte","comision","iva",
   "pub","descRed","demanda","retPct","errPct"].forEach(k => {
    const el = document.getElementById("fi_"+k);
    if (el) p[k] = parseFloat(el.value) || 0;
  });
  const n = document.getElementById("fi_nombre");
  if (n) p.nombre = n.value;
}

// TABS DE PRODUCTOS
function renderTabs() {
  document.getElementById("prod-tabs").innerHTML = data.map((p,i) =>
    `<button class="prod-tab ${i===cur?"active":""}" onclick="sel(${i})">${p.nombre}</button>`
  ).join("");
}
function sel(i) { cur=i; renderTabs(); renderFields(); renderRight(); }

// FIELDS
function renderFields() {
  const p = data[cur];
  const nf = (key, label, unit="Bs", hint="") => `
    <div class="fr">
      <span class="fl">${label}${hint?`<br><span style="font-size:10px;color:var(--text3)">${hint}</span>`:""}</span>
      <input class="fi" type="number" step="0.01" id="fi_${key}" value="${p[key]}"
        oninput="updateAll()" onkeyup="updateAll()">
      <span class="fu">${unit}</span>
    </div>`;
  const pf = (key, label, bg="") => `
    <div class="fr" style="${bg}">
      <span class="fl">${label}</span>
      <input class="fi" type="number" step="0.1" id="fi_${key}" value="${p[key]}"
        oninput="updateAll()" onkeyup="updateAll()">
      <span class="fu">%</span>
    </div>`;

  document.getElementById("fields-scroll").innerHTML = `
    <div class="fg">
      <div class="fg-title">Identificación</div>
      <div class="fr">
        <span class="fl">Nombre</span>
        <input class="fi" type="text" id="fi_nombre" value="${p.nombre}"
          style="width:130px;text-align:left" oninput="updateAll()">
      </div>
      ${nf("demanda","Demanda estimada","unid.")}
      ${nf("pub","Precio público (cliente final)")}
    </div>
    <div class="fg">
      <div class="fg-title">Componentes de costo (producción)</div>
      ${nf("materia",   "Materia prima / Bot")}
      ${nf("capsulas",  "Cápsulas / bote")}
      ${nf("envases",   "Envases")}
      ${nf("etiqueta",  "Etiqueta")}
      ${nf("transporte","Transporte","Bs","por defecto 0")}
      ${nf("comision",  "Comisión ventas","Bs","por defecto 0")}
      ${nf("iva",       "IVA / Arancel","Bs","por defecto 0")}
    </div>
    <div class="fg">
      <div class="fg-title">Márgenes</div>
      ${pf("retPct","Retorno empresa s/ costo fab.","background:#f0fdf4")}
      ${pf("errPct","Margen de error s/ (costo+retorno)","background:#fffbeb")}
      ${pf("descRed","Descuento precio red (sobre pub.)","background:#eff6ff")}
    </div>
  `;
}

// TABS DE SECCIÓN
function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll(".sec-tab").forEach(el =>
    el.classList.toggle("active", el.dataset.tab === tab));
  document.querySelectorAll(".tab-content").forEach(el =>
    el.classList.toggle("active", el.dataset.tab === tab));
  if (tab === "analisis") renderRight();
}

// LEER SIMULADOR
function leerSimState() {
  const nEl = document.getElementById("sim-niveles");
  if (nEl) simState.numNiveles = parseInt(nEl.value);
  for (let i = 0; i < 5; i++) {
    const bEl = document.getElementById(`sim-bono-${i}`);
    const vEl = document.getElementById(`sim-vend-${i}`);
    const dEl = document.getElementById(`sim-vdia-${i}`);
    if (bEl) simState.bonosFijos[i] = parseFloat(bEl.value) >= 0 ? parseFloat(bEl.value) : simState.bonosFijos[i];
    if (vEl) simState.vendedores[i] = parseInt(vEl.value)   > 0  ? parseInt(vEl.value)   : simState.vendedores[i];
    if (dEl) simState.ventasDia[i]  = parseInt(dEl.value)   > 0  ? parseInt(dEl.value)   : simState.ventasDia[i];
  }
  const mvEl = document.getElementById("mis-ventas-input");
  if (mvEl) simState.misVentas = parseInt(mvEl.value) || 0;
}

// CONSTANTES
const nivelColors = ["#d97706","#1d4ed8","#059669","#7c3aed","#0d9488"];
const nivelNames  = ["Directo","Indirecto","Profundo","Extendido","Red amplia"];
const nivelDescs  = [
  "Personas que tú patrocinas directamente.",
  "Los que reclutan tus distribuidores N1.",
  "Red de tus N2. Ingreso pasivo real.",
  "Red amplia. Gran volumen.",
  "Máxima profundidad.",
];

// MIS VENTAS
function buildMisVentasResumen(c) {
  const mv     = simState.misVentas;
  const ingDir = c.utilidadTuya * mv;
  const { ingRed, vend } = calcIngRed(c);
  const n    = simState.numNiveles;
  const total = ingDir + ingRed;

  if (mv === 0) {
    return `<div class="notice amber" style="margin-top:8px">Ingresa cuántas unidades vendiste tú directamente este mes para ver el total combinado.</div>`;
  }

  return `
    <div class="mv-resumen">
      <div class="mv-row mv-row-dir">
        <div class="mv-row-label">
          <span class="mv-icon">🛒</span>
          <div>
            <div class="mv-row-title">Mis ventas directas</div>
            <div class="mv-row-sub">${mv} unid. × ${bs(c.utilidadTuya)} utilidad/unid. (después de bonos)</div>
          </div>
        </div>
        <div class="mv-row-val green">${bs(ingDir)}</div>
      </div>
      <div class="mv-row mv-row-red">
        <div class="mv-row-label">
          <span class="mv-icon">🌐</span>
          <div>
            <div class="mv-row-title">Bonos de red (ingreso pasivo)</div>
            <div class="mv-row-sub">${n} niveles · ${vend.reduce((a,b)=>a+b,0)} distribuidores</div>
          </div>
        </div>
        <div class="mv-row-val amber">${bs(ingRed)}</div>
      </div>
      <div class="mv-row mv-row-total">
        <div class="mv-row-label">
          <span class="mv-icon">💰</span>
          <div>
            <div class="mv-row-title" style="font-size:14px;font-weight:700">Total del mes</div>
            <div class="mv-row-sub">utilidad directa + bonos de red</div>
          </div>
        </div>
        <div class="mv-row-val total">${bs(total)}</div>
      </div>
    </div>`;
}

// BLOQUES SIMULADOR
function buildFlujoRed(c, n, bonos) {
  const nodos = ["Tú", ...Array.from({length:n}, (_,i) => `N${i+1}`)];
  const cadena = nodos.map((nodo, idx, arr) => `
    <div class="sim-nodo ${idx===0?"sim-nodo-yo":""}">
      <div class="sim-nodo-dot" style="background:${idx===0?"var(--accent)":nivelColors[idx-1]}"></div>
      <div class="sim-nodo-name">${nodo}</div>
      ${idx===0
        ? `<div class="sim-nodo-bono">pagas ${bs(c.precioSocio)} · vendes a ${bs(c.precioRed)}</div>`
        : `<div class="sim-nodo-bono">tu bono: ${bs(bonos[idx-1])}/unid.</div>`}
    </div>
    ${idx < arr.length-1 ? `<div class="sim-arrow">→</div>` : ""}
  `).join("");

  return `
    <div class="sim-bloque">
      <div class="sim-bloque-hdr">
        <span class="sim-bloque-num">①</span>
        <div>
          <div class="sim-bloque-title">Flujo de dinero</div>
          <div class="sim-bloque-desc">
            Tú pagas <strong>${bs(c.precioSocio)}</strong> (precio socio) y vendes a toda la red al precio único de <strong>${bs(c.precioRed)}</strong>.
            Tu margen es <strong>${bs(c.margenTuyo)}</strong>. Pagas bonos de <strong>${bs(c.totalBonos)}/unid.</strong> y retienes <strong>${bs(c.utilidadTuya)}</strong>.
            Cada distribuidor revende al público a <strong>${bs(data[cur].pub)}</strong> ganando <strong>${bs(c.margenDistrib)}</strong>.
          </div>
        </div>
      </div>
      <div style="padding:12px 14px">
        <div class="sim-cadena">${cadena}</div>
      </div>
    </div>`;
}

function buildDetallePorNivel(c, n, bonos, vend, ventasDia) {
  const tarjetas = bonos.slice(0, n).map((bono, i) => {
    const vMes = ventasDia[i] * DIAS_MES;
    const ventasTotalNivel = vend[i] * vMes;
    const totalNivel = bono * ventasTotalNivel;
    return `
    <div class="sim-nivel-card">
      <div class="sim-nivel-card-hdr" style="border-left:3px solid ${nivelColors[i]}">
        <div class="sim-nivel-card-toprow">
          <span class="sim-nivel-card-title" style="color:${nivelColors[i]}">Nivel ${i+1} · ${nivelNames[i]}</span>
          <span class="sim-nivel-pct-badge" style="background:${nivelColors[i]}20;color:${nivelColors[i]}">${bs(bono)}/unid.</span>
        </div>
        <div class="sim-nivel-card-desc">${nivelDescs[i]}</div>
      </div>
      <div class="sim-nivel-card-body">
        <div class="sim-nivel-stat">
          <span class="sim-nivel-stat-label">Tu bono por venta</span>
          <span class="sim-nivel-stat-val" style="color:${nivelColors[i]}">${bs(bono)}/unid.</span>
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
          <span class="sim-nivel-stat-val" style="color:var(--green)">${bono > 0 ? bs(totalNivel) : "Sin bono — ventas contabilizan pero no generan pago"}</span>
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
          <div class="sim-bloque-desc">
            Bonos fijos en Bs por unidad — salen de tu margen de <strong>${bs(c.margenTuyo)}</strong> (precioRed − precioSocio).
          </div>
        </div>
      </div>
      <div class="sim-niveles-grid" style="margin:12px">${tarjetas}</div>
    </div>`;
}

function buildSostenibilidad(c, n) {
  const bonos = c.bonos.slice(0, n);
  const totalBonos = c.totalBonos;
  const ok = c.utilidadTuya >= 0;
  const pctPayout  = c.pctPayout.toFixed(1);

  let acumulado = c.margenTuyo;
  const filas = bonos.map((bono, i) => {
    acumulado = r2(acumulado - bono);
    const resta  = acumulado;
    const okEste = resta >= 0;
    return `
      <tr>
        <td>Bono nivel ${i+1}</td>
        <td style="text-align:center;font-family:var(--font-mono)">${bs(bono)}</td>
        <td style="text-align:center;font-family:var(--font-mono);color:${okEste?"var(--green)":"var(--red)"};font-weight:600">${bs(resta)}</td>
        <td style="text-align:center"><span class="tag ${okEste?"tg":"tr2"}">${okEste?"OK":"Excede"}</span></td>
      </tr>`;
  }).join("");

  return `
    <div class="sim-bloque">
      <div class="sim-bloque-hdr">
        <span class="sim-bloque-num">③</span>
        <div>
          <div class="sim-bloque-title">Sostenibilidad del margen</div>
          <div class="sim-bloque-desc">
            Base de bonos: <strong>${bs(c.margenTuyo)}</strong> (precioRed − precioSocio = ${bs(c.precioRed)} − ${bs(c.precioSocio)}).
            <strong>Nunca</strong> el precio público. Payout total: <strong>${pctPayout}%</strong> de tu margen.
          </div>
        </div>
      </div>
      <div style="margin:12px">
        <div class="bonos-formula" style="margin-bottom:10px">
          <div class="bonos-formula-item">
            <div class="bonos-formula-label">Precio red</div>
            <div class="bonos-formula-val">${bs(c.precioRed)}</div>
            <div class="bonos-formula-sub">precio único toda la red</div>
          </div>
          <div class="bonos-formula-op">−</div>
          <div class="bonos-formula-item">
            <div class="bonos-formula-label">Precio socio</div>
            <div class="bonos-formula-val purple">${bs(c.precioSocio)}</div>
            <div class="bonos-formula-sub">lo que tú pagas</div>
          </div>
          <div class="bonos-formula-op">=</div>
          <div class="bonos-formula-item bonos-formula-result">
            <div class="bonos-formula-label">Tu margen</div>
            <div class="bonos-formula-val green">${bs(c.margenTuyo)}</div>
            <div class="bonos-formula-sub">base de bonos</div>
          </div>
          <div class="bonos-formula-op">−</div>
          <div class="bonos-formula-item" style="background:var(--amber-dim);border:1px solid var(--amber-bdr);border-radius:6px;padding:6px 12px">
            <div class="bonos-formula-label">Total bonos</div>
            <div class="bonos-formula-val amber">${bs(totalBonos)}</div>
            <div class="bonos-formula-sub">${pctPayout}% del margen</div>
          </div>
          <div class="bonos-formula-op">=</div>
          <div class="bonos-formula-item" style="background:var(--green-dim);border:1px solid var(--green-bdr);border-radius:6px;padding:6px 12px">
            <div class="bonos-formula-label">Tu utilidad</div>
            <div class="bonos-formula-val" style="color:var(--green)">${bs(c.utilidadTuya)}</div>
            <div class="bonos-formula-sub">por unidad vendida</div>
          </div>
        </div>
        <div class="table-wrap" style="margin-bottom:10px">
          <table>
            <thead>
              <tr>
                <th>Bono</th>
                <th style="text-align:center">Monto</th>
                <th style="text-align:center">Resta de tu margen</th>
                <th style="text-align:center">Estado</th>
              </tr>
            </thead>
            <tbody>${filas}</tbody>
          </table>
        </div>
        ${ok
          ? `<div class="notice green">✓ Payout: <strong>${pctPayout}%</strong> de tu margen. Tu utilidad: <strong>${bs(c.utilidadTuya)}/unid.</strong> Seguro y escalable.</div>`
          : `<div class="notice red">⚠ Los bonos superan tu margen. Reduce los bonos o ajusta el descuento de red.</div>`
        }
      </div>
    </div>`;
}

function buildProyeccionMensual(c, n, bonos, vend, ventasDia) {
  const totalMes = bonos.reduce((sum, bono, i) =>
    sum + bono * vend[i] * ventasDia[i] * DIAS_MES, 0);

  const filas = bonos.map((bono, i) => {
    const vMes = ventasDia[i] * DIAS_MES;
    const ventasTotalNivel = vend[i] * vMes;
    const totalNivel = bono * ventasTotalNivel;
    return `
    <tr>
      <td>
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${nivelColors[i]};margin-right:6px;vertical-align:middle"></span>
        Nivel ${i+1}
      </td>
      <td style="text-align:center">${vend[i]}</td>
      <td style="text-align:center">${ventasDia[i]}</td>
      <td style="text-align:center;color:var(--text2)">${vMes}</td>
      <td>${bs(bono)}/unid.</td>
      <td style="color:var(--green);font-weight:600">${bono > 0 ? bs(totalNivel) : "—"}</td>
    </tr>`;
  }).join("");

  return `
    <div class="sim-bloque">
      <div class="sim-bloque-hdr">
        <span class="sim-bloque-num">④</span>
        <div>
          <div class="sim-bloque-title">Proyección mensual consolidada</div>
          <div class="sim-bloque-desc">Bonos de red por mes. Ventas/mes = ventas/día × ${DIAS_MES} días.</div>
        </div>
      </div>
      <div class="table-wrap" style="margin:12px">
        <table>
          <thead>
            <tr><th>Nivel</th><th>Dist.</th><th>Ventas/día</th><th>Ventas/mes</th><th>Bono/venta</th><th>Total mes</th></tr>
          </thead>
          <tbody>
            ${filas}
            <tr class="tabla-total-row">
              <td style="font-weight:600">Total</td>
              <td style="text-align:center">${vend.reduce((a,b)=>a+b,0)}</td>
              <td style="text-align:center">—</td><td style="text-align:center">—</td><td>—</td>
              <td style="color:var(--green);font-weight:700">${bs(totalMes)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="notice blue" style="margin:0 12px 12px">
        <strong>${bs(totalMes)}</strong> bonos de red por mes.
        Cada unidad que vendas tú mismo genera <strong>${bs(c.utilidadTuya)}</strong> adicional de utilidad neta.
        Cada distribuidor gana <strong>${bs(c.margenDistrib)}</strong> al vender al público.
      </div>
    </div>`;
}

function buildSimResultados(c) {
  if (c.margenTuyo <= 0) return `<div class="notice amber">⚠ Tu margen es negativo. El precio de red es menor al precio socio.</div>`;

  const n = simState.numNiveles;
  const bonos = c.bonos.slice(0, n);
  const vend = simState.vendedores.slice(0, n);
  const ventasDia = simState.ventasDia.slice(0, n);

  return [
    buildFlujoRed(c, n, bonos),
    buildDetallePorNivel(c, n, bonos, vend, ventasDia),
    buildSostenibilidad(c, n),
    buildProyeccionMensual(c, n, bonos, vend, ventasDia),
  ].join("");
}

// PESTAÑA BONOS
function renderBonos(p, c) {
  if (c.margenTuyo <= 0) {
    return `<div class="notice amber">⚠ Tu margen es negativo. Ajusta el descuento de red antes de analizar bonos.</div>`;
  }

  const base = c.margenTuyo;

  const bonosEj = [5,10,15,20,25,30,40,50,60,80,100,120,147].filter(b => b <= base + 5);
  const filas = bonosEj.map(bonoFijo => {
    const consumo = bonoFijo / base;
    const celdas = [1,2,3,4,5].map(nv => {
      const acum = bonoFijo * nv;
      const c2 = acum / base;
      const cls = c2 > 1 ? "bono-red" : c2 > 0.5 ? "bono-amber" : "bono-green";
      return `<td class="${cls}">${bs(acum)}<br><span style="font-size:10px">${(c2*100).toFixed(0)}%</span></td>`;
    }).join("");
    return `
      <tr>
        <td style="text-align:center;font-weight:600;font-family:var(--font-mono)">${bs(bonoFijo)}</td>
        <td style="text-align:center;font-family:var(--font-mono);font-weight:600;color:${consumo>0.5?"var(--amber)":"var(--green)"}">${(consumo*100).toFixed(1)}%</td>
        ${celdas}
      </tr>`;
  }).join("");

  const combis = [
    { label:"Conservador 2N", bonos:[10, 5, 0, 0, 0] },
    { label:"Estándar 3N ★", bonos:[15, 7, 3, 0, 0] },
    { label:"Agresivo 3N", bonos:[20,10, 5, 0, 0] },
    { label:"Profundo 4N", bonos:[15, 7, 3, 2, 0] },
    { label:"Red total 5N", bonos:[15, 7, 3, 2, 1] },
    { label:"Equilibrado 5N", bonos:[12, 6, 4, 2, 1] },
  ];

  const filasCombi = combis.map(combo => {
    const total = combo.bonos.reduce((a,b)=>a+b,0);
    const resta = r2(base - total);
    const ok = resta >= 0;
    const pctUso = (total / base * 100).toFixed(1);
    const celdas = combo.bonos.map((b,i) =>
      b > 0
        ? `<td style="color:${nivelColors[i]};font-weight:600;font-family:var(--font-mono);font-size:12px">${bs(b)}</td>`
        : `<td style="color:var(--text3);font-family:var(--font-mono);font-size:12px">—</td>`
    ).join("");
    return `
      <tr>
        <td style="font-weight:600">${combo.label}</td>
        ${celdas}
        <td style="font-family:var(--font-mono);font-size:12px;font-weight:700;color:var(--amber)">${bs(total)} (${pctUso}%)</td>
        <td style="font-family:var(--font-mono);font-size:12px;font-weight:700;color:${ok?"var(--green)":"var(--red)"}">${bs(resta)}</td>
        <td><span class="tag ${ok?"tg":"tr2"}">${ok?"OK":"Excede"}</span></td>
      </tr>`;
  }).join("");

  return `
    <div class="planes-bloque">
      <div class="planes-bloque-title">Producto seleccionado</div>
      <div style="padding:12px 14px;display:flex;flex-direction:column;gap:9px">
        <div class="notice teal">
          <strong>${p.nombre}</strong> —
          Precio socio (tú pagas): <strong>${bs(c.precioSocio)}</strong> ·
          Precio red (tú vendes a la red): <strong>${bs(c.precioRed)}</strong> ·
          Precio público: <strong>${bs(p.pub)}</strong>
        </div>
        <div class="bonos-formula">
          <div class="bonos-formula-item">
            <div class="bonos-formula-label">Precio red</div>
            <div class="bonos-formula-val">${bs(c.precioRed)}</div>
            <div class="bonos-formula-sub">pub × (1−${p.descRed}%)</div>
          </div>
          <div class="bonos-formula-op">−</div>
          <div class="bonos-formula-item">
            <div class="bonos-formula-label">Precio socio</div>
            <div class="bonos-formula-val purple">${bs(c.precioSocio)}</div>
            <div class="bonos-formula-sub">costo×(1+${p.retPct}%)×(1+${p.errPct}%)</div>
          </div>
          <div class="bonos-formula-op">=</div>
          <div class="bonos-formula-item bonos-formula-result">
            <div class="bonos-formula-label">Tu margen (base bonos)</div>
            <div class="bonos-formula-val green">${bs(base)}</div>
            <div class="bonos-formula-sub">única bolsa para bonos</div>
          </div>
        </div>
        <div class="notice blue" style="font-size:12px">
          <strong>Regla crítica:</strong> los bonos se calculan sobre <strong>${bs(base)}</strong> (tu margen = precioRed − precioSocio).
          <em>Nunca</em> sobre el precio público. El margen retail (<strong>${bs(c.margenDistrib)}</strong>) lo retiene cada distribuidor cuando vende al público.
        </div>
      </div>
    </div>

    <div class="planes-bloque">
      <div class="planes-bloque-title">Análisis de bonos fijos (base: ${bs(base)})</div>
      <div class="bonos-leyenda">
        <span class="bono-dot bono-green-dot"></span>Sostenible (&lt;50%) &nbsp;
        <span class="bono-dot bono-amber-dot"></span>Ajustado (50–100%) &nbsp;
        <span class="bono-dot bono-red-dot"></span>Supera el margen
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th style="text-align:center">Bono/unid.</th>
              <th style="text-align:center">% margen</th>
              ${[1,2,3,4,5].map((n,i)=>`<th style="text-align:center;color:${nivelColors[i]}">${n} nivel${n>1?"es":""}</th>`).join("")}
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      </div>
      <div class="notice blue" style="margin-top:8px;font-size:12px">
        Las columnas muestran el costo total si se paga ese mismo bono en cada nivel acumulado hasta ese nivel.
        Ejemplo actual (N1=${bs(c.bonos[0])}, N2=${bs(c.bonos[1])}, N3=${bs(c.bonos[2])}): total ${bs(c.totalBonos)} = ${c.pctPayout.toFixed(1)}% de tu margen.
      </div>
    </div>

    <div class="planes-bloque">
      <div class="planes-bloque-title">Combinaciones recomendadas (tu margen: ${bs(base)})</div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Plan</th>
              ${[1,2,3,4,5].map((n,i)=>`<th style="color:${nivelColors[i]}">N${n}</th>`).join("")}
              <th>Total bonos</th><th>Tu utilidad</th><th>Estado</th>
            </tr>
          </thead>
          <tbody>${filasCombi}</tbody>
        </table>
      </div>
      <div class="notice green" style="margin-top:8px;font-size:12px">
        "Tu utilidad" = tu margen (${bs(base)}) − total bonos. Lo que retienes por cada unidad vendida en la red.
      </div>
    </div>
  `;
}

// RENDER PLANES
function renderPlanes(p, c) {
  if (c.margenTuyo <= 0) {
    return `<div class="notice amber">⚠ Tu margen es negativo. El precio de red es menor al precio socio.</div>`;
  }

  const n = simState.numNiveles;
  const optsNiveles = [1,2,3,4,5].map(v =>
    `<option value="${v}" ${v===n?"selected":""}>${v} nivel${v>1?"es":""}</option>`
  ).join("");

  const filasConfig = Array.from({length:5}, (_, i) => `
    <div class="sim-config-row" id="sim-row-${i}" style="display:${i<n?"":"none"}">
      <div class="sim-config-label">
        <span class="sim-nivel-dot" style="background:${nivelColors[i]}"></span>
        <div>
          <div style="font-weight:600;font-size:12px;color:var(--text)">Nivel ${i+1} — ${nivelNames[i]}</div>
          <div style="font-size:11px;color:var(--text3)">${nivelDescs[i]}</div>
        </div>
      </div>
      <div class="sim-config-fields">
        <div class="sim-field-group">
          <span class="sim-field-label">Bono fijo</span>
          <input class="fi" type="number" step="0.5" min="0" id="sim-bono-${i}"
            value="${simState.bonosFijos[i]}"
            oninput="updateAll()" onkeyup="updateAll()" style="width:60px">
          <span class="fu">Bs</span>
        </div>
        <div class="sim-field-group">
          <span class="sim-field-label">Distribuidores</span>
          <input class="fi" type="number" step="1" min="0" id="sim-vend-${i}"
            value="${simState.vendedores[i]}"
            oninput="updateAll()" onkeyup="updateAll()" style="width:52px">
        </div>
        <div class="sim-field-group">
          <span class="sim-field-label">Ventas/día</span>
          <input class="fi" type="number" step="1" min="1" id="sim-vdia-${i}"
            value="${simState.ventasDia[i]}"
            oninput="updateAll()" onkeyup="updateAll()" style="width:52px">
        </div>
      </div>
    </div>`
  ).join("");

  return `
    <div class="planes-bloque">
      <div class="planes-bloque-title">Producto seleccionado</div>
      <div class="notice teal" style="margin:12px">
        <strong>${p.nombre}</strong> —
        Precio socio (tú pagas): <strong>${bs(c.precioSocio)}</strong> ·
        Precio red (tú vendes): <strong>${bs(c.precioRed)}</strong> ·
        Tu margen: <strong>${bs(c.margenTuyo)}</strong> ·
        Margen distribuidor al público: <strong>${bs(c.margenDistrib)}</strong>
      </div>
    </div>

    <div class="planes-bloque">
      <div class="planes-bloque-title">Mis ventas directas este mes</div>
      <div class="mv-input-row">
        <span class="mv-input-label">Unidades que vendí yo directamente:</span>
        <input class="fi" type="number" step="1" min="0" id="mis-ventas-input"
          value="${simState.misVentas}"
          oninput="updateAll()" onkeyup="updateAll()" style="width:72px">
        <span class="fu">unid.</span>
        <span class="mv-input-hint" id="mis-ventas-hint">× ${bs(c.utilidadTuya)} = ${bs(c.utilidadTuya * simState.misVentas)}</span>
      </div>
      <div id="mis-ventas-resumen">${buildMisVentasResumen(c)}</div>
    </div>

    <div class="planes-bloque">
      <div class="planes-bloque-title">¿Cómo funciona este plan?</div>
      <div class="planes-explainer">
        <div class="planes-exp-grid">
          <div class="planes-exp-item">
            <div class="planes-exp-icon">①</div>
            <div><strong>Precio socio</strong> — Tú compras a la empresa a <strong>${bs(c.precioSocio)}</strong> (costo fab. + ${p.retPct}% + ${p.errPct}%).</div>
          </div>
          <div class="planes-exp-item">
            <div class="planes-exp-icon">②</div>
            <div><strong>Precio red único</strong> — Toda la red (N1, N2, N3…) te compra a ti a <strong>${bs(c.precioRed)}</strong> (${p.pub} × (1−${p.descRed}%)). Nadie revende con sobreprecio.</div>
          </div>
          <div class="planes-exp-item">
            <div class="planes-exp-icon">③</div>
            <div><strong>Tu margen</strong> — ${bs(c.precioRed)} − ${bs(c.precioSocio)} = <strong>${bs(c.margenTuyo)}</strong>. De aquí pagas bonos (<strong>${bs(c.totalBonos)}</strong>) y retienes <strong>${bs(c.utilidadTuya)}/unid.</strong></div>
          </div>
          <div class="planes-exp-item">
            <div class="planes-exp-icon">④</div>
            <div><strong>Margen retail</strong> — Cada distribuidor vende al público a ${bs(p.pub)} y gana <strong>${bs(c.margenDistrib)}/unid.</strong>, independiente de los bonos.</div>
          </div>
        </div>
      </div>
    </div>

    <div class="planes-bloque">
      <div class="planes-bloque-title">Configuración del plan</div>
      <div class="sim-configurador">
        <div class="sim-cfg-hdr">
          <div style="font-size:12px;color:var(--text2);line-height:1.5">
            Ajusta los bonos fijos (Bs/unidad), distribuidores y ventas por día.
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
            <span style="font-size:11.5px;color:var(--text3);font-family:var(--font-mono)">Niveles:</span>
            <select id="sim-niveles" class="fi"
              style="width:90px;text-align:left;cursor:pointer"
              onchange="updateAll()">
              ${optsNiveles}
            </select>
          </div>
        </div>
        <div class="sim-config-explain">
          <strong>Bono fijo</strong> = Bs que tú pagas por cada unidad vendida en ese nivel (de tu margen de <strong>${bs(c.margenTuyo)}</strong>).<br>
          <strong>Nivel 1</strong> = distribuidores que tú patrocinas directamente · <strong>Nivel 2</strong> = los que ellos reclutan · y así.<br>
          <strong>Ventas/día</strong> × ${DIAS_MES} días = ventas mensuales.
        </div>
        ${filasConfig}
      </div>
    </div>

    <div class="planes-bloque">
      <div class="planes-bloque-title">Resultados del simulador</div>
      <div id="sim-resultados">${buildSimResultados(c)}</div>
    </div>`;
}

// RENDER PRINCIPAL
function renderRight() {
  leerSimState();
  const p = data[cur];
  const c = calc(p);

  const margenTuyoPct = c.precioRed > 0 ? (c.margenTuyo / c.precioRed * 100) : 0;
  const margenDistPct = p.pub > 0 ? (c.margenDistrib / p.pub * 100) : 0;
  const viable        = c.utilidadTuya >= 0 && c.margenDistrib >= 0;

  const analisisHTML = `
    <div class="sec-label">Estructura de precios</div>
    <div class="price-strip" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      <div class="pc">
        <div class="pc-label">Costo fabricación</div>
        <div class="pc-val">${bs(c.costoFab)}</div>
        <div class="pc-sub">materia + envases + etc.</div>
      </div>
      <div class="pc hl-purple">
        <div class="pc-label">Precio socio (tú pagas)</div>
        <div class="pc-val purple">${bs(c.precioSocio)}</div>
        <div class="pc-sub">costo×(1+${p.retPct}%)×(1+${p.errPct}%)</div>
      </div>
      <div class="pc hl-amber">
        <div class="pc-label">Precio red (tú vendes)</div>
        <div class="pc-val amber">${bs(c.precioRed)}</div>
        <div class="pc-sub">pub × (1−${p.descRed}%) → tu margen: ${bs(c.margenTuyo)}</div>
      </div>
      <div class="pc hl-green">
        <div class="pc-label">Precio público</div>
        <div class="pc-val green">${bs(p.pub)}</div>
        <div class="pc-sub">margen distribuidor: ${bs(c.margenDistrib)}</div>
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
        <span class="build-label"><strong>Costo fabricación</strong></span>
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
        <span class="build-pct">${p.errPct}% × (costo + retorno)</span>
        <span class="build-val amber">+ ${bs(c.error)}</span>
      </div>
      <div class="build-row build-total">
        <span class="build-idx" style="color:var(--purple)">→</span>
        <span class="build-label"><strong>Precio socio (tú pagas a la empresa)</strong></span>
        <span class="build-pct">costo × (1+${p.retPct}%) × (1+${p.errPct}%)</span>
        <span class="build-val purple"><strong>${bs(c.precioSocio)}</strong></span>
      </div>
      <div class="build-row" style="background:var(--amber-dim)">
        <span class="build-idx" style="color:var(--amber)">⑤</span>
        <span class="build-label"><strong>Precio red (tú vendes a toda la red)</strong></span>
        <span class="build-pct">${bs(p.pub)} × (1−${p.descRed}%)</span>
        <span class="build-val amber"><strong>${bs(c.precioRed)}</strong></span>
      </div>
      <div class="build-row ${c.margenTuyo>=0?"build-margin-pos":"build-margin-neg"}">
        <span class="build-idx" style="color:${c.margenTuyo>=0?"var(--green)":"var(--red)"}">⑥</span>
        <span class="build-label"><strong>Tu margen (base de bonos)</strong></span>
        <span class="build-pct">${bs(c.precioRed)} − ${bs(c.precioSocio)}</span>
        <span class="build-val ${c.margenTuyo>=0?"green":"red"}"><strong>${bs(c.margenTuyo)}</strong></span>
      </div>
      <div class="build-row" style="background:var(--amber-dim)">
        <span class="build-idx" style="color:var(--amber)">⑦</span>
        <span class="build-label">Total bonos de red</span>
        <span class="build-pct">${c.pctPayout.toFixed(1)}% de tu margen</span>
        <span class="build-val amber">− ${bs(c.totalBonos)}</span>
      </div>
      <div class="build-row ${c.utilidadTuya>=0?"build-margin-pos":"build-margin-neg"}">
        <span class="build-idx" style="color:${c.utilidadTuya>=0?"var(--green)":"var(--red)"}">⑧</span>
        <span class="build-label"><strong>Tu utilidad neta por unidad</strong></span>
        <span class="build-pct">margen − bonos</span>
        <span class="build-val ${c.utilidadTuya>=0?"green":"red"}"><strong>${bs(c.utilidadTuya)}</strong></span>
      </div>
      <div class="build-row build-sep">
        <span class="build-idx" style="color:var(--text2)">→</span>
        <span class="build-label"><strong>Precio público (cliente final)</strong></span>
        <span class="build-pct"></span>
        <span class="build-val def"><strong>${bs(p.pub)}</strong></span>
      </div>
      <div class="build-row ${c.margenDistrib>=0?"build-margin-pos":"build-margin-neg"}">
        <span class="build-idx" style="color:${c.margenDistrib>=0?"var(--green)":"var(--red)"}">⑨</span>
        <span class="build-label"><strong>Margen del distribuidor (N1/N2/N3)</strong></span>
        <span class="build-pct">${bs(p.pub)} − ${bs(c.precioRed)}</span>
        <span class="build-val ${c.margenDistrib>=0?"green":"red"}"><strong>${bs(c.margenDistrib)}</strong></span>
      </div>
    </div>

    ${c.margenTuyo < 0 ? `<div class="notice red" style="margin-bottom:16px">⚠ Precio red (${bs(c.precioRed)}) menor al precio socio (${bs(c.precioSocio)}). Reduce el descuento de red.</div>` : ""}
    ${c.utilidadTuya < 0 ? `<div class="notice red" style="margin-bottom:16px">⚠ Los bonos (${bs(c.totalBonos)}) superan tu margen (${bs(c.margenTuyo)}). Reduce bonos o descuento.</div>` : ""}
    ${c.margenDistrib < 0 ? `<div class="notice red" style="margin-bottom:16px">⚠ El precio de red supera el precio público. Los distribuidores operarían en pérdida.</div>` : ""}
    ${p.demanda>0?`<div class="notice blue" style="margin-bottom:16px">Proyección · <strong>${p.demanda} unid.</strong> → tu utilidad: <strong>${bs(c.utilidadTuya*p.demanda)}</strong> · bonos pagados: <strong>${bs(c.totalBonos*p.demanda)}</strong></div>`:""}

    <div class="sec-label">Escenarios por actor</div>
    <div class="table-wrap" style="margin-bottom:16px">
      <table>
        <thead><tr><th>Actor</th><th>Paga</th><th>Recibe</th><th>Margen</th><th>%</th></tr></thead>
        <tbody>
          <tr>
            <td>Tú (compra a empresa)</td>
            <td>${bs(c.precioSocio)}</td>
            <td>${bs(c.precioRed)}</td>
            <td style="color:var(--purple);font-weight:600">${bs(c.margenTuyo)}</td>
            <td>${margenTuyoPct.toFixed(1)}% del precio red</td>
          </tr>
          <tr>
            <td>Distribuidor (N1/N2/N3)</td>
            <td>${bs(c.precioRed)}</td>
            <td>${bs(p.pub)}</td>
            <td style="color:var(--green);font-weight:600">${bs(c.margenDistrib)}</td>
            <td>${margenDistPct.toFixed(1)}% del precio público</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="sec-label">Bonos configurados</div>
    <div class="nivel-grid" style="margin-bottom:9px">
      ${c.bonos.slice(0, simState.numNiveles).map((b,i)=>`
        <div class="nivel-card ${i===0?"best":""}">
          <div class="nivel-n">Nivel ${i+1} · ${nivelNames[i]}</div>
          <div class="nivel-amt">${bs(b)}</div>
          <div class="nivel-bs">bono fijo / unidad</div>
        </div>`).join("")}
    </div>
    <div class="notice ${c.utilidadTuya>=0?"green":"amber"}" style="margin-bottom:20px">
      Total bonos: <strong>${bs(c.totalBonos)}/unid.</strong> (${c.pctPayout.toFixed(1)}% de tu margen) ·
      Tu utilidad neta: <strong>${bs(c.utilidadTuya)}/unid.</strong>
    </div>

    <div class="sec-label">Desglose de costos</div>
    <div class="table-wrap" style="margin-bottom:20px">
      <table>
        <thead><tr><th>Concepto</th><th>Monto</th><th>% s/ precio socio</th></tr></thead>
        <tbody>
          ${[["Materia prima",p.materia],["Cápsulas",p.capsulas],["Envases",p.envases],["Etiqueta",p.etiqueta],["Transporte",p.transporte],["Comisión",p.comision]]
            .filter(([,v])=>v>0).map(([l,v])=>`<tr><td>${l}</td><td>${bs(v)}</td><td>${pct(v,c.precioSocio)}%</td></tr>`).join("")}
          <tr style="background:var(--bg3)"><td>Subtotal sin IVA</td><td>${bs(c.sub)}</td><td>—</td></tr>
          ${p.iva>0?`<tr><td>IVA / Arancel</td><td>${bs(p.iva)}</td><td>${pct(p.iva,c.precioSocio)}%</td></tr>`:""}
          <tr style="background:var(--bg3)"><td style="font-weight:600">Costo fabricación</td><td style="font-weight:600">${bs(c.costoFab)}</td><td>${pct(c.costoFab,c.precioSocio)}%</td></tr>
          <tr style="background:#fff8f0"><td style="color:var(--amber)">Retorno empresa (${p.retPct}%)</td><td style="color:var(--amber);font-weight:600">+ ${bs(c.retorno)}</td><td>${pct(c.retorno,c.precioSocio)}%</td></tr>
          <tr style="background:#fffbeb"><td style="color:var(--amber)">Margen error (${p.errPct}%)</td><td style="color:var(--amber);font-weight:600">+ ${bs(c.error)}</td><td>${pct(c.error,c.precioSocio)}%</td></tr>
          <tr style="background:var(--purple-dim)"><td style="color:var(--purple);font-weight:600">Precio socio (tú pagas)</td><td style="color:var(--purple);font-weight:600">${bs(c.precioSocio)}</td><td>100%</td></tr>
        </tbody>
      </table>
    </div>

    <div class="sec-label">Conclusión</div>
    <div class="notice ${viable?"green":"amber"}">
      <strong>${p.nombre}</strong><br>
      Precio socio (tú pagas): ${bs(c.precioSocio)} ·
      Precio red (tú vendes): ${bs(c.precioRed)} ·
      Precio público: ${bs(p.pub)}<br>
      <strong>Tu margen</strong>: ${bs(c.margenTuyo)} ·
      Bonos: ${bs(c.totalBonos)} (${c.pctPayout.toFixed(1)}%) ·
      <strong>Tu utilidad neta</strong>: ${bs(c.utilidadTuya)}/unid.<br>
      Margen distribuidor al público: <strong>${bs(c.margenDistrib)}/unid.</strong><br><br>
      ${!viable
        ? `⚠ Revisa la estructura — hay márgenes negativos.`
        : `✓ Estructura sana. Creces por volumen, no por exprimir margen. Ve a "Planes" para simular la red.`}
    </div>
  `;

  document.getElementById("right-panel").innerHTML = `
    <div>
      <div class="prod-name-header">
        → <span>${p.nombre}</span>
        <span class="badge ${viable?"green":"red"}">${bs(c.utilidadTuya)}/unid. utilidad</span>
      </div>
      <div class="sec-tabs">
        <div class="sec-tab ${activeTab==="analisis"?"active":""}" data-tab="analisis" onclick="switchTab('analisis')">Análisis de costos</div>
        <div class="sec-tab ${activeTab==="planes"?"active":""}" data-tab="planes" onclick="switchTab('planes')">Planes de compensación</div>
        <div class="sec-tab ${activeTab==="bonos"?"active":""}" data-tab="bonos" onclick="switchTab('bonos')">Bonos</div>
      </div>
      <div class="tab-content ${activeTab==="analisis"?"active":""}" data-tab="analisis">${analisisHTML}</div>
      <div class="tab-content ${activeTab==="planes"?"active":""}" data-tab="planes">${renderPlanes(p, c)}</div>
      <div class="tab-content ${activeTab==="bonos"?"active":""}" data-tab="bonos">${renderBonos(p, c)}</div>
    </div>`;
}

// INIT
renderTabs(); renderFields(); renderRight();