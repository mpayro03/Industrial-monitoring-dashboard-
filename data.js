// MÁQUINAS - Datos (ejemplos) 

const CATALOGO = [
    {
        id: 'M1-Make',
        nombre: 'Mixer Line 1',
        area: 'Making',
        velocidad_nominal: 2100,
        limite_temp: 75,
        descripcion: 'Primary material mixing for finished product'
    },
    {
        id: 'M2-Make',
        nombre: 'Mixer Line 2',
        area: 'Making',
        velocidad_nominal: 2100,
        limite_temp: 75,
        descripcion: 'Backup line for material mixing'
    },
    {
        id: 'F1-Pack',
        nombre: 'Auto Sealer L1',
        area: 'Packing',
        velocidad_nominal: 1850,
        limite_temp: 175,
        descripcion: 'Thermal sealing and packaging line 1'
    },
    {
        id: 'F2-Pack',
        nombre: 'Rotary Packer L2',
        area: 'Packing',
        velocidad_nominal: 1600,
        limite_temp: 160,
        descripcion: 'Rotary packaging and pallet formation'
    },
    {
        id: 'F3-Pack',
        nombre: 'High-Speed Sealer',
        area: 'Packing',
        velocidad_nominal: 2200,
        limite_temp: 175,
        descripcion: 'High-speed sealing for export batches'
    },
    {
        id: 'W1-Ware',
        nombre: 'Main Conveyor',
        area: 'Warehouse',
        velocidad_nominal: null,
        limite_temp: null,
        descripcion: 'Pallet transport and movement system'
    },
    {
        id: 'Q1-QC',
        nombre: 'QC Station',
        area: 'Quality',
        velocidad_nominal: null,
        limite_temp: null,
        descripcion: 'Visual, gravimetric and seal inspection'
    },
];

