class ToolHistogramaVariable extends GEOOSTool {
    constructor(id, name, createOptions) {
        let config = {
            layerId:createOptions.layerId, object:createOptions.object
        }
        super("histograma-variable", id, name, config);
        this.data = {aborter:null, grid:null}        
        this.timeChangeListener = async _ => await this.timeChanged();
        this.objectMoveListener = async objectId => await this.objectMoved(objectId);
    }

    get object() {return this.config.object}
    get layerId() {return this.config.layerId}
    get layer() {return window.geoos.getActiveGroup().getLayer(this.layerId)}
    get mainPanelPath() {
        let basePath = window.geoos.getPlugin("demo").basePath;
        return basePath + "/tools/histogramaVariable/HistogramaVariableMain"
    }

    async activate() {
        super.activate();
        window.geoos.events.on("portal", "timeChange", this.timeChangeListener);
        window.geoos.events.on("userObject", "moved", this.objectMoveListener);
    }
    async deactivate() {
        window.geoos.events.remove(this.timeChangeListener);
        window.geoos.events.remove(this.objectMoveListener);
        super.deactivate();
    }

    getPropertyPanels() {
        return [{
            code:"tool-props", name:"Nombre del Análisis", path:"./propertyPanels/PropToolName"
        }, {
            code:"raster-var", name:"Selección de Variable", path:"./propertyPanels/SelectRasterVariable"
        }]
    }

    get caption() {
        if (this.variable) return this.name + " / " + this.variable.name;
        return this.name;
    }

    get variable() {
        if (this._variable) return this._variable;
        if (this.config.variable) {
            this._variable = GEOOSQuery.deserialize(this.config.variable)
            return this._variable;
        } else {
            return null;
        }
    }
    set variable(v) {
        this._variable = v;
        this.config.variable = v?v.serialize():null;
        window.geoos.events.trigger("tools", "renamed", this);
        window.geoos.events.trigger("tools", "propertyChange", this);
        this.refresh();
    }

    createDefaultConfig() {
        this.config.variable = {type:"raster", id:"default", format:"grid", geoServer:"geoos-main", dataSet:"noaa-gfs4", variable:"TMP_2"}
    }

    get bounds() {
        if (this.object.type == "user-object/area") {
            let area = window.geoos.getUserObject(this.object.code);
            return {n:area.lat0, s:area.lat1, w:area.lng0, e:area.lng1};
        }
        throw "Object type " + this.object.type + " not handled";
    }
    refresh() {
        this.startWorking();
        if (this.data.aborter) {
            this.data.aborter.abort();
            this.data.aborter = null;
        }
        if (!this.variable) this.createDefaultConfig();
        let b = this.bounds;
        let {promise, controller} = this.variable.query({
            format:"grid", n:b.n, s:b.s, w:b.w, e:b.e
        });
        this.data.aborter = controller;
        promise
            .then(res => {
                this.data.aborter = null;
                this.data.grid = res;
                if (this.mainPanel) this.mainPanel.refresh();
                this.finishWorking();
            }).catch(err => {
                this.finishWorking();
                this.data.aborter = null;
                console.error(err)
            })

    }

    async timeChanged() {
        if (this.variable && this.variable.dependsOnTime) {
            if (this.mainPanel) {
                this.refresh();                
            } else {
                this.data.grid = null;
            }            
        }                      
    }

    async objectMoved(objectId) {
        if (this.object.type.startsWith("user-object") && objectId == this.object.code) {
            if (this.mainPanel) {
                this.refresh();                
            } else {
                this.data.grid = null;
            }    
        }
    }

    async isValid() {
        if (this.object.type.startsWith("user-object/")) return window.geoos.getUserObject(this.object.code)?true:false;
        return true;
    }
}

GEOOSTool.register("histograma-variable", "Histograma Variable en Área", {    
    creationPanelPath:"./creationPanels/ToolObjectSelector",
    creationPanelOptions:{
        allowedObjectTypes:["user-object/area"],
        caption:"Seleccione el Área para el Análisis"
    },
    icon:window.geoos.getPlugin("demo").basePath + "/tools/img/histograma.png",
    menuIcon:window.geoos.getPlugin("demo").basePath + "/tools/img/histograma.svg",
    menuIconStyles:{filter:"invert(1)"},
    menuLabel:"Histograma",
    factory:(name, creationPanelResult) => (new ToolHistogramaVariable(null, name, creationPanelResult)),
    deserialize:(id, name, config) => {
        let tool = new ToolHistogramaVariable(id, name, {layerId:config.layerId, object:config.object})
        tool.config = config;
        return tool;
    }        
})