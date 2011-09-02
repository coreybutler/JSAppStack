var http	= require('http'),
	colors	= require('colors'),
	webproxy= require('http-proxy'),
	cfg		= require('./config'),
	express	= require('express'),
	app		= express.createServer();




/**
 * Standard web server (port 80)
 * The proxy is necessary to separate regular web traffic and traffic directed 
 * to a remote CouchDB host. Remote connections to CouchDB are HTTP connections.
 * When using Ext JS, you must use a JSONP proxy to communicate with a remote
 * domain, but we want to leverage the REST data proxy to simplify app development.
 * This proxy tricks the browser into thinking the remote domain is the same
 * as the requesting domain.
 */
webproxy.createServer(function (req, res, proxy) {
  
	var buffer = proxy.buffer(req);

	if ( req.url.indexOf('/futurejs') < 0 ) {
		
		//Proxy requests on a specific URL to the CouchDB server
		console.log('>> '.yellow+'Proxy '.blue+req.url.blue.underline+' to port '.blue+cfg.webport.toString().bold.red);
		proxy.proxyRequest(req, res, {
			host: 'localhost',
			port: cfg.webport, 
			buffer: buffer
		});
		
	} else {
		
		/**
		 * CouchDB proxy
		 * - Used to bypass cross-domain limitations (i.e. allow use of Ext REST proxy with a remote domain).
		 */
		console.log('>> '.yellow+'Proxy '.blue+req.url.blue.underline+' to '.blue+cfg.couchserver.bold.red);

		//Set the host header to bypass any cross domain limitations
		req.headers.host = cfg.couchserver;
		
		//Proxy the request to the Couch Server
		proxy.proxyRequest( req, res, {
			host: cfg.couchserver,
			port: 80//,
			//headers
		});
		
	}
    
}).listen(80);
console.log('\n--> Proxying standard web requests to port '.cyan+cfg.webport.toString().bold.red);
console.log('--> Proxying DB requests to '.cyan+cfg.couchserver.bold.yellow+'\n\n'+'LIVE MONITORING'.underline.yellow+'\n');