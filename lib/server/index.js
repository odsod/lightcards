require('colors');

var fs = require('fs'),
    path = require('path'),
    http = require('http'),
    express = require('express');

var clientScriptBundler = require('./client-script-bundler.js');

var app = express();
app.use(express.bodyParser());
app.use(express.favicon(path.join(__dirname, '../../static/favicon.ico')));

exports.listen = function(options, callback) {

  if (fs.existsSync(options.audioFolder)) {
    app.use('/audio', express.static(options.audioFolder));
  }

  app.use(express.static(path.join(__dirname, '../../static')));

  app.get('/script.js', function(req, res) {
    process.stdout.write('Compiling script...');

    clientScriptBundler.compileScriptBundle(options, function(err, bundle) {
      process.stdout.write(' OK!\n'.green);
      res.end(bundle);
    });
  });

  app.post('/save', function(req, res) {
    process.stdout.write('Saving...');
    fs.writeFileSync(options.stateFile, JSON.stringify(req.body));
    process.stdout.write(' OK!\n'.green);
    res.end();
  });

  http.createServer(app).listen(options.port, callback);
};
