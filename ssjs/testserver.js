//Require the HTTP module
var http	= require('http'),
	colors	= require('colors'),
	host	= 'localhost',
	port	= 80;

//Create the server
http.createServer(function (req, res) {
	
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
  
}).listen(port, host);


//Indicate the server is running
console.log('Server running at '.green+'http://'.cyan+host.cyan+':'.green+port.toString().cyan);
