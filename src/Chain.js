/**
 * Created by ader on 11/25/14.
 */

this.Chain = function(func) {

    var self = this;

    var resolveFunc;
    var rejectFunc;

    var next;

    this.resolve = function(data) {
        var res;
        if (resolveFunc)
            res = resolveFunc(data);
        if (next)
            next.resolve(res);
    }

    this.reject = function(data) {
        var res;
        if (rejectFunc)
            res = rejectFunc(data);
        if (next)
            next.reject(res);
    }

    function runFunc() {
        func(self.resolve, self.reject);
    }

    if (func)
        runFunc();

    this.then = function(resolve, reject) {

        resolveFunc = resolve;
        rejectFunc = reject;

        return next = new Chain();

    }

}