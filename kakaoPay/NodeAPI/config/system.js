const pkg = require("../package.json");
const mode = process.env.MODE;

module.exports = {
  env: {
    mode,
    host: pkg[mode].host,
    proxy: pkg[mode].proxy,
    listen_port: pkg[mode].listen_port,
    request_portA: pkg[mode].request_portA,
    request_portB: pkg[mode].request_portB,
    isDev: process.env.NODE_ENV === "development",
  },
  kakaocert: {
    IPRestrictOnOff: true, // 인증토큰 IP제한기능 사용여부, 권장(true)
    UseLocalTimeYN: true, // 인증토큰정보 로컬서버 시간 사용여부
  },
};
