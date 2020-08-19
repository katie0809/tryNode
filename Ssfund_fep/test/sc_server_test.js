var env = require('../env');
var confPath = env.dev? '../config_dev' : '../config_real';
var conf = require(confPath);

conf.WEB_HOST = '127.0.0.1';

var MAX_CONNECTION_COUNT = conf.MaxConnCnt ? conf.MaxConnCnt : 2500;

var dateFormat = require('dateformat');

var net = require('net');


/*
 WEB -> SC 
 tcp -> tcp  */

var wasListenServer = net.createServer(
    
    
    function(client) {
        console.log ("SC Server Connected! " + conf.SERVER_TO_SC_REQUEST_PORT); 
        client.on('data', function(data){
            var dataString = data.toString(); 
            console.log("Reeived from client: " +dataString +"("+ dataString.length+")");    
            data[9] =  49;    // 1000->1001        
            client.write(data);            
        });

    }

);

wasListenServer.listen(conf.SERVER_TO_SC_REQUEST_PORT);

console.log("SC Server Test started : " + conf.SERVER_TO_SC_REQUEST_PORT);