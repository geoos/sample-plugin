class GEOOSDemoPlugin extends GEOOSPlugIn {
    get code() {return "demo"}    
    get includeFiles() {return [
        "analysis/calculador-superficie.js", 
        "tools/histograma-variable.js",
        "raster-visualizers/dataPoints/data-points.js", "raster-visualizers/dataPoints/DataPointsVisualizer.js" 
    ]}
}

(new GEOOSDemoPlugin())

