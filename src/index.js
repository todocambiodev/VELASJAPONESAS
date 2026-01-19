class Vela {
    constructor(vela = {open: 0, high: 0, low: 0, close: 0, volume: 0, datetime: 0}) {
        this.fecha = null;
        this.open = vela.open;
        this.high = vela.high;
        this.low = vela.low;
        this.close = vela.close;
        this.volume = vela.volume;
        this.cuerpo = Math.abs(this.close - this.open);
        this.sombra_sup = this.high - Math.max(this.open, this.close);
        this.sombra_inf = Math.min(this.open, this.close) - this.low;
        this.tamaño_total = this.high - this.low;
        this.es_alcista = this.close > this.open;
        this.es_bajista = this.open > this.close;
        this.es_doji = this.cuerpo < (this.tamaño_total * 0.1);
        this.es_alcista_fuerte = this.es_alcista && (this.cuerpo / this.open) > 0.00189; // 0.189%
        this.es_bajista_fuerte = this.es_bajista && (this.cuerpo / this.open) > 0.00189; // 0.189%
    }

    es_estrella_fugaz() {
        const cuerpo_pequeno = this.cuerpo < this.tamaño_total * 0.3;
        const sombra_sup_larga = this.sombra_sup > this.cuerpo * 2;
        const sombra_inf_pequena = this.sombra_inf <= this.cuerpo;
        return cuerpo_pequeno && sombra_sup_larga && sombra_inf_pequena;
    }

    es_hombre_colgado() {
        const cuerpo_pequeno = this.cuerpo < this.tamaño_total * 0.3;
        const sombra_inf_larga = this.sombra_inf > this.cuerpo * 2;
        const sombra_sup_pequena = this.sombra_sup <= this.cuerpo;
        return cuerpo_pequeno && sombra_inf_larga && sombra_sup_pequena;
    }

    es_martillo() {
        const cuerpo_pequeno = this.cuerpo < this.tamaño_total * 0.3;
        const sombra_inf_larga = this.sombra_inf > this.cuerpo * 2;
        const sombra_sup_pequena = this.sombra_sup <= this.cuerpo;
        return cuerpo_pequeno && sombra_inf_larga && sombra_sup_pequena;
    }

    es_doji_lapida() {
        const doji = this.es_doji;
        const sombra_sup_larga = this.sombra_sup > this.cuerpo * 3;
        const sombra_inf_pequena = this.sombra_inf <= this.cuerpo;
        return doji && sombra_sup_larga && sombra_inf_pequena;
    }

    es_doji_dragonfly() {
        const doji = this.es_doji;
        const sombra_inf_larga = this.sombra_inf > this.cuerpo * 3;
        const sombra_sup_pequena = this.sombra_sup <= this.cuerpo;
        return doji && sombra_inf_larga && sombra_sup_pequena;
    }

    es_doji_piernas_largas() {
        const doji = this.es_doji;
        const sombra_sup_larga = this.sombra_sup > this.cuerpo * 3;
        const sombra_inf_larga = this.sombra_inf > this.cuerpo * 3;
        return doji && sombra_sup_larga && sombra_inf_larga;
    }

    buscar_patrones() {
        const patrones_encontrados = [];
        if (this.es_estrella_fugaz()) {
            patrones_encontrados.push("Estrella Fugaz");
        }
        if (this.es_hombre_colgado()) {
            patrones_encontrados.push("Hombre Colgado");
        }
        if (this.es_martillo()) {
            patrones_encontrados.push("Martillo");
        }
        if (this.es_doji_lapida()) {
            patrones_encontrados.push("Doji Lápida");
        }
        if (this.es_doji_dragonfly()) {
            patrones_encontrados.push("Doji Dragonfly");
        }
        if (this.es_doji_piernas_largas()) {
            patrones_encontrados.push("Doji Piernas Largas");
        }
        return patrones_encontrados;
    }
}

function es_estrella_fugaz(vela) {
    const cuerpo_pequeno = vela.cuerpo < vela.tamaño_total * 0.3;
    const sombra_sup_larga = vela.sombra_sup > vela.cuerpo * 2;
    const sombra_inf_pequena = vela.sombra_inf <= vela.cuerpo;
    return cuerpo_pequeno && sombra_sup_larga && sombra_inf_pequena;
}

function es_hombre_colgado(vela) {
    const cuerpo_pequeno = vela.cuerpo < vela.tamaño_total * 0.3;
    const sombra_inf_larga = vela.sombra_inf > vela.cuerpo * 2;
    const sombra_sup_pequena = vela.sombra_sup <= vela.cuerpo;
    return cuerpo_pequeno && sombra_inf_larga && sombra_sup_pequena;
}

function es_martillo(vela) {
    const cuerpo_pequeno = vela.cuerpo < vela.tamaño_total * 0.3;
    const sombra_inf_larga = vela.sombra_inf > vela.cuerpo * 2;
    const sombra_sup_pequena = vela.sombra_sup <= vela.cuerpo;
    return cuerpo_pequeno && sombra_inf_larga && sombra_sup_pequena;
}

