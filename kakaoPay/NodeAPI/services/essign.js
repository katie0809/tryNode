const express = require("express");
const fs = require("fs");
const { promisify } = require("util");
const logger = require("../middleware/logger");
const companyInfo = require("../config/companies");

const router = express.Router();

/** 전자서명 요청 - 임의의 접수번호 아이디 보낸다. */
router.post("/", async (req, res, next) => {
  try {
    if (companyInfo && req.body && req.body.fno) {
      logger.debug(`[${companyInfo[req.body.fno].company_name}] kakao request expires in => ${companyInfo[req.body.fno].expires_in}`);
    }

    return res.json({
      receiptId: "1234567890",
    });
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
