var express = require('express');
var app = express();
var path = require('path');

var db = require('./db');

app.get('/connect_number', function (req, res){
  db.connect_number.find({}, function (err, docs) {
    res.json(docs);
  });
});

app.get('/network_stauts',function(req,res){
  db.network_stauts.find({},function(err,docs){
    res.json(docs);
  });
});

var frontend = path.join(__dirname,'../frontend');
console.log(frontend);
app.use(express.static(frontend));

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});