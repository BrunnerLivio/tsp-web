var tspReader = require('./tsp-reader/tsp-reader'),
    express = require('express'),
    app = express(),
    http = require('http').createServer(app);
    
app.set("ipaddr", "127.0.0.1");

app.set("port", 3000);
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

http.listen(app.get("port"), app.get("ipaddr"), function() {
  console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
});