var http = require('http');

// HTTPRequest의 옵션 설정
var options = {
   host: 'localhost',
   port: '19870',
   path: '/index.html'  
};

// 서버에 HTTP Request 를 날린다.
var req = http.request(options, function(response){
    // response 이벤트가 감지되면 데이터를 body에 받아온다
    var body = '';
    response.on('data', function(data) {
       body += data;
    });
    
    // end 이벤트가 감지되면 데이터 수신을 종료하고 내용을 출력한다
    response.on('end', function() {
       // 데이저 수신 완료
       console.log(body);
    });
 });
req.end();