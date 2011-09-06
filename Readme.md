# The Future of JS App Architecture
The example code in this repository is part of the presentation given to the Austin Sencha meetup group on 9/6/2011.

## Requirements and Setup

1. Clone (or fork) this repo (you'll end up with something like `[your root]/JSAppStack/`)
2. Install [Node](http://nodejs.org) if needed. Note that these demos were built with version 0.4.11.
3. Install [npm](http://npmjs.org) if needed. These demos require version 1.0.0 or greater (currently 1.0.26).
3. Install the following npm modules (from the `JSAppStack/ssjs/` directory):

	npm install express mongoose colors http-proxy 

You should end up with something like this in the console:

	colors@0.5.0 ./node_modules/colors 
	express@2.4.6 ./node_modules/express 
	├── mime@1.2.2
	├── qs@0.3.1
	└── connect@1.7.0
	mongoose@2.1.0 ./node_modules/mongoose 
	├── hooks@0.1.9
	└── mongodb@0.9.6-7
	http-proxy@0.6.6 ./node_modules/http-proxy 
	├── pkginfo@0.2.2
	└── optimist@0.2.6

_**NOTE:** You may need to install using `sudo`. You can also install globally by appending `-g` to the command above._

---

## The Examples

The examples in the presentation implement several different concepts. Most of the examples use some npm modules.

### Verifying the NodeJS Installation

To verify that your NodeJS installation works, execute the following from the `/ssjs` directory.

	sudo node testserver.js

You should see this in the console:

	Server running at http://localhost:80/

In your browser, you should see the words "Hello World" displayed when you point to [http://localhost](http://localhost)

_**NOTE:** Most examples in this demonstration run on the standard port :80 (or :81) of localhost. If you are already running another web server (like Apache) locally you may need to stop it temporarily while testing these examples._

After verifying that node works, you can exit the server by typing `Ctrl-C` into the console.

### CouchDB

This example simulates the ability to connect directly to a CouchDB server with no middleware. For simplicity, this example uses [Iriscouch.com](http://iriscouch.com) as our hosted DB. Due to browser restrictions and cross-domain security policies, a simple proxy was created for this example. In a local environment with CouchDB installed, this proxy would be unnecessary. The proxy simply modifies an HTTP header to make the browser believe it is communicating with the same domain.

To start simulating a direct connection, open a terminal or ssh window and navigate to the `JSAppStack/ssjs/` directory and execute the following:

	sudo node couchproxy.js

This will start the proxy server and it will now wait for requests to proxy for the demo application. You will not connect directly to this server.

Open a second terminal or ssh window, then navigate to the same `ssjs/` directory and execute the following:

	sudo node webserver.js

This will start the web server that will host the demo application.

Using your favorite browser, navigate to [http://localhost/couch.htm](http://localhost/couch.htm). You can experiment with adding or deleting questions that get persisted remotely.

Firefox with Firebug installed (or Chrome with dev tools) is recommended to see what's happening behind the scenes. You can also watch the logging that occurs in both active console windows as each request is executed.

**REMEMBER**: There is a challenge with the Sencha REST data proxy and CouchDB that requires a workaround (Ext does not automatically handle the `_rev` attribute that Couch requires). See [http://guide.couchdb.org/draft/api.html](http://guide.couchdb.org/draft/api.html) about half way down (Revisions) for more information. This is only an issue when modifying or deleting a record.

**USE CASE**: This example is suitable for testing or proof-of-concept development only. Using a middleware layer or API (as in the following examples) is highly recommended as it allows developers to enforce data integrity, security, and maintain control over their application.

**We don't ever recommend using a direct connection from a public-facing app to a NoSQL database.**

When you are done with the example you can exit the server by typing `Ctrl-C` into the console.

### MongoDB

This example shows the same question/answer demo application, but highlights the use of the Mongoose package as a middleware layer for Node and Ext JS. Mongoose helps enforce data integrity in a fashion more familiar to traditional RDBMS users. By using the Express module, it's possible to create a very "Sencha Friendly" API for your Ext and Touch applications.

To run the example, first make sure no other demos are still running (e.g. the CouchDB examples). From the `ssjs/` directory, execute the following:

	sudo node webserver-mongo.js

In your browser, navigate to [http://localhost/mongo.htm](http://localhost/mongo.htm) to use the application. As before, you can watch the browser and system consoles to get insights into what the application is doing behind the scenes.

**USE CASE**: This example, using Mongoose as the middleware layer, is a more suitable template for real-world code that could form the basis for a production application. The demo is not a full-blown application architecture (it doesn't provide a complete MVC structure, security, etc.) but it could readily be extended as needed.

### Socket.io

The slide deck that accompanies this overview was implemented in these technologies as well. The content is basic HTML, presented via an Ext JS front end and powered on the back end by Node and Socket.io for real-time, two-way communication between the server and multiple clients. The details for the slide deck demo are [included](slides/Readme.md) in the `slides/` folder.

## Wrapping Up

There are many different choices of middleware and back-end packages within the Node / NoSQL world. While it's impossible to demonstrate every tool currently available, these demos should provide you with a good taste of how the basic pieces fit together and how to get them up and running quickly.

You are encouraged to evaluate other packages as well (npm is your friend!), and mix and match as needed to best suit your own environment and development preferences.

## References

Corey provides references on his [blog](http://www.coreybutler.com). He also maintains some NodeJS tools and scripts on [Github](http://github.com/coreybutler).

The MDB approach used in the MongoDB examples is an organizational pattern for managing Mongo schemas that Corey developed, and is freely [available on Github](https://github.com/coreybutler/mdb).

The slides from this presentation will be posted on Slideshare.

### NodeJS
- NodeJS: [http://nodejs.org](http://nodejs.org)
- NodeJS Modules: [https://github.com/joyent/node/wiki/modules](https://github.com/joyent/node/wiki/modules)
- Node Package Manager (npm): [http://npmjs.org](http://npmjs.org)
- Express: [http://expressjs.com](http://expressjs.com)

### NoSQL References
- Selecting a NoSQL DB: [http://kkovacs.eu/cassandra-vs-mongodb-vs-couchdb-vs-redis](http://kkovacs.eu/cassandra-vs-mongodb-vs-couchdb-vs-redis)
- Mongoose (MongoDB Schema): [http://mongoosejs.com](http://mongoosejs.com)
- Socket IO: [http://socket.io](http://socket.io)

### Free NoSQL Databases
- CouchDB: [http://www.iriscouch.com](http://www.iriscouch.com)
- MongoDB: [http://www.mongohq.com](http://www.mongohq.com)
- Redis: [http://www.redistogo.com](http://www.redistogo.com)

### Other
 - Map/Reduce example code: [https://gist.github.com/1186538](https://gist.github.com/1186538)
