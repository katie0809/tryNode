/**
 * Create HTTP Server in NodeJS
 */
const http = require("http");
const log4js = require("log4js");
const fs = require('fs');
const url = require('url');

/** 환경설정 가져온다. */
const confPath = process.env.NODE_ENV =="production" ?  './config_real' : './config_dev';
const conf = require(confPath);

/** 로깅설정 */
log4js.configure({
  appenders: { 
      file: { 
        type: "dateFile", 
        filename: 'logs/system.log',
        maxLogSize: 10485760,
        pattern: '.yyyy-MM-dd-hh',
        keepFileExt: true,
        compress: true,
        pm2: true,
        layout: {
            type: 'pattern',
            pattern: '[%d] [%p] %m',
            // tokens: {
            //     deviceId: function() {
            //         return getCurDeviceID();
            //     }
            // }
        }
    },
},
  categories: { 
      default: { 
          appenders: ["file"], 
          level: "trace" 
        } 
    }
});
const logger = log4js.getLogger('file');

/** 
 * 로그메시지를 구성한다.
 * @param {number} type - 호출구분. 0:REQUEST, 1:RESPONSE, 2:ERROR
 * @param {string} deviceId
 * @param {string} api_url - 호출API
 * @param {string} message - 호출구분에 따른 요청정보/응답정보/에러메시지
 * @returns {string} 정의된 패턴에 맞춰 구성된 로그 메시지
 */
function createLogMsg(type, deviceId, api_url, message) {

    switch(type) {
        case 0:
            // API요청
            return deviceId.toString() + ' :: REQUEST fno=' + conf.fno.toString() + ' url=' + api_url.toString() + ' payload=' + message;
            break;
        case 1:
            // API응답
            return deviceId.toString() + ' :: RESPONSE fno=' + conf.fno.toString() + ' url=' + api_url.toString() + ' payload=' + message;
            break;
        case 2:
            // 오류발생
            return deviceId.toString() + ' :: ERROR fno=' + conf.fno.toString() + ' url=' + api_url.toString() + ' message=[' + message.errorCode.toString() + '] ' + message.errorMessage.toString() + '\n';
            break;
        default:
            return 'LOG MESSAGE TYPE ERROR'
            break;
    }
}

/**
 * Hello, world 문자열을 반환하는 http 웹서버를 생성한다.
 * 19870 포트로 설정한다.
 */
const webListenServer = http.createServer(function(req, res) {

    // URL parsing
    var pathname = url.parse(req.url).pathname;
    logger.debug(createLogMsg(0, 'SLK9877-LD01-0921', pathname, '요청정보'))

    
    // 200 ok 응답 전송
    res.writeHead(200, {'Content-Type': 'text/plain'});

    // response body message 설정
    res.end('hello world');
})

webListenServer.listen(conf.WEB_TO_SERVER_LISTEN_PORT);

console.log("Server is running at http://127.0.0.1:19870")