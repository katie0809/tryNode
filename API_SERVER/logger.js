
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
