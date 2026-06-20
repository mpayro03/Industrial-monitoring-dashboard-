function fmtNumero(n) {
    if (n === null || n === undefined) {
        return '—';
    }
    return n.toLocaleString('en-US');
}

function fmtPct(n) {
    if (n === null || n === undefined) {
        return '—';
    }
    return `${Math.round(n * 10) / 10}%`;
}

function fmtTemp(n) {
    if (n === null || n === undefined) {
        return '—';
    }
    return `${Math.round(n * 10) / 10}°C`;
}

// CLASIFICADORES (para asignar clases CSS según rangos de valor)
function clasificarOEE(oee) {
    if (oee >= 85) {
        return 'oee-bueno';
    } else if (oee >= 70) {
        return 'oee-regular';
    } else {
        return 'oee-malo';
    }
}

function clasificarTemp(temp, limite) {
    if (limite === null || limite === undefined || temp === null) {
        return 'temp-safe';
    }
    
    const ratio = temp / limite;
    
    if (ratio >= 1.0) {
        return 'temp-critical';
    } else if (ratio >= 0.90) {
        return 'temp-warning';
    } else {
        return 'temp-safe';
    }
}

function claseStatus(status) {
    const mapa = {
        'RUNNING': { clase: 'status-running', etiqueta: 'Running' },
        'IDLE': { clase: 'status-idle', etiqueta: 'Idle' },
        'FAULT': { clase: 'status-fault', etiqueta: 'Fault' },
        'MAINTENANCE': { clase: 'status-maint', etiqueta: 'Maintenance' },
    };
    return mapa[status] || { clase: '', etiqueta: status };
}

function iconoAlerta(nivel) {
    const iconos = {
        CRITICAL: '⚠',
        WARNING: '⚡',
        INFO: 'ℹ',
        OK: '✓',
    };
    return iconos[nivel] || 'ℹ';
}

// RENDER: KPIs
function renderKPIs(kpis) {
    const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };
    
    set('heroUnidades',  fmtNumero(kpis.unidades));
    set('heroTurno',     fmtNumero(kpis.meta));
    set('heroGrado',     fmtPct(kpis.cumplimiento));
    set('overOEE',       Math.round(kpis.oee * 10) / 10);
    set('overCapacity',  Math.round(kpis.utilizacion * 10) / 10);
    set('overHours',     kpis.horas.toFixed(1));
    set('updated-id',    new Date().toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    }));
    
    const oeeEl = document.getElementById('overOEE');
    if (oeeEl) {
        oeeEl.className = `estado-tarj-val ${clasificarOEE(kpis.oee)}`;
    }
}

// RENDER: Panel ambiental
function renderAmbiente(amb) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  set('temp-fila',    fmtTemp(amb.temp));
  set('humedad-fila', `${amb.humedad}%`);
  set('ruido-fila',   `${amb.ruido} dB`);
  set('energ-fila',   `${amb.energia} kW`);
  set('aire-fila',    amb.aire);
}

// RENDER: Información operativa
function renderOperativo(kpis, maquinas) {
    const activas = maquinas.filter(m => m.status === 'RUNNING').length;
    const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };
    set('maquina-fila', `${activas} / ${maquinas.length}`);
    set('turno-fila',   `${kpis.horas.toFixed(1)}h`);
    set('paros-fila',   kpis.paros);
}

