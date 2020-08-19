var conf =
{    
    
    logLevel : "info",    

    WAS_TO_SERVER_LISTEN_PORT : 19740,
    SERVER_TO_SC_REQUEST_PORT : 19739,    
    
    WAS_HOST: "10.207.40.31", // "10.207.40.32" //WAS2
    SC_HOST : "11.40.19.10",

    httpString: "http://",
    SC_TO_SERVER_LISTEN_PORT : 19738,
    SERVER_TO_WAS_REQUEST_PORT : 9071,    

    tcpSocketTimeOut: 60000 //milliseconds
    
};
module.exports = conf; 