function es_envolvente_alcista(vela_anterior, vela) {
    const cuerpo_grande = vela.cuerpo > 2 * vela_anterior.cuerpo;
    const de_bajista_a_alcista = vela_anterior.es_bajista && vela.es_alcista;
    const abre_abajo_cierra_arriba = vela.open <= vela_anterior.close && vela.close > vela_anterior.open;
    return cuerpo_grande && de_bajista_a_alcista && abre_abajo_cierra_arriba;
}

function es_envolvente_bajista(vela_anterior, vela) {
    const cuerpo_grande = vela.cuerpo > 2 * vela_anterior.cuerpo;
    const de_alcista_a_bajista = vela_anterior.es_alcista && vela.es_bajista;
    const abre_arriba_cierra_abajo = vela.open >= vela_anterior.close && vela.close < vela_anterior.open;
    return cuerpo_grande && de_alcista_a_bajista && abre_arriba_cierra_abajo;
}

function es_nube_oscura(vela_anterior, vela) {
    const alcista_fuerte = vela_anterior.es_alcista_fuerte;
    const gap_arriba = vela.open > vela_anterior.close;
    const cierra_50por_debajo = vela.close < vela_anterior.close - (vela_anterior.cuerpo * 0.5);
    return alcista_fuerte && gap_arriba && cierra_50por_debajo;
}

function es_nube_clara(vela_anterior, vela) {
    const bajista_fuerte = vela_anterior.es_bajista_fuerte;
    const gap_abajo = vela.open < vela_anterior.close;
    const cierra_50por_arriba = vela.close > vela_anterior.close + (vela_anterior.cuerpo * 0.5);
    return bajista_fuerte && gap_abajo && cierra_50por_arriba;
}

function es_estrella_del_atardecer(vela_anterior, vela, vela_siguiente) {
    const alcista_fuerte = vela_anterior.es_alcista_fuerte;
    const doji_o_cuerpo_pequeno = vela.es_doji || vela.cuerpo <= vela_anterior.cuerpo * 0.3;
    const gap_arriba = vela.open > vela_anterior.close;
    const bajista_fuerte = vela_siguiente.es_bajista_fuerte;
    const cierra_50por_debajo = vela_siguiente.close < vela_anterior.close - (vela_anterior.cuerpo * 0.5);
    return alcista_fuerte && doji_o_cuerpo_pequeno && bajista_fuerte && gap_arriba && cierra_50por_debajo;
}

function es_estrella_del_amanecer(vela_anterior, vela, vela_siguiente) {
    const bajista_fuerte = vela_anterior.es_bajista_fuerte;
    const doji_o_cuerpo_pequeno = vela.es_doji || vela.cuerpo <= vela_anterior.cuerpo * 0.3;
    const gap_abajo = vela.open < vela_anterior.close;
    const alcista_fuerte = vela_siguiente.es_alcista_fuerte;
    const cierra_50por_arriba = vela_siguiente.close > vela_anterior.close + (vela_anterior.cuerpo * 0.5);
    return bajista_fuerte && doji_o_cuerpo_pequeno && alcista_fuerte && gap_abajo && cierra_50por_arriba;
}

function es_tres_cuervos_negros(vela1, vela2, vela3) {
    const tres_velas_bajistas = vela1.es_bajista_fuerte && vela2.es_bajista_fuerte && vela3.es_bajista_fuerte;
    const abren_dentro_del_cuerpo_anterior = vela1.close < vela2.open < vela1.open && vela2.close < vela3.open < vela2.open;
    const cierran_debajo_del_minimo_anterior = vela1.low > vela2.close && vela2.low > vela3.close;
    return tres_velas_bajistas && abren_dentro_del_cuerpo_anterior && cierran_debajo_del_minimo_anterior;
}

function es_tres_soldados_blancos(vela1, vela2, vela3) {
    const tres_velas_alcistas = vela1.es_alcista_fuerte && vela2.es_alcista_fuerte && vela3.es_alcista_fuerte;
    const abren_dentro_del_cuerpo_anterior = vela1.close > vela2.open > vela1.open && vela2.close > vela3.open > vela2.open;
    const cierran_arriba_del_maximo_anterior = vela1.high < vela2.close && vela2.high < vela3.close;
    return tres_velas_alcistas && abren_dentro_del_cuerpo_anterior && cierran_arriba_del_maximo_anterior;
}

function es_tres_metodos_bajistas(vela1, vela2, vela3, vela4, vela5) {
    const bajista_fuerte = vela1.es_bajista_fuerte;
    const grupo_alcista_debil = (vela1.close < vela2.open < vela1.open && vela1.close < vela2.close < vela1.open &&
                                vela1.close < vela3.open < vela1.open && vela1.close < vela3.close < vela1.open &&
                                vela1.close < vela4.open < vela1.open && vela1.close < vela4.close < vela1.open);
    const cierre_debajo_del_minimo_inicial = vela5.close < vela1.close;
    return bajista_fuerte && grupo_alcista_debil && cierre_debajo_del_minimo_inicial;
}