// RENDER: MÁQUINAS MINI (tarjeta home) 
function renderMaquinasMini(maquinas, area) {
    const contenedor = document.getElementById('estado-maquina');
    if (!contenedor) {
        return;
    }
    
    let filtradas;
    if (area === 'all') {
        filtradas = maquinas;
    } else {
        filtradas = maquinas.filter(m => m.area === area);
    }
    
    const visibles = filtradas.slice(0, 4);
    let html = '';
    
    for (const m of visibles) {
        const { etiqueta, clase } = claseStatus(m.status);
        
        let claseOEE = '';
        if (m.eficiencia > 0) {
            claseOEE = clasificarOEE(m.eficiencia);
        }
        
        let bloqueEficiencia;
        if (m.eficiencia > 0) {
            bloqueEficiencia = `
                <div class="maquina-mini-eff">
                    <div class="mini-barra">
                        <div class="mini-barra-fill ${claseOEE}"
                            style="width:${m.eficiencia}%">
                        </div>
                    </div>
                    <span>${Math.round(m.eficiencia)}%</span>
                </div>
            `;
        } else {
            bloqueEficiencia = '<div class="maquina-mini-eff" style="color:var(--texto-muted)">—</div>';
        }
            
        html += `
            <div class="maquina-mini">
                <div class="maquina-mini-id">${m.id}</div>
                <div class="maquina-mini-status ${clase}">${etiqueta}</div>
                ${bloqueEficiencia}
            </div>
        `;
    }

    contenedor.innerHTML = html;
}

// RENDER: MÁQUINAS COMPLETO (vista machines)
function renderMaquinasCompleto(maquinas, area) {
    const contenedor = document.getElementById('maquinas-grid');
    if (!contenedor) {
        return;
    }
    
    let filtradas;
    if (area === 'all') {
        filtradas = maquinas;
    } else {
        filtradas = maquinas.filter(m => m.area === area);
    }
    
    const subtitulo = document.getElementById('machines-subtitulo');
    if (subtitulo) {
        let nombreArea;
        if (area === 'all') {
            nombreArea = 'All areas';
        } else {
            nombreArea = area;
        }
        subtitulo.textContent = `Shift ${store.get('turnoActual')} — ${nombreArea}`;
    }
    
    let html = '';

    for (const m of filtradas) {
        const { clase, etiqueta } = claseStatus(m.status);
        
        let claseOEE = '';
        if (m.eficiencia > 0) {
            claseOEE = clasificarOEE(m.eficiencia);
        }
        
        const claseTemp = clasificarTemp(m.temp, m.limite_temp);
        let dotClase;
        const statusMin = m.status.toLowerCase();
        if (statusMin === 'fault') {
            dotClase = 'fault';
        } else if (statusMin === 'running') {
            dotClase = 'running';
        } else if (statusMin === 'idle') {
            dotClase = 'idle';
        } else {
            dotClase = 'maintenance';
        }
        
        let claseFalla = '';
        if (m.status === 'FAULT') {
            claseFalla = 'fault';
        }
        
        let bloqueEficiencia;
        
        if (m.eficiencia > 0) {
            bloqueEficiencia = `
                <div class="maquina-metrica">
                    <span class="maquina-metrica-label">Efficiency</span>
                    <span class="maquina-metrica-val ${claseOEE}">
                        ${Math.round(m.eficiencia * 10) / 10}%
                    </span>
                </div>
                <div class="eff-barra">
                    <div class="eff-barra-fill ${claseOEE}"
                        style="width:${m.eficiencia}%">
                    </div>
                </div>
            `;
        } else {
            bloqueEficiencia = `
                <div class="maquina-metrica">
                    <span class="maquina-metrica-label">Efficiency</span>
                    <span class="maquina-metrica-val" style="color:var(--texto-muted)">—</span>
                </div>
            `;
        }
        
        let bloqueTemp = '';
        if (m.temp !== null) {
            let limiteTexto = '';
            if (m.limite_temp) {
                limiteTexto = `/ ${m.limite_temp}°C`;
            }
            bloqueTemp = `
                <div class="maquina-metrica">
                    <span class="maquina-metrica-label">Temperature</span>
                    <span class="maquina-metrica-val ${claseTemp}">
                        ${fmtTemp(m.temp)} ${limiteTexto}
                    </span>
                </div>
            `;
        }
        
        html += `
            <article class="maquina-card ${claseFalla}">
                <div class="maquina-card-header">
                    <div>
                        <div class="maquina-card-id">${m.id}</div>
                        <div class="maquina-card-nombre">${m.nombre}</div>
                    </div>
                    <span class="status-pill ${clase}">${etiqueta}</span>
                </div>
                <div class="maquina-card-area">${m.area}</div>
                
                ${bloqueEficiencia}
                ${bloqueTemp}
                
                <div class="maquina-evento">
                    <span class="evento-dot ${dotClase}"></span>
                    <span>${m.ultimo_evento}</span>
                </div>
            </article>
        `;
    }
    
    contenedor.innerHTML = html;
}

