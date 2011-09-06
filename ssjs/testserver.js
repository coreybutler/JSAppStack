//Require the HTTP module
var http	= require('http'),
	colors	= require('colors'),
<<<<<<< HEAD
	host	= 'localhost',
=======
>>>>>>> 9ec3a76b5af0264dfe565aeb6e5d8cb214fc09e9
	port	= 80;

//Create the server
http.createServer(function (req, res) {
	
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
  
}).listen(port, host);


//Indicate the server is running
console.log('Server running at http://'.green+host.cyan+':'.green+port.toString().cyan+'/'.green);