// DATOS POR TURNO 
const DATOS_TURNO = {
    A: {
        unidades: 12450,
        meta: 13000,
        horas_activas: 7.2,
        paros: 3,
        oee: 81.3,
        utilizacion: 89.5,
        defectos_pct: 0.4,
        produccion_horas: [1840, 1920, 1760, 1980, 2040, 1890, 1740, 1280],
        meta_horas:       [2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000],
        ambiente: {
            temp: 22.4,
            humedad: 54,
            ruido: 78,
            energia: 342,
            aire: 'GOOD'
        },
        oee_por_area: {
            Making: 87, Packing: 74, Warehouse: 91, Quality: 96, HSE: 100
        },
        estados_maquina: {
            'M1-Make': { status: 'RUNNING',     eficiencia: 93.2, temp: 68.4,  ultimo_evento: 'Normal production' },
            'M2-Make': { status: 'MAINTENANCE', eficiencia: 0,    temp: null,  ultimo_evento: 'Scheduled preventive maintenance' },
            'F1-Pack': { status: 'RUNNING',     eficiencia: 88.1, temp: 162.3, ultimo_evento: 'Nominal speed' },
            'F2-Pack': { status: 'IDLE',        eficiencia: 0,    temp: 85.0,  ultimo_evento: 'Waiting for material from Making' },
            'F3-Pack': { status: 'FAULT',       eficiencia: 0,    temp: 182.4, ultimo_evento: 'FAULT: Temperature out of range' },
            'W1-Ware': { status: 'RUNNING',     eficiencia: 79.0, temp: null,  ultimo_evento: 'Route optimization active' },
            'Q1-QC':   { status: 'RUNNING',     eficiencia: 100,  temp: null,  ultimo_evento: 'Inspection in progress' },
        },
        temperaturas: [
            { zona: 'Bearing', temp: 69,  limite: 85,  unidad: '°C' },
            { zona: 'Ambient', temp: 22,  limite: 35,  unidad: '°C' },
            { zona: 'Rotor',   temp: 71,  limite: 90,  unidad: '°C' },
            { zona: 'Sealing', temp: 162, limite: 175, unidad: '°C' },
            { zona: 'Storage', temp: 19,  limite: 30,  unidad: '°C' },
        ],
        alertas: [
            {
                id: 'A001', nivel: 'CRITICAL', reconocida: false,
                maquina: 'F3-Pack', area: 'Packing',
                titulo: 'Seal temperature out of range',
                detalle: 'Current: 182°C — Limit: 175°C. Risk of defective seal.',
                tiempo: '4 min ago',
                accion: 'Stop line and recalibrate heating system'
            },
            {
                id: 'A002', nivel: 'WARNING', reconocida: false,
                maquina: 'F2-Pack', area: 'Packing',
                titulo: 'Extended idle time',
                detalle: 'F2-Pack has been IDLE for 38 min waiting for material from Making.',
                tiempo: '18 min ago',
                accion: 'Check material flow from M1-Make'
            },
            {
                id: 'A003', nivel: 'OK', reconocida: true,
                maquina: 'Q1-QC', area: 'Quality',
                titulo: 'Scale calibration completed',
                detalle: 'Periodic calibration within ISO 8655 specification.',
                tiempo: '42 min ago',
                accion: null
            },
            {
                id: 'A004', nivel: 'INFO', reconocida: false,
                maquina: 'M2-Make', area: 'Making',
                titulo: 'Preventive maintenance scheduled',
                detalle: 'M2-Make reached 720h of operation. Maintenance per PM schedule.',
                tiempo: '1h 10min ago',
                accion: 'Start maintenance checklist'
            },
        ],
    },
    B: {
        unidades: 13210,
        meta: 13000,
        horas_activas: 7.75,
        paros: 1,
        oee: 84.7,
        utilizacion: 92.1,
        defectos_pct: 0.2,
        produccion_horas: [1950, 2010, 2080, 1990, 2100, 2050, 1980, 2040],
        meta_horas:       [2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000],
        ambiente: {
            temp: 21.8,
            humedad: 51,
            ruido: 76,
            energia: 358,
            aire: 'EXCELLENT'
        },
        oee_por_area: {
            Making: 92, Packing: 86, Warehouse: 95, Quality: 98, HSE: 100
        },
        estados_maquina: {
            'M1-Make': { status: 'RUNNING', eficiencia: 96.1, temp: 65.2,  ultimo_evento: 'Stable production 3h straight' },
            'M2-Make': { status: 'RUNNING', eficiencia: 91.4, temp: 67.8,  ultimo_evento: 'Normal production' },
            'F1-Pack': { status: 'RUNNING', eficiencia: 93.2, temp: 158.9, ultimo_evento: 'Nominal speed' },
            'F2-Pack': { status: 'RUNNING', eficiencia: 88.7, temp: 155.4, ultimo_evento: 'Normal production' },
            'F3-Pack': { status: 'RUNNING', eficiencia: 95.0, temp: 168.1, ultimo_evento: 'High-speed mode active' },
            'W1-Ware': { status: 'RUNNING', eficiencia: 88.3, temp: null,  ultimo_evento: 'Continuous flow' },
            'Q1-QC':   { status: 'RUNNING', eficiencia: 100,  temp: null,  ultimo_evento: 'Inspection in progress' },
        },
        temperaturas: [
            { zona: 'Bearing', temp: 65,  limite: 85,  unidad: '°C' },
            { zona: 'Ambient', temp: 22,  limite: 35,  unidad: '°C' },
            { zona: 'Rotor',   temp: 68,  limite: 90,  unidad: '°C' },
            { zona: 'Sealing', temp: 158, limite: 175, unidad: '°C' },
            { zona: 'Storage', temp: 20,  limite: 30,  unidad: '°C' },
        ],
        alertas: [
            {
                id: 'B001', nivel: 'OK', reconocida: true,
                maquina: 'M1-Make', area: 'Making',
                titulo: 'Sustained performance — 3 consecutive hours',
                detalle: 'M1-Make running at 96% efficiency without interruption.',
                tiempo: '12 min ago',
                accion: null
            },
            {
                id: 'B002', nivel: 'INFO', reconocida: false,
                maquina: 'W1-Ware', area: 'Warehouse',
                titulo: 'Primary material inventory at 35%',
                detalle: 'Current stock: 3,500 units. Estimated coverage: 2.7h at current rate.',
                tiempo: '55 min ago',
                accion: 'Request replenishment from internal supplier'
            },
        ],
    },
    C: {
        unidades: 8120,
        meta: 9000,
        horas_activas: 5.92,
        paros: 5,
        oee: 74.1,
        utilizacion: 73.8,
        defectos_pct: 0.8,
        produccion_horas: [1200, 980, 1350, 1100, 890, 1050, 1100, 450],
        meta_horas:       [1800, 1800, 1800, 1800, 1800, 1800, 1800, 1800],
        ambiente: {
            temp: 20.1,
            humedad: 58,
            ruido: 72,
            energia: 289,
            aire: 'ACCEPTABLE'
        },
        oee_por_area: {
            Making: 71, Packing: 63, Warehouse: 82, Quality: 89, HSE: 100
        },
        estados_maquina: {
            'M1-Make': { status: 'RUNNING',     eficiencia: 74.2, temp: 70.1,  ultimo_evento: 'Reduced speed after stop' },
            'M2-Make': { status: 'FAULT',       eficiencia: 0,    temp: null,  ultimo_evento: 'FAULT: Formula error batch #C-441' },
            'F1-Pack': { status: 'RUNNING',     eficiencia: 71.8, temp: 159.2, ultimo_evento: 'Reduced speed' },
            'F2-Pack': { status: 'RUNNING',     eficiencia: 68.4, temp: 154.1, ultimo_evento: 'Missing operator — manual speed' },
            'F3-Pack': { status: 'IDLE',        eficiencia: 0,    temp: 98.5,  ultimo_evento: 'Stopped — no material available' },
            'W1-Ware': { status: 'FAULT',       eficiencia: 0,    temp: null,  ultimo_evento: 'FAULT: Internal transport system' },
            'Q1-QC':   { status: 'RUNNING',     eficiencia: 100,  temp: null,  ultimo_evento: 'Post-stop inspection in progress' },
        },
        temperaturas: [
            { zona: 'Bearing', temp: 78,  limite: 85,  unidad: '°C' },
            { zona: 'Ambient', temp: 20,  limite: 35,  unidad: '°C' },
            { zona: 'Rotor',   temp: 82,  limite: 90,  unidad: '°C' },
            { zona: 'Sealing', temp: 159, limite: 175, unidad: '°C' },
            { zona: 'Storage', temp: 18,  limite: 30,  unidad: '°C' },
        ],
        alertas: [
            {
                id: 'C001', nivel: 'CRITICAL', reconocida: false,
                maquina: 'W1-Ware', area: 'Warehouse',
                titulo: 'Internal transport system failure',
                detalle: 'W1-Ware stopped. Supply line blocked — direct impact on F3-Pack.',
                tiempo: '2 min ago',
                accion: 'Activate contingency protocol — manual transport'
            },
            {
                id: 'C002', nivel: 'CRITICAL', reconocida: false,
                maquina: 'M2-Make', area: 'Making',
                titulo: 'Automatic batch rejection',
                detalle: 'Batch #C-441 rejected: formula out of spec (viscosity 8.2 cP, limit 7.5 cP).',
                tiempo: '22 min ago',
                accion: 'Segregate batch, start root cause investigation'
            },
            {
                id: 'C003', nivel: 'WARNING', reconocida: false,
                maquina: 'F2-Pack', area: 'Packing',
                titulo: 'Missing operator — reduced manual speed',
                detalle: 'F2-Pack running at 68% due to absent operator at control station.',
                tiempo: '40 min ago',
                accion: 'Reassign staff or notify supervisor'
            },
            {
                id: 'C004', nivel: 'OK', reconocida: true,
                maquina: 'Q1-QC', area: 'HSE',
                titulo: 'HSE inspection completed — no findings',
                detalle: 'Night HSE round completed. No critical safety findings.',
                tiempo: '1h 5min ago',
                accion: null
            },
            {
                id: 'C005', nivel: 'INFO', reconocida: false,
                maquina: 'F3-Pack', area: 'Making',
                titulo: 'Drive belt replaced',
                detalle: 'Belt replacement completed in 45 min. Returning to production.',
                tiempo: '1h 30min ago',
                accion: null
            },
        ],
    }
};

