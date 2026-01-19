class Vela:
    def __init__(self, vela:dict[str,float]={"open":0, "high":0, "low":0, "close":0, "volume":0, "datetime":0}):
        self.fecha = None
        self.open: float = vela["open"]
        self.high: float = vela["high"]
        self.low: float = vela["low"]
        self.close: float = vela["close"]
        self.volume: float = vela["volume"]
        self.cuerpo: float = abs(self.close - self.open)
        self.sombra_sup: float = self.high - max(self.open, self.close)
        self.sombra_inf: float = min(self.open, self.close) - self.low
        self.tamaño_total: float = self.high - self.low
        self.es_alcista: bool = self.close > self.open
        self.es_bajista: bool = self.open > self.close
        self.es_doji: bool = self.cuerpo < (self.tamaño_total * 0.1)
        self.es_alcista_fuerte: bool = self.es_alcista and (self.cuerpo/self.open) > 0.00189 # 0.189%
        self.es_bajista_fuerte: bool = self.es_bajista and (self.cuerpo/self.open) > 0.00189 # 0.189%

    def es_estrella_fugaz(self) -> bool:
        cuerpo_pequeno = self.cuerpo < self.tamaño_total * 0.3
        sombra_sup_larga = self.sombra_sup > self.cuerpo * 2
        sombra_inf_pequena = self.sombra_inf <= self.cuerpo
        return cuerpo_pequeno and sombra_sup_larga and sombra_inf_pequena
    
    def es_hombre_colgado(self) -> bool:
        cuerpo_pequeno = self.cuerpo < self.tamaño_total * 0.3
        sombra_inf_larga = self.sombra_inf > self.cuerpo * 2
        sombra_sup_pequena = self.sombra_sup <= self.cuerpo
        return cuerpo_pequeno and sombra_inf_larga and sombra_sup_pequena

    def es_martillo(self) -> bool:
        cuerpo_pequeno = self.cuerpo < self.tamaño_total * 0.3
        sombra_inf_larga = self.sombra_inf > self.cuerpo * 2
        sombra_sup_pequena = self.sombra_sup <= self.cuerpo
        return cuerpo_pequeno and sombra_inf_larga and sombra_sup_pequena
    
    def es_doji_lapida(self) -> bool:
        doji = self.es_doji
        sombra_sup_larga = self.sombra_sup > self.cuerpo * 3
        sombra_inf_pequena = self.sombra_inf <= self.cuerpo
        return doji and sombra_sup_larga and sombra_inf_pequena

    def es_doji_dragonfly(self) -> bool:
        doji = self.es_doji
        sombra_inf_larga = self.sombra_inf > self.cuerpo * 3
        sombra_sup_pequena = self.sombra_sup <= self.cuerpo
        return doji and sombra_inf_larga and sombra_sup_pequena

    def es_doji_piernas_largas(self) -> bool:
        doji = self.es_doji
        sombra_sup_larga = self.sombra_sup > self.cuerpo * 3
        sombra_inf_larga = self.sombra_inf > self.cuerpo * 3
        return doji and sombra_sup_larga and sombra_inf_larga
    
    def buscar_patrones(self):
        patrones_encontrados = []
        if self.es_estrella_fugaz():
            patrones_encontrados.append("Estrella Fugaz")
        if self.es_hombre_colgado():
            patrones_encontrados.append("Hombre Colgado")
        if self.es_martillo():
            patrones_encontrados.append("Martillo")
        if self.es_doji_lapida():
            patrones_encontrados.append("Doji Lápida")
        if self.es_doji_dragonfly():
            patrones_encontrados.append("Doji Dragonfly")
        if self.es_doji_piernas_largas():
            patrones_encontrados.append("Doji Piernas Largas")
        return patrones_encontrados

def es_estrella_fugaz(vela:Vela) -> bool:
    cuerpo_pequeno = vela.cuerpo < vela.tamaño_total * 0.3
    sombra_sup_larga = vela.sombra_sup > vela.cuerpo * 2
    sombra_inf_pequena = vela.sombra_inf <= vela.cuerpo
    return cuerpo_pequeno and sombra_sup_larga and sombra_inf_pequena

def es_hombre_colgado(vela:Vela) -> bool:
    cuerpo_pequeno = vela.cuerpo < vela.tamaño_total * 0.3
    sombra_inf_larga = vela.sombra_inf > vela.cuerpo * 2
    sombra_sup_pequena = vela.sombra_sup <= vela.cuerpo
    return cuerpo_pequeno and sombra_inf_larga and sombra_sup_pequena

def es_martillo(vela:Vela) -> bool:
    cuerpo_pequeno = vela.cuerpo < vela.tamaño_total * 0.3
    sombra_inf_larga = vela.sombra_inf > vela.cuerpo * 2
    sombra_sup_pequena = vela.sombra_sup <= vela.cuerpo
    return cuerpo_pequeno and sombra_inf_larga and sombra_sup_pequena

