/**
 * Created by ader on 11/25/14.
 */

this.Chain = function(func) {

    var self = this;

    var resolveFunc;
    var rejectFunc;

    var next;

    var resolved;

    this.resolve = function(data) {
        var res;
        if (resolveFunc) {
            res = resolveFunc(data);
            resolved = true;
        }
        if (next)
            next.resolve(res);
    }

    this.reject = function(data) {
        var res;
        if (rejectFunc) {
            res = rejectFunc(data);
            resolved = false;
        }
        if (next)
            next.reject(res);
    }

    function runFunc() {
        func(self.resolve, self.reject);
    }

    if (func)
        runFunc();

    this.resolved = function() {
        return resolved;
    }

    this.rejected = function() {
        return !resolved;
    }

    this.then = function(resolve, reject) {

        resolveFunc = resolve;
        rejectFunc = reject;

        return next = new Chain();

    }

    this.catch = function(reject) {
        rejectFunc = reject;

        return next = new Chain();
    }

    this.map = function(map) {
        resolveFunc = map;

        return next = new Chain();

    }

    var nextSaved;
    this.filter = function(filter) {

        resolveFunc = function(data) {

            var res = filter;
            if (typeof filter == 'function')
                res = filter(data);

            if (!res)
                if (next) {
                    nextSaved = next;
                    next = null;
                }
            else if (!next) {
                next = nextSaved;
                nextSaved = null;
            }

        }

        return next = new Chain();

    }

}