const kakaocert = require("kakaocert");

/** kakaoCert 서비스 클래스 */
const kakaocertService = kakaocert.KakaocertService();

/** 전자서명 요청 */
const requestESign = () => {
  let receiptID = "123456";

  /** 전자서명 요청 함수를 호출한다. */
  // receiptID = kakaocertService.requestESign(ClientCode, RequestESign, success, error);

  /** 접수 ID반환 */
  return receiptID;
};
