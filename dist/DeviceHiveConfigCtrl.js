'use strict';

System.register([], function (_export, _context) {
    "use strict";

    var _createClass, DeviceHiveConfigCtrl;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [],
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

            DeviceHiveConfigCtrl = function () {
                function DeviceHiveConfigCtrl() {
                    _classCallCheck(this, DeviceHiveConfigCtrl);
                }

                _createClass(DeviceHiveConfigCtrl, [{
                    key: 'onChangeInternal',
                    value: function onChangeInternal() {
                        var me = this;

                        if (me.current.jsonData.authType === 'Token') {
                            me.current.jsonData.auth = {
                                login: '',
                                password: ''
                            };
                        } else {
                            me.current.jsonData.auth = {
                                accessToken: '',
                                refreshToken: ''
                            };
                        }
                    }
                }]);

                return DeviceHiveConfigCtrl;
            }();

            DeviceHiveConfigCtrl.templateUrl = 'partials/datasource.config.html';

            _export('default', DeviceHiveConfigCtrl);
        }
    };
});
//# sourceMappingURL=DeviceHiveConfigCtrl.js.map
