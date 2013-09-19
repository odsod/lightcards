var express = require('express'),
    http = require('http'),
    path = require('path'),
    app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'assets')));

exports.serveBundle = function(bundle, cb) {
  app.get('/script.js', function(req, res) { bundle.pipe(res); });
  http.createServer(app).listen(app.get('port'), function() {
    console.log('Start learning on port ' + app.get('port'));
  });
};
