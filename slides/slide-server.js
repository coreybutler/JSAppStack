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

// For each connection made add the client to the
// list of clients.
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

// Advancing will... move the slides forward!
app.get('/next', function(req, res) {
  // Increment and send over socket
  state++;
  if (state > (slideCount-1)) {
    state = wrap ? 0 : (slideCount-1);
  }
  nav(res);
});

// Receding will... move the slides backwards!
app.get('/previous', function(req, res) {
  state--;
  if (state < 0) {
    state = wrap ? (slideCount-1) : 0;
  }
  nav(res);
});

// Reset will not refresh cornfication, but
// will send the slides back to the beginning.
app.get('/reset', function(req, res) {
  state = 0;
  nav(res);
});

// Send the controller for any other request to this
// Node.js server.
app.get('*', function(req, res) {
  fs.readFile('controller.html', function(err, buffer) {
    res.send(buffer.toString());
  });
});