function es_tres_metodos_alcistas(vela1, vela2, vela3, vela4, vela5) {
    const alcista_fuerte = vela1.es_alcista_fuerte;
    const grupo_bajista_debil = (vela1.close > vela2.open > vela1.open && vela1.close > vela2.close > vela1.open &&
                                 vela1.close > vela3.open > vela1.open && vela1.close > vela3.close > vela1.open &&
                                 vela1.close > vela4.open > vela1.open && vela1.close > vela4.close > vela1.open);
    const cierre_arriba_del_maximo_inicial = vela5.close > vela1.close;
    return alcista_fuerte && grupo_bajista_debil && cierre_arriba_del_maximo_inicial;
}

function es_doji_lapida(vela) {
    const doji = vela.es_doji;
    const sombra_sup_larga = vela.sombra_sup > vela.cuerpo * 3;
    const sombra_inf_pequena = vela.sombra_inf <= vela.cuerpo;
    return doji && sombra_sup_larga && sombra_inf_pequena;
}

function es_doji_dragonfly(vela) {
    const doji = vela.es_doji;
    const sombra_inf_larga = vela.sombra_inf > vela.cuerpo * 3;
    const sombra_sup_pequena = vela.sombra_sup <= vela.cuerpo;
    return doji && sombra_inf_larga && sombra_sup_pequena;
}

function es_doji_piernas_largas(vela) {
    const doji = vela.es_doji;
    const sombra_sup_larga = vela.sombra_sup > vela.cuerpo * 3;
    const sombra_inf_larga = vela.sombra_inf > vela.cuerpo * 3;
    return doji && sombra_sup_larga && sombra_inf_larga;
}

function buscar_patrones(velas) {
    const patrones_encontrados = [];
    if (velas.length <= 1) {
        return patrones_encontrados;
    }
    
    if (velas[velas.length - 2].es_estrella_fugaz()) {
        patrones_encontrados.push("Estrella Fugaz");
    }
    if (velas[velas.length - 2].es_hombre_colgado()) {
        patrones_encontrados.push("Hombre Colgado");
    }
    if (velas[velas.length - 2].es_martillo()) {
        patrones_encontrados.push("Martillo");
    }
    if (velas[velas.length - 2].es_doji_lapida()) {
        patrones_encontrados.push("Doji Lápida");
    }
    if (velas[velas.length - 2].es_doji_dragonfly()) {
        patrones_encontrados.push("Doji Dragonfly");
    }
    if (velas[velas.length - 2].es_doji_piernas_largas()) {
        patrones_encontrados.push("Doji Piernas Largas");
    }
    if (velas.length <= 2) {
        return patrones_encontrados;
    }
    
    if (es_envolvente_alcista(velas[velas.length - 3], velas[velas.length - 2])) {
        patrones_encontrados.push("Envolvente Alcista");
    }
    if (es_envolvente_bajista(velas[velas.length - 3], velas[velas.length - 2])) {
        patrones_encontrados.push("Envolvente Bajista");
    }
    if (es_nube_oscura(velas[velas.length - 3], velas[velas.length - 2])) {
        patrones_encontrados.push("Nube Oscura");
    }
    if (es_nube_clara(velas[velas.length - 3], velas[velas.length - 2])) {
        patrones_encontrados.push("Nube Clara");
    }
    if (velas.length <= 3) {
        return patrones_encontrados;
    }
    
    if (es_estrella_del_atardecer(velas[velas.length - 4], velas[velas.length - 3], velas[velas.length - 2])) {
        patrones_encontrados.push("Estrella del Atardecer");
    }
    if (es_estrella_del_amanecer(velas[velas.length - 4], velas[velas.length - 3], velas[velas.length - 2])) {
        patrones_encontrados.push("Estrella del Amanecer");
    }
    if (es_tres_cuervos_negros(velas[velas.length - 4], velas[velas.length - 3], velas[velas.length - 2])) {
        patrones_encontrados.push("Tres Cuervos Negros");
    }
    if (es_tres_soldados_blancos(velas[velas.length - 4], velas[velas.length - 3], velas[velas.length - 2])) {
        patrones_encontrados.push("Tres Soldados Blancos");
    }
    if (velas.length <= 4) {
        return patrones_encontrados;
    }
    
    if (es_tres_metodos_bajistas(velas[velas.length - 6], velas[velas.length - 5], velas[velas.length - 4], velas[velas.length - 3], velas[velas.length - 2])) {
        patrones_encontrados.push("Tres Métodos Bajistas");
    }
    if (es_tres_metodos_alcistas(velas[velas.length - 6], velas[velas.length - 5], velas[velas.length - 4], velas[velas.length - 3], velas[velas.length - 2])) {
        patrones_encontrados.push("Tres Métodos Alcistas");
    }
    return patrones_encontrados;
}
