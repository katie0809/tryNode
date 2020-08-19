var env = require('./env');
var confPath = process.env.NODE_ENV =="production" ?  './config_real' : './config_dev';
var conf = require(confPath);
var path = require('path');
const axios = require('axios');



/*logger */
const fs = require('fs');
// const rfs = require('rotating-file-stream');
const log4js = require('log4js');

const logDirectory = path.join(__dirname, 'logs');
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);


log4js.configure({
  appenders: {
    file: {
      type: 'dateFile',
      filename: 'logs/system.log',
      flags:'a+'
    }
  },
  categories: {
    default: {     
      appenders:['file'],        
      level: 'trace'
    }
  }
});

const logger = log4js.getLogger('file');

/*logger */





var MAX_CONNECTION_COUNT = conf.MaxConnCnt ? conf.MaxConnCnt : 2500;



var COMMON_HEADER_LENGTH_SIZE = 6;
var COMMON_HEADER_SIZE = 35;
// var OCR_RETURN_CODE_SIZE = 2; 



var OCR_ETXT_DV_C_SIZE = 4; //전문구분코드 
var OCR_DLNG_DV_C_OFFSET = COMMON_HEADER_LENGTH_SIZE + OCR_ETXT_DV_C_SIZE; //거래구분코드 위치
var OCR_DLNG_DV_C_SIZE = 4; //거래구분코드 size


var OCR_USER_KEY_SIZE = 44;  //신청인KEY암호화 size

var OCR_RSP_C_SIZE = 2; //응답코드 

var OCR_RETURN_TOTAL_SIZE = "000075";
var OCR_RETURN_ETXT_DV_C = "2001"; // RETURN (응답) 전문 구분 코드 

var OCR_RETURN_SUCCESS_CODE = "00"; // 성공 응답 코드
var OCR_RETURN_ERROR_CODE_423 = "02";   // 오류 응답 코드
var OCR_RETURN_ERROR_CODE_500 = "03";   // 오류 응답 코드


var OCR_TYPE_1 = "0001";            //거래구분코드 : OCR 전송 
var OCR_TYPE_1_IMG_SIZE = 131072;
var OCR_TYPE_1_LENGTH = COMMON_HEADER_SIZE - COMMON_HEADER_LENGTH_SIZE + OCR_USER_KEY_SIZE + OCR_TYPE_1_IMG_SIZE + OCR_RSP_C_SIZE; //"131147";

var OCR_TYPE_2 = "0002";             // 거래구분코드 : OCR 전송_장전문
var OCR_TYPE_2_IMG_SIZE = 524288;
var OCR_TYPE_2_LENGTH = COMMON_HEADER_SIZE  - COMMON_HEADER_LENGTH_SIZE + OCR_USER_KEY_SIZE + OCR_TYPE_2_IMG_SIZE + OCR_RSP_C_SIZE;  //"524363"


// var OCR_REQ_SIZE = 524365;

//API 
const API_BASE_URL = conf.httpString + conf.WAS_HOST + ":" + conf.SERVER_TO_WAS_REQUEST_PORT;
const API_OCR_PATH = "/v1/samsung/ocr";
const API_OCR_FULL_URL = API_BASE_URL + API_OCR_PATH; 

var net = require('net');


/*
WAS -> WEB -> SC 
 tcp -> tcp  */

var wasListenServer = net.createServer(

    function (client) {
        logger.info( "WAS CLIENT connected! " );

        wasListenServer.getConnections(function(err, count) {
            logger.info("wasListenServer Connections count: " + count);
         });


        let server = createSocketClient(client);

        const wasServerOnClose = err => {
            client.destroy();
            server.destroy();
            logger.info( `wasListenServer disconnect [${err ? `error: ${err.message}` : 'close'}]`);
            this.removeListener('close', wasServerOnClose);
        };

        const clientOnClose = err => {
            client.destroy();
            server.destroy();
            logger.info( `clientOnClose disconnect [${err ? `error: ${err.message}` : 'close'}]`);
            this.removeListener('close', clientOnClose);
        };

        /*      server.on('data', function(dataIn){            
                logger.info( "SC SERVER : Received from server: " + dataIn.toString());        
                client.write(dataIn); 
            });
        */
        client.on('data', function (data) {

            logger.info( "WAS CLIENT : Received from client: " + data.toString());
            if (!server || !server.isConnected) {
                logger.info( "WAS CLIENT : SC Server NOT CONNECTE YET - DELAY to SEND: " + data.toString());
                if (!client.tempData) client.tempData = data;
                else client.tempData += data;

            }
            else
                server.write(data);

        });

        server.once('close', wasServerOnClose);
        server.once('error', wasServerOnClose);
        client.once('close', clientOnClose);
        client.once('error', clientOnClose);

    }

);


