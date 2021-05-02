class GEOOSAnalyzerCalculadorSuperficie extends GEOOSAnalyzer {
    constructor(o, listeners) {
        super(o, "calculador-superficie", listeners);
        this.moveListener = id => {
            if (this.object.type == "user-object" && this.object.code == id) this.refresca()
        }
        window.geoos.events.on("userObject", "moved", this.moveListener);
        this.refresca();
    }
    refresca() {
        this.startWorking();
        // Se simula un proceso asíncrono (200 ms)
        // La llamada a finishWorking dispara el refrescado (método refresh) en el panel Principal del Analizador GEOOS
        setTimeout( _ => {
            let uo = window.geoos.getUserObject(this.object.code);
            let poligono = turf.polygon([[[uo.lng0, uo.lat0], [uo.lng0, uo.lat1], [uo.lng1, uo.lat1], [uo.lng1, uo.lat0], [uo.lng0, uo.lat0]]]);
            this.superficie = turf.area(poligono);
            this.finishWorking();    
        }, 200)
    }
    destroy() {
        window.geoos.events.remove(this.moveListener);
    }
    getPropertyPanels() {return []}
    getMainPanel() {
        let basePath = window.geoos.getPlugin("demo").basePath;
        return basePath + "/analysis/calculadorSuperficie/CalculadorSuperficieMain"
    }
}

GEOOSAnalyzer.register("calculador-superficie", "Calcular Superficie", 
    o => {
        // El analizador aplica sólo a user-objects de tipo "area" (no Puntos)
        if (o.type != "user-object") return false;
        let uo = window.geoos.getUserObject(o.code);
        return uo && uo.type == "area";
    }, 
    (o, listeners) => (new GEOOSAnalyzerCalculadorSuperficie(o, listeners)),
    250
)