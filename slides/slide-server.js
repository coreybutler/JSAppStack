/*
 * Code derived from a similar example by Tim Branyan
 * from the following blog post:
 * 
 *   http://weblog.bocoup.com/synchronizing-html5-slides-with-node-js
 * 
 */

// Required dependancies
var app = require('express').createServer();
var io = require('socket.io').listen(app);
var fs = require('fs');

// State is the current slide position
var state = 0;

// Config info about the current slideshow. Note that this demo
// server can only handle state for one slideshow at a time, although
// it could easily be extended to manage state uniquely for multiple
// slideshows, each with multiple clients simultaneously.
var clientConfigured = false,
    slideCount = 0,
    wrap = false;

// Listen on some high level port to avoid dealing
// with authbind or root user privileges.
app.listen(1987);
console.log('slide-server now listening on port 1987...');

// For each connection do some setup and initial sync
io.sockets.on('connection', function(socket) {
    socket.on('config', function(o) {
        console.log('received client config');
        slideCount = o.slideCount || 99;
        wrap = o.wrap;
        clientConfigured = true;
    });
    
    if (!clientConfigured) {
        socket.emit('config');
    }
    
    socket.emit('nav', {
        page: state
    });
    
    socket.on('sync', function() {
        socket.emit('sync', {
            page: state
        });
    });
    
    socket.on('disconnect', function() {
        //console.log('client disconnected');
    });
});

function nav(response) {
    io.sockets.emit('nav', { page: state });
    response.send(state);
}

// Next will... move the slides forward!
app.get('/next', function(req, res) {
  // Increment and send over socket
  state++;
  if (state > (slideCount-1)) {
    state = wrap ? 0 : (slideCount-1);
  }
  nav(res);
});

// Previous will... move the slides backwards!
app.get('/previous', function(req, res) {
  state--;
  if (state < 0) {
    state = wrap ? (slideCount-1) : 0;
  }
  nav(res);
});

// Reset to the first slide
app.get('/reset', function(req, res) {
  state = 0;
  nav(res);
});

// Handle other requests
app.get('*', function(req, res) {
  var ua = req.headers['user-agent'],
      controller = 'controller.html';
      
  if (ua && ua.toLowerCase().indexOf('iphone') > -1) {
      // redirect to a Touch-optimized controller for iPhone user agents
      controller = 'controller-touch.html';
  }
  fs.readFile(controller, function(err, buffer) {
    res.send(buffer.toString());
  });
});


//Presentation Specific Code
app.get('/server', function(req,res) {
	getNetworkIP(function(error, ip){
		if (error) console.log('error:',error);
		
		res.end(ip);
	}, false);
});

var getNetworkIP = (function () {
    var ignoreRE = /^(127\.0\.0\.1|::1|fe80(:1)?::1(%.*)?)$/i;

    var exec = require('child_process').exec;
    var cached;    
    var command;
    var filterRE;

    switch (process.platform) {
    // TODO: implement for OSs without ifconfig command
    case 'darwin':
         command = 'ifconfig';
         filterRE = /\binet\s+([^\s]+)/g;
         // filterRE = /\binet6\s+([^\s]+)/g; // IPv6
         break;
    default:
         command = 'ifconfig';
         filterRE = /\binet\b[^:]+:\s*([^\s]+)/g;
         // filterRE = /\binet6[^:]+:\s*([^\s]+)/g; // IPv6
         break;
    }

    return function (callback, bypassCache) {
         // get cached value
        if (cached && !bypassCache) {
            callback(null, cached);
            return;
        }
        // system call
        exec(command, function (error, stdout, sterr) {
            var ips = [];
            // extract IPs
            var matches = stdout.match(filterRE);
            // JS has no lookbehind REs, so we need a trick
            for (var i = 0; i < matches.length; i++) {
                ips.push(matches[i].replace(filterRE, '$1'));
            }

            // filter BS
            for (var i = 0, l = ips.length; i < l; i++) {
                if (!ignoreRE.test(ips[i])) {
                    //if (!error) {
                        cached = ips[i];
                    //}
                    callback(error, ips[i]);
                    return;
                }
            }
            // nothing found
            callback(error, null);
        });
    };
})();