function createSocketClient(server) {
    var client = new net.Socket();

    // client.setEncoding('euc-kr');

    client.connect(conf.SERVER_TO_SC_REQUEST_PORT, conf.SC_HOST, function () {
        client.isConnected = true;
        logger.info( "createSocketClient SC SERVER Connected");

        if (server && server.tempData) {
            logger.info( 'SEND SC SERVER DATA DELAY:' + server.tempData);
            client.write(server.tempData);
            server.tempData = null;

        }

        // server.pipe(client);
        // client.pipe(server);        
        // this.emit('connection', client, server);


        client.on('data', function (dataIn) {
            logger.info( "SC SERVER : Received from server: " + dataIn.toString());
            server.write(dataIn);
        });



    });


    return client;

}


wasListenServer.listen(conf.WAS_TO_SERVER_LISTEN_PORT);
logger.info("*** SERVER START:: wasListenServer started " + conf.WAS_TO_SERVER_LISTEN_PORT);





/*
SC -> WEB -> WAS
 OCR Image save
 tcp -> http */
var scListenServer = net.createServer(function (socket) {

    logger.info( "SC CLIENT connected!");

    initSocketMemberVariable(socket); 
    
    // socket.chunk = null;
    // socket.lengthIn = null;
    // socket.returnHeader = null;
    // socket.returnString = null;
    // socket.reqType = null;    
    // socket.imgSize = OCR_TYPE_1_IMG_SIZE; 
    // socket.headerError =false;     
    scListenServer.getConnections(function(err, count) {
        logger.info("scListenServer Connections count: " + count);
     });

    socket.on('data', function (data) {

        if (socket.headerError)
        {
            logger.error( socket.returnHeader + " COMMON HEADER ERROR (CONTIN) " ); 
            return; 
        }
        if (!socket.chunk)
            socket.chunk = data.toString();
        else
            socket.chunk += data.toString();

        if (!socket.lengthIn && data.length > COMMON_HEADER_LENGTH_SIZE) {
            let lengthInString = data.slice(0, COMMON_HEADER_LENGTH_SIZE).toString();

            socket.returnHeader = socket.chunk.substring(COMMON_HEADER_LENGTH_SIZE + OCR_ETXT_DV_C_SIZE, COMMON_HEADER_SIZE + OCR_USER_KEY_SIZE); // 거래구분콛, 전송일시, 순번 복사

            socket.lengthIn = parseInt(lengthInString);
            socket.reqType = socket.chunk.substr(OCR_DLNG_DV_C_OFFSET, OCR_DLNG_DV_C_SIZE); // 거래구분코드 추출
            if (isNaN(socket.lengthIn)) {
                socket.headerError = true; 
                logger.error( socket.returnHeader  + " COMMON HEADER LENGTH - INT PARSE ERROR -length:" + lengthInString);
                logger.error( socket.returnHeader  + " COMMON HEADER LENGTH - INT PARSE ERROR -data:" + socket.chunk.substr(0,100));

               
                socket.end(createOcrErrorReturnString423(socket.returnHeader), (err)=>{
                    logger.error(socket.returnHeader  + " COMMON HEADER LENGTH - INT PARSE ERROR -SOCKET END"); 
                });    
                return;
            }
            else if (socket.reqType != OCR_TYPE_1 && socket.reqType != OCR_TYPE_2 ) //거래구분코드가 잘못된 경우 
            {
                socket.headerError = true; 
                logger.error(socket.returnHeader + " COMMON HEADER INVALID req type(DLNG_DV_C) - length:" + socket.lengthIn);
                logger.error(socket.returnHeader + " COMMON HEADER INVALID req type(DLNG_DV_C):" + socket.reqType);
                logger.error(socket.returnHeader + " COMMON HEADER INVALID req type(DLNG_DV_C) - data:" + socket.chunk.substr(0,100));

                socket.end(createOcrErrorReturnString423(socket.returnHeader), (err)=>{                    
                        logger.error("COMMON HEADER INVALID req type(DLNG_DV_C) -SOCKET END");                                                
                });    
                return;
            }
            ///거래구분코드에 따라 길이가 제대로 넘어 왔는지 확인 하는 코드 
            else if (!((socket.reqType == OCR_TYPE_1 && socket.lengthIn == OCR_TYPE_1_LENGTH)  //type 1
                || (socket.reqType == OCR_TYPE_2 && socket.lengthIn == OCR_TYPE_2_LENGTH))) {  //type 2
                socket.headerError = true;                 
                logger.error( socket.returnHeader + " COMMON HEADER INVALID LENGTH - length:" + socket.lengthIn);
                logger.error( socket.returnHeader + " COMMON HEADER INVALID LENGTH - DLNG_DV_C:" + socket.reqType);
                logger.error( socket.returnHeader + " COMMON HEADER INVALID LENGTH - data:" + socket.chunk.substr(0,100));
                socket.end(createOcrErrorReturnString423(socket.returnHeader), (err)=>{                 
                    logger.error(socket.returnHeader  + " COMMON HEADER INVALID LENGTH - SOCKET END");                                         
                });    
                return;                 
            }
            
        }

        logger.info( socket.returnHeader  + " lengthIn :" + socket.lengthIn + " current length : " + socket.chunk.length);
        if (socket.lengthIn > 0 && socket.lengthIn + COMMON_HEADER_LENGTH_SIZE <= socket.chunk.length) {
            
            logger.info( "** Header: " + socket.returnHeader );
            
            if ( socket.reqType == OCR_TYPE_1)
                socket.imgSize = OCR_TYPE_1_IMG_SIZE;
            else if ( socket.reqType == OCR_TYPE_2)
                socket.imgSize = OCR_TYPE_2_IMG_SIZE;

            var reqBody =  {
                "client_key": socket.chunk.substr(COMMON_HEADER_SIZE,  OCR_USER_KEY_SIZE),
                "image" :  socket.chunk.substr(COMMON_HEADER_SIZE + OCR_USER_KEY_SIZE,socket.imgSize  )
            };            

            var jsonString = JSON.stringify(reqBody);

            logger.info( socket.returnHeader + " User key: " + reqBody.clientKey);
            logger.trace( "**RECEIVED DATA STRING START**");
            logger.trace( reqBody.image);
            logger.trace( "**RECEIVED DATA STRING END**");



            axios.post(API_OCR_FULL_URL, jsonString, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                }
            })
            .then(function(response){
    
                socket.returnString = createOcrSuccessReturnString(socket.returnHeader);
    
                logger.info( "RETURN STRING: " + socket.returnString);
                socket.write(socket.returnString);
                initSocketMemberVariable(socket); 
            })
            .catch(function (error){

                if( error.response)
                {                    
                    logger.error( socket.returnHeader + " OCR API RESPONSE STATUS ERROR -" + error.response.status + " " + JSON.stringify(error.response.data)  );                  
                    if( error.response.status == "500")
                        socket.returnString = createOcrErrorReturnString500(socket.returnHeader);
                    else //if ( error.response.status == "423") 
                        socket.returnString = createOcrErrorReturnString423(socket.returnHeader);  
                    
                }
                else if (error.request)
                {
                    logger.error(socket.returnHeader +  " OCR API NO RESPONSE ERROR " + error.message );                  
                    socket.returnString = createOcrErrorReturnString423(socket.returnHeader);  
                }
                else 
                {
                    logger.error(socket.returnHeader + " OCR API ERROR " + error.message  );                  
                    socket.returnString = createOcrErrorReturnString423(socket.returnHeader);  
                }
                
    
                logger.error( socket.returnHeader + " RETURN STRING: " + socket.returnString);
                socket.write(socket.returnString);
                initSocketMemberVariable(socket); 
            }); 

        }



    });

    const socketOnClose = err => {
        
        logger.error( socket.returnHeader +` clientOnClose disconnect [${err ? `error: ${err.message}` : 'close'}]`);
        this.removeListener('close', socketOnClose);
    };

    const socketOnError = err => {
        socket.destroy();
        logger.error( socket.returnHeader +` clientOnClose ERROR [${err ? `error: ${err.message}` : 'close'}]`);
        this.removeListener('close', socketOnClose);
    };

    socket.once('close', socketOnClose);
    socket.once('error', socketOnError);
});



