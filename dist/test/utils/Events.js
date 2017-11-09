"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Events = function () {
    function Events() {
        _classCallCheck(this, Events);

        var me = this;

        me.listeners = new Map();
    }

    _createClass(Events, [{
        key: "addEventListener",
        value: function addEventListener(eventName, callback) {
            var me = this;

            if (!me.listeners.has(eventName)) {
                me.listeners.set(eventName, []);
            }

            me.listeners.get(eventName).push(callback);
        }
    }, {
        key: "removeEventListener",
        value: function removeEventListener(eventName, callback) {
            var me = this;

            if (!me.listeners.has(eventName)) {
                return;
            }

            var stack = me.listeners.get(eventName);

            for (var i = 0, l = stack.length; i < l; i++) {
                if (stack[i] === callback) {
                    stack.splice(i, 1);
                    return;
                }
            }
        }
    }, {
        key: "dispatchEvent",
        value: function dispatchEvent(eventName) {
            var me = this;

            if (!me.listeners.has(eventName)) {
                return true;
            }

            var stack = me.listeners.get(eventName);

            for (var i = 0, l = stack.length; i < l; i++) {
                stack[i].call(me);
            }

            return;
        }
    }]);

    return Events;
}();

exports.default = Events;
//# sourceMappingURL=Events.js.map
