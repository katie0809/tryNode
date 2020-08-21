const log4js = require("log4js");

/** 로깅 환경설정 */
log4js.configure({
  appenders: {
    default: {
      type: "dateFile",
      filename: "logs/system.log",
      maxLogSize: 10485760,
      pattern: ".yyyy-MM-dd-hh",
      keepFileExt: true,
      compress: false,
      pm2: true,
      layout: {
        type: "pattern",
        pattern: "[%d] [%p] %m",
      },
    },
  },
  categories: {
    default: {
      appenders: ["default"],
      level: "trace",
    },
  },
});
const writer = log4js.getLogger("default");

module.exports = {
  express: log4js.connectLogger(writer, { level: log4js.levels.TRACE }),
  debug: (message, apiType = null, apiUrl = null, fno = null, deviceId = null) => {
    if (apiType) writer.debug(`${deviceId.toString()} :: ${apiType ? "REQUEST" : "RESPONSE"} fno=${fno} url=${apiUrl.toString()} payload=${message}`);
    else writer.debug(message);
  },
  warn: (message, apiType = null, apiUrl = null, fno = null, deviceId = null) => {
    if (apiType) writer.warn(`${deviceId.toString()} :: ${apiType ? "REQUEST" : "RESPONSE"} fno=${fno} url=${apiUrl.toString()} payload=${message}`);
    else writer.warn(message);
  },
  error: (message, apiUrl = null, fno = null, deviceId = null) => {
    if (apiUrl) writer.error(`${deviceId.toString()} :: ERROR fno=${fno} url=${apiUrl} message=[${message.errorCode.toString()}] ${message.errorMessage.toString()}\n`);
    else writer.error(message);
  },
};
