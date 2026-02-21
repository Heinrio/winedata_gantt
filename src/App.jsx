import { useState, useRef, useCallback, useMemo } from "react";

// ─── Pre-loaded data from Gantt_2.xml ────────────────────────────────────────
const EMBEDDED_TASKS = [{"uid":1,"name":"Definición detallada de Requisitos (Specs)","start":"2025-11-03","finish":"2025-11-07","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"1","predecessors":[]},{"uid":3,"name":"Arquitectura de Sistema (HW + SW + Cloud)","start":"2025-11-10","finish":"2025-11-21","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"2","predecessors":[{"predUID":1,"type":1}]},{"uid":4,"name":"Selección de Componentes (MCU, Sensores, Cloud)","start":"2025-11-24","finish":"2025-12-05","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"3","predecessors":[{"predUID":3,"type":1}]},{"uid":5,"name":"Diseño UI/UX (Mockups y Flujo de Usuario)","start":"2025-11-10","finish":"2025-11-14","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"4","predecessors":[{"predUID":1,"type":1}]},{"uid":6,"name":"Adquisición de Componentes (Proto)","start":"2025-12-08","finish":"2025-12-26","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"5","predecessors":[{"predUID":4,"type":1}]},{"uid":7,"name":"Diseño Esquemático - Nodo Viñedo (VSN)","start":"2025-12-08","finish":"2025-12-19","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"6","predecessors":[{"predUID":4,"type":1}]},{"uid":8,"name":"Diseño Esquemático - Nodo Bodega (WSN)","start":"2025-12-08","finish":"2025-12-19","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"7","predecessors":[{"predUID":4,"type":1}]},{"uid":9,"name":"Diseño Esquemático - Gateway / Repetidor LoRa","start":"2025-12-22","finish":"2026-01-02","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"8","predecessors":[{"predUID":7,"type":1}]},{"uid":10,"name":"Diseño Esquemático - Válvula Inteligente (SVC)","start":"2025-12-22","finish":"2026-01-02","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"9","predecessors":[{"predUID":8,"type":1}]},{"uid":11,"name":"Montaje y Pruebas (Protoboard) - VSN + WSN","start":"2025-12-29","finish":"2026-01-09","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"10","predecessors":[{"predUID":6,"type":1},{"predUID":7,"type":1},{"predUID":8,"type":1}]},{"uid":12,"name":"Montaje y Pruebas (Protoboard) - Gateway + SVC","start":"2026-01-05","finish":"2026-01-16","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"11","predecessors":[{"predUID":6,"type":1},{"predUID":9,"type":1},{"predUID":10,"type":1}]},{"uid":13,"name":"Firmware Básico (Drivers Sensores y Conectividad)","start":"2026-01-19","finish":"2026-02-13","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"12","predecessors":[{"predUID":11,"type":1},{"predUID":12,"type":1}]},{"uid":14,"name":"Configuración Cloud, DB y Red LoRaWAN","start":"2025-12-08","finish":"2025-12-19","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"13","predecessors":[{"predUID":3,"type":1},{"predUID":4,"type":1}]},{"uid":15,"name":"Desarrollo API - Autenticación (Login, 2FA, Super-admin)","start":"2025-12-22","finish":"2026-01-09","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"14","predecessors":[{"predUID":14,"type":1}]},{"uid":16,"name":"Desarrollo API - Ingesta de Datos (MQTT/HTTP)","start":"2026-01-12","finish":"2026-01-23","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"15","predecessors":[{"predUID":14,"type":1}]},{"uid":17,"name":"Desarrollo API - ABM (Usuarios, Sensores, Zonas)","start":"2026-01-12","finish":"2026-01-30","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"16","predecessors":[{"predUID":15,"type":1}]},{"uid":18,"name":"Desarrollo Lógica de Accionamiento (Válvulas)","start":"2026-01-26","finish":"2026-02-13","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"17","predecessors":[{"predUID":16,"type":1}]},{"uid":19,"name":"Configuración Proyecto Frontend (Mobile/Desktop)","start":"2025-11-17","finish":"2025-11-21","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"18","predecessors":[{"predUID":1,"type":1},{"predUID":5,"type":1}]},{"uid":20,"name":"Vistas - Login y Sección Mantenimiento (ABMs)","start":"2026-02-02","finish":"2026-02-27","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"19","predecessors":[{"predUID":19,"type":1},{"predUID":17,"type":1}]},{"uid":21,"name":"Vistas - Dashboard (Gráficos, KPIs)","start":"2026-03-02","finish":"2026-03-27","isCritical":true,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"20","predecessors":[{"predUID":19,"type":1},{"predUID":16,"type":1}]},{"uid":22,"name":"Vistas - Integración Google Maps","start":"2026-03-30","finish":"2026-04-10","isCritical":true,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"21","predecessors":[{"predUID":21,"type":1}]},{"uid":23,"name":"Vistas - Customización de Dashboard","start":"2026-04-13","finish":"2026-04-24","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"22","predecessors":[{"predUID":21,"type":1}]},{"uid":24,"name":"Integración HW/SW (MVP Viñedo - Lab)","start":"2026-02-16","finish":"2026-03-06","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"23","predecessors":[{"predUID":13,"type":1},{"predUID":16,"type":1}]},{"uid":25,"name":"Pruebas Conectividad y Válvulas (Viñedo)","start":"2026-03-09","finish":"2026-03-20","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"24","predecessors":[{"predUID":24,"type":1}]},{"uid":27,"name":"Pruebas de Campo (Instalación MVP Viñedo)","start":"2026-04-13","finish":"2026-04-24","isCritical":true,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"25","predecessors":[{"predUID":25,"type":1},{"predUID":22,"type":1}]},{"uid":41,"name":"Desarrollo HW - Nodo Bodega (WSN)","start":"2026-02-16","finish":"2026-03-06","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"26","predecessors":[{"predUID":4,"type":1},{"predUID":6,"type":1}]},{"uid":42,"name":"Firmware Nodo Bodega","start":"2026-03-10","finish":"2026-03-23","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"27","predecessors":[{"predUID":41,"type":1},{"predUID":13,"type":1}]},{"uid":43,"name":"Integración y Pruebas (Bodega)","start":"2026-03-25","finish":"2026-04-07","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"28","predecessors":[{"predUID":42,"type":1}]},{"uid":28,"name":"Feedback y Ajustes (Viñedo + Bodega)","start":"2026-04-27","finish":"2026-05-08","isCritical":true,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"29","predecessors":[{"predUID":27,"type":1},{"predUID":43,"type":1}]},{"uid":29,"name":"Diseño PCB (Nodos, Gateway, Válvula)","start":"2026-05-11","finish":"2026-05-29","isCritical":true,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"30","predecessors":[{"predUID":28,"type":1}]},{"uid":30,"name":"Diseño de Cajas (Impresión 3D / Moldeo)","start":"2026-04-27","finish":"2026-05-08","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"31","predecessors":[{"predUID":27,"type":1}]},{"uid":31,"name":"Fabricación y Ensamblaje PCBs (V1.0)","start":"2026-06-01","finish":"2026-06-19","isCritical":true,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"32","predecessors":[{"predUID":29,"type":1}]},{"uid":32,"name":"Refinamiento Firmware (Batería, OTA, Failsafes)","start":"2026-06-22","finish":"2026-07-03","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"33","predecessors":[{"predUID":31,"type":1}]},{"uid":33,"name":"Refinamiento Software (Seguridad, Mobile, Bugs)","start":"2026-05-11","finish":"2026-05-29","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"34","predecessors":[{"predUID":28,"type":1}]},{"uid":34,"name":"Pruebas de Estrés y Ciclos (Temp, Agua, Batería)","start":"2026-06-22","finish":"2026-07-10","isCritical":true,"isCritical":true,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"35","predecessors":[{"predUID":30,"type":1},{"predUID":31,"type":1}]},{"uid":36,"name":"Ensamblaje y QA (Producto Final)","start":"2026-07-13","finish":"2026-07-24","isCritical":true,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"36","predecessors":[{"predUID":34,"type":1},{"predUID":32,"type":1},{"predUID":33,"type":1}]},{"uid":37,"name":"Documentación Técnica y de Usuario - HW","start":"2026-07-27","finish":"2026-08-07","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"37","predecessors":[{"predUID":36,"type":1}]},{"uid":40,"name":"Documentación Técnica y de Usuario - SW","start":"2026-06-01","finish":"2026-06-12","isCritical":false,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"38","predecessors":[{"predUID":33,"type":1}]},{"uid":38,"name":"Instalación Piloto (Cliente 1)","start":"2026-07-27","finish":"2026-07-31","isCritical":true,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"39","predecessors":[{"predUID":33,"type":1},{"predUID":36,"type":1}]},{"uid":39,"name":"Monitoreo y Soporte Activo (Piloto)","start":"2026-08-03","finish":"2026-08-14","isCritical":true,"isSummary":false,"isMilestone":false,"outlineLevel":1,"wbs":"40","predecessors":[{"predUID":38,"type":1}]}];

// ─── Pre-loaded resources & assignments from Gantt_2.xml ─────────────────────
const EMBEDDED_ASSIGNMENTS = {"1":["EE1","EE2","ES","TE","TP"],"3":["EE1","ES"],"4":["EE1","EE2","ES"],"5":["TP","TP2"],"6":["TE"],"7":["EE1"],"8":["EE2"],"9":["EE1"],"10":["EE2"],"11":["TE"],"12":["EE1"],"13":["EE1","EE2"],"14":["ES"],"15":["ES"],"16":["ES","TP"],"17":["TP2"],"18":["ES"],"19":["TP","TP2"],"20":["TP2"],"21":["TP"],"22":["TP"],"23":["TP"],"24":["EE1","ES"],"25":["EE1","ES","TE"],"27":["ES","TE"],"28":["EE1","EE2","ES","TP"],"29":["EE1","EE2"],"30":["TE"],"31":["TE","P"],"32":["EE1"],"33":["ES","TP"],"34":["EE2","TE"],"36":["TE","EE1"],"37":["EE1","EE2"],"38":["ES","TE"],"39":["EE1","EE2","ES","TE","TP"],"40":["ES","TP"],"41":["EE2"],"42":["EE2"],"43":["EE2","TE","TP2"]};

// Color palette per resource (consistent across themes)
// Full names editable here — siglas are the keys from MS Project
const RESOURCE_FULL_NAMES = {
  "EE1": "EE1 – Ingeniero Electrónico 1",
  "EE2": "EE2 – Ingeniero Electrónico 2",
  "ES":  "ES – Ingeniero en Sistemas",
  "TE":  "TE – Técnico Electrónico",
  "TP":  "TP – Técnico Programador",
  "TP2": "TP2 – Técnico Programador 2",
  "P":   "P – Proveedor/Externo",
};
const RESOURCE_COLORS = {
  "EE1": {bg:"#1A4A8A",text:"#7EC8FF",short:"E1"},
  "EE2": {bg:"#1A6B4A",text:"#6BEEAA",short:"E2"},
  "ES":  {bg:"#5B2A8A",text:"#C88AFF",short:"ES"},
  "TE":  {bg:"#8A5B00",text:"#FFD060",short:"TE"},
  "TP":  {bg:"#8A1A40",text:"#FF80A8",short:"TP"},
  "TP2": {bg:"#1A6B6B",text:"#60E0E0",short:"T2"},
  "P":   {bg:"#5B3A1A",text:"#FFAA60",short:"P"},
};
function getResColor(name) { return RESOURCE_COLORS[name] || {bg:"#333",text:"#ccc",short:name.slice(0,2)}; }
function getResFullName(name) { return RESOURCE_FULL_NAMES[name] || name; }

const DAY = 86400000;

function getEarliestStart(rawTasks) {
  let earliest = null;
  for (const t of rawTasks) {
    const d = new Date(t.start + "T00:00:00");
    if (!earliest || d < earliest) earliest = d;
  }
  return earliest;
}

function shiftTasks(rawTasks, offsetDays) {
  return rawTasks.map(t => {
    const s = new Date(t.start + "T00:00:00");
    const f = new Date(t.finish + "T23:59:59");
    s.setDate(s.getDate() + offsetDays);
    f.setDate(f.getDate() + offsetDays);
    return { ...t, start: s, finish: f };
  });
}

function parseMSProjectXML(xmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml");
  const NS = "http://schemas.microsoft.com/project";
  const g = (el, tag) => { const c = el.getElementsByTagNameNS(NS, tag)[0]; return c ? c.textContent.trim() : null; };
  const raw = [];
  for (const tel of doc.getElementsByTagNameNS(NS, "Task")) {
    const uid = parseInt(g(tel, "UID"), 10);
    const name = g(tel, "Name") || g(tel, "n") || "";
    const startStr = g(tel, "Start"), finishStr = g(tel, "Finish");
    if (!startStr || !finishStr || !name || isNaN(new Date(startStr))) continue;
    const preds = [];
    for (const pl of tel.getElementsByTagNameNS(NS, "PredecessorLink")) {
      const puid = parseInt(g(pl, "PredecessorUID"), 10);
      if (!isNaN(puid)) preds.push({ predUID: puid, type: parseInt(g(pl, "Type") || "1", 10) });
    }
    raw.push({ uid, name, start: startStr.split("T")[0], finish: finishStr.split("T")[0],
      isCritical: g(tel, "Critical") === "1", isSummary: g(tel, "Summary") === "1",
      isMilestone: g(tel, "Milestone") === "1", outlineLevel: parseInt(g(tel, "OutlineLevel") || "1", 10),
      wbs: g(tel, "WBS") || "", predecessors: preds });
  }
  return raw.filter(t => t.uid !== 0 && t.name);
}

function parseMSProjectResources(xmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml");
  const NS = "http://schemas.microsoft.com/project";
  const g = (el, tag) => { const c = el.getElementsByTagNameNS(NS, tag)[0]; return c ? c.textContent.trim() : null; };
  // Resources
  const resources = {};
  for (const rel of doc.getElementsByTagNameNS(NS, "Resource")) {
    const uid = g(rel, "UID"), name = g(rel, "Name");
    if (uid && name && uid !== "0") resources[uid] = name;
  }
  // Assignments: taskUID -> [resourceNames]
  const assignments = {};
  for (const ael of doc.getElementsByTagNameNS(NS, "Assignment")) {
    const tuid = g(ael, "TaskUID"), ruid = g(ael, "ResourceUID");
    if (tuid && ruid && resources[ruid]) {
      if (!assignments[tuid]) assignments[tuid] = [];
      if (!assignments[tuid].includes(resources[ruid])) assignments[tuid].push(resources[ruid]);
    }
  }
  return assignments;
}

// ─── Theme definitions ────────────────────────────────────────────────────────
const THEMES = {
  "Cosmos": {
    bg:"#070B14",surface:"#0D1320",surface2:"#111927",border:"#1E2D45",borderBright:"#2E4060",
    text:"#CDD9E5",textMuted:"#7A90A8",textDim:"#3A5068",accent:"#4D9DE0",accentGlow:"#1A3A5C",
    critical:"#E05C5C",criticalBg:"#3D1515",summary:"#B88AFF",summaryBg:"#221540",
    milestone:"#FFB830",dep:"#2A5080",depHi:"#FFD700",rowAlt:"#0A1220",
    wine:"#8B2252",wineLight:"#D4547A",wineDim:"#3A0F22",
    preview:["#070B14","#4D9DE0","#E05C5C","#B88AFF"],
  },
  "Viñedo": {
    bg:"#12080A",surface:"#1E0F13",surface2:"#261419",border:"#3D1F28",borderBright:"#5C2E3C",
    text:"#EDD9DD",textMuted:"#A07A85",textDim:"#5C3A42",accent:"#D4547A",accentGlow:"#4A1828",
    critical:"#FF6B35",criticalBg:"#3D1A0A",summary:"#C47ABF",summaryBg:"#2E1430",
    milestone:"#F0C040",dep:"#6B2840",depHi:"#FFD700",rowAlt:"#160B0E",
    wine:"#8B2252",wineLight:"#D4547A",wineDim:"#3A0F22",
    preview:["#12080A","#D4547A","#FF6B35","#C47ABF"],
  },
  "Pizarron": {
    bg:"#1A1A1A",surface:"#242424",surface2:"#2E2E2E",border:"#3A3A3A",borderBright:"#505050",
    text:"#E8E8E8",textMuted:"#909090",textDim:"#505050",accent:"#5BB8A0",accentGlow:"#1A3530",
    critical:"#E06060",criticalBg:"#3A1818",summary:"#A07AE0",summaryBg:"#20183A",
    milestone:"#E0B040",dep:"#405050",depHi:"#FFE066",rowAlt:"#1E1E1E",
    wine:"#8B2252",wineLight:"#D4547A",wineDim:"#2A0F1A",
    preview:["#1A1A1A","#5BB8A0","#E06060","#A07AE0"],
  },
  "Papel": {
    bg:"#F5F0E8",surface:"#EDE8DC",surface2:"#E5DFD0",border:"#C8BEA8",borderBright:"#A89880",
    text:"#2A2018",textMuted:"#6A5840",textDim:"#A89878",accent:"#1A5FAA",accentGlow:"#D0E4F8",
    critical:"#B83020",criticalBg:"#F8DDD8",summary:"#7040A0",summaryBg:"#EAE0F5",
    milestone:"#A06010",dep:"#8090B0",depHi:"#E08020",rowAlt:"#EDE5D5",
    wine:"#8B2252",wineLight:"#A03060",wineDim:"#F0D8E0",
    preview:["#F5F0E8","#1A5FAA","#B83020","#7040A0"],
  },
  "Oceano": {
    bg:"#030D1A",surface:"#061828",surface2:"#0A2035",border:"#0E3050",borderBright:"#1A4870",
    text:"#C8E8FF",textMuted:"#6090B8",textDim:"#2A5070",accent:"#00B8D9",accentGlow:"#003848",
    critical:"#FF5577",criticalBg:"#380018",summary:"#40BFAA",summaryBg:"#0A2828",
    milestone:"#FFB830",dep:"#1A4868",depHi:"#00FFD0",rowAlt:"#050F20",
    wine:"#8B2252",wineLight:"#D4547A",wineDim:"#2A0812",
    preview:["#030D1A","#00B8D9","#FF5577","#40BFAA"],
  },
  "Bosque": {
    bg:"#080F08",surface:"#101810",surface2:"#162016",border:"#223022",borderBright:"#345034",
    text:"#D4E8D0",textMuted:"#7A9870",textDim:"#3A5038",accent:"#60CC70",accentGlow:"#183820",
    critical:"#E08840",criticalBg:"#382010",summary:"#80C0A0",summaryBg:"#182820",
    milestone:"#E8D040",dep:"#2A5030",depHi:"#A8FF80",rowAlt:"#0C140C",
    wine:"#8B2252",wineLight:"#D4547A",wineDim:"#200A10",
    preview:["#080F08","#60CC70","#E08840","#80C0A0"],
  },
  "Aurora": {
    bg:"#0A0818",surface:"#120F28",surface2:"#181535",border:"#28204A",borderBright:"#3A3068",
    text:"#E8E0FF",textMuted:"#8878C0",textDim:"#3A3060",accent:"#A070FF",accentGlow:"#28186A",
    critical:"#FF6090",criticalBg:"#380020",summary:"#60D0E0",summaryBg:"#102030",
    milestone:"#FFD060",dep:"#302860",depHi:"#E0A0FF",rowAlt:"#0E0C20",
    wine:"#8B2252",wineLight:"#D4547A",wineDim:"#250A20",
    preview:["#0A0818","#A070FF","#FF6090","#60D0E0"],
  },
  "Desierto": {
    bg:"#1A1008",surface:"#241808",surface2:"#2E2010",border:"#4A3418",borderBright:"#6A5030",
    text:"#F0E0C0",textMuted:"#A08858",textDim:"#5A4028",accent:"#E09040",accentGlow:"#3A2010",
    critical:"#E04830",criticalBg:"#380E08",summary:"#C08850",summaryBg:"#302010",
    milestone:"#F0C840",dep:"#5A4020",depHi:"#FFE090",rowAlt:"#1E1408",
    wine:"#8B2252",wineLight:"#D4547A",wineDim:"#2A0A12",
    preview:["#1A1008","#E09040","#E04830","#C08850"],
  },
};
const DEFAULT_THEME = "Cosmos";

const ROW_H = 38, BAR_H = 20, BAR_OFF = (ROW_H - BAR_H) / 2, HDR_H = 60, SIDE_W = 300;
const ZOOM_COL = { day: 30, week: 90, month: 130 };

function addDays(d, n) { return new Date(+d + n * DAY); }
function diffDays(a, b) { return Math.round((b - a) / DAY); }
function isWeekend(d) { const w = d.getDay(); return w === 0 || w === 6; }

function getWeekNum(d) {
  const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = dt.getUTCDay() || 7;
  dt.setUTCDate(dt.getUTCDate() + 4 - day);
  const ys = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
  return Math.ceil(((dt - ys) / DAY + 1) / 7);
}

function genCols(start, end, zoom) {
  const cols = [];
  let cur = new Date(start); cur.setHours(0,0,0,0);
  const fin = new Date(end); fin.setHours(23,59,59,999);
  if (zoom === "day") {
    while (cur <= fin) {
      cols.push({ date: new Date(cur), w: ZOOM_COL.day, isWE: isWeekend(cur), label: cur.getDate(), sub: ["D","L","M","X","J","V","S"][cur.getDay()] });
      cur = addDays(cur, 1);
    }
  } else if (zoom === "week") {
    const tmp = new Date(cur); const dow = tmp.getDay();
    tmp.setDate(tmp.getDate() - (dow === 0 ? 6 : dow - 1)); cur = tmp;
    while (cur <= fin) {
      cols.push({ date: new Date(cur), w: ZOOM_COL.week, isWE: false, label: `S${getWeekNum(cur)}`, sub: `${cur.getDate()}/${cur.getMonth()+1}` });
      cur = addDays(cur, 7);
    }
  } else {
    while (cur <= fin) {
      const y = cur.getFullYear(), m = cur.getMonth();
      cols.push({ date: new Date(cur), w: ZOOM_COL.month, isWE: false, label: cur.toLocaleDateString("es",{month:"short"}).toUpperCase(), sub: y });
      cur = new Date(y, m+1, 1);
    }
  }
  return cols;
}

function colsToX(cols) { let x = 0; return cols.map(c => { const r={...c,x}; x+=c.w; return r; }); }

function computeXMap(tasks, cols, totalW) {
  if (!cols.length || !totalW) return {};
  const first = new Date(cols[0].date); first.setHours(0,0,0,0);
  const lastCol = cols[cols.length-1];
  const extDays = lastCol.w === ZOOM_COL.day ? 1 : lastCol.w === ZOOM_COL.week ? 7 : 31;
  const last = new Date(lastCol.date); last.setDate(last.getDate() + extDays);
  const range = last - first || 1;
  const xOf = d => { const dt = new Date(d); dt.setHours(0,0,0,0); return Math.round(((dt - first) / range) * totalW); };
  const m = {};
  for (const t of tasks) m[t.uid] = { x: xOf(t.start), w: Math.max(6, xOf(t.finish) - xOf(t.start)) };
  m._xOf = xOf;
  return m;
}

function toInputDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function fmtDisplay(d) { return d.toLocaleDateString("es-AR", { day:"2-digit", month:"short", year:"numeric" }); }

export default function GanttApp() {
  const [themeName, setThemeName] = useState(DEFAULT_THEME);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const C = THEMES[themeName];
  const [rawTasks, setRawTasks] = useState(EMBEDDED_TASKS);
  const [assignments, setAssignments] = useState(EMBEDDED_ASSIGNMENTS);
  const [fileName, setFileName] = useState("Gantt_2.xml");
  const originalStart = useMemo(() => getEarliestStart(rawTasks), [rawTasks]);
  const [customStartStr, setCustomStartStr] = useState(() => toInputDate(getEarliestStart(EMBEDDED_TASKS)));

  const tasks = useMemo(() => {
    const customStart = new Date(customStartStr + "T00:00:00");
    const offsetDays = diffDays(originalStart, customStart);
    return shiftTasks(rawTasks, offsetDays);
  }, [rawTasks, customStartStr, originalStart]);

  const shiftedEnd = useMemo(() => {
    if (!tasks.length) return null;
    let e = tasks[0].finish;
    for (const t of tasks) if (t.finish > e) e = t.finish;
    return e;
  }, [tasks]);

  const offsetDays = useMemo(() => {
    const cs = new Date(customStartStr + "T00:00:00");
    return diffDays(originalStart, cs);
  }, [customStartStr, originalStart]);

  const [zoom, setZoom] = useState("week");
  const [colScale, setColScale] = useState(1.0); // visual zoom multiplier 0.4 – 4.0
  const [selected, setSelected] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [showDeps, setShowDeps] = useState(true);
  const [highlightCritical, setHighlightCritical] = useState(false);
  const chartRef = useRef(null);
  const sideRef = useRef(null);
  const fileRef = useRef(null);
  const scrollingRef = useRef(false);

  const { projectStart, projectEnd } = useMemo(() => {
    if (!tasks.length) return { projectStart: new Date(), projectEnd: new Date() };
    let s = tasks[0].start, e = tasks[0].finish;
    for (const t of tasks) { if (t.start < s) s = t.start; if (t.finish > e) e = t.finish; }
    const ps = new Date(s); ps.setDate(ps.getDate() - 5);
    const pe = new Date(e); pe.setDate(pe.getDate() + 10);
    return { projectStart: ps, projectEnd: pe };
  }, [tasks]);

  const cols = useMemo(() => genCols(projectStart, projectEnd, zoom), [projectStart, projectEnd, zoom]);
  const colsX = useMemo(() => colsToX(cols), [cols]);
  const totalW = useMemo(() => Math.round((colsX.reduce((a,c) => a+c.w, 0) || 1) * colScale), [colsX, colScale]);
  const xMap = useMemo(() => computeXMap(tasks, cols, totalW), [tasks, cols, totalW]);
  // Column headers scaled for SVG rendering
  const scaledColsX = useMemo(() => colsX.map(c=>({...c, x:Math.round(c.x*colScale), w:Math.round(c.w*colScale)})), [colsX, colScale]);
  const uidMap = useMemo(() => { const m={}; for (const t of tasks) m[t.uid]=t; return m; }, [tasks]);

  const allDeps = useMemo(() => {
    const d = [];
    for (const t of tasks) for (const p of t.predecessors) if (uidMap[p.predUID]) d.push({from:p.predUID,to:t.uid});
    return d;
  }, [tasks, uidMap]);

  const selDeps = useMemo(() => {
    if (!selected) return new Set();
    const s = new Set();
    for (const {from,to} of allDeps) if (from===selected||to===selected) s.add(`${from}-${to}`);
    return s;
  }, [selected, allDeps]);

  const handleFile = useCallback((file) => {
    if (!file || !file.name.endsWith(".xml")) return;
    setFileName(file.name);
    const r = new FileReader();
    r.onload = (e) => {
      try {
        const parsed = parseMSProjectXML(e.target.result);
        if (!parsed.length) { alert("No se encontraron tareas en el XML."); return; }
        setRawTasks(parsed);
        setAssignments(parseMSProjectResources(e.target.result));
        const es = getEarliestStart(parsed);
        setCustomStartStr(toInputDate(es));
        setSelected(null);
      } catch(err) { alert("Error: " + err.message); }
    };
    r.readAsText(file);
  }, []);

  const SVG_H = HDR_H + tasks.length * ROW_H + 20;
  const getRowY = i => HDR_H + i * ROW_H;
  const getBarY = i => getRowY(i) + BAR_OFF;
  const getTaskIdx = uid => tasks.findIndex(t => t.uid === uid);

  const projectDurationDays = useMemo(() => {
    if (!tasks.length) return 0;
    let s=tasks[0].start, e=tasks[0].finish;
    for (const t of tasks) { if(t.start<s)s=t.start; if(t.finish>e)e=t.finish; }
    return diffDays(s, e);
  }, [tasks]);

  function renderDep(dep, i) {
    const {from,to} = dep;
    const fi = getTaskIdx(from), ti = getTaskIdx(to);
    if (fi<0||ti<0||!xMap[from]||!xMap[to]) return null;
    const isHi = selDeps.has(`${from}-${to}`);
    const isDim = selected && !isHi;
    const color = isHi ? C.depHi : C.dep;
    const x1=xMap[from].x+xMap[from].w, y1=getBarY(fi)+BAR_H/2;
    const x2=xMap[to].x, y2=getBarY(ti)+BAR_H/2;
    const isCriticalDep = highlightCritical && uidMap[from]?.isCritical && uidMap[to]?.isCritical;
    const depDimmed = (isDim) || (highlightCritical && !isCriticalDep);
    return (
      <g key={i} opacity={depDimmed?0.06:isCriticalDep?1:isHi?1:0.5} style={{pointerEvents:"none"}}>
        <path d={`M${x1},${y1} H${x1+14} V${y2} H${x2}`} fill="none"
          stroke={isCriticalDep?C.critical:color}
          strokeWidth={isCriticalDep?2.5:isHi?2.5:1.5} markerEnd={`url(#arr${isHi||isCriticalDep?"H":"L"})`} />
      </g>
    );
  }

  function renderBar(task, ri) {
    if (!xMap[task.uid]) return null;
    const {x,w} = xMap[task.uid];
    const y = getBarY(ri);
    const isSel = task.uid === selected;
    // Critical highlight mode: dim non-critical, glow critical
    const isDimmedByCritical = highlightCritical && !task.isCritical;
    const isGlowingCritical = highlightCritical && task.isCritical;
    let fill = task.isCritical ? C.criticalBg : task.isSummary ? C.summaryBg : C.accentGlow;
    let stroke = task.isCritical ? C.critical : task.isSummary ? C.summary : C.accent;
    if (task.isMilestone) { fill="#2A1A00"; stroke=C.milestone; }

    if (task.isMilestone) {
      const cx=x, cy=y+BAR_H/2, r=9;
      return (
        <g key={task.uid} style={{cursor:"pointer",opacity:isDimmedByCritical?0.15:1,transition:"opacity 0.3s"}}
          onClick={()=>setSelected(task.uid===selected?null:task.uid)}
          onMouseEnter={e=>setTooltip({task,mx:e.clientX,my:e.clientY})}
          onMouseLeave={()=>setTooltip(null)}>
          {isSel&&<polygon points={`${cx},${cy-r-4} ${cx+r+4},${cy} ${cx},${cy+r+4} ${cx-r-4},${cy}`} fill="none" stroke={stroke} strokeWidth={1} opacity={0.4}/>}
          <polygon points={`${cx},${cy-r} ${cx+r},${cy} ${cx},${cy+r} ${cx-r},${cy}`} fill={fill} stroke={stroke} strokeWidth={isSel?2.5:1.5}/>
        </g>
      );
    }

    return (
      <g key={task.uid} style={{cursor:"pointer",opacity:isDimmedByCritical?0.15:1,transition:"opacity 0.3s"}}
        onClick={()=>setSelected(task.uid===selected?null:task.uid)}
        onMouseEnter={e=>setTooltip({task,mx:e.clientX,my:e.clientY})}
        onMouseLeave={()=>setTooltip(null)}>
        {isSel&&<rect x={x-3} y={y-3} width={w+6} height={BAR_H+6} rx={7} fill={stroke} opacity={0.15}/>}
        {isGlowingCritical&&!isSel&&<rect x={x-2} y={y-2} width={w+4} height={BAR_H+4} rx={7} fill="none" stroke={C.critical} strokeWidth={2} opacity={0.7} strokeDasharray="4,2"/>}
        <rect x={x+2} y={y+2} width={w} height={BAR_H} rx={task.isSummary?2:5} fill="#000" opacity={0.35}/>
        <rect x={x} y={y} width={w} height={BAR_H} rx={task.isSummary?2:5} fill={fill} stroke={stroke} strokeWidth={isSel?2:1}/>
        {task.isSummary&&<>
          <polygon points={`${x},${y+BAR_H} ${x+7},${y+BAR_H+6} ${x+14},${y+BAR_H}`} fill={stroke} opacity={0.8}/>
          <polygon points={`${x+w},${y+BAR_H} ${x+w-7},${y+BAR_H+6} ${x+w-14},${y+BAR_H}`} fill={stroke} opacity={0.8}/>
        </>}
        {/* Resource avatar circles on the bar */}
        {(() => {
          const members = assignments[String(task.uid)] || [];
          const maxShow = Math.floor((w - 8) / 16);
          const show = members.slice(0, Math.max(0, maxShow));
          return show.map((r, i) => {
            const rc = getResColor(r);
            return (
              <g key={r} style={{pointerEvents:"none"}}>
                <circle cx={x + w - 8 - i * 14} cy={y + BAR_H/2} r={7} fill={rc.bg} stroke={stroke} strokeWidth={0.8}/>
                <text x={x + w - 8 - i * 14} y={y + BAR_H/2 + 3.5} textAnchor="middle"
                  fontSize={6} fontWeight={700} fill={rc.text} fontFamily="monospace"
                  style={{pointerEvents:"none",userSelect:"none"}}>{rc.short}</text>
              </g>
            );
          });
        })()}
        {w>60&&(assignments[String(task.uid)]||[]).length===0&&(
          <text x={x+6} y={y+BAR_H-5} fontSize={9} fill="#fff" fontFamily="'IBM Plex Mono',monospace"
            opacity={0.5} style={{pointerEvents:"none",userSelect:"none"}}>
            {task.finish.toLocaleDateString("es-AR",{day:"2-digit",month:"short"})}
          </text>
        )}
      </g>
    );
  }

  const isShifted = offsetDays !== 0;

  return (
    <div onClick={(e)=>{if(showThemePicker&&!e.target.closest('[data-theme-panel]'))setShowThemePicker(false);}} style={{width:"100%",height:"100vh",background:C.bg,color:C.text,fontFamily:"'IBM Plex Mono',monospace",display:"flex",flexDirection:"column",overflow:"hidden",userSelect:"none",position:"relative"}}>

      {/* ── Top Bar ── */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 14px",height:54,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>

        {/* Brand */}
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <svg width={30} height={30} viewBox="0 0 30 30" fill="none">
            <rect width={30} height={30} rx={7} fill={C.wine}/>
            <ellipse cx={15} cy={11} rx={4.5} ry={5} fill="white" opacity={0.15}/>
            <path d="M11 11 Q15 21 19 11" stroke="white" strokeWidth={1.8} fill={C.wine} opacity={0.9}/>
            <circle cx={15} cy={8} r={2.5} fill="white" opacity={0.9}/>
            <rect x={13} y={21} width={4} height={5} rx={1} fill="white" opacity={0.6}/>
            <rect x={10} y={25} width={10} height={2} rx={1} fill="white" opacity={0.4}/>
          </svg>
          <div>
            <div style={{fontSize:15,fontWeight:800,letterSpacing:"0.04em",color:C.text,lineHeight:1.1}}>
              WineData <span style={{color:C.wineLight,fontWeight:400}}>·</span> <span style={{color:C.wineLight}}>Gantt</span>
            </div>
            <div style={{fontSize:8,color:C.textDim,letterSpacing:"0.14em",textTransform:"uppercase"}}>Planificación de Proyecto</div>
          </div>
        </div>

        <div style={{width:1,height:34,background:C.border,margin:"0 2px"}}/>

        {fileName&&<span style={{fontSize:10,color:C.textMuted,background:C.surface2,padding:"3px 9px",borderRadius:4,border:`1px solid ${C.border}`}}>
          📄 {fileName} <span style={{color:C.accent}}>· {tasks.length} tareas · {projectDurationDays}d</span>
        </span>}

        <div style={{flex:1}}/>

        {/* ── Date Shift Panel ── */}
        <div style={{display:"flex",alignItems:"center",gap:10,background:C.wineDim,border:`1px solid ${C.wine}66`,borderRadius:9,padding:"5px 14px"}}>
          <div>
            <div style={{fontSize:8,color:C.wineLight,letterSpacing:"0.14em",marginBottom:2}}>INICIAR PLANIFICACIÓN EL</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <input type="date" value={customStartStr}
                onChange={e => { if(e.target.value) setCustomStartStr(e.target.value); }}
                style={{background:C.surface2,border:`1px solid ${C.wineLight}`,borderRadius:5,color:C.text,
                  padding:"4px 8px",fontSize:12,fontFamily:"inherit",cursor:"pointer",outline:"none",
                  colorScheme:themeName==="Papel"?"light":"dark",fontWeight:700}}/>
              {isShifted&&(
                <button onClick={()=>setCustomStartStr(toInputDate(originalStart))}
                  title="Restaurar fecha original del archivo"
                  style={{fontSize:9,padding:"3px 9px",background:"transparent",color:C.wineLight,
                    border:`1px solid ${C.wine}`,borderRadius:4,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
                  ↺ restaurar
                </button>
              )}
            </div>
          </div>
          {shiftedEnd&&(
            <div style={{borderLeft:`1px solid ${C.wine}44`,paddingLeft:10}}>
              <div style={{fontSize:8,color:C.textDim,letterSpacing:"0.12em",marginBottom:2}}>FIN ESTIMADO</div>
              <div style={{fontSize:12,color:C.wineLight,fontWeight:700}}>{fmtDisplay(shiftedEnd)}</div>
            </div>
          )}
          {isShifted&&(
            <div style={{borderLeft:`1px solid ${C.wine}44`,paddingLeft:10}}>
              <div style={{fontSize:8,color:C.textDim,letterSpacing:"0.12em",marginBottom:2}}>DESPLAZAMIENTO</div>
              <div style={{fontSize:12,fontWeight:700,color:offsetDays>0?C.wineLight:C.accent}}>
                {offsetDays>0?"+":""}{offsetDays}d
              </div>
            </div>
          )}
        </div>

        <div style={{width:1,height:34,background:C.border}}/>

        {/* Critical path highlight */}
        <button onClick={()=>setHighlightCritical(h=>!h)} title="Resaltar ruta crítica"
          style={{padding:"4px 11px",background:highlightCritical?"#3D1515":"transparent",
            color:highlightCritical?C.critical:C.textMuted,
            border:`1px solid ${highlightCritical?C.critical:C.border}`,
            borderRadius:5,cursor:"pointer",fontSize:10,fontFamily:"inherit",
            boxShadow:highlightCritical?`0 0 10px ${C.critical}55`:undefined,
            transition:"all 0.2s"}}>
          ⚠ CRÍTICA
        </button>

        {/* Deps toggle */}
        <button onClick={()=>setShowDeps(!showDeps)}
          style={{padding:"4px 11px",background:showDeps?C.accentGlow:"transparent",color:showDeps?C.accent:C.textMuted,
            border:`1px solid ${showDeps?C.accent:C.border}`,borderRadius:5,cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>
          🔗 {showDeps?"ON":"OFF"}
        </button>

        {/* Zoom mode pills */}
        <div style={{display:"flex",gap:2,background:C.bg,borderRadius:6,padding:3,border:`1px solid ${C.border}`}}>
          {[["day","DÍAS"],["week","SEM"],["month","MES"]].map(([z,l])=>(
            <button key={z} onClick={()=>setZoom(z)}
              style={{padding:"3px 11px",borderRadius:4,border:"none",cursor:"pointer",fontSize:10,
                fontFamily:"inherit",fontWeight:zoom===z?700:400,
                background:zoom===z?C.accentGlow:"transparent",color:zoom===z?C.accent:C.textMuted,letterSpacing:"0.06em"}}>
              {l}
            </button>
          ))}
        </div>

        {/* Visual zoom +/- */}
        <div style={{display:"flex",alignItems:"center",gap:4,background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,padding:"3px 6px"}}>
          <button onClick={()=>setColScale(s=>Math.max(0.3,+(s-0.15).toFixed(2)))}
            style={{width:22,height:22,borderRadius:4,border:"none",cursor:"pointer",background:"transparent",
              color:colScale<=0.3?C.textDim:C.textMuted,fontSize:16,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>
            −
          </button>
          <span style={{fontSize:10,color:C.textMuted,minWidth:34,textAlign:"center",cursor:"default"}}
            title="Ctrl+Rueda del ratón para zoom" onClick={()=>setColScale(1)}>
            {Math.round(colScale*100)}%
          </span>
          <button onClick={()=>setColScale(s=>Math.min(4,+(s+0.15).toFixed(2)))}
            style={{width:22,height:22,borderRadius:4,border:"none",cursor:"pointer",background:"transparent",
              color:colScale>=4?C.textDim:C.textMuted,fontSize:16,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>
            +
          </button>
        </div>

        {/* Theme picker button */}
        <button data-theme-panel="1" onClick={(e)=>{e.stopPropagation();setShowThemePicker(p=>!p);}} title="Cambiar tema de color"
          style={{position:"relative",padding:"5px 13px",background:showThemePicker?C.accentGlow:"transparent",
            color:showThemePicker?C.accent:C.textMuted,border:`1px solid ${showThemePicker?C.accent:C.border}`,
            borderRadius:6,cursor:"pointer",fontSize:10,fontFamily:"inherit",letterSpacing:"0.06em",
            display:"flex",alignItems:"center",gap:6}}>
          <span style={{display:"flex",gap:3}}>
            {THEMES[themeName].preview.map((col,i)=>(
              <span key={i} style={{width:8,height:8,borderRadius:"50%",background:col,display:"inline-block",border:`1px solid ${C.borderBright}`}}/>
            ))}
          </span>
          TEMA
        </button>


      </div>

      {/* ── Theme Picker Panel ── */}
      {showThemePicker&&(
        <div data-theme-panel="1" onClick={e=>e.stopPropagation()} style={{position:"absolute",top:54,right:0,zIndex:500,background:C.surface,
          border:`1px solid ${C.borderBright}`,borderRadius:"0 0 12px 12px",padding:"16px 18px",
          boxShadow:`0 16px 48px rgba(0,0,0,0.7)`,minWidth:320}}>
          <div style={{fontSize:10,color:C.textDim,letterSpacing:"0.14em",marginBottom:12,textTransform:"uppercase"}}>
            Seleccionar tema de color
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {Object.entries(THEMES).map(([name,theme])=>{
              const isActive = name === themeName;
              return (
                <button key={name} onClick={()=>{setThemeName(name);setShowThemePicker(false);}}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",
                    background:isActive?`${C.accentGlow}`:`${theme.bg}`,
                    border:`1px solid ${isActive?C.accent:C.border}`,borderRadius:8,cursor:"pointer",
                    textAlign:"left",transition:"all 0.15s",boxShadow:isActive?`0 0 0 1px ${C.accent}`:undefined}}>
                  {/* Color preview swatches */}
                  <div style={{display:"flex",flexDirection:"column",gap:3,flexShrink:0}}>
                    <div style={{display:"flex",gap:3}}>
                      {theme.preview.slice(0,2).map((col,i)=>(
                        <div key={i} style={{width:14,height:14,borderRadius:3,background:col,border:`1px solid rgba(255,255,255,0.15)`}}/>
                      ))}
                    </div>
                    <div style={{display:"flex",gap:3}}>
                      {theme.preview.slice(2,4).map((col,i)=>(
                        <div key={i} style={{width:14,height:14,borderRadius:3,background:col,border:`1px solid rgba(255,255,255,0.15)`}}/>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize:11,fontWeight:isActive?700:500,color:isActive?C.accent:theme.text,fontFamily:"inherit",lineHeight:1}}>
                      {name}
                    </div>
                    {isActive&&<div style={{fontSize:8,color:C.accent,marginTop:3,letterSpacing:"0.1em"}}>ACTIVO</div>}
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{marginTop:12,paddingTop:10,borderTop:`1px solid ${C.border}`,fontSize:9,color:C.textDim,textAlign:"center"}}>
            Clic fuera para cerrar
          </div>
        </div>
      )}

      {/* ── Legend / status bar ── */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"5px 16px",display:"flex",gap:16,alignItems:"center",flexShrink:0,minHeight:32}}>
        {[[C.accent,"Normal"],[C.critical,"Ruta Crítica"],[C.summary,"Resumen"],[C.milestone,"Hito"]].map(([color,lbl])=>(
          <div key={lbl} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:C.textMuted}}>
            <div style={{width:13,height:7,background:color,borderRadius:2,opacity:0.85}}/>{lbl}
          </div>
        ))}
        {highlightCritical&&(
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:10,color:C.critical,
            background:C.criticalBg,border:`1px solid ${C.critical}55`,borderRadius:4,padding:"2px 10px",
            animation:"pulse 1.5s ease-in-out infinite",fontWeight:700,letterSpacing:"0.06em"}}>
            ⚠ RUTA CRÍTICA ACTIVA — {tasks.filter(t=>t.isCritical).length} tareas
          </div>
        )}
        {isShifted&&(
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:10,color:C.wineLight,
            background:`${C.wine}22`,border:`1px solid ${C.wine}44`,borderRadius:4,padding:"2px 10px"}}>
            ⏱ Todas las tareas desplazadas {offsetDays>0?"+":""}{offsetDays} días
          </div>
        )}
        {selected&&(
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8,fontSize:10,color:C.textMuted}}>
            <span style={{color:C.accent,maxWidth:240,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{uidMap[selected]?.name}</span>
            <span style={{color:C.textDim}}>— {selDeps.size} dep.</span>
            <button onClick={()=>setSelected(null)}
              style={{padding:"1px 7px",background:"transparent",color:C.textMuted,border:`1px solid ${C.border}`,borderRadius:3,cursor:"pointer",fontSize:9,fontFamily:"inherit"}}>✕</button>
          </div>
        )}
        <div style={{width:1,height:16,background:C.border,margin:"0 4px"}}/>
        {/* Resource legend */}
        {Object.entries(RESOURCE_COLORS).map(([name,rc])=>(
          <div key={name} title={`${name} — ${getResFullName(name)}`} style={{display:"flex",alignItems:"center",gap:4,cursor:"default"}}>
            <div style={{width:18,height:18,borderRadius:4,background:rc.bg,border:`1px solid ${rc.text}44`,
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:7,fontWeight:700,color:rc.text,fontFamily:"monospace"}}>{rc.short}</span>
            </div>
            <span style={{fontSize:10,color:C.textMuted}}>{name}</span>
          </div>
        ))}
        {!selected&&<div style={{marginLeft:"auto",fontSize:10,color:C.textDim}}>Clic en una tarea para resaltar dependencias</div>}
      </div>

      {/* ── Main layout ── */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}
        onDragOver={e=>{e.preventDefault();setDragging(true);}}
        onDragLeave={()=>setDragging(false)}
        onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0]);}}>

        {dragging&&(
          <div style={{position:"absolute",inset:0,zIndex:100,background:"rgba(139,34,82,0.2)",border:`3px dashed ${C.wine}`,
            display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
            <span style={{fontSize:22,color:C.wineLight,fontWeight:700}}>Suelta el archivo XML aquí</span>
          </div>
        )}

        {/* Sidebar */}
        <div style={{width:SIDE_W,flexShrink:0,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{height:HDR_H,background:C.bg,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"flex-end",padding:"0 12px 10px",flexShrink:0}}>
            <span style={{fontSize:9,color:C.textDim,letterSpacing:"0.12em",textTransform:"uppercase"}}>#&nbsp;&nbsp;Tarea</span>
          </div>
          <div ref={sideRef} style={{flex:1,overflowY:"auto",overflowX:"hidden"}}
            onScroll={e=>{if(!scrollingRef.current){scrollingRef.current=true;if(chartRef.current)chartRef.current.scrollTop=e.target.scrollTop;requestAnimationFrame(()=>{scrollingRef.current=false;});}}}>
            {tasks.map((task,i)=>{
              const isSel=task.uid===selected;
              const indent=(task.outlineLevel-1)*14;
              const isConn=selDeps.size>0&&[...selDeps].some(k=>k.startsWith(`${task.uid}-`)||k.endsWith(`-${task.uid}`));
              return (
                <div key={task.uid} onClick={()=>setSelected(task.uid===selected?null:task.uid)}
                  style={{height:ROW_H,display:"flex",alignItems:"center",padding:`0 8px 0 ${10+indent}px`,
                    background:isSel?`${C.accentGlow}99`:isConn?`${C.dep}33`:i%2===0?"transparent":C.rowAlt,
                    borderLeft:isSel?`3px solid ${C.accent}`:isConn?`3px solid ${C.dep}`:highlightCritical&&task.isCritical?`3px solid ${C.critical}`:"3px solid transparent",
                    opacity:highlightCritical&&!task.isCritical?0.3:1,
                    cursor:"pointer",borderBottom:`1px solid ${C.border}22`,transition:"background 0.1s"}}>
                  <span style={{fontSize:9,color:C.textDim,minWidth:22,flexShrink:0}}>{task.wbs}</span>
                  {task.isSummary&&<span style={{fontSize:8,color:C.summary,marginRight:3}}>▶</span>}
                  {task.isMilestone&&<span style={{fontSize:10,marginRight:3,color:C.milestone}}>◆</span>}
                  <span style={{fontSize:11,flex:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
                    color:isSel?C.accent:task.isCritical?C.critical:task.isSummary?C.summary:task.isMilestone?C.milestone:C.text,
                    fontWeight:task.isSummary?700:400}}>
                    {task.name}
                  </span>
                  {task.isCritical&&<span style={{fontSize:8,color:C.critical,marginLeft:4,flexShrink:0}}>⚠</span>}
                  {/* Resource chips */}
                  <div style={{display:"flex",gap:2,marginLeft:4,flexShrink:0}}>
                    {(assignments[String(task.uid)]||[]).slice(0,3).map(r=>{
                      const rc=getResColor(r);
                      return <span key={r} title={`${r} — ${getResFullName(r)}`} style={{fontSize:7,fontWeight:700,padding:"1px 4px",borderRadius:3,
                        background:rc.bg,color:rc.text,letterSpacing:"0.04em",lineHeight:"14px",cursor:"default"}}>{rc.short}</span>;
                    })}
                    {(assignments[String(task.uid)]||[]).length>3&&(
                      <span style={{fontSize:7,color:C.textDim,padding:"1px 2px"}}>+{(assignments[String(task.uid)]||[]).length-3}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart panel */}
        <div ref={chartRef} style={{flex:1,overflow:"auto"}}
          onScroll={e=>{if(!scrollingRef.current){scrollingRef.current=true;if(sideRef.current)sideRef.current.scrollTop=e.target.scrollTop;requestAnimationFrame(()=>{scrollingRef.current=false;});}}}
          onWheel={e=>{
            if(!e.ctrlKey&&!e.metaKey) return;
            e.preventDefault();
            const delta = e.deltaY>0 ? -0.12 : 0.12;
            setColScale(s=>Math.min(4,Math.max(0.3,+(s+delta).toFixed(2))));
          }}>
          <svg width={totalW} height={SVG_H} style={{display:"block",fontFamily:"'IBM Plex Mono',monospace"}}>
            <defs>
              <marker id="arrL" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L7,3.5z" fill={C.dep}/>
              </marker>
              <marker id="arrH" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L0,8 L8,4z" fill={C.depHi}/>
              </marker>
            </defs>

            {tasks.map((t,i)=>(
              <rect key={`rb${t.uid}`} x={0} y={getRowY(i)} width={totalW} height={ROW_H}
                fill={t.uid===selected?`${C.accentGlow}55`:[...selDeps].some(k=>k.startsWith(`${t.uid}-`)||k.endsWith(`-${t.uid}`))?`${C.dep}18`:i%2===0?"transparent":C.rowAlt}/>
            ))}

            {zoom==="day"&&scaledColsX.filter(c=>c.isWE).map((c,i)=>(
              <rect key={`we${i}`} x={c.x} y={HDR_H} width={c.w} height={SVG_H-HDR_H} fill="#060D18"/>
            ))}

            {scaledColsX.map((c,i)=><line key={`vg${i}`} x1={c.x} y1={0} x2={c.x} y2={SVG_H} stroke={C.border} strokeWidth={0.5}/>)}

            <rect x={0} y={0} width={totalW} height={HDR_H} fill={C.bg}/>
            <line x1={0} y1={HDR_H} x2={totalW} y2={HDR_H} stroke={C.borderBright} strokeWidth={1}/>

            {zoom!=="month"&&(()=>{
              const mg={};
              for (const c of scaledColsX) {
                const k=`${c.date.getFullYear()}-${c.date.getMonth()}`;
                if(!mg[k]) mg[k]={label:c.date.toLocaleDateString("es",{month:"long",year:"numeric"}),x:c.x,endX:c.x};
                mg[k].endX=c.x+c.w;
              }
              return Object.values(mg).map((m,i)=>(
                <g key={i}>
                  <text x={(m.x+m.endX)/2} y={18} textAnchor="middle" fontSize={10} fill={C.textMuted} fontWeight={600} fontFamily="inherit">{m.label.toUpperCase()}</text>
                  <line x1={m.x} y1={0} x2={m.x} y2={HDR_H} stroke={C.borderBright} strokeWidth={1}/>
                </g>
              ));
            })()}

            {scaledColsX.map((c,i)=>(
              <g key={`ch${i}`}>
                <text x={c.x+c.w/2} y={zoom==="month"?28:38} textAnchor="middle" fontSize={zoom==="month"?12:11}
                  fill={c.isWE?C.textDim:C.text} fontWeight={700} fontFamily="inherit">{c.label}</text>
                <text x={c.x+c.w/2} y={zoom==="month"?46:52} textAnchor="middle" fontSize={zoom==="month"?10:9}
                  fill={C.textMuted} fontFamily="inherit">{c.sub}</text>
              </g>
            ))}

            {tasks.map((_,i)=><line key={`hl${i}`} x1={0} y1={getRowY(i)} x2={totalW} y2={getRowY(i)} stroke={C.border} strokeWidth={0.4}/>)}

            {showDeps&&allDeps.map((dep,i)=>renderDep(dep,i))}
            {tasks.map((t,i)=>renderBar(t,i))}
          </svg>
        </div>
      </div>

      {/* ── Tooltip ── */}
      {tooltip&&(
        <div style={{position:"fixed",left:tooltip.mx+14,top:tooltip.my-12,zIndex:9999,pointerEvents:"none",
          background:C.surface,border:`1px solid ${C.borderBright}`,borderRadius:10,padding:"12px 16px",
          minWidth:240,boxShadow:"0 12px 40px rgba(0,0,0,0.7)"}}>
          <div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:8,paddingBottom:7,borderBottom:`1px solid ${C.border}`,lineHeight:1.4}}>
            {tooltip.task.name}
          </div>
          <div style={{fontSize:11,color:C.textMuted,lineHeight:1.9}}>
            <div>📅 <span style={{color:C.text}}>Inicio:</span> {fmtDisplay(tooltip.task.start)}</div>
            <div>🏁 <span style={{color:C.text}}>Fin:</span> {fmtDisplay(tooltip.task.finish)}</div>
            <div>⏱ <span style={{color:C.text}}>Duración:</span> {diffDays(tooltip.task.start,tooltip.task.finish)} días</div>
            {tooltip.task.predecessors.length>0&&(
              <div>🔗 <span style={{color:C.text}}>Predec.:</span> {tooltip.task.predecessors.map(p=>p.predUID).join(", ")}</div>
            )}
            {(assignments[String(tooltip.task.uid)]||[]).length>0&&(
              <div style={{marginTop:6,paddingTop:6,borderTop:`1px solid ${C.border}`}}>
                <div style={{fontSize:9,color:C.textDim,letterSpacing:"0.1em",marginBottom:5}}>EQUIPO ASIGNADO</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {(assignments[String(tooltip.task.uid)]||[]).map(r=>{
                    const rc=getResColor(r);
                    return (
                      <span key={r} style={{display:"inline-flex",alignItems:"center",gap:4,
                        padding:"3px 8px",borderRadius:5,background:rc.bg,border:`1px solid ${rc.text}44`}}>
                        <span style={{fontSize:9,fontWeight:700,color:rc.text,fontFamily:"monospace"}}>{rc.short}</span>
                        <span style={{fontSize:10,color:rc.text,opacity:0.9}}>{getResFullName(r)}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
            {tooltip.task.isCritical&&<span style={{fontSize:9,padding:"2px 8px",background:C.criticalBg,color:C.critical,borderRadius:4,border:`1px solid ${C.critical}44`}}>⚠ RUTA CRÍTICA</span>}
            {tooltip.task.isSummary&&<span style={{fontSize:9,padding:"2px 8px",background:C.summaryBg,color:C.summary,borderRadius:4,border:`1px solid ${C.summary}44`}}>📁 RESUMEN</span>}
            {tooltip.task.isMilestone&&<span style={{fontSize:9,padding:"2px 8px",background:"#2A1A00",color:C.milestone,borderRadius:4,border:`1px solid ${C.milestone}44`}}>◆ HITO</span>}
          </div>
        </div>
      )}
    </div>
  );
}