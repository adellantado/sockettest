/**
 * Created by ader on 11/22/14.
 */

this.SocketPromise = function() {

    if (!Promise) {
        throw new Error("Promise are not supported in your browser!");
    }
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
        return new ReactStream(runConnection);
    }

    this.listen = function() {
        return new ReactStream(listenConnection);
    }

    this.close = function() {
        return new ReactStream(closeConnection);
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

this.ReactStream = function(func) {

    this.then = function(resolve, reject) {

        var self = this;

        var localResolve = function() {
            var res = resolve.apply(self, arguments);

            if (res instanceof ReactStream) {
                return res;
            }

            return new ReactStream(function(resFunc, rejFunc){

                try {
                    resFunc(res);
                } catch (e) {
                    if (rejFunc)
                        rejFunc(e);
                }

            });
        }

        if (reject) {

            var localReject = function() {
                reject.apply(self, arguments);
            }

            if (func)
                func(localResolve, localReject);

        } else {

            if (func)
                func(localResolve);

        }

        //return new ReactStream(function(){});

    }

}