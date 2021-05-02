class CalculadorSuperficieMain extends ZCustomController {
    onThis_init(options) {
        this.analyzer = options.analyzer;
        this.refresh();
    }

    doResize() {
        // Ejemplo de captura de tamaño 
        let size = this.size;   
    }

    refresh() {
        if (!isNaN(this.analyzer.superficie)) {
            this.lblResultado.text = this.analyzer.superficie.toLocaleString() + " [m2]";
        } 
        this.triggerEvent("setCaption", "Superficie Calculada");
    }
}
ZVC.export(CalculadorSuperficieMain);