// RENDER: TEMPERATURAS
function renderTemperaturas(temps) {
    const contenedor = document.getElementById('temp-body');
    if (!contenedor) {
        return;
    }
    
    let html = '';
    
    for (const t of temps) {
        const cls = clasificarTemp(t.temp, t.limite);
        
        let pct;
        if (t.limite) {
            pct = Math.min(100, Math.round((t.temp / t.limite) * 100));
        } else {
            pct = 50;
        }
        
        html += `
            <div class="temp-fila">
                <span class="temp-zona">${t.zona}</span>
                <div class="temp-barra">
                <div class="temp-barra-fill ${cls}" style="width:${pct}%"></div>
            </div>
                <span class="temp-val ${cls}">${Math.round(t.temp)}${t.unidad}</span>
            </div>
        `;
    }
    
    contenedor.innerHTML = html;
}

// RENDER: ALERTAS 
function renderAlertas(alertas) {
    const contenedor = document.getElementById('alerts-contenedor');
    if (!contenedor) {
        return;
    }
    
    const turno = store.get('turnoActual');
    const subtitulo = document.getElementById('alerts-subtitulo');
    
    if (subtitulo) {
        subtitulo.textContent = `Shift ${turno} — ${alertas.length} alerts`;
    }
    
    const orden = { CRITICAL: 0, WARNING: 1, INFO: 2, OK: 3 };
    const ordenadas = [...alertas].sort((a, b) => {
        let valorA = orden[a.nivel];
        if (valorA === undefined) {
            valorA = 4;
        }
        let valorB = orden[b.nivel];
        if (valorB === undefined) {
            valorB = 4;
        }
        return valorA - valorB;
    });
    
    let html = '';
    for (const a of ordenadas) {
        const nivelMin = a.nivel.toLowerCase();
        
        let claseVista = '';
        if (a.reconocida) {
            claseVista = 'acked';
        }
        
        let bloqueAccion = '';
        if (a.accion) {
            bloqueAccion = `<div class="alert-accion">→ ${a.accion}</div>`;
        }
        
        let bloqueBoton;
        if (!a.reconocida && a.nivel !== 'OK') {
            bloqueBoton = `<button class="alert-ack-btn" onclick="ackAlerta('${a.id}')">Acknowledge</button>`;
        } else if (a.reconocida) {
            bloqueBoton = '<span class="alert-acked-label">✓ Seen</span>';
        } else {
            bloqueBoton = '';
        }
        
        html += `
            <div class="alert-card ${nivelMin} ${claseVista}">
                <div class="alert-icono ${nivelMin}">${iconoAlerta(a.nivel)}</div>
                <div class="alert-body">
                    <div class="alert-header">
                        <span class="alert-nivel ${nivelMin}">${a.nivel}</span>
                        <span class="alert-maquina">${a.maquina} · ${a.area}</span>
                        <span class="alert-tiempo">${a.tiempo}</span>
                    </div>
                    <div class="alert-titulo">${a.titulo}</div>
                    <div class="alert-detalle">${a.detalle}</div>
                    ${bloqueAccion}
                </div>
                ${bloqueBoton}
            </div>
        `;
    }
    
    contenedor.innerHTML = html;
    
    // Alerta crítica flotante
    const badge = document.getElementById('criticalBadge');
    const badgeText = document.getElementById('textoAlerta');
    const critica = alertas.find(a => a.nivel === 'CRITICAL' && !a.reconocida);
    
    if (badge) {
        if (critica) {
            badge.hidden = false;
            if (badgeText) {
                badgeText.textContent = critica.titulo;
            }
        } else {
            badge.hidden = true;
        }
    }
}

