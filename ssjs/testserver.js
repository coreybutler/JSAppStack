//Require the HTTP module
var http	= require('http'),
	colors	= require('colors'),
	sys=require('sys');
	port	= 80;

//Create the server
http.createServer(function (req, res) {
	
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
  
}).listen(port, "127.0.0.1");


//Indicate the server is running
console.log('Server running at http://127.0.0.1:'.green+port.toString().cyan+'/'.green);