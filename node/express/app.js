/**
 * Created by xuxin on 2017/7/24.
 */
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var multer = require('multer');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
multer();

app.get('/:id', function (req, res) {
  res.send(req.params.id);
});
app.post('/:id', function (req, res) {
  // res.send(req.params.id);
  res.json(req.body);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});