function ackAlerta(idAlerta) {
    const turno = store.get('turnoActual');
    reconocerAlerta(idAlerta, turno);
    const alertas = obtenerAlertas(turno);
    store.set('alertas', alertas);
    renderAlertas(alertas);
}

// ─── RENDER: OEE BARRAS (quality) ────────────────────────────────
function renderOEEBarras(oee_por_area) {
    const contenedor = document.getElementById('oee-barras');
    if (!contenedor) {
        return;
    }
    
    let html = '';
    for (const area in oee_por_area) {
        const val = oee_por_area[area];
        const cls = clasificarOEE(val);
        
        html += `
            <div class="oee-fila">
                <span class="oee-fila-label">${area}</span>
                <div class="oee-barra">
                    <div class="oee-barra-fill ${cls}" style="width:${val}%"></div>
                </div>
                <span class="oee-fila-val ${cls}">${val}%</span>
            </div>
        `;
    }
    contenedor.innerHTML = html;
}

// RENDER: QUALITY PARÁMETROS
function renderQualityParams(kpis) {
    const contenedor = document.getElementById('quality-params');
    if (!contenedor) {
        return;
    }
    
    // Clasificar tasa de defectos
    let clsDefectos;
    if (kpis.defectos < 0.5) {
        clsDefectos = 'oee-bueno';
    } else if (kpis.defectos < 1.0) {
        clsDefectos = 'oee-regular';
    } else {
        clsDefectos = 'oee-malo';
    }

    // Clasificar utilización
    let clsUtilizacion;
    if (kpis.utilizacion >= 80) {
        clsUtilizacion = 'oee-bueno';
    } else {
        clsUtilizacion = 'oee-regular';
    }

    // Clasificar paros no planeados
    let clsParos;
    if (kpis.paros <= 2) {
        clsParos = 'oee-bueno';
    } else if (kpis.paros <= 4) {
        clsParos = 'oee-regular';
    } else {
        clsParos = 'oee-malo';
    }
    
    const params = [
        {
            nombre: 'Defect Rate',
            val: `${kpis.defectos}%`,
            limite: '< 1.0%',
            cls: clsDefectos,
            std: 'ISO 2859-1'
        },
        {
            nombre: 'Overall OEE',
            val: `${kpis.oee}%`,
            limite: '≥ 85%',
            cls: clasificarOEE(kpis.oee),
            std: 'ISO 22400-2'
        },
        {
            nombre: 'Plant Utilization',
            val: `${kpis.utilizacion}%`,
            limite: '≥ 80%',
            cls: clsUtilizacion,
            std: 'SEMI E10'
        },
        {
            nombre: 'Unplanned Stops',
            val: `${kpis.paros} events`,
            limite: '≤ 2 / shift',
            cls: clsParos,
            std: 'PackML ISA-88'
        },
    ];
    
    let html = '';
    for (const p of params) {
        html += `
            <div class="param-fila">
                <div>
                    <div class="param-nombre">${p.nombre}</div>
                    <div class="param-std">${p.std}</div>
                </div>
                <div style="text-align:right;">
                    <span class="param-val ${p.cls}">${p.val}</span>
                    <span class="param-limite">Limit: ${p.limite}</span>
                </div>
            </div>
        `;
    }
    
    contenedor.innerHTML = html;
}

// RENDER: REPORTE PREVIEW 
function renderReportePreview() {
    const contenedor = document.getElementById('report-preview');
    if (!contenedor) return;
    
    const kpis     = store.get('kpis');
    const maquinas = store.get('maquinas') || [];
    const alertas  = store.get('alertas') || [];
    const turno    = store.get('turnoActual');
    
    if (!kpis || !kpis.unidades) {
        contenedor.innerHTML = '<p style="color:var(--texto-muted);font-size:13px;">Loading...</p>';
        return;
    }
    
    const lineas = generarLineasReporte(turno, kpis, maquinas, alertas);
    contenedor.innerHTML = `<pre class="report-pre">${lineas}</pre>`;
}

