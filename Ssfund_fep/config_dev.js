var conf =
{    
    
    logLevel : "info",    

    WAS_TO_SERVER_LISTEN_PORT : 19740,
    SERVER_TO_SC_REQUEST_PORT : 19739,    
    
    
    //SC_HOST : "11.40.19.101",

    SC_HOST : "127.0.0.1",

    //local
    //WAS_HOST: "127.0.0.1",

    //remote local 
    // WAS_HOST: "10.98.3.91",
    
    //koscom test from local
    WAS_HOST :"testapi.r2fund.com",     
    
    //koscom test from test WEB server
    // WAS_HOST :"10.227.40.31", 
  

    httpString: "http://",
    SC_TO_SERVER_LISTEN_PORT : 19738,

    //local
    //SERVER_TO_WAS_REQUEST_PORT : 8080,    
    
    //remote local 
    //SERVER_TO_WAS_REQUEST_PORT : 8081,    

    
    //koscom test from local
    //  SERVER_TO_WAS_REQUEST_PORT : 9089,    
    
    //koscom test from WEB SERVER
    SERVER_TO_WAS_REQUEST_PORT : 9069,    

    tcpSocketTimeOut: 60000, //milliseconds
    MaxConnCnt : 2500
};
module.exports = conf; 
