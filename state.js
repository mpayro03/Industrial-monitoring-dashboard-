const estado = {
    turnoActual: 'A',
    areaActual: 'all',
    vistaActual: 'home',
    maquinas: [],
    kpis: {},
    alertas: [],
    ambiente: {},
    temperaturas: [],
};

const oyentes = new Map();

const store = {
    get(clave) {
        return estado[clave];
    },
    
    set(clave, valor) {
        estado[clave] = valor;
        if (oyentes.has(clave)) {
            oyentes.get(clave).forEach(fn => fn(valor));
        }
    },
    
    suscribir(clave, fn) {
        if (!oyentes.has(clave)) oyentes.set(clave, new Set());
        oyentes.get(clave).add(fn);
    },
};