scListenServer.listen(conf.SC_TO_SERVER_LISTEN_PORT);
logger.info("*** SERVER START:: scListenServer started " + conf.SC_TO_SERVER_LISTEN_PORT)

function initSocketMemberVariable(socket)
{
    socket.chunk = null;
    socket.lengthIn = null;
    socket.returnHeader = null;
    socket.returnString = null;
    socket.reqType = null;    
    socket.imgSize = null; 
    socket.headerError =false;     
}


function createOcrErrorReturnString423(returnHeader) {
    return OCR_RETURN_TOTAL_SIZE  //LENGTH
        + OCR_RETURN_ETXT_DV_C
        + returnHeader
        + OCR_RETURN_ERROR_CODE_423;
}

function createOcrErrorReturnString500 (returnHeader) {
    return OCR_RETURN_TOTAL_SIZE  //LENGTH
        + OCR_RETURN_ETXT_DV_C
        + returnHeader
        + OCR_RETURN_ERROR_CODE_500;
}

function createOcrSuccessReturnString(returnHeader) {
    return OCR_RETURN_TOTAL_SIZE  //LENGTH
        + OCR_RETURN_ETXT_DV_C
        + returnHeader
        + OCR_RETURN_SUCCESS_CODE;

}


/*
function logMsg(level, msg) {
    console.log(level + "\t:" + new Date().toString() + "\t:" + msg);

}
*/
function handle(signal) {
    
    logger.info(`About to exit with code: ${signal}`);
    console.log(new Date() +  ` About to exit with code: ${signal}`);
    process.exit(1);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
process.on('exit', handle); 