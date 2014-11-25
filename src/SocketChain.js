/**
 * Created by ader on 11/22/14.
 */

this.SocketChain = function() {

    if (!WebSocket) {
        throw new Error("WebSocket are not supported in your browser!");
    }

    var self = this;

    var hst;
    var prt;
    var conn;

    function runConnection(resolve, reject) {
        conn = new WebSocket('ws://'+hst+':'+prt);

        conn.onopen = function(e) {
            resolve(e);
        };

        conn.onerror = function(e) {
            conn.close();
            conn = null;
            reject(new Error("Connection problem: "+e.message));
        }

        conn.onclose = function(e) {
            conn = null;
            reject(new Error("Connection closed: "+e.message));
        }

    }

    function listenConnection(resolve, reject) {
        checkConnection();

        conn.onmessage = function(e) {
            resolve(e.data);
        }
    }

    function closeConnection(resolve, reject) {
        checkConnection();

        conn.onclose = function(e) {
            conn = null;
            resolve();
        }

        conn.close();
    }


    this.connect = function(host, port) {
        hst = host;
        prt = port;
        return new Chain(runConnection);
    }

    this.listen = function() {
        return new Chain(listenConnection);
    }

    this.close = function() {
        return new Chain(closeConnection);
    }

    this.send = function(message) {
        checkConnection();
        conn.send(message);
    }



    function checkConnection() {
        if (!conn) {
            throw new Error("Connection ain't established.");
        }
    }

}