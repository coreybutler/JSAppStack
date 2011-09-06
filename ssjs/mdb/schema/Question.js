var Schema 			= require('mongoose').Schema;
	//Person			= require('./Person');

/**
 * Represents a question/answer.
 * @name Question
 * @version 1.0
 * @class Question
 * @requires mongoose
 * @augments Schema
 * @property {String} q Question. Required.
 * @property {String} a Answer. Optional.
 * @property {Date} d Date when the question was asked. Defaults to current date.
 * @property {Array} p Person who asked the question.
 */
exports.Question = Question = new Schema({

	id: Schema.ObjectId,

	//Require the question and index it.
	q: { type: String, required: true, index: true },
	
	//An optional answer to the question.
	a: { type: String, required: false },
	
	//The date when the question was asked.
	d: { type: Date, required: true, index: true, 'default': Date.now }
	
	//Optional question author
	//p: [Person]
	
});


/**
 * Validate data before persisting to MongoDB
 */

Question.pre('save', function( next ){
	
	//Make sure the question is substantial
	if ( this.q.trim().length < 3 )
		throw Error( 'Question is not long enough.' );
	
	//Everything is OK, continue processing
	next();
});


/**
 * Make sure the questions are formatted correctly and professionally.
 */
Question.path('q').set( function ( v ) {

	//Make sure there is a question mark at the end.
	if ( v.indexOf('?') != v.length-1 )
		v += '?';
		
	return capitalize(v);
});

Question.path('a').set( function ( v ) {
  return capitalize(v);
});


var capitalize = function(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
