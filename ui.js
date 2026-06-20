function switchView(vista) {
    // Ocultar todas las vistas
    const todasLasVistas = document.querySelectorAll('.view-active, .view-oculta');
    for (const v of todasLasVistas) {
        v.className = 'view-oculta';
    }

    // Mostrar solo la vista seleccionada
    const objetivo = document.getElementById(`view-${vista}`);
    if (objetivo) {
        objetivo.className = 'view-active';
    }

    // Apagar todos los botones de navegación
    const todosLosBotones = document.querySelectorAll('.home-boton, .boton');
    for (const b of todosLosBotones) {
        b.className = 'boton';
        
        const textoBoton = b.textContent.toLowerCase();
        if (textoBoton === vista) {
            b.className = 'home-boton';
        }
    }
    
    store.set('vistaActual', vista);

    // Renderizar contenido específico según la vista
    if (vista === 'reports') {
        renderReportePreview();
    } else if (vista === 'alerts') {
        let alertas = store.get('alertas');
        if (!alertas) {
            alertas = [];
        }
        
        renderAlertas(alertas);
    } else if (vista === 'machines') {
        let maquinas = store.get('maquinas');
        if (!maquinas) {
            maquinas = [];
        }
        renderMaquinasCompleto(maquinas, store.get('areaActual'));
    } else if (vista === 'quality') {
        const kpis = store.get('kpis');
        if (kpis) {
            renderOEEBarras(kpis.oee_por_area);
            renderQualityParams(kpis);
        }
        iniciarGraficaDefectos();
    }
}

function setShift(btn, turno) {
    document.querySelectorAll('.boton-turno').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    store.set('turnoActual', turno);
    refrescarTodo();
}

function setArea(btn, area) {
    document.querySelectorAll('.area').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    store.set('areaActual', area);
    
    let maquinas = store.get('maquinas');
    if (!maquinas) {
        maquinas = [];
    }
    
    renderMaquinasMini(maquinas, area);
    renderMaquinasCompleto(maquinas, area);
}