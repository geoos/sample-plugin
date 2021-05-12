class DataPointsVisualizerHelper extends RasterVisualizer {
    static applyToLayer(layer) {
        return layer.variable.queries.includes("grid");
    }

    constructor(layer, config) {
        super(layer);
        config = config || {};
        this.config = config;
        this.query = new RasterQuery(this.layer.geoServer, this.layer.dataSet, this.layer.variable, "grid");
        this.aborter = null;
    }
    get code() {return "data-points"}
    get name() {return "Puntos con Datos"}

    async create() {
        this.visualizer = this.layer.konvaLeafletLayer.addVisualizer(this.code, new DataPointsVisualizer({
            zIndex:2,
            onBeforeUpdate: _ => {this.startQuery(); return false}
        }));
        this.timeChangeListener = _ => {
            if (this.layer.config.dataSet.temporality != "none" && this.active) this.startQuery()
        }
        window.geoos.events.on("portal", "timeChange", this.timeChangeListener);
        this.startQuery();
    }
    async destroy() {
        window.geoos.events.remove(this.timeChangeListener);
        if (this.aborter) {
            this.aborter.abort();
            this.aborter = null;
        }
        if (this.layer.konvaLeafletLayer) this.layer.konvaLeafletLayer.removeVisualizer(this.code);
        this.visualizer = null;
    }
    update() {
        if (this.active && this.layer.active && this.layer.group.active) {
            this.layer.konvaLeafletLayer.getVisualizer(this.code).update();
        }
    }
    startQuery(cb) {
        if (this.aborter) {
            this.aborter.abort();
            this.finishWorking();
        }
        this.startWorking();
        let {promise, controller} = this.query.query({margin:1, level:this.layer.level});
        this.aborter = controller;
        let visualizer = this.layer.konvaLeafletLayer.getVisualizer(this.code)
        promise
            .then(ret => {
                this.aborter = null;
                this.finishWorking();
                window.geoos.events.trigger("visualizer", "results", this);
                visualizer.setGridData(ret.foundBox, ret.rows, ret.nrows, ret.ncols);
                if (cb) cb();
            })
            .catch(err => {
                this.aborter = null;
                if (err != "aborted" && err.toString().indexOf("abort") < 0) {
                    console.error(err);
                    this.finishWorking();
                }
                visualizer.setGridData(null, null, null, null);
                if (cb) cb(err);
            })
    }

    getPropertyPanels() {
        return []
    }
}

RasterVisualizer.registerVisualizerClass("data-points", DataPointsVisualizerHelper);