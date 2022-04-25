//Check if we are running in production environment or development env
const http = require('http');
const os = require('os');

console.log("BuildYourHome shopping app starting...");

var handler = function(request, response) {
  console.log("Received request from " + request.connection.remoteAddress);
  response.writeHead(200);
  response.end("This is version 2 running in pod " + os.hostname() + "\n");
};

var www = http.createServer(handler);
www.listen(5000);