// VARIABILIDAD DE SENSOR (Función de jitter para simular pequeñas variaciones aleatorias en los datos de sensores)
function jitter(valor, variacion = 0.02) {
    if (valor === null || valor === undefined) {
        return valor;
    }
    const delta = valor * variacion;
    let direccion;
    if (Math.random() > 0.5) {
        direccion = 1;
    } else {
        direccion = -1;
    }
    return Math.round((valor + direccion * Math.random() * delta) * 10) / 10;
}

// FUNCIONES DE ACCESO A DATOS 
function obtenerCatalogo() {
    return CATALOGO;
}

function obtenerEstadoMaquinas(turno) {
    const datos = DATOS_TURNO[turno];
    const estados = {};
    
    for (const [id, estado] of Object.entries(datos.estados_maquina)) {
        let tempFinal;
        let eficienciaFinal;
        
        if (estado.status === 'RUNNING') {
            tempFinal = jitter(estado.temp, 0.015);
            eficienciaFinal = jitter(estado.eficiencia, 0.01);
        } else {
            tempFinal = estado.temp;
            eficienciaFinal = estado.eficiencia;
        }
        
        estados[id] = {
            ...estado,
            temp: tempFinal,
            eficiencia: eficienciaFinal,
        };
    }
    return estados;
}

function obtenerKPIs(turno) {
    const d = DATOS_TURNO[turno];
    return {
        unidades:    d.unidades + Math.floor(Math.random() * 20 - 10),
        meta:        d.meta,
        cumplimiento: Math.round((d.unidades / d.meta) * 1000) / 10,
        oee:         jitter(d.oee, 0.005),
        utilizacion: jitter(d.utilizacion, 0.005),
        horas:       d.horas_activas,
        paros:       d.paros,
        defectos:    d.defectos_pct,
        oee_por_area: d.oee_por_area,
        produccion_horas: d.produccion_horas.map(v => jitter(v, 0.01)),
        meta_horas:  d.meta_horas,
    };
}

function obtenerAmbiente(turno) {
    const env = DATOS_TURNO[turno].ambiente;
    return {
        temp:    jitter(env.temp, 0.02),
        humedad: jitter(env.humedad, 0.02),
        ruido:   jitter(env.ruido, 0.01),
        energia: jitter(env.energia, 0.03),
        aire:    env.aire,
    };
}

function obtenerAlertas(turno) {
    return DATOS_TURNO[turno].alertas;
}

function obtenerTemperaturas(turno) {
    return DATOS_TURNO[turno].temperaturas.map(t => ({
        ...t,
        temp: jitter(t.temp, 0.015),
    }));
}

function reconocerAlerta(idAlerta, turno) {
    const alerta = DATOS_TURNO[turno].alertas.find(a => a.id === idAlerta);
    if (alerta) alerta.reconocida = true;
}

