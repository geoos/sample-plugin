class GEOOSDemoPlugin extends GEOOSPlugIn {
    get code() {return "demo"}    
    get includeFiles() {return ["analysis/calculador-superficie.js", "tools/histograma-variable.js"]}
}

(new GEOOSDemoPlugin())

