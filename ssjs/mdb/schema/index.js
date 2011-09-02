/**
 * This is a dynamic loader that includes all of the data model objects.
 * @author Corey Butler
 */
var dir		= './mdb/schema/',
	files 	= require('fs').readdirSync( dir );

files.forEach( function( file ) {

	//Convert filename to array
	a = file.split('.');

	//Export the schema object
	if ( file !== 'index.js' && a[a.length-1].toLowerCase() === 'js' )
		exports[a[0]] = require( './' + file )[a[0]];

});