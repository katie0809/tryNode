/**
 * Create HTTP Server in NodeJS
 */
var http = require("http");

/**
 * Hello, world 문자열을 반환하는 http 웹서버를 생성한다.
 * 8081 포트로 설정한다.
 */
http.createServer(function(req, res) {
    
    // 200 ok 응답 전송
    res.writeHead(200, {'Content-Type': 'text/plain'});

    // response body message 설정
    res.end('hello world');
}).listen(8081);

