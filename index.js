function startHTTPServer() {
    try {
        const express = require('express');
        const app = express();
        const bodyParser = require('body-parser');
        const http = require('http');
        const cors = require("cors");
        app.use(cors());
        app.use("/", express.static(__dirname + "/www"));
        app.use(bodyParser.urlencoded({limit: '50mb', extended:true}));
        app.use(bodyParser.json({limit: '50mb', extended: true}));
        app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
            next();
        });        
        let port = 8090;
        httpServer = http.createServer(app);
        httpServer.listen(port, "0.0.0.0", _ => {
            console.log("[GEOOS Demo Plugin HTTP Server] Listenning at Port " + port);
        });
    } catch(error) {
        console.error(error);
    }
}

startHTTPServer();