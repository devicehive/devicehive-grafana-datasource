'use strict';

System.register(['./css/query-editor.css!', 'app/plugins/sdk'], function (_export, _context) {
    "use strict";

    var QueryCtrl, _createClass, DeviceHiveDatasourceQueryCtrl;

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
        setters: [function (_cssQueryEditorCss) {}, function (_appPluginsSdk) {
            QueryCtrl = _appPluginsSdk.QueryCtrl;
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

            DeviceHiveDatasourceQueryCtrl = function (_QueryCtrl) {
                _inherits(DeviceHiveDatasourceQueryCtrl, _QueryCtrl);

                /**
                 * Creates an instance of DeviceHiveDatasourceQueryCtrl.
                 * @param {any} $scope
                 * @param {any} $injector
                 * @param {any} uiSegmentSrv
                 * @memberof DeviceHiveDatasourceQueryCtrl
                 */
                function DeviceHiveDatasourceQueryCtrl($scope, $injector, uiSegmentSrv) {
                    _classCallCheck(this, DeviceHiveDatasourceQueryCtrl);

                    var _this = _possibleConstructorReturn(this, (DeviceHiveDatasourceQueryCtrl.__proto__ || Object.getPrototypeOf(DeviceHiveDatasourceQueryCtrl)).call(this, $scope, $injector));

                    var me = _this;

                    me.target.target = me.target.target || 'select metric';
                    me.target.type = me.target.type || 'command';
                    me.target.name = me.target.name || '';
                    me.target.dataPath = me.target.dataPath || '';
                    me.target.scale = me.target.scale || 1;
                    me.showHelp = false;
                    return _this;
                }

                /**
                 * Refresh data every time query params change.
                 *
                 * @memberof DeviceHiveDatasourceQueryCtrl
                 */


                _createClass(DeviceHiveDatasourceQueryCtrl, [{
                    key: 'onChangeInternal',
                    value: function onChangeInternal() {
                        var me = this;

                        me.panelCtrl.refresh();
                    }
                }]);

                return DeviceHiveDatasourceQueryCtrl;
            }(QueryCtrl);

            DeviceHiveDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';

            _export('default', DeviceHiveDatasourceQueryCtrl);
        }
    };
});
//# sourceMappingURL=DeviceHiveDatasourceQueryCtrl.js.map
