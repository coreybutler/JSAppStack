# Node + Socket.io + Ext Slideshow Demo

## External Dependencies

- node
- npm
- express
- socket.io

## Set Up

If you have already gone through the setup for the other JSAppStack demos then you'll already have Node and npm, but you may still need to install express and socket.io as below.

- [Install node](https://github.com/joyent/node/wiki/Installation) if needed
- [Install npm](http://npmjs.org/) if needed
- In the `JSAppStack/slides/` folder install Express and Socket.io:

	npm install express socket.io

- From the same `slides/` folder start the node server:

	sudo node slide-server.js

If all goes well you should see a message like:

	info - socket.io started
	slide-server now listening on port 1987...

## Usage

There are two files of interest to the end user:

- **controller.html**: The slide deck remote control that can advance and rewind the master slide presentation, notifying all clients to stay in sync as the slides change. This is accessible at the server+port base url configured for the slide server (e.g., [http://localhost:1987](http://localhost:1987)). This page is only intended for the person presenting the slides as it controls the navigation for all connected clients. Currently there is no authentication on this page since this is just a demo, but it could be easily added.

- **client/index.html**: The slide deck viewer client app. This file actually contains the slide deck content locally, but also connects to the slide server to submit itself to remote control during the presentation. This is the file most people will view and it is accessible locally via standard http from wherever it's hosted (not on the slide-server port), e.g. [http://localhost/JSAppStack/slides](http://localhost/JSAppStack/slides). Note that for other clients to connect the web server must be available by IP or host name, e.g. http://some.computer/JSAppStack/slides.