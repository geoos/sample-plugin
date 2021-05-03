class HistogramaVariableMain extends ZCustomController {
    async onThis_init(options) {
        this.tool = options.tool;
    }

    onThis_activated() {this.tool.mainPanel = this;}
    onThis_deactivated() {this.tool.mainPanel = null;}

    doResize() {
        let size = this.size;
        this.mainPanelContainer.size = size;
        this.histogramaContainer.size = {width:size.width, height:size.height - 10};
        if (this.chart) this.chart.setSize(this.histogramaContainer.width, this.histogramaContainer.height);        
    }
    async refresh() {
        let grid = this.tool.data.grid;
        console.log("grid", grid);
        if (!grid || grid.min == grid.max) return;
        // Recorrer filas y columnas en la matriz retornada
        let data = [];
        grid.rows.forEach(row => {
            row.forEach(v => {
                if (v !== null && v !== undefined) data.push(v);                
            })
        });
        this.chart = Highcharts.chart('histogramaContainer', {
            title: {
                text: 'Análisis Variable'
            },
        
            xAxis: [{
                title: { text: 'Data' },
                alignTicks: false
            }, {
                title: { text: 'Histogram' },
                alignTicks: false,
                opposite: true
            }],
        
            yAxis: [{
                title: { text: 'Data' }
            }, {
                title: { text: 'Histogram' },
                opposite: true
            }],
        
            plotOptions: {
                histogram: {
                    accessibility: {
                        pointDescriptionFormatter: point => {
                            let ix = point.index + 1,
                                x1 = point.x.toFixed(2),
                                x2 = point.x2.toFixed(2),
                                val = point.y;
                            return ix + '. ' + x1 + ' to ' + x2 + ', ' + val + '.';
                        }
                    }
                }
            },
        
            series: [{
                name: 'Histogram',
                type: 'histogram',
                xAxis: 1,
                yAxis: 1,
                baseSeries: 's1',
                zIndex: -1
            }, {
                name: 'Data',
                type: 'scatter',
                data: data,
                id: 's1',
                marker: {
                    radius: 1.5
                }
            }]
        });      
    }
}
ZVC.export(HistogramaVariableMain);