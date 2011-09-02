var Schema 			= require('mongoose').Schema;

/**
 * Represents a person.
 * @name Person
 * @version 1.0
 * @class Person
 * @requires mongoose
 * @augments Schema
 * @property {String} gn Given Name. Optional.
 * @property {String} sn Surname. Optional.
 */
exports.Person = Person = new Schema({

	//Require the question and index it.
	gn	: String,
	
	//An optional answer to the question.
	sn	: String
	
});


Person.path('gn').set( function ( v ) {
	return capitalize(v);
});

Person.path('sn').set( function ( v ) {
	return capitalize(v);
});


var capitalize = function(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}