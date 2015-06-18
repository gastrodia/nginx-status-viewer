var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var db = require('./db');
var config = require('./config');


function getConnectionNumber(port,callback){

  if(process.platform == 'linux'){
    //ss sport eq :80  |wc -l
    exec('ss -t sport eq :' + port + ' |wc -l',
      function (error, stdout, stderr) {
        var count = stdout*1 - 1;
        if(callback) callback(count);
    });
  }else{
    //netstat -nat|grep -i "80"|wc -l
    exec('netstat -nat|grep -i "' + port + '"|wc -l',
      function (error, stdout, stderr) {
        var count = stdout*1;
        if(callback) callback(count);
    });
  }

}



function recordNetWorkStatus(){

    var procfs = require('procfs-stats');
    var old = null;
    setInterval(function(){
      if(process.platform == 'linux'){
        procfs.net(function(err,data){
            console.log(data[0].Interface);
            console.log(data[0].bytes);
            var _new = data[0].bytes;
            if(old){
              var receive = _new.Receive - old.Receive;
              var transmit = _new.Transmit - old.Transmit;
              console.log('this second receive ' + receive + ' bytes data');
              console.log('this second transmit ' + transmit + ' bytes data');
              db.network_stauts.insert({
                time:Date.now(),
                receive:receive,
                transmit:transmit
              },function(err,newDocs){
                console.log(err,newDocs);
              });
            }
            old = _new;
        });
      }else{
        console.log('This program only work on linux, fake data (now)..')
        db.network_stauts.insert({
          time:Date.now(),
          receive:1,
          transmit:1
        },function(err,newDocs){
          console.log(err,newDocs);
        });
      }

    },1000);


}

function recordConnectionNumber(port){
  setInterval(function(){
    getConnectionNumber(port,function(num){
      console.log('port ' + port + ' now connect_number is ' + num);
      db.connect_number.insert({
        time:Date.now(),
        num:num,
        port:port
      }, function (err, newDocs) {
      //  console.log(err,newDocs);
      });
    });

  },1000);
}


function recordMultiConnectionNumber(ports){
    for(var i in ports){
      var port = ports[i];
      recordConnectionNumber(port)
    }
}

//recordConnectionNumber(config.target_port);
recordMultiConnectionNumber(config.target_ports);
recordNetWorkStatus();
