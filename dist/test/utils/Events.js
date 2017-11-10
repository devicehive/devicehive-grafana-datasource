"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * EventTarget implementation
 */
var Events = function () {

    /**
     * Create new Events object
     */
    function Events() {
        _classCallCheck(this, Events);

        var me = this;

        me.listeners = new Map();
    }

    /**
     * Add event listener
     * @param eventName
     * @param callback
     */


    _createClass(Events, [{
        key: "addEventListener",
        value: function addEventListener(eventName, callback) {
            var me = this;

            if (!me.listeners.has(eventName)) {
                me.listeners.set(eventName, []);
            }

            me.listeners.get(eventName).push(callback);
        }

        /**
         * Remove event listener
         * @param eventName
         * @param callback
         */

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

        /**
         * Fire event
         * @param eventName
         * @returns {boolean}
         */

    }, {
        key: "dispatchEvent",
        value: function dispatchEvent(eventName) {
            var me = this;

            if (me.listeners.has(eventName)) {
                var stack = me.listeners.get(eventName);
                var listenersPool = stack.map(function (listener) {
                    return listener;
                });

                listenersPool.forEach(function (listener) {
                    listener.call(me);
                });
            }

            return true;
        }

        /**
         * Add disposable event listener
         * @param eventName
         * @param callback
         */

    }, {
        key: "once",
        value: function once(eventName, callback) {
            var _arguments = arguments;

            var me = this;
            var wrapper = function wrapper() {
                me.removeEventListener(eventName, wrapper);
                callback.call(me, _arguments);
            };

            me.addEventListener(eventName, wrapper);
        }
    }]);

    return Events;
}();

exports.default = Events;
//# sourceMappingURL=Events.js.map