def es_envolvente_alcista(vela_anterior:Vela, vela:Vela) -> bool:
    cuerpo_grande =  vela.cuerpo > 2 * vela_anterior.cuerpo
    de_bajista_a_alcista = vela_anterior.es_bajista and vela.es_alcista
    abre_abajo_cierra_arriba = vela.open <= vela_anterior.close and vela.close > vela_anterior.open
    return cuerpo_grande and de_bajista_a_alcista and abre_abajo_cierra_arriba

def es_envolvente_bajista(vela_anterior:Vela, vela:Vela) -> bool:
    cuerpo_grande =  vela.cuerpo > 2 * vela_anterior.cuerpo
    de_alcista_a_bajista = vela_anterior.es_alcista and vela.es_bajista
    abre_arriba_cierra_abajo = vela.open >= vela_anterior.close and vela.close < vela_anterior.open
    return cuerpo_grande and de_alcista_a_bajista and abre_arriba_cierra_abajo

def es_nube_oscura(vela_anterior:Vela, vela:Vela) -> bool:
    alcista_fuerte = vela_anterior.es_alcista_fuerte
    gap_arriba = vela.open > vela_anterior.close
    cierra_50por_debajo = vela.close < vela_anterior.close - (vela_anterior.cuerpo * 0.5)
    return alcista_fuerte and gap_arriba and cierra_50por_debajo

def es_nube_clara(vela_anterior:Vela, vela:Vela) -> bool:
    bajista_fuerte = vela_anterior.es_bajista_fuerte
    gap_abajo = vela.open < vela_anterior.close
    cierra_50por_arriba = vela.close > vela_anterior.close + (vela_anterior.cuerpo * 0.5)
    return bajista_fuerte and gap_abajo and cierra_50por_arriba

def es_estrella_del_atardecer(vela_anterior:Vela, vela:Vela, vela_siguiente:Vela) -> bool:
    alcista_fuerte = vela_anterior.es_alcista_fuerte
    doji_o_cuerpo_pequeno = vela.es_doji or vela.cuerpo <= vela_anterior.cuerpo * 0.3
    gap_arriba = vela.open > vela_anterior.close
    bajista_fuerte = vela_siguiente.es_bajista_fuerte
    cierra_50por_debajo = vela_siguiente.close < vela_anterior.close - (vela_anterior.cuerpo * 0.5)
    return alcista_fuerte and doji_o_cuerpo_pequeno and bajista_fuerte and gap_arriba and cierra_50por_debajo

def es_estrella_del_amanecer(vela_anterior:Vela, vela:Vela, vela_siguiente:Vela) -> bool:
    bajista_fuerte = vela_anterior.es_bajista_fuerte
    doji_o_cuerpo_pequeno = vela.es_doji or vela.cuerpo <= vela_anterior.cuerpo * 0.3
    gap_abajo = vela.open < vela_anterior.close
    alcista_fuerte = vela_siguiente.es_alcista_fuerte
    cierra_50por_arriba = vela_siguiente.close > vela_anterior.close + (vela_anterior.cuerpo * 0.5)
    return bajista_fuerte and doji_o_cuerpo_pequeno and alcista_fuerte and gap_abajo and cierra_50por_arriba

def es_tres_cuervos_negros(vela1:Vela, vela2:Vela, vela3:Vela) -> bool:
    tres_velas_bajistas = vela1.es_bajista_fuerte and vela2.es_bajista_fuerte and vela3.es_bajista_fuerte
    abren_dentro_del_cuerpo_anterior = vela1.close < vela2.open < vela1.open and vela2.close < vela3.open < vela2.open       
    cierran_debajo_del_minimo_anterior = vela1.low > vela2.close and vela2.low > vela3.close
    return tres_velas_bajistas and abren_dentro_del_cuerpo_anterior and cierran_debajo_del_minimo_anterior

def es_tres_soldados_blancos(vela1:Vela, vela2:Vela, vela3:Vela) -> bool:
    tres_velas_alcistas = vela1.es_alcista_fuerte and vela2.es_alcista_fuerte and vela3.es_alcista_fuerte
    abren_dentro_del_cuerpo_anterior = vela1.close > vela2.open > vela1.open and vela2.close > vela3.open > vela2.open
    cierran_arriba_del_maximo_anterior = vela1.high < vela2.close and vela2.high < vela3.close
    return tres_velas_alcistas and abren_dentro_del_cuerpo_anterior and cierran_arriba_del_maximo_anterior

