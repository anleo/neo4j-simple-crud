var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/', express.static(__dirname + '/dist'));

require('./app.routes')(app, express);

app.set('trust proxy', true);
app.set('trust proxy', 'loopback');

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
