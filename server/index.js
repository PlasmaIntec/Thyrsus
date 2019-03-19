var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var parser = require('body-parser');
var routes = require('./controllers');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(morgan('dev'));

app.use('/images', express.static(path.join(__dirname + '/../resources')));

app.get('/users/:name', routes.getUser);

app.get('/users/', routes.getAllUsers);

app.post('/users', parser.json(), routes.addUser);

app.use(express.static(path.join(__dirname + '/../client/dist')));

app.listen(PORT, () => {
  console.log(`Express listening on port ${PORT}`);
});