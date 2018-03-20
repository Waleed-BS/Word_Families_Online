const path = require('path');

const webpack = require('webpack');
const config = require('./webpack.config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const express = require('express');
const app = express();
const router = express.Router();

const PORT = (process.env.PORT || 3000);
const DIST_DIR = path.join(__dirname, 'dist');
const HTML_FILE = path.join(__dirname, 'dist/index.html');


if (process.env.NODE_ENV === 'development') {
  /* development environment */
  const compiler = webpack(config)

  // process.cwd() returns the current working directory of the Node.js process.
  // app.set('views', path.join(process.cwd(), 'views'));
  // app.set('view engine', 'jade');
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: { colors: true },
    noInfo: true,
  }));
  app.use(webpackHotMiddleware(compiler));

  // router.get('/', (req, res, next) => res.render(HTML_FILE))

  // app.use(router);
  app.get("*", (req, res, next) => {
		compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
			if (err) {
				return next(err);
			}
			res.set('content-type', 'text/html');
			res.send(result);
			res.end();
		});
	});

} else {
  /* production environment */
  app.use(express.static(DIST_DIR));
  app.get('/', (req, res) => res.sendFile(HTML_FILE));
}
// console.log("DIST_DIR = ", DIST_DIR);
// console.log("HTML_FILE = ", HTML_FILE);
console.log('process.env.NODE_ENV =', process.env.NODE_ENV);
console.log('listening on port', PORT);

app.set('port', PORT);

app.listen(app.get('port'));