def es_tres_metodos_bajistas(vela1:Vela, vela2:Vela, vela3:Vela, vela4:Vela, vela5:Vela) -> bool:
    bajista_fuerte = vela1.es_bajista_fuerte
    grupo_alcista_debil = (vela1.close < vela2.open < vela1.open and vela1.close < vela2.close < vela1.open and
                            vela1.close < vela3.open < vela1.open and vela1.close < vela3.close < vela1.open and
                            vela1.close < vela4.open < vela1.open and vela1.close < vela4.close < vela1.open)
    cierre_debajo_del_minimo_inicial = vela5.close < vela1.close
    return bajista_fuerte and grupo_alcista_debil and cierre_debajo_del_minimo_inicial

def es_tres_metodos_alcistas(vela1:Vela, vela2:Vela, vela3:Vela, vela4:Vela, vela5:Vela) -> bool:
    alcista_fuerte = vela1.es_alcista_fuerte
    grupo_bajista_debil = (vela1.close > vela2.open > vela1.open and vela1.close > vela2.close > vela1.open and
                           vela1.close > vela3.open > vela1.open and vela1.close > vela3.close > vela1.open and
                           vela1.close > vela4.open > vela1.open and vela1.close > vela4.close > vela1.open)
    cierre_arriba_del_maximo_inicial = vela5.close > vela1.close
    return alcista_fuerte and grupo_bajista_debil and cierre_arriba_del_maximo_inicial

def es_doji_lapida(vela:Vela) -> bool:
    doji = vela.es_doji
    sombra_sup_larga = vela.sombra_sup > vela.cuerpo * 3
    sombra_inf_pequena = vela.sombra_inf <= vela.cuerpo
    return doji and sombra_sup_larga and sombra_inf_pequena

def es_doji_dragonfly(vela:Vela) -> bool:
    doji = vela.es_doji
    sombra_inf_larga = vela.sombra_inf > vela.cuerpo * 3
    sombra_sup_pequena = vela.sombra_sup <= vela.cuerpo
    return doji and sombra_inf_larga and sombra_sup_pequena

def es_doji_piernas_largas(vela:Vela) -> bool:
    doji = vela.es_doji
    sombra_sup_larga = vela.sombra_sup > vela.cuerpo * 3
    sombra_inf_larga = vela.sombra_inf > vela.cuerpo * 3
    return doji and sombra_sup_larga and sombra_inf_larga

def buscar_patrones(velas:list[Vela]) -> list[str]:
    patrones_encontrados = []
    if len(velas) <= 1:
        return patrones_encontrados
    
    if velas[-2].es_estrella_fugaz():
        patrones_encontrados.append("Estrella Fugaz")
    if velas[-2].es_hombre_colgado():
        patrones_encontrados.append("Hombre Colgado")
    if velas[-2].es_martillo():
        patrones_encontrados.append("Martillo")
    if velas[-2].es_doji_lapida():
        patrones_encontrados.append("Doji Lápida")
    if velas[-2].es_doji_dragonfly():
        patrones_encontrados.append("Doji Dragonfly")
    if velas[-2].es_doji_piernas_largas():
        patrones_encontrados.append("Doji Piernas Largas")
    if len(velas) <= 2:
        return patrones_encontrados
    
    if es_envolvente_alcista(velas[-3], velas[-2]):
        patrones_encontrados.append("Envolvente Alcista")
    if es_envolvente_bajista(velas[-3], velas[-2]):
        patrones_encontrados.append("Envolvente Bajista")
    if es_nube_oscura(velas[-3], velas[-2]):
        patrones_encontrados.append("Nube Oscura")
    if es_nube_clara(velas[-3], velas[-2]):
        patrones_encontrados.append("Nube Clara")
    if len(velas) <= 3:
        return patrones_encontrados
    
    if es_estrella_del_atardecer(velas[-4], velas[-3], velas[-2]):
        patrones_encontrados.append("Estrella del Atardecer")
    if es_estrella_del_amanecer(velas[-4], velas[-3], velas[-2]):
        patrones_encontrados.append("Estrella del Amanecer")
    if es_tres_cuervos_negros(velas[-4], velas[-3], velas[-2]):
        patrones_encontrados.append("Tres Cuervos Negros")
    if es_tres_soldados_blancos(velas[-4], velas[-3], velas[-2]):
        patrones_encontrados.append("Tres Soldados Blancos")
    if len(velas) <= 4:
        return patrones_encontrados
    
    if es_tres_metodos_bajistas(velas[-6], velas[-5], velas[-4], velas[-3], velas[-2]):
        patrones_encontrados.append("Tres Métodos Bajistas")
    if es_tres_metodos_alcistas(velas[-6], velas[-5], velas[-4], velas[-3], velas[-2]):
        patrones_encontrados.append("Tres Métodos Alcistas")
    return patrones_encontrados