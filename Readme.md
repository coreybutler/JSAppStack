# The Future of JS App Architecture
The example code in this repository is part of the presentation given to the Austin Sencha meetup group on 9/6/2011.

# References

Corey provides references on his blog at http://www.coreybutler.com. He also maintains some NodeJS tools and scripts on http://github.com/coreybutler.
The MDB approach used in the MongoDB examples is available freely on the Github site (MDB). The slides from this presentation will be posted on Slideshare.

### NodeJS
- NodeJS http://nodejs.org
- NodeJS Modules https://github.com/joyent/node/wiki/modules
- Node Package Manager (npm) http://npmjs.org
- Express http://expressjs.com


### NoSQL References
- Selecting a NoSQL DB http://kkovacs.eu/cassandra-vs-mongodb-vs-couchdb-vs-redis
- Mongoose (MongoDB Schema) http://mongoosejs.com
- Socket IO http://socket.io

### Free NoSQL Databases
- CouchDB http://www.iriscouch.com
- MongoDB http://www.mongohq.com
- Redis http://www.redistogo.com


# The Examples

The examples in the presentation implement several different concepts. Most of the examples use some npm modules.

### Map/Reduce Example
Notice there is a gist at https://gist.github.com/1186538 showing rudimentary map/reduce (updated).

	{
		"_id": "_design/questions",
		"language": "javascript",
		"views": {
       		"all": {
           		"map": "function(doc) { emit(null, doc) }"
       		}
   		}
	}

_*CouchDB example_

### Obtain NPM Modules

In a terminal or ssh window, navigate to the ssjs directory. You will need NPM installed to continue.

	npm install express http-proxy colors mongoose http-console


### Testing NodeJS Installation

To test your NodeJS installation, execute the following from the ssjs directory.

	sudo node testserver.js

In your browser, you should see the words "Hello World" displayed when you point to http://127.0.0.1

### CouchDB

This example simulates the ability to connect directly to a CouchDB server with no middleware. Due to browser restrictions
and cross-domain security policies, a simple proxy was created for this example. In a local environment with CouchDB installed,
this proxy would be unnecessary. The proxy simply modifies an HTTP header to make the browser believe it is communicating with
the same domain.

To start simulating a direct connection, open a terminal or ssh window and navigate to the ssjs directory and execute the following:

	sudo node couchproxy.js

In a second terminal or ssh window, navigate to the same ssjs directory and execute the following:

	sudo node webserver.js

Using your favorite browser, navigate to http://127.0.0.1/couch.htm. Firefox with Firebug installed is recommended to see what's happening behind the scenes.

REMEMBER: There is a challenge with the Sencha REST data proxy and CouchDB that requires a workaround. See http://guide.couchdb.org/draft/api.html about half 
way down (Revisions) for information. This only happens when modifying or deleting a record.

USE CASE: This example is suitable for development only. I don't ever recommend using a direct connection from a public-facing app to a NoSQL database.
Using a middleware layer or API allows developers to maintain data integrity, security, and control over their application. 

### MongoDB

This example highlights the use of NodeJS and the Mongoose package as a middleware layer for Sencha. Mongoose helps enforce data integrity in a fashion
more familiar to traditional RDBMS users. By using the Express module, it's possible to create a very "Sencha Friendly" API for your Ext and Touch applications.

To run the example, make sure the other examples are not running (i.e. the CouchDB examples). From the ssjs directory, execute the following:

	sudo node webserver-mongo.js

In your browser, navigate to http://127.0.0.1/mongo.htm to use the application.