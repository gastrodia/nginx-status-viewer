var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var db = require('./db');
var config = require('./config');


function getConnectionNumber(port,callback){
  exec('netstat -nat|grep -i " ' + port + '"|wc -l',
    function (error, stdout, stderr) {
      var count = stdout*1;
      if(callback) callback(count);
  });
}



function recordNetWorkStatus(){

    var procfs = require('procfs-stats');
    var old = null;
    setInterval(function(){
      procfs.net(function(err,data){
        try{
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
        }catch(e){
          console.log('this function may not work on windows and mac');
        }


      });

    },1000);


}

function recordConnectionNumber(){
  setInterval(function(){
    getConnectionNumber(config.target_port,function(num){
      console.log('now connect_number is ' + num);
      db.connect_number.insert({
        time:Date.now(),
        num:num
      }, function (err, newDocs) {
        console.log(err,newDocs);
      });
    });
  },1000);
}

recordConnectionNumber();
recordNetWorkStatus();
