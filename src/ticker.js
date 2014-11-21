/**
 * Created by ader on 11/21/14.
 */

this.run = function(fps, tick) {

    var _fps = fps;
    var requestAnimationFrame;
    var animationCallback;

    var now;
    var then = Date.now();
    var delta;

    if (!requestAnimationFrame) {
        requestAnimationFrame = (function(callback) {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
                function(callback) {
                    window.setTimeout(callback, 1000 / _fps);
                };
        })();
    }
    // got somewhere
    if (!animationCallback) {
        animationCallback = function () {

            requestAnimationFrame(animationCallback);

            now = Date.now();
            delta = now - then;
            var interval = 1000/_fps;
            if (delta > interval) {
                then = now - (delta % interval);
                //
                if (tick)
                    tick();
            }
        }
        animationCallback();
    }

};