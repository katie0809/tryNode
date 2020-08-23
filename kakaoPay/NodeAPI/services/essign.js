const express = require("express");
const kakaocert = require("../middleware/kakaocert");
const logger = require("../middleware/logger");
const companyInfo = require("../config/companies");

const router = express.Router();

/** 전자서명 요청 - 임의의 접수번호 아이디 보낸다. */
router.post("/", async (req, res, next) => {
  logger.debug(req.body, req, null, req.header);
  try {
    const pageId = req.body.PageId;
    const deviceId = req.body.DeviceId;
    const receiptId = kakaocert.requestESign();

    res.status(200).json({
      AuthCode: {
        pageId,
        deviceId,
        receiptId,
        timestamp: "2020-08-23",
      },
    });
    logger.debug(res.body, null, res, res.body.AuthCode);
  } catch (e) {
    const err = new Error(e);
    err.status = 500;
    next(err);
  }
  return next();
});

/** 전자서명 요청 응답 */
router.post("/verify", (res, req) => {
  res.send("Response to /essign/verify");
});

module.exports = router;
