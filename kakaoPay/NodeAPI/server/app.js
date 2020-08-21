const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const essignRouter = require("../services/essign");
const config = require("../config/system.js");
const logger = require("../middleware/logger");

const app = express();

/** 포트 세팅 */
app.set("port", process.env.PORT || config.env.host);

/** body-parser 사용 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** API 로그생성 */
app.use(logger.express);

/** 라우터 */
app.use("/essign", essignRouter);

/** 에러처리 */
app.use((err, req, res, next) => {
  logger.debug("into error handling middleware");
  logger.error(err);
  res.status(err.status).json({
    errorCode: err.status,
  });
});

const server = app.listen(config.env.listen_port, function () {
  console.log(`[${process.pid}] Express server has started at ${config.env.host} on port ${config.env.listen_port}`);
});
