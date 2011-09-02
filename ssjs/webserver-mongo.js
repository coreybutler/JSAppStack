var http			= require('http'),
	colors			= require('colors'),
	express			= require('express'),
	app				= express.createServer(),
	sys				= require('sys'),
	MongoDatabase 	= require('./mdb'),
	cfg				= require('./config');
	
	
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




/**
 * Database
 * Leverages the MDB approach found at http://github.com/coreybutler/mdb
 *
 */

var database = new MongoDatabase({
				server:			cfg.mongo.server,
				port:			cfg.mongo.port,
				store:			cfg.mongo.database,
				username: 		cfg.mongo.username || '',
				password: 		cfg.mongo.password || '',
				debug:			true,
				autoConnect:	true
			});


/**
 * RESTful API
 * Provides a middleware API for Sencha to communicate with MongoDB.
 */

//Create
app.post('/mongo', function( req, res ){

	var form = JSON.parse( req.rawBody ),
		question = new database.Collections.Question();
	
	question.q = form.q;
	question.a = form.a;
	
	question.save( function( err ){
		
		//Respond with JSON
		res.contentType('application/json');
		if ( err ) {
			res.send({ success: false, error: err });
			console.log('>> Error adding question!'.red.bold);
		} else {
			res.send({ success: true });
			console.log('>> Added question: '.yellow+form.q.toString().bold.red);
		}
	});

});

//Read
app.get('/mongo', function( req, res ){
	
	database.Collections.Question.find({}, function( err, docs ) {
		if ( err ) throw err;
		
		//Respond with JSON
		res.contentType('application/json');
		res.send({ questions: docs, total_rows: docs.length });
		
		console.log('>> Retrieved questions from MongoDB.'.yellow);
		
	});
	
});

//Update
app.put('/mongo/:id', function( req, res ){
	
	var form = JSON.parse( req.rawBody );
	
	//Modify the object
	database.Collections.Question.update( 
		{ _id:req.params.id }, 
		{ q: form.q, a: form.a },
		{ multi: false },
		function ( error ) {
			if ( error ) {
				res.send({ success: false, error: error });
				console.log('>> Error updating question '.red+form._id.toString().bold.red.underline);
			} else {
				res.send({ success: true });
				console.log('>> Updated question '.yellow+form._id.toString().bold.red);
			}
		}
	);
	
});

//Delete
app.del('/mongo/:id', function( req, res ){
	
	var form = JSON.parse( req.rawBody );
	
	database.Collections.Question.remove( { _id:req.params.id }, function( err ){
		
		res.contentType('application/json');
		if ( err ) {
			res.send({ success: false, error: err });
			console.log('>> Error deleting question '.red+form._id.toString().bold.red.underline);
		} else {
			res.send({ success: true });
			console.log('>> Deleted question '.yellow+form._id.toString().bold.red);
		}
	});
	
});




//Listen
app.listen(cfg.mongoport);
console.log('Now listening on port '.cyan+' '+cfg.mongoport.toString().underline.green);
