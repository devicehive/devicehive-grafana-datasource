"use strict";

System.register(["lodash", "./utils/Events"], function (_export, _context) {
    "use strict";

    var lodash, Events, _createClass, DeviceHive;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    return {
        setters: [function (_lodash) {
            lodash = _lodash.default;
        }, function (_utilsEvents) {
            Events = _utilsEvents.default;
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

            DeviceHive = function (_Events) {
                _inherits(DeviceHive, _Events);

                /**
                 * Creates an instance of DeviceHive.
                 * @param {Object} { serverUrl, login, password, accessToken, refreshToken }
                 * @memberof DeviceHive
                 */
                function DeviceHive(_ref) {
                    var serverUrl = _ref.serverUrl,
                        login = _ref.login,
                        password = _ref.password,
                        accessToken = _ref.accessToken,
                        refreshToken = _ref.refreshToken;

                    _classCallCheck(this, DeviceHive);

                    var _this = _possibleConstructorReturn(this, (DeviceHive.__proto__ || Object.getPrototypeOf(DeviceHive)).call(this));

                    var me = _this;

                    if (serverUrl && (login && password || accessToken || refreshToken)) {
                        me.socket = new WebSocket(serverUrl);
                        me.login = login;
                        me.password = password;
                        me.serverUrl = serverUrl;
                        me.accessToken = accessToken;
                        me.refreshToken = refreshToken;
                        me.isOpen = false;
                        me.isAuthenticated = false;
                        me.isTokenRequested = false;
                        me.isAuthenticationStarted = false;

                        me.socket.addEventListener("open", function () {
                            return me.isOpen = true;
                        });
                        me.socket.addEventListener("close", function () {
                            return me.isOpen = false;
                        });
                    } else {
                        throw new Error("You need to specify URL, login and password or Access Token");
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
                            return me.isAuthenticated === true || messageObject.action === "authenticate" || messageObject.action === "token/refresh" || messageObject.action === "token" ? Promise.resolve() : me.authenticate();
                        }).then(function () {
                            return new Promise(function (resolve, reject) {
                                messageObject.requestId = messageObject.requestId || lodash.uniqueId("deviceHiveId_");
                                me.socket.send(JSON.stringify(messageObject));

                                var listener = function listener(event) {
                                    var messageData = JSON.parse(event.data);
                                    var isSuccess = messageData.status === "success";

                                    if (messageData.action === messageObject.action && messageData.requestId === messageObject.requestId) {
                                        me.socket.removeEventListener("message", listener);
                                        me.isAuthenticated = isSuccess === false ? isSuccess : me.isAuthenticated;
                                        isSuccess ? resolve(messageData) : reject(messageData.error);
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

                        me.accessToken = token || me.accessToken;
                        me.login = login || me.login;
                        me.password = password || me.password;

                        return new Promise(function (resolve, reject) {
                            me.once("authenticated", function () {
                                me.isTokenRequested = false;
                                me.isAuthenticationStarted = false;
                                me.isAuthenticated = true;
                                resolve();
                            });

                            if (me.isAuthenticated === true) {
                                me.dispatchEvent("authenticated");
                            } else {
                                if (me.isAuthenticationStarted === false || me.isTokenRequested === false) {
                                    if (me.accessToken || me.refreshToken) {
                                        me.isAuthenticationStarted = true;
                                        me.send({ action: "authenticate", token: me.accessToken }).then(function () {
                                            return me.dispatchEvent("authenticated");
                                        }).catch(function (error) {
                                            return me.refreshToken ? me._refreshToken() : Promise.reject(error);
                                        }).then(function (result) {
                                            return result.accessToken ? me.authenticate({ token: result.accessToken }) : Promise.resolve();
                                        }).catch(function (error) {
                                            return reject(error);
                                        });
                                    } else {
                                        me.isTokenRequested = true;
                                        me.send({ action: "token", login: me.login, password: me.password }).then(function (_ref3) {
                                            var accessToken = _ref3.accessToken,
                                                refreshToken = _ref3.refreshToken;

                                            me.accessToken = accessToken;
                                            me.refreshToken = refreshToken;

                                            return me.authenticate({ token: accessToken });
                                        }).catch(function (error) {
                                            return reject(error);
                                        });
                                    }
                                }
                            }
                        });
                    }
                }, {
                    key: "_refreshToken",
                    value: function _refreshToken() {
                        var me = this;

                        return me.send({
                            action: "token/refresh",
                            refreshToken: me.refreshToken
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
            }(Events);

            _export("default", DeviceHive);
        }
    };
});
//# sourceMappingURL=DeviceHive.js.map
