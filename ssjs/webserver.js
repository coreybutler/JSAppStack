var http	= require('http'),
	colors	= require('colors'),
	wp		= require('http-proxy'),
	express	= require('express'),
	app		= express.createServer(),
	cfg		= require('./config');
	
	
//App Configuration
app.use( function ( req, res, next ) {
	res.removeHeader('X-Powered-By');
	res.header('X-Powered-By','Awesome Sauce');
	next();
});
app.use(express.bodyParser());
app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));

//Set the static file serving directory
app.use(express.static(__dirname + '/../'));

//Basic GET
app.get('/', function(req,res){
	
	//Ref expressjs.com
	
	//Really simple output
	//res.send('hello world');
	
	//JSON output
	res.contentType('application/json');
	res.send({test:'json goes here.'});
	
	//Standard HTTP Status Code
	//res.send(501);
});


//Listen
app.listen(cfg.webport);
console.log('Now listening on port '.cyan+' '+cfg.webport.toString().underline.green);
