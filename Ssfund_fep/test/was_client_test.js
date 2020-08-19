var env = require('../env');
var confPath = env.dev? '../config_dev' : '../config_real';
var conf = require(confPath);

conf.WEB_HOST = '127.0.0.1';
//conf.WEB_HOST = '211.255.203.56';

var MAX_CONNECTION_COUNT = conf.MaxConnCnt ? conf.MaxConnCnt : 2500;

var dateFormat = require('dateformat');

var net = require('net');


// WAS -> WEB 

function createSocketClient () 
{
    var client = new net.Socket(); 
    
    console.log("createSocketClient ");
    client.connect(conf.WAS_TO_SERVER_LISTEN_PORT, conf.WEB_HOST, function() {

        console.log("createSocketClient connected!");
        var datetimehigh = new Date(); 
        var sDate =  dateFormat(datetimehigh, "yyyymmddHHMMssl");

        client.write(sDate);
        // client.pipe(client);       
        // this.emit('connection', client);

        client.on('data', function (data){
            console.log("data IN: " + data);
            client.destroy(); 
        });
    
        const socketOnClose = err => {
            client.destroy();        
            console.log(`clientOnClose disconnect [${err ? `error: ${err.message}` : 'close'}]`);        
          };
    
          client.once('close', socketOnClose);
          client.once('error', socketOnClose);


    });
    
    

    return client; 

}


createSocketClient();