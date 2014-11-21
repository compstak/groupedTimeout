(function(factory) {

    //AMD
    if(typeof define === 'function' && define.amd) {
        define(factory);

    //NODE
    } else if(typeof module === 'object' && module.exports) {
        module.exports = factory();

    //GLOBAL
    } else {
        window.groupedTimeout = factory();
    }

})(function () {
    'use strict';

    function GroupedTimeout () {
        this.timeouts = [];
        this.alwayses = [];
    }

    GroupedTimeout.prototype.add = function (cb, ms) {
        var timeoutId = setTimeout(function () {
            cb();
            this.clear(timeoutId);
        }.bind(this), ms);

        this.timeouts.push(timeoutId);

        return timeoutId;
    };
    
    GroupedTimeout.prototype.clear = function (timeoutId) {
        clearTimeout(timeoutId);
        var index = this.timeouts.indexOf(timeoutId);
        this.timeouts.splice(index, 1);
    };

    GroupedTimeout.prototype.clearAll = function () {
        this.timeouts.forEach(clearTimeout);
        this.alwayses.forEach(function (always) {
            always.cb();
            this.clearAlways(always.timerId);
        }.bind(this));
    };

    GroupedTimeout.prototype.always = function (cb, delay) {

        var always = {
            cb: cb,
            delay: delay
        };

        always.timerId = setTimeout(function () {
            cb();
            this.clearAlways(always.timerId);
        }.bind(this), delay);

        this.alwayses.push(always);

        return always.timerId;
    };

    GroupedTimeout.prototype.clearAlways = function (timerId) {
        var i = 0;
        for (; i < this.alwayses.length; i++) {
            if (this.alwayses[i].timerId === timerId) {
                break;
            }
        }

        if (this.alwayses[i]) {
            clearTimeout(timerId);
            this.alwayses.splice(i, 1);
        }
    };


    return function groupedTimeout () {
        return new GroupedTimeout();
    };
});
