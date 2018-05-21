/*
    ./server/express.js
*/

const path = require('path');
const UUID = require('node-uuid');

const webpack = require('webpack');
const config = require('../webpack.config');
// This is a middleware with same functions of webpack-dev-server,
// but in format that can be injected to the server/express application.
const webpackDevMiddleware = require('webpack-dev-middleware');
// to use HMR on express server
const webpackHotMiddleware = require('webpack-hot-middleware');

const express = require('express');
const app = express();
const router = express.Router();

const PORT = (process.env.PORT || 3000);
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(__dirname, '../dist/index.html');

if (process.env.NODE_ENV === 'development') {
  /* development environment */

  // returns a compiler instance
  const compiler = webpack(config)

  router.use(webpackDevMiddleware(compiler, {
    // colors webpack output
    stats: {
      colors: true,
    },
    // hides webpack output
    stats: 'none',
  }));

  // let express app use HMR (Hot Module Replacement)
  router.use(webpackHotMiddleware(compiler));

  // middleware to use for all requests
  router.use(function(req, res, next) {
    // log something
    console.log('\n~~~~~~~~~~~~~ something just happened ~~~~~~~~~~~~~~ \n');
    next(); // make sure we go to the next routes and don't stop here
  });

  // define the home page route
  router.get('/', (req, res, next) => {
    // outputFileSystem is for handling the output files in memory instead of disk
    compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
      if(err) {
	      return next(err);
		  }
      res.send('we are at root');
	  })
  });

  // register our routes
  app.use('/', router);

} else {
  /* production environment */
  console.log("\nSERVER IS RUNNING ON PRODUCTION ENVIRONMENT");

  // serve static files
  router.use(express.static(DIST_DIR));

  console.log("\nserving the static HTML " + HTML_FILE + " file to the home page (localhost/) ")
  // define the home page route
  router.get('/', (req, res) =>  {
    res.sendFile(HTML_FILE);
  });

  // register our routes
  app.use('/', router);

}

// set the port number
app.set('port', PORT);

console.log('\n Express :: Listening on port ' + PORT );
// start the HTTP server listening for connections.
const server = app.listen(app.get('port'));
// Instantiate Socket.IO, have it listen to the express server
const io = require('socket.io')(server);
// import the global Object gameserver where all the logic of the game server
gameserver = require('./gameserver.js');

io.on('connection', (client) => {

  // generate a random id to client
  client.userID = UUID();

  console.log('\n~~~ socket.io :: client ' + client.userID + ' connected ~~~');

  // search for a game
  // if there is no available games, create a game and be the host
  // if there is an available game, join that game and be the client
  gameserver.findGame(client);

  // listen to any client disconnects from this server
  client.on('disconnect', () => {

    console.log('\n~~~ socket.io :: client ' + client.userID + ' disconnected ~~~');
    console.log('    from game id ' +  client.currentGameID + '\n');

    gameserver.endGame(client.currentGameID, client);

  });

  // listen to subscribeToTimer event to emit the current date/time
  // during a specific interval
  // client.on('subscribeToTimer', (interval) => {
  //   console.log('\n\tclient is subscribing to timer with interval ', interval);
  //   setInterval(() => {
  //     client.emit('timer', new Date());
  //   }, interval);
  //
  // });

})