// EXPORT: REPORTE TXT
function generarLineasReporte(turno, kpis, maquinas, alertas) {
    const ahora = new Date().toLocaleString('en-US');
    
    let texto = '';
    
    // Encabezado
    texto += `SHIFT ${turno} REPORT — PlantSight\n`;
    texto += `Generated: ${ahora}\n`;
    texto += `\n`;

    // KPIs principales
    texto += `KEY PERFORMANCE INDICATORS\n`;
    texto += `-----------------------------\n`;
    texto += `Units produced  : ${fmtNumero(kpis.unidades)}\n`;
    texto += `Shift target    : ${fmtNumero(kpis.meta)}\n`;
    texto += `Achievement     : ${kpis.cumplimiento}%\n`;
    texto += `OEE             : ${kpis.oee}%\n`;
    texto += `Utilization     : ${kpis.utilizacion}%\n`;
    texto += `Active hours    : ${kpis.horas}h\n`;
    texto += `Unplanned stops : ${kpis.paros}\n`;
    texto += `Defect rate     : ${kpis.defectos}%\n`;
    texto += `\n`;

    // OEE por área — recorremos el objeto con un for...in
    texto += `OEE BY AREA\n`;
    texto += `-----------------------------\n`;
    for (const area in kpis.oee_por_area) {
        const valor = kpis.oee_por_area[area];
        texto += `${area}: ${valor}%\n`;
    }
    texto += `\n`;

    // Estado de máquinas — recorremos el arreglo con for...of
    texto += `MACHINE STATUS\n`;
    texto += `-----------------------------\n`;
    for (const m of maquinas) {
        let eficienciaTexto;
        if (m.eficiencia > 0) {
            eficienciaTexto = Math.round(m.eficiencia) + '%';
        } else {
            eficienciaTexto = 'N/A';
        }
        texto += `${m.id} | ${m.area} | ${m.status} | Eff: ${eficienciaTexto}\n`;
    }
    texto += `\n`;

    // Alertas del turno
    texto += `ALERTS\n`;
    texto += `-----------------------------\n`;
    for (const a of alertas) {
        texto += `[${a.nivel}] ${a.titulo} (${a.tiempo})\n`;
    }
    texto += `\n`;

    // Pie de página
    texto += `-----------------------------------------------\n`;
    texto += `Auto-generated — no manual logging required\n`;
    texto += `Estimated time saved: ~31.5 min/shift\n`;
    
    return texto;
}

