var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(morgan('dev'));

app.use('/images', express.static(path.join(__dirname + '/../resources')));

app.use(express.static(path.join(__dirname + '/../client/dist')));

app.listen(PORT, () => {
  console.log(`Express listening on port ${PORT}`);
});