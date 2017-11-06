"use strict";

System.register(["lodash"], function (_export, _context) {
    "use strict";

    var lodash, _createClass, DeviceHive;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_lodash) {
            lodash = _lodash.default;
        }],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            DeviceHive = function () {

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

                    var me = this;

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
                        console.warn("You need to specify URL, login and password or token");
                        throw new Error("You need to specify URL, login and password or token");
                    }
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
                                messageObject.requestId = messageObject.requestId || lodash.uniqueId("deviceHiveId_");
                                me.socket.send(JSON.stringify(messageObject));

                                var listener = function listener(event) {
                                    var messageData = JSON.parse(event.data);

                                    if (messageData.action === messageObject.action && messageData.requestId === messageObject.requestId) {
                                        me.socket.removeEventListener("message", listener);
                                        messageData.status === "success" ? resolve(messageData) : reject(messageData.error);
                                    }
                                };

                                me.socket.addEventListener("message", listener);
                            });
                        });
                    }
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
            }();

            _export("default", DeviceHive);
        }
    };
});
//# sourceMappingURL=DeviceHive.js.map
