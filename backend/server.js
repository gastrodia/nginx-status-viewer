var express = require('express');
var app = express();
var path = require('path');
var config = require('./config');
var db = require('./db');



//最多返回500条数据，且尽量让数据在值域区间内均匀分布
var maxDataNumber = 500;

function isExactDivision(m,n){
  return m/n == Math.round(m/2);
}

function getMaxArray(totalArray,newArrayLength){
  console.log('newArrayLength',newArrayLength);
  if(isExactDivision(totalArray.length,newArrayLength)){
    var newArray = [];
    var step = totalArray.length / newArrayLength;
    var startIndex = step;
    for(var i=startIndex; i<= totalArray.length;i = i+ step){
      newArray.push(totalArray[i]);
    }

    // console.log('maxArray calculate result :');
    // console.log('totalArray.length',totalArray.length);
    // console.log('maxDataNumber',maxDataNumber);
    // console.log('newArrayLength',newArrayLength);
    // console.log('step:',step);
    // console.log('newArray.length',newArray.length);

    return newArray;
  }else if(isExactDivision(totalArray.length - 1,newArrayLength - 1)){
    var newArray = [];
    var startIndex = 0;
    var step = (totalArray.length - 1) / (newArrayLength - 1);
    for(var i=startIndex;i<=totalArray.length;i=i+step){
      newArray.push(totalArray[i]);
    }

    // console.log('maxArray calculate result :');
    // console.log('totalArray.length',totalArray.length);
    // console.log('maxDataNumber',maxDataNumber);
    // console.log('newArrayLength',newArrayLength);
    // console.log('step:',step);
    // console.log('newArray.length',newArray.length);

    return newArray;
  }else{
    return getMaxArray(totalArray,newArrayLength - 1);
  }
}

function getMaxArray2(totalArray){
  var litteStep = Math.floor( (totalArray.length - maxDataNumber)/maxDataNumber);
  var bigStep = litteStep + 1;
  var bigStepNumber = (totalArray.length - maxDataNumber) % maxDataNumber;
  var litteStepNumber = maxDataNumber - bigStepNumber;

  var _newArray = [];
  var index = totalArray.length - 1;
  for(var i=0;i<litteStepNumber;i++){
    console.log(index);
    _newArray.push(totalArray[index]);
    index = index - litteStep - 1;
  }
  for(var i=0;i<bigStepNumber;i++){
    console.log(index);
    _newArray.push(totalArray[index]);
    index = index - bigStep - 1;
  }

  var newArray = _newArray.reverse();

  // console.log('bigStep',bigStep);
  // console.log('bigStepNumber',bigStepNumber);
  // console.log('litteStep',litteStep);
  // console.log('litteStepNumber',litteStepNumber);

//  console.log(newArray);

  return newArray;
}

app.get('/connect_number/:port', function (req, res){
  var port =  req.params.port * 1;
  db.connect_number.loadDatabase(function(err){
    db.connect_number.find({port:port}, function (err, docs) {
      if(docs.length > maxDataNumber){
        var newArray = getMaxArray2(docs);
        res.json(newArray);
      }else{
        res.json(docs);
      }
    });
  });

});

app.get('/target_ports',function(req,res){
  res.json(config.target_ports);
})

app.get('/network_stauts',function(req,res){
  db.network_stauts.loadDatabase(function(err){
    db.network_stauts.find({},function(err,docs){
      if(docs.length > maxDataNumber){
        var newArray = getMaxArray2(docs);
        res.json(newArray);
      }else{
        res.json(docs);
      }
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