function exportReport() {
    const kpis     = store.get('kpis');
    const maquinas = store.get('maquinas') || [];
    const alertas  = store.get('alertas') || [];
    const turno    = store.get('turnoActual');
    if (!kpis) return;
    
    const texto = generarLineasReporte(turno, kpis, maquinas, alertas);
    const blob  = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    const url   = URL.createObjectURL(blob);
    const a     = document.createElement('a');
    
    a.href      = url;
    a.download  = `Shift_${turno}_Report_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    
    URL.revokeObjectURL(url);
}

function exportCSV() {
    let maquinas = store.get('maquinas');
    if (!maquinas) {
        maquinas = [];
    }
    
    const filas = [['ID','Name','Area','Status','Efficiency (%)','Temperature','Last Event']];
    
    for (const m of maquinas) {
        let eficienciaTexto = '';
        if (m.eficiencia > 0) {
            eficienciaTexto = Math.round(m.eficiencia);
        }
        
        let tempTexto = '';
        if (m.temp !== null) {
            tempTexto = `${Math.round(m.temp * 10) / 10} °C`;
        }
        
        filas.push([m.id, m.nombre, m.area, m.status, eficienciaTexto, tempTexto, m.ultimo_evento]);
    }
    
    // Convierte cada fila en texto CSV (separado por comas)
    let csv = '';
    
    for (const fila of filas) {
        const filaConComillas = [];
        for (const celda of fila) {
            filaConComillas.push(`"${celda}"`);
        }
        csv += filaConComillas.join(',') + '\n';
    }
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Machines_Shift_${store.get('turnoActual')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// CHARTS 
let graficaProd = null;
let graficaMini = null;
let graficaDefectos = null;

function iniciarGraficaProduccion(kpis) {
    const canvas = document.getElementById('produccion-grafica');
    if (!canvas) return;
    
    const labels = ['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00'];
    
    if (graficaProd) {
        graficaProd.data.datasets[0].data = kpis.produccion_horas;
        graficaProd.data.datasets[1].data = kpis.meta_horas;
        graficaProd.update('none');
        return;
    }
    
    graficaProd = new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Units/hr',
                    data: kpis.produccion_horas,
                    backgroundColor: 'rgba(139,158,119,0.15)',
                    borderColor: '#8B9E77',
                    borderWidth: 1.5,
                    borderRadius: 4,
                },
                {
                    label: 'Target',
                    data: kpis.meta_horas,
                    type: 'line',
                    borderColor: '#C9B99A',
                    borderWidth: 1.5,
                    borderDash: [4, 4],
                    pointRadius: 0,
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { font: { size: 10 }, color: '#9E9589' }, grid: { color: 'rgba(150,140,130,0.15)' } },
                y: { ticks: { font: { size: 10 }, color: '#9E9589' }, grid: { color: 'rgba(150,140,130,0.15)' }, beginAtZero: false }
            }
        }
    });
}

function iniciarGraficaMiniOEE(kpis) {
    const canvas = document.getElementById('OEE-grafica');
    if (!canvas) return;
    
    const historial = Array.from({ length: 8 }, () =>
        Math.round((kpis.oee + (Math.random() * 6 - 3)) * 10) / 10
    );
    
    if (graficaMini) {
        graficaMini.data.datasets[0].data = historial;
        graficaMini.update('none')
        return;
    }
    
    graficaMini = new Chart(canvas, {
        type: 'line',
        data: {
            labels: Array(8).fill(''),
            datasets: [{
                data: historial,
                borderColor: '#C17F59',
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
                backgroundColor: 'rgba(193,127,89,0.10)',
                tension: 0.4,
            }]
        },
        
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } },
            animation: { duration: 0 }
        }
    });
}

function iniciarGraficaDefectos() {
    const canvas = document.getElementById('defectos-grafica');
    if (!canvas || graficaDefectos) return;
    
    graficaDefectos = new Chart(canvas, {
        type: 'line',
        data: {
            labels: ['Wk1','Wk2','Wk3','Wk4','Wk5','Wk6','Wk7','Wk8'],
            datasets: [
                {
                    label: 'Defects (%)',
                    data: [0.6, 0.5, 0.7, 0.4, 0.3, 0.5, 0.4, 0.4],
                    borderColor: '#C17F59',
                    backgroundColor: 'rgba(193,127,89,0.10)',
                    borderWidth: 2,
                    pointRadius: 3,
                    fill: true,
                    tension: 0.35,
                },
                {
                    label: 'Limit (1%)',
                    data: Array(8).fill(1.0),
                    borderColor: '#C9B99A',
                    borderWidth: 1.5,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false,
                }
            ]
        },
        
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: { font: { size: 11 }, color: '#7A7062', boxWidth: 12 }
                }
            },
            scales: {
                x: { ticks: { font: { size: 10 }, color: '#9E9589' }, grid: { color: 'rgba(150,140,130,0.15)' } },
                y: { ticks: { font: { size: 10 }, color: '#9E9589' }, grid: { color: 'rgba(150,140,130,0.15)' } }
            }
        }
    });
}