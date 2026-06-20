async function refrescarTodo() {
    const turno = store.get('turnoActual');
    
    // Obtener los datos del simulador
    const estadoMaquinas = obtenerEstadoMaquinas(turno);
    const kpis           = obtenerKPIs(turno);
    const alertas        = obtenerAlertas(turno);
    const ambiente       = obtenerAmbiente(turno);
    const temps          = obtenerTemperaturas(turno);
    
    // Combinar catálogo + estado actual
    const maquinas = CATALOGO.map(cat => ({
        ...cat,
        ...estadoMaquinas[cat.id],
    }));
    
    // Guardar en el store
    store.set('maquinas', maquinas);
    store.set('kpis',     kpis);
    store.set('alertas',  alertas);
    store.set('ambiente', ambiente);
    
    // Renderizado
    renderKPIs(kpis);
    renderAmbiente(ambiente);
    renderOperativo(kpis, maquinas);
    renderMaquinasMini(maquinas, store.get('areaActual'));
    renderTemperaturas(temps);
    renderAlertas(alertas);
    iniciarGraficaProduccion(kpis);
    iniciarGraficaMiniOEE(kpis);
}

function iniciarReloj() {
    function tick() {
        const el = document.getElementById('reloj');
        if (el) {
            el.textContent = new Date().toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
        }
    }
    tick();
    setInterval(tick, 1000);
}

document.addEventListener('DOMContentLoaded', function () {
    iniciarReloj();
    refrescarTodo();
    setInterval(refrescarTodo, 5000)
});