var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());

var buffer = fs.readFileSync('index.html');
var content = buffer.toString('utf-8');

app.get('/', function(request, response) {
  response.send(content);
});

var envPort = require('./environmentPorts');

//var port = process.env.PORT || 5000;
var port = envPort.port;
app.listen(port, function() {
  console.log("Listening on " + port);
});
