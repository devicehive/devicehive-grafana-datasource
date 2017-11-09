"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _Events2 = require("./utils/Events");

var _Events3 = _interopRequireDefault(_Events2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * DeviceHive api class
 */
var DeviceHive = function (_Events) {
    _inherits(DeviceHive, _Events);

    /**
     * Creates an instance of DeviceHive.
     * @param {Object} { login, password, serverUrl, token }
     * @memberof DeviceHive
     */
    function DeviceHive(_ref) {
        var login = _ref.login,
            password = _ref.password,
            serverUrl = _ref.serverUrl,
            token = _ref.token;

        _classCallCheck(this, DeviceHive);

        var _this = _possibleConstructorReturn(this, (DeviceHive.__proto__ || Object.getPrototypeOf(DeviceHive)).call(this));

        var me = _this;

        if (serverUrl && (login && password || token)) {
            me.socket = new WebSocket(serverUrl);
            me.login = login;
            me.password = password;
            me.serverUrl = serverUrl;
            me.token = token;
            me.isOpen = false;
            me.isAuthenticated = false;

            me.socket.addEventListener("open", function () {
                return me.isOpen = true;
            });
            me.socket.addEventListener("close", function () {
                return me.isOpen = false;
            });
        } else {
            throw new Error("You need to specify URL, login and password or token");
        }
        return _this;
    }

    /**
     * Send message object over WS session by the key
     * @param messageObject
     * @return {Promise}
     */


    _createClass(DeviceHive, [{
        key: "send",
        value: function send(messageObject) {
            var me = this;

            return me._getReadyClient().then(function () {
                return new Promise(function (resolve, reject) {
                    messageObject.requestId = messageObject.requestId || _lodash2.default.uniqueId("deviceHiveId_");
                    me.socket.send(JSON.stringify(messageObject));

                    var listener = function listener(event) {
                        var messageData = JSON.parse(event.data);
                        var isSuccess = messageData.status === "success";

                        if (messageData.action === messageObject.action && messageData.requestId === messageObject.requestId) {
                            me.socket.removeEventListener("message", listener);
                            me.isAuthenticated = isSuccess;
                            isSuccess ? resolve(messageData) : reject(messageData.error);
                        }
                    };

                    me.socket.addEventListener("message", listener);
                });
            });
        }

        /**
         * Internal `authenticate` message sender
         * @param {String} accessToken
         * @memberof DeviceHive
         */

    }, {
        key: "authenticate",
        value: function authenticate() {
            var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                token = _ref2.token,
                login = _ref2.login,
                password = _ref2.password;

            var me = this;

            me.token = token || me.token;
            me.login = login || me.login;
            me.password = password || me.password;

            return me.isAuthenticated ? Promise.resolve() : (me.token ? me.send({ action: "authenticate", token: me.token }) : me.send({ action: "token", login: me.login, password: me.password }).then(function (_ref3) {
                var accessToken = _ref3.accessToken,
                    refreshToken = _ref3.refreshToken;
                return me.authenticate({ token: accessToken });
            }).catch(function () {
                return me.authenticate({ login: me.login, password: me.password });
            })).then(function () {
                return me.isAuthenticated = true;
            });
        }

        /**
         * Waits for WS session to be opened
         * @return {Promise}
         * @private
         */

    }, {
        key: "_getReadyClient",
        value: function _getReadyClient() {
            var me = this;

            function onOpen(resolve) {
                me.socket.removeEventListener("open", onOpen);
                resolve(me);
            }

            return new Promise(function (resolve) {
                return me.isOpen ? resolve(me) : me.socket.addEventListener("open", function () {
                    return onOpen(resolve);
                });
            });
        }
    }]);

    return DeviceHive;
}(_Events3.default);

exports.default = DeviceHive;
//# sourceMappingURL=DeviceHive.js.map
