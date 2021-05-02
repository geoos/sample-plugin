class GEOOSDemoPlugin extends GEOOSPlugIn {
    get code() {return "demo"}    
    get includeFiles() {return ["analysis/calculador-superficie.js"]}
}

(new GEOOSDemoPlugin())