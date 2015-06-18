var express = require('express');
var app = express();
var path = require('path');
var config = require('./config');
var db = require('./db');




app.get('/connect_number/:port', function (req, res){
  var port =  req.params.port * 1;
  db.connect_number.loadDatabase(function(err){
    db.connect_number.find({port:port}, function (err, docs) {
      res.json(docs);
    });
  });

});

app.get('/target_ports',function(req,res){
  res.json(config.target_ports);
})

app.get('/network_stauts',function(req,res){
  db.network_stauts.loadDatabase(function(err){
    db.network_stauts.find({},function(err,docs){
      res.json(docs);
    });
  });

});

var frontend = path.join(__dirname,'../frontend');
console.log(frontend);
app.use(express.static(frontend));

var server = app.listen(config.server_port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
