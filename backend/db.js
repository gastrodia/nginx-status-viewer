var Datastore = require('nedb');
db = {};
db.connect_number = new Datastore({filename:'./data/connect_number.db',autoload:true});

db.network_stauts = new Datastore({filename:'./data/network_stauts.db',autoload:true});

module.exports = db;
