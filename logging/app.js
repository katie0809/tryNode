const log4js = require("log4js");

// log4js.configure({
//   appenders: { 
//       file: { 
//         type: "dateFile", 
//         filename: 'logs/system.log',
//         maxLogSize: 10485760,
//         pattern: '.yyyy-MM-dd-hh',
//         keepFileExt: true,
//         compress: true,
//         pm2: true,
//         layout: {
//             type: 'pattern',
//             pattern: '%x{deviceId} %d %x{pid} %p %c - %m %n',
//             tokens: {
//                 deviceId: function() {
//                     return getCurDeviceID();
//                 },
//                 pid: function() {
//                     return process.pid
//                 }
//             }
//         }
//     },
// },
//   categories: { 
//       default: { 
//           appenders: ["file"], 
//           level: "trace" 
//         } 
//     }
// });
log4js.configure({
    appenders: { 
        file: { 
            type: "dateFile", 
            filename: 'logs/system.log',
            maxLogSize: 10485760,
            pattern: '.yyyy-MM-dd-hh',
            compress: true
      }
  },
    categories: { 
        default: { 
            appenders: ["file"], 
            level: "trace" 
          } 
      }
  });
const logger = log4js.getLogger('file');

function getCurDeviceID() {
    return 'samsung-TS-294LT92NM'
}

function func2() {
    logger.info("Cheese is Comté.");
    throw new Error('msg');
}

function func1() {

    logger.trace("Entering cheese testing");
    logger.debug("Got cheese.");
    
    try {
        func2();
    }
    catch(e) {
        logger.warn('Cheese warning', e)
    }
}

function main() {
    logger.error("Cheese is too ripe!");
    logger.fatal("Cheese was breeding ground for listeria.");
    func1();
}

main();