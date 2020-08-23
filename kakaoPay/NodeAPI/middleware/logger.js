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
  debug: (message, req = null, res = null, token = null) => {
    const DEVICEID = token ? "" : token.deviceId;
    const HEADER = req ? "REQUEST" : "RESPONSE";
    const URL = req ? req.url : res.url;
    const PAYLOAD = message || (req ? req.body : res.body);

    writer.debug(`${HEADER}-${DEVICEID} :: url=${URL} payload=${PAYLOAD}`);
  },
  warn: (message, req = null, res = null, token = null) => {
    const DEVICEID = token ? "" : token.deviceId;
    const HEADER = req ? "REQUEST" : "RESPONSE";
    const URL = req ? req.url : res.url;
    const PAYLOAD = message || (req ? req.body : res.body);

    writer.warn(`${HEADER}-${DEVICEID} :: url=${URL} payload=${PAYLOAD}`);
  },
  error: (e, req = null, res = null) => {
    const URL = req ? req.url : res.url;

    if ((req || res) && e.errorCode && e.errorMessage) {
      const HEADER = req ? "REQUEST" : "RESPONSE";
      const { errorCode, errorMessage } = e;

      writer.error(`${HEADER} :: url=${URL} error=[${errorCode}] ${errorMessage}\n`);
    } else writer.error(e);
  },
};
