/** 서버 환경설정 */
const confPath = process.env.NODE_ENV =="production" ?  './config_real' : './config_dev';
const conf = require(confPath);
const express = require('express');
const log4js = require('log4js')
const fs = require('fs');
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

/** 로깅 환경설정 */
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
  
/** 라우터 모듈인 main.js를 app에 전달해준다. */
const router = require('./main.js')(app, logger);

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

const server = app.listen(conf.WEB_TO_SERVER_LISTEN_PORT, function(){
    console.log( `[${process.pid}] Express server has started on port ${conf.WEB_TO_SERVER_LISTEN_PORT}